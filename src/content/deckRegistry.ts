/**
 * Unified deck resolution across the hand-authored static decks and the
 * lazily-loaded, API-imported vocabulary decks.
 */

import type { Deck } from '../types';
import { allDecks } from './decks';
import { loadVocabularyDecks } from './vocabulary';
import { COGNATES_DECK_ID, loadCognatesDeck } from './cognates';
import { useAppStore } from '../stores/appStore';

export const MINED_DECK_ID = 'mined';

/**
 * Resolve a deck by id. Static decks resolve synchronously; vocabulary deck ids
 * (prefixed `vocab-`) trigger the lazy vocabulary load. Special ids: `cognates`
 * (computed) and `mined` (the user's saved words from the Analyzer).
 */
export async function getDeckById(id: string): Promise<Deck | undefined> {
  const staticDeck = allDecks.find((d) => d.id === id);
  if (staticDeck) return staticDeck;

  if (id === COGNATES_DECK_ID) return loadCognatesDeck();

  if (id === MINED_DECK_ID) {
    const cards = Object.values(useAppStore.getState().minedWords);
    if (cards.length === 0) return undefined;
    return {
      id: MINED_DECK_ID,
      name: 'My Mined Words',
      description: 'Words you saved from the Analyzer',
      cards,
    };
  }

  if (id.startsWith('vocab-')) {
    const vocabDecks = await loadVocabularyDecks();
    return vocabDecks.find((d) => d.id === id);
  }

  return undefined;
}
