/**
 * Unified deck resolution across the hand-authored static decks and the
 * lazily-loaded, API-imported vocabulary decks.
 */

import type { Deck } from '../types';
import { allDecks } from './decks';
import { loadVocabularyDecks } from './vocabulary';

/**
 * Resolve a deck by id. Static decks resolve synchronously; vocabulary deck ids
 * (prefixed `vocab-`) trigger the lazy vocabulary load.
 */
export async function getDeckById(id: string): Promise<Deck | undefined> {
  const staticDeck = allDecks.find((d) => d.id === id);
  if (staticDeck) return staticDeck;

  if (id.startsWith('vocab-')) {
    const vocabDecks = await loadVocabularyDecks();
    return vocabDecks.find((d) => d.id === id);
  }

  return undefined;
}
