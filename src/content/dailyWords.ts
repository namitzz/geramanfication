/**
 * The daily-words program: every day serves the next WORDS_PER_DAY unseen
 * words from the frequency-ordered vocabulary (A1 first, then A2 ... C1),
 * driven by the persistent cursor in the app store's `dailyReview` slice.
 */

import type { Card } from '../types';
import { loadVocabularyDecks } from './vocabulary';

export const WORDS_PER_DAY = 50;

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
