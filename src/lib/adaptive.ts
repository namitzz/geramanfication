import type { Card, CEFRLevel, SrsRecord } from '../types';
import { isCardDue } from '../utils/srs';
import { loadOrderedWords } from '../content/dailyWords';
import { loadVocabularyByLevel, CEFR_LEVELS } from '../content/vocabulary';
import type { Mistake } from '../store/app';

/** Mastered-word milestones per CEFR level (active vocab; tunable). */
export const MILESTONES: { level: CEFRLevel; words: number }[] = [
  { level: 'A1', words: 300 },
  { level: 'A2', words: 750 },
  { level: 'B1', words: 1500 },
  { level: 'B2', words: 3000 },
  { level: 'C1', words: 5000 },
];
/** Mastered words that ≈ conversational (B1 active vocabulary). */
export const CONVERSATIONAL_TARGET = 1500;

const WEAK_SOURCES: Record<string, { name: string; route: string }> = {
  vocab: { name: 'Vocabulary', route: '/review' },
  grammar: { name: 'Grammar', route: '/quiz/grammar' },
  cloze: { name: 'Cloze', route: '/quiz/cloze' },
};

export interface AdaptiveSession {
  cards: Card[];
  counts: { due: number; weak: number; fresh: number };
}
export interface FluencyLevel {
  level: CEFRLevel;
  total: number;
  studied: number;
  mastered: number;
  learning: number;
  pct: number;
}
export interface WeakArea {
  source: string;
  count: number;
  route: string;
}
export interface Fluency {
  masteredTotal: number;
  studiedTotal: number;
  conversationalPct: number;
  estimatedLevel: CEFRLevel | '—';
  nextLevel: CEFRLevel | null;
  toNextPct: number;
  levels: FluencyLevel[];
  weakAreas: WeakArea[];
  focus: { label: string; route: string };
}

/** Parse the CEFR level out of a vocab card id (`v-A1-3`). */
export function cardLevel(id: string): CEFRLevel | null {
  const m = /^v-([A-C][12])-/.exec(id);
  return m ? (m[1] as CEFRLevel) : null;
}

/**
 * Order an adaptive session: due reviews (most overdue) → weak spots (recent
 * vocab mistakes) → new frontier words, deduped and capped at `goal`.
 */
export function selectAdaptive(
  byId: Map<string, Card>,
  ordered: Card[],
  srsRecords: Record<string, SrsRecord>,
  mistakes: Record<string, Mistake>,
  goal: number,
): AdaptiveSession {
  const chosen: Card[] = [];
  const seen = new Set<string>();
  const add = (c: Card | undefined): boolean => {
    if (!c || seen.has(c.id) || chosen.length >= goal) return false;
    seen.add(c.id);
    chosen.push(c);
    return true;
  };

  // 1) due reviews, most overdue first
  let due = 0;
  Object.values(srsRecords)
    .filter((r) => isCardDue(r))
    .sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())
    .forEach((r) => {
      if (add(byId.get(r.cardId))) due++;
    });

  // 2) weak spots — vocab mistakes, newest first
  let weak = 0;
  Object.values(mistakes)
    .filter((m) => m.id.startsWith('vocab-'))
    .sort((a, b) => b.ts - a.ts)
    .forEach((m) => {
      if (add(byId.get(m.id.slice('vocab-'.length)))) weak++;
    });

  // 3) new frontier — next unstudied words in frequency order
  let fresh = 0;
  for (const c of ordered) {
    if (chosen.length >= goal) break;
    if (!srsRecords[c.id] && add(c)) fresh++;
  }

  return { cards: chosen, counts: { due, weak, fresh } };
}

/** Async wrapper: loads the corpus and builds an adaptive session. */
export async function buildAdaptiveSession(
  goal: number,
  srsRecords: Record<string, SrsRecord>,
  mistakes: Record<string, Mistake>,
): Promise<AdaptiveSession> {
  const ordered = await loadOrderedWords();
  const byId = new Map(ordered.map((c) => [c.id, c]));
  return selectAdaptive(byId, ordered, srsRecords, mistakes, goal);
}

/** Total words available per CEFR level. */
export async function getLevelTotals(): Promise<Record<CEFRLevel, number>> {
  const summaries = await loadVocabularyByLevel();
  const totals = {} as Record<CEFRLevel, number>;
  for (const s of summaries) totals[s.level] = s.wordCount;
  return totals;
}

/** Compute the honest mastery / fluency picture from what's been studied. */
export function computeFluency(
  srsRecords: Record<string, SrsRecord>,
  mistakes: Record<string, Mistake>,
  levelTotals: Record<CEFRLevel, number>,
): Fluency {
  const records = Object.values(srsRecords);

  const levels: FluencyLevel[] = CEFR_LEVELS.map((level) => {
    const recs = records.filter((r) => cardLevel(r.cardId) === level);
    const studied = recs.length;
    const mastered = recs.filter((r) => r.box === 5).length;
    const total = levelTotals[level] ?? 0;
    return { level, total, studied, mastered, learning: studied - mastered, pct: total ? mastered / total : 0 };
  });

  const masteredTotal = levels.reduce((s, l) => s + l.mastered, 0);
  const studiedTotal = levels.reduce((s, l) => s + l.studied, 0);
  const conversationalPct = Math.min(100, Math.round((masteredTotal / CONVERSATIONAL_TARGET) * 100));

  let idx = -1;
  MILESTONES.forEach((m, i) => {
    if (masteredTotal >= m.words) idx = i;
  });
  const estimatedLevel = idx >= 0 ? MILESTONES[idx].level : '—';
  const nextLevel = idx + 1 < MILESTONES.length ? MILESTONES[idx + 1].level : null;
  const curWords = idx >= 0 ? MILESTONES[idx].words : 0;
  const nextWords = nextLevel ? MILESTONES[idx + 1].words : curWords;
  const toNextPct = nextLevel
    ? Math.min(100, Math.round(((masteredTotal - curWords) / (nextWords - curWords)) * 100))
    : 100;

  const counts: Record<string, number> = {};
  for (const id of Object.keys(mistakes)) {
    const src = id.split('-')[0];
    if (WEAK_SOURCES[src]) counts[src] = (counts[src] ?? 0) + 1;
  }
  const weakAreas: WeakArea[] = Object.entries(counts)
    .map(([src, count]) => ({ source: WEAK_SOURCES[src].name, count, route: WEAK_SOURCES[src].route }))
    .sort((a, b) => b.count - a.count);

  const dueNow = records.filter((r) => isCardDue(r)).length;
  let focus: { label: string; route: string };
  if (dueNow > 0) focus = { label: `${dueNow} word${dueNow > 1 ? 's' : ''} due to review`, route: '/review' };
  else if (weakAreas.length) focus = { label: `${weakAreas[0].source} is your weak spot`, route: weakAreas[0].route };
  else focus = { label: "Learn today's new words", route: '/session' };

  return {
    masteredTotal,
    studiedTotal,
    conversationalPct,
    estimatedLevel,
    nextLevel,
    toNextPct,
    levels,
    weakAreas,
    focus,
  };
}
