/**
 * A tiny, offline German NLP layer built on the bundled vocabulary dataset.
 *
 * It tokenizes German text, then looks up each word in an 8k-word lexicon with
 * light heuristic lemmatization (stripping common inflectional endings) so
 * inflected forms still resolve to a dictionary entry. No model, no network.
 */

import type { CEFRLevel } from '../types';
import { isUsableTranslation } from './vocabulary';

interface RawVocab {
  german: string;
  english: string;
  gender: string;
  pos: string;
  frequency_rank: number;
  level: CEFRLevel;
}

export interface LexEntry {
  de: string;
  en: string;
  pos: string;
  gender: string;
  level: CEFRLevel;
  freq: number;
}

export interface Token {
  text: string;
  isWord: boolean;
}

export interface AnalyzedWord {
  text: string; // original token as written
  entry?: LexEntry; // matched dictionary entry, if any
  lemma?: string; // the form that matched (for inflected words)
}

export interface Analysis {
  tokens: (Token & { annotation?: AnalyzedWord })[];
  words: AnalyzedWord[];
  totalWords: number;
  knownWords: number;
  coverage: number; // 0..1
  levelCounts: Record<CEFRLevel, number>;
  unknown: string[];
}

let lexiconPromise: Promise<Map<string, LexEntry>> | null = null;

/** Build a lowercase-keyed lexicon; on collisions keep the most common entry. */
export function loadLexicon(): Promise<Map<string, LexEntry>> {
  if (!lexiconPromise) {
    lexiconPromise = import('./generated/vocab.json').then((mod) => {
      const rows = mod.default as RawVocab[];
      const map = new Map<string, LexEntry>();
      for (const r of rows) {
        if (r.pos === 'name' || !isUsableTranslation(r.english)) continue;
        const key = r.german.toLowerCase();
        const existing = map.get(key);
        // Prefer the more frequent (lower rank) reading of a word.
        if (!existing || r.frequency_rank < existing.freq) {
          map.set(key, {
            de: r.german,
            en: r.english,
            pos: r.pos,
            gender: r.gender,
            level: r.level,
            freq: r.frequency_rank,
          });
        }
      }
      return map;
    });
  }
  return lexiconPromise;
}

/** Split German text into word and non-word (spaces/punctuation) tokens. */
export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  // Words: letters incl. German umlauts/ß, apostrophes and hyphens inside.
  const re = /([A-Za-zÀ-ÿäöüÄÖÜß]+(?:['-][A-Za-zÀ-ÿäöüÄÖÜß]+)*)|([^A-Za-zÀ-ÿäöüÄÖÜß]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m[1]) tokens.push({ text: m[1], isWord: true });
    else tokens.push({ text: m[2], isWord: false });
  }
  return tokens;
}

// Inflectional endings to strip, longest first (verbs, adjectives, plurals).
const SUFFIXES = [
  'esten',
  'sten',
  'ende',
  'eten',
  'test',
  'end',
  'ere',
  'ten',
  'est',
  'em',
  'en',
  'er',
  'es',
  'st',
  'te',
  'e',
  'n',
  's',
  't',
];

/** Reverse umlauting for plural stems (Häuser -> haus, Mütter -> mutter). */
const deUmlaut = (s: string): string =>
  s.replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u');

/** Candidate base forms for a lowercased word, in priority order. */
function candidates(word: string): string[] {
  const out = [word];
  for (const suf of SUFFIXES) {
    if (word.length - suf.length >= 3 && word.endsWith(suf)) {
      const base = word.slice(0, -suf.length);
      // Try the reconstructed infinitive BEFORE the bare stem: "heiße"
      // should gloss as heißen (to be called), not heiß (hot).
      out.push(base + 'en');
      out.push(base);
      // Umlauted plural stems: Häuser -> häus -> haus.
      const plain = deUmlaut(base);
      if (plain !== base) out.push(plain);
    }
  }
  return out;
}

/** Look up a single word, trying the surface form then lemmatized candidates. */
export function lookupWord(
  word: string,
  lexicon: Map<string, LexEntry>
): AnalyzedWord {
  const lower = word.toLowerCase();
  for (const cand of candidates(lower)) {
    const entry = lexicon.get(cand);
    if (entry) return { text: word, entry, lemma: cand === lower ? undefined : cand };
  }
  return { text: word };
}

export interface CompoundPart {
  part: string;
  entry: LexEntry;
}

// German linking elements ("Fugenelemente") that glue compound parts together:
// Arbeit+s+zeit, Blume+n+laden, ...
const LINKERS = ['', 's', 'es', 'n', 'en', 'er', 'e'];

/**
 * Try to split a German compound word into lexicon-known parts
 * (Hausarbeit -> Haus + Arbeit). Depth-first, preferring the fewest parts;
 * each part must be ≥ 3 chars and exist in the lexicon. Returns null when no
 * full split is found.
 */
export function splitCompound(
  word: string,
  lexicon: Map<string, LexEntry>
): CompoundPart[] | null {
  const lower = word.toLowerCase();
  if (lower.length < 7) return null; // too short to be a compound worth splitting

  const find = (rest: string, depth: number): CompoundPart[] | null => {
    if (rest.length === 0) return [];
    if (depth >= 3) return null;
    // Longest-first keeps splits natural (Kranken+haus over Kran+ken+haus).
    for (let end = rest.length; end >= 3; end--) {
      const head = rest.slice(0, end);
      const entry = lexicon.get(head);
      if (!entry) continue;
      // The final part must consume the whole remainder.
      if (end === rest.length) return [{ part: head, entry }];
      for (const linker of LINKERS) {
        const after = rest.slice(end + linker.length);
        if (linker && !rest.slice(end).startsWith(linker)) continue;
        if (after.length < 3) continue;
        const tail = find(after, depth + 1);
        if (tail) return [{ part: head, entry }, ...tail];
      }
    }
    return null;
  };

  const parts = find(lower, 0);
  // A "split" into one part just means the word itself was found — not a compound.
  return parts && parts.length >= 2 ? parts : null;
}

const EMPTY_LEVELS = (): Record<CEFRLevel, number> => ({
  A1: 0,
  A2: 0,
  B1: 0,
  B2: 0,
  C1: 0,
});

/** Analyze a block of German text against the lexicon. */
export function analyze(text: string, lexicon: Map<string, LexEntry>): Analysis {
  const tokens = tokenize(text);
  const words: AnalyzedWord[] = [];
  const levelCounts = EMPTY_LEVELS();
  const unknown: string[] = [];

  const annotated = tokens.map((t) => {
    if (!t.isWord) return t;
    const a = lookupWord(t.text, lexicon);
    words.push(a);
    if (a.entry) levelCounts[a.entry.level]++;
    else unknown.push(t.text);
    return { ...t, annotation: a };
  });

  const knownWords = words.filter((w) => w.entry).length;
  return {
    tokens: annotated,
    words,
    totalWords: words.length,
    knownWords,
    coverage: words.length ? knownWords / words.length : 0,
    levelCounts,
    unknown,
  };
}
