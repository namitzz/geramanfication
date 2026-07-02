import { describe, it, expect } from 'vitest';
import { analyze, loadLexicon, lookupWord, tokenize } from '../content/nlp';

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
