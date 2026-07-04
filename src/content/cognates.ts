/**
 * "German you already know" — cognates and loanwords detected by comparing
 * German words to their English translations (exact or near-exact spelling).
 */

import type { Card, CEFRLevel, Deck } from '../types';
import { levenshteinDistance } from '../utils/stringMatch';
import { isUsableTranslation } from './vocabulary';

interface RawVocab {
  german: string;
  english: string;
  gender: string;
  pos: string;
  frequency_rank: number;
  level: CEFRLevel;
}

export const COGNATES_DECK_ID = 'cognates';
const MAX_CARDS = 50;

function isCognate(de: string, en: string): boolean {
  const a = de.toLowerCase();
  const b = en.toLowerCase();
  if (a.length < 3 || b.includes(' ')) return false;
  if (a === b) return true;
  const dist = levenshteinDistance(a, b);
  if (a.length >= 7) return dist <= 2;
  if (a.length >= 4) return dist <= 1;
  return false;
}

let deckPromise: Promise<Deck> | null = null;

/** The cognates deck: A1/A2 words spelled (almost) like their English meaning. */
export function loadCognatesDeck(): Promise<Deck> {
  if (!deckPromise) {
    deckPromise = import('./generated/vocab.json').then((mod) => {
      const rows = mod.default as RawVocab[];
      const seen = new Set<string>();
      const cards: Card[] = [];

      for (const r of rows) {
        if (r.level !== 'A1' && r.level !== 'A2') continue;
        if (r.pos === 'name' || !isUsableTranslation(r.english)) continue;
        const key = r.german.toLowerCase();
        if (seen.has(key) || !isCognate(r.german, r.english)) continue;
        seen.add(key);
        cards.push({
          id: `cog-${key}`,
          de: r.german,
          en: r.english,
          article:
            r.gender === 'der' || r.gender === 'die' || r.gender === 'das'
              ? r.gender
              : undefined,
          level: r.level,
          frequencyRank: r.frequency_rank,
        });
      }

      cards.sort((a, b) => (a.frequencyRank ?? 0) - (b.frequencyRank ?? 0));
      return {
        id: COGNATES_DECK_ID,
        name: 'German You Already Know',
        description: 'Cognates: German words spelled (almost) like the English',
        cards: cards.slice(0, MAX_CARDS),
      };
    });
  }
  return deckPromise;
}
