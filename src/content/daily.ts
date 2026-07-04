/**
 * Daily Sprint — a Wordle-style daily German puzzle.
 *
 * Every calendar day, one sentence is picked deterministically from the
 * bundled dataset (same puzzle for every player, no server). The player
 * rebuilds the scrambled sentence in up to MAX_ATTEMPTS tries and gets a
 * shareable emoji result.
 */

import type { ApiSentence, SentenceItem } from './sentences';

export const MAX_ATTEMPTS = 3;

/** Day 0 of the puzzle series (puzzle #1 launched this day, UTC). */
const EPOCH_DAY = Math.floor(Date.UTC(2026, 6, 1) / 86_400_000); // 2026-07-01

/** Days since Unix epoch for a local calendar date. */
export function dayNumber(date = new Date()): number {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000
  );
}

/** Human-facing puzzle number (#1, #2, ...). */
export function puzzleNumber(date = new Date()): number {
  return dayNumber(date) - EPOCH_DAY + 1;
}

/** Small deterministic PRNG (mulberry32). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic in-place-style shuffle that never returns the original order. */
export function seededScramble(tokens: string[], seed: number): string[] {
  const rand = mulberry32(seed);
  const a = [...tokens];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.length > 1 && a.join(' ') === tokens.join(' ')) {
    // Deterministic fallback: rotate by one.
    a.push(a.shift()!);
  }
  return a;
}

let poolPromise: Promise<ApiSentence[]> | null = null;

/** Beginner-friendly candidate sentences, in a stable order. */
function loadPool(): Promise<ApiSentence[]> {
  if (!poolPromise) {
    poolPromise = import('./generated/sentences.json').then((mod) => {
      const rows = mod.default as ApiSentence[];
      return rows
        .filter(
          (s) =>
            (s.cefr_level === 'A1' || s.cefr_level === 'A2') &&
            s.word_count >= 4 &&
            s.word_count <= 8 &&
            s.sentence_en
        )
        .sort((a, b) => a.id - b.id);
    });
  }
  return poolPromise;
}

export interface DailyPuzzle {
  number: number;
  day: number;
  item: SentenceItem;
  scrambled: string[];
}

/** The puzzle for a given date (defaults to today). Deterministic. */
export async function getDailyPuzzle(date = new Date()): Promise<DailyPuzzle> {
  const pool = await loadPool();
  const day = dayNumber(date);
  const rand = mulberry32(day * 2654435761);
  const s = pool[Math.floor(rand() * pool.length)];
  const tokens = s.sentence_de.split(/\s+/).filter(Boolean);
  return {
    number: puzzleNumber(date),
    day,
    item: {
      id: s.id,
      de: s.sentence_de,
      en: s.sentence_en,
      level: s.cefr_level,
      tokens,
    },
    scrambled: seededScramble(tokens, day * 1013904223),
  };
}

/** Wordle-style share text, e.g. "Daily Sprint #12 ⚡ 2/3 🟥🟩". */
export function shareText(
  number: number,
  attemptsUsed: number,
  solved: boolean
): string {
  const squares =
    '🟥'.repeat(solved ? attemptsUsed - 1 : attemptsUsed) + (solved ? '🟩' : '⬛');
  const score = solved ? `${attemptsUsed}/${MAX_ATTEMPTS}` : `X/${MAX_ATTEMPTS}`;
  return `Daily Sprint #${number} ⚡ ${score}\n${squares}\nhttps://namitzz.github.io/geramanfication/`;
}

// ---- Result persistence (local, per-day) ----

export interface DailyResult {
  attemptsUsed: number;
  solved: boolean;
}

const RESULTS_KEY = 'daily-sprint-results';

export function loadResult(day: number): DailyResult | null {
  try {
    const all = JSON.parse(localStorage.getItem(RESULTS_KEY) ?? '{}');
    return all[day] ?? null;
  } catch {
    return null;
  }
}

export function saveResult(day: number, result: DailyResult): void {
  try {
    const all = JSON.parse(localStorage.getItem(RESULTS_KEY) ?? '{}');
    all[day] = result;
    localStorage.setItem(RESULTS_KEY, JSON.stringify(all));
  } catch {
    // Storage unavailable (private mode) — playing still works, result just isn't kept.
  }
}
