import { describe, it, expect } from 'vitest';
import {
  analyze,
  loadLexicon,
  lookupWord,
  splitCompound,
  tokenize,
} from '../content/nlp';

describe('nlp tokenizer', () => {
  it('separates words from punctuation and spaces', () => {
    const tokens = tokenize('Ich heiße Anna.');
    const words = tokens.filter((t) => t.isWord).map((t) => t.text);
    expect(words).toEqual(['Ich', 'heiße', 'Anna']);
  });

  it('keeps umlauts and ß inside words', () => {
    const tokens = tokenize('Tschüss, Straße!');
    const words = tokens.filter((t) => t.isWord).map((t) => t.text);
    expect(words).toEqual(['Tschüss', 'Straße']);
  });
});

describe('nlp lexicon + lookup', () => {
  it('looks up a common word regardless of case', async () => {
    const lex = await loadLexicon();
    const a = lookupWord('Haus', lex);
    expect(a.entry).toBeTruthy();
    expect(a.entry?.en.toLowerCase()).toContain('house');
  });

  it('resolves an inflected form to its base via lemmatization', async () => {
    const lex = await loadLexicon();
    // "wohne" should resolve to the verb "wohnen"
    const a = lookupWord('wohne', lex);
    expect(a.entry).toBeTruthy();
    expect(a.lemma).toBeTruthy(); // matched a base form, not the surface form
  });

  it('returns no entry for gibberish', async () => {
    const lex = await loadLexicon();
    expect(lookupWord('xqzptv', lex).entry).toBeUndefined();
  });
});

describe('nlp compound splitter', () => {
  // Synthetic lexicon so the tests don't depend on which compounds happen to
  // exist as whole entries in the real dataset (the splitter only runs on
  // words the lexicon does NOT contain).
  const entry = (de: string, en: string) => ({
    de,
    en,
    pos: 'noun',
    gender: 'das',
    level: 'A1' as const,
    freq: 1,
  });
  const lex = new Map([
    ['haus', entry('Haus', 'house')],
    ['arbeit', entry('Arbeit', 'work')],
    ['zeit', entry('Zeit', 'time')],
  ]);

  it('splits a two-part compound into known words', () => {
    const parts = splitCompound('Hausarbeit', lex);
    expect(parts).toBeTruthy();
    expect(parts!.map((p) => p.part)).toEqual(['haus', 'arbeit']);
    for (const p of parts!) expect(p.entry.en).toBeTruthy();
  });

  it('handles linking elements (Fugen-s etc.)', () => {
    // Arbeitszeit = Arbeit + s + Zeit
    const parts = splitCompound('Arbeitszeit', lex);
    expect(parts).toBeTruthy();
    expect(parts!.map((p) => p.part)).toEqual(['arbeit', 'zeit']);
  });

  it('returns null for non-compounds, known words, and gibberish', () => {
    expect(splitCompound('Haus', lex)).toBeNull(); // too short / single word
    expect(splitCompound('xqzptvwxyz', lex)).toBeNull();
  });

  it('does not fire on unknown words in the real lexicon that are not compounds', async () => {
    const real = await loadLexicon();
    expect(splitCompound('xqzptvwxyzqq', real)).toBeNull();
  });
});

describe('nlp analyze', () => {
  it('computes coverage and level counts', async () => {
    const lex = await loadLexicon();
    const res = analyze('Ich wohne in Berlin.', lex);
    expect(res.totalWords).toBe(4);
    expect(res.knownWords).toBeGreaterThan(0);
    expect(res.coverage).toBeGreaterThan(0);
    expect(res.coverage).toBeLessThanOrEqual(1);
    const levelTotal = Object.values(res.levelCounts).reduce((a, b) => a + b, 0);
    expect(levelTotal).toBe(res.knownWords);
  });
});
