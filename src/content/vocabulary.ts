/**
 * CEFR-leveled vocabulary, derived from the API-imported dataset
 * (src/content/generated/vocab.json, produced by `npm run content:fetch`).
 *
 * The raw JSON (~8,200 words) is loaded with a dynamic import so it ships as a
 * separate chunk and never weighs down the main bundle. Decks are built once
 * and cached.
 */

import type { Article, Card, CEFRLevel, Deck, PartOfSpeech } from '../types';

/** Shape of a row in generated/vocab.json. */
interface ApiVocab {
  german: string;
  english: string;
  all_translations: string;
  gender: string;
  pos: string;
  frequency_rank: number;
  example_de: string;
  example_en: string;
  level: CEFRLevel;
}

export const CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export const LEVEL_LABELS: Record<CEFRLevel, string> = {
  A1: 'A1 · Beginner',
  A2: 'A2 · Elementary',
  B1: 'B1 · Intermediate',
  B2: 'B2 · Upper-Intermediate',
  C1: 'C1 · Advanced',
};

/** Words per generated deck — small enough for a single study session. */
const CARDS_PER_DECK = 50;

const POS_MAP: Record<string, PartOfSpeech> = {
  adjective: 'adj',
  adverb: 'adv',
  noun: 'noun',
  verb: 'verb',
  numeral: 'numeral',
  interjection: 'interjection',
  pronoun: 'pronoun',
  conjunction: 'conjunction',
  preposition: 'preposition',
  determiner: 'determiner',
  particle: 'particle',
  name: 'name',
};

function toArticle(gender: string): Article | undefined {
  if (gender === 'der' || gender === 'die' || gender === 'das') return gender;
  return undefined;
}

/**
 * The source dataset includes Wiktionary-style morphological labels in the
 * `english` field (e.g. "singular imperative of hausen", "plural of Auge",
 * "genitive of er") instead of a real translation. These make confusing,
 * effectively wrong flashcards/quiz answers, so they are excluded.
 */
const JUNK_MEANING_PATTERNS = [
  'imperative',
  'genitive',
  'dative',
  'accusative',
  'nominative',
  'vocative',
  'inflection of',
  'inflected form',
  'past participle',
  'present participle',
  'past tense of',
  'alternative form of',
  'alternative spelling of',
  'obsolete',
  'archaic',
  'misspelling',
  'ungrammatical',
  'comparative of',
  'superlative of',
  'plural of',
  'singular of',
];

export function isUsableTranslation(english: string): boolean {
  const s = english.trim().toLowerCase();
  if (!s) return false;
  if (s === 'singular' || s === 'plural') return false;
  return !JUNK_MEANING_PATTERNS.some((p) => s.includes(p));
}

function toCard(row: ApiVocab, index: number): Card {
  return {
    id: `v-${row.level}-${index}`,
    de: row.german,
    en: row.english,
    partOfSpeech: POS_MAP[row.pos],
    article: toArticle(row.gender),
    level: row.level,
    frequencyRank: row.frequency_rank,
    exampleDe: row.example_de || undefined,
    exampleEn: row.example_en || undefined,
  };
}

let decksPromise: Promise<Deck[]> | null = null;

/**
 * Load and build all vocabulary decks, grouped by CEFR level and chunked into
 * frequency-ordered sets. Cached after the first call.
 */
export function loadVocabularyDecks(): Promise<Deck[]> {
  if (!decksPromise) {
    decksPromise = import('./generated/vocab.json').then((mod) => {
      const rows = mod.default as ApiVocab[];
      const decks: Deck[] = [];

      for (const level of CEFR_LEVELS) {
        // Skip proper nouns and entries whose "translation" is a grammatical
        // label rather than a real meaning.
        const words = rows
          .filter(
            (r) =>
              r.level === level &&
              r.pos !== 'name' &&
              isUsableTranslation(r.english)
          )
          .sort((a, b) => a.frequency_rank - b.frequency_rank);

        const cards = words.map(toCard);
        const setCount = Math.ceil(cards.length / CARDS_PER_DECK);

        for (let i = 0; i < setCount; i++) {
          const start = i * CARDS_PER_DECK;
          const slice = cards.slice(start, start + CARDS_PER_DECK);
          decks.push({
            id: `vocab-${level.toLowerCase()}-${i + 1}`,
            name: `${level} · Set ${i + 1}`,
            description: `${level} vocabulary, words ${start + 1}–${
              start + slice.length
            } by frequency`,
            cards: slice,
          });
        }
      }

      return decks;
    });
  }
  return decksPromise;
}

export interface LevelSummary {
  level: CEFRLevel;
  label: string;
  wordCount: number;
  decks: Deck[];
}

/** Vocabulary decks grouped by level, for the level-browser UI. */
export async function loadVocabularyByLevel(): Promise<LevelSummary[]> {
  const decks = await loadVocabularyDecks();
  return CEFR_LEVELS.map((level) => {
    const levelDecks = decks.filter((d) =>
      d.id.startsWith(`vocab-${level.toLowerCase()}-`)
    );
    return {
      level,
      label: LEVEL_LABELS[level],
      wordCount: levelDecks.reduce((sum, d) => sum + d.cards.length, 0),
      decks: levelDecks,
    };
  });
}
