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

export interface ClozeItem {
  id: number;
  /** All word tokens of the sentence. */
  tokens: string[];
  /** Index of the blanked-out word within `tokens`. */
  blankIndex: number;
  /** The correct word (as written in the sentence). */
  answer: string;
  /** Four options, `answer` included, shuffled. */
  options: string[];
  en: string;
  level: CEFRLevel;
}

/**
 * Build fill-in-the-blank exercises from real sentences (Clozemaster-style).
 * The blank is the longest word that exists in the vocabulary lexicon, so the
 * gap is always a meaningful content word rather than punctuation-adjacent
 * filler.
 */
export async function buildClozeSet(
  level: CEFRLevel | 'all',
  count: number
): Promise<ClozeItem[]> {
  const [{ loadLexicon, lookupWord }, raw] = await Promise.all([
    import('./nlp'),
    loadRaw(),
  ]);
  const lexicon = await loadLexicon();

  const pool = raw.filter((s) => {
    const lvlOk = level === 'all' || s.cefr_level === level;
    return lvlOk && s.word_count >= 3 && s.word_count <= 12 && s.sentence_en;
  });

  const items: ClozeItem[] = [];
  for (const s of shuffle(pool)) {
    if (items.length >= count) break;
    const tokens = s.sentence_de.split(/\s+/).filter(Boolean);
    // Longest lexicon-known word wins; strip punctuation for the lookup.
    let blankIndex = -1;
    let best = '';
    tokens.forEach((t, i) => {
      const word = t.replace(/[^A-Za-zÀ-ÿäöüÄÖÜß-]/g, '');
      if (word.length > best.length && lookupWord(word, lexicon).entry) {
        best = word;
        blankIndex = i;
      }
    });
    if (blankIndex === -1 || best.length < 3) continue;
    items.push({
      id: s.id,
      tokens,
      blankIndex,
      answer: best,
      options: [], // distractors filled in below, across the whole set
      en: s.sentence_en,
      level: s.cefr_level,
    });
  }

  // Distractors: other items' answers (real words of similar difficulty).
  const allAnswers = Array.from(new Set(items.map((i) => i.answer)));
  for (const item of items) {
    const distractors = shuffle(
      allAnswers.filter((a) => a !== item.answer)
    ).slice(0, 3);
    // Rare small sets: pad from the lexicon-free token pool if needed.
    item.options = shuffle([item.answer, ...distractors]);
  }

  return items.filter((i) => i.options.length >= 2);
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
