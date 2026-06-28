/**
 * Interactive sentence content, derived from the API-imported dataset
 * (src/content/generated/sentences.json). Dynamically imported so it ships as a
 * separate chunk.
 *
 * Sentences power three gamified exercise modes: building scrambled words back
 * into order, listening dictation, and translation.
 */

import type { CEFRLevel } from '../types';

export interface ApiSentence {
  id: number;
  sentence_de: string;
  sentence_en: string;
  cefr_level: CEFRLevel;
  word_count: number;
  clause_count: number;
  grammar_features: string[];
  topic: string;
  register: string;
  source: string;
  license_tag: string;
}

export interface SentenceItem {
  id: number;
  de: string;
  en: string;
  level: CEFRLevel;
  /** Word tokens of the German sentence, for the scramble exercise. */
  tokens: string[];
}

let sentencesPromise: Promise<ApiSentence[]> | null = null;

function loadRaw(): Promise<ApiSentence[]> {
  if (!sentencesPromise) {
    sentencesPromise = import('./generated/sentences.json').then(
      (mod) => mod.default as ApiSentence[]
    );
  }
  return sentencesPromise;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function toItem(s: ApiSentence): SentenceItem {
  return {
    id: s.id,
    de: s.sentence_de,
    en: s.sentence_en,
    level: s.cefr_level,
    tokens: s.sentence_de.split(/\s+/).filter(Boolean),
  };
}

/**
 * Build a randomized set of sentences for practice.
 *
 * @param level     CEFR level, or 'all'
 * @param count     desired number of sentences
 * @param maxWords  cap sentence length (keeps the scramble exercise tractable)
 */
export async function buildSentenceSet(
  level: CEFRLevel | 'all',
  count: number,
  maxWords = 9
): Promise<SentenceItem[]> {
  const raw = await loadRaw();
  const pool = raw.filter((s) => {
    const lvlOk = level === 'all' || s.cefr_level === level;
    return lvlOk && s.word_count >= 3 && s.word_count <= maxWords && s.sentence_en;
  });
  return shuffle(pool).slice(0, count).map(toItem);
}

/** Word counts available per level, for the setup screen. */
export async function getSentenceLevelCounts(): Promise<
  Record<CEFRLevel | 'all', number>
> {
  const raw = await loadRaw();
  const counts: Record<string, number> = { all: raw.length };
  for (const s of raw) {
    counts[s.cefr_level] = (counts[s.cefr_level] ?? 0) + 1;
  }
  return counts as Record<CEFRLevel | 'all', number>;
}
