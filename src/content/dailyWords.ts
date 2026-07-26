/**
 * The daily-words program: every day serves the next WORDS_PER_DAY unseen
 * words from the frequency-ordered vocabulary (A1 first, then A2 ... C1),
 * driven by the persistent cursor in the app store's `dailyReview` slice.
 */

import type { Card, CEFRLevel } from '../types';
import { loadVocabularyDecks, CEFR_LEVELS } from './vocabulary';

export const WORDS_PER_DAY = 50;

export interface LevelOffset {
  level: CEFRLevel;
  /** Cursor index where this level's words begin in learning order. */
  offset: number;
  /** Number of words in this level. */
  count: number;
}

let orderedPromise: Promise<Card[]> | null = null;

/** All vocabulary cards in learning order (level, then frequency). Cached. */
export function loadOrderedWords(): Promise<Card[]> {
  if (!orderedPromise) {
    orderedPromise = loadVocabularyDecks().then((decks) =>
      decks.flatMap((d) => d.cards)
    );
  }
  return orderedPromise;
}

/** Today's batch of words, starting at the day's cursor position. */
export async function getDailyBatch(dayStart: number): Promise<Card[]> {
  const all = await loadOrderedWords();
  return all.slice(dayStart, dayStart + WORDS_PER_DAY);
}

/** Total words available in the program (for an all-done screen someday). */
export async function getTotalWordCount(): Promise<number> {
  return (await loadOrderedWords()).length;
}

/**
 * Where each CEFR level starts in the ordered word list, so a learner can jump
 * the daily program to their level instead of always starting at word #1.
 */
export async function getLevelOffsets(): Promise<LevelOffset[]> {
  const all = await loadOrderedWords();
  const result: LevelOffset[] = [];
  for (const level of CEFR_LEVELS) {
    const offset = all.findIndex((c) => c.level === level);
    if (offset === -1) continue;
    const count = all.filter((c) => c.level === level).length;
    result.push({ level, offset, count });
  }
  return result;
}
