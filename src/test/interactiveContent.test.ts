import { describe, it, expect } from 'vitest';
import {
  buildGrammarQuestions,
  getGrammarCategories,
  loadGrammarRules,
} from '../content/grammar';
import {
  buildClozeSet,
  buildSentenceSet,
  getSentenceLevelCounts,
} from '../content/sentences';
import { loadLexicon, lookupWord } from '../content/nlp';

describe('grammar content', () => {
  it('loads rules and categories', async () => {
    const rules = await loadGrammarRules();
    expect(rules.length).toBeGreaterThan(0);
    const cats = await getGrammarCategories();
    expect(cats.length).toBeGreaterThan(0);
  });

  it('builds well-formed MCQ questions', async () => {
    const qs = await buildGrammarQuestions('all', 'all', 10);
    expect(qs.length).toBe(10);
    for (const q of qs) {
      expect(q.options.length).toBe(4);
      expect(new Set(q.options).size).toBe(4); // no duplicate options
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.options[q.correctIndex]).toBeTruthy();
      expect(q.prompt).toBeTruthy();
    }
  });

  it('filters by level', async () => {
    const qs = await buildGrammarQuestions('all', 'A1', 5);
    for (const q of qs) expect(q.level).toBeTruthy();
  });
});

describe('sentence content', () => {
  it('builds a sentence set with tokens', async () => {
    const set = await buildSentenceSet('A1', 8);
    expect(set.length).toBeGreaterThan(0);
    expect(set.length).toBeLessThanOrEqual(8);
    for (const s of set) {
      expect(s.de).toBeTruthy();
      expect(s.en).toBeTruthy();
      expect(s.level).toBe('A1');
      expect(s.tokens.join(' ')).toBe(s.de);
      expect(s.tokens.length).toBeLessThanOrEqual(9);
    }
  });

  it('reports per-level counts', async () => {
    const counts = await getSentenceLevelCounts();
    expect(counts.all).toBeGreaterThan(0);
    expect(counts.A1).toBeGreaterThan(0);
  });
});

describe('cloze content', () => {
  it('builds well-formed cloze items', async () => {
    const items = await buildClozeSet('A1', 10);
    const lexicon = await loadLexicon();
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      // Blank points at a real token and the answer is that token's word.
      expect(item.blankIndex).toBeGreaterThanOrEqual(0);
      expect(item.blankIndex).toBeLessThan(item.tokens.length);
      expect(item.tokens[item.blankIndex]).toContain(item.answer);
      // The blanked word is glossable via the lexicon.
      expect(lookupWord(item.answer, lexicon).entry).toBeTruthy();
      // Options include the answer, are distinct, and at most 4.
      expect(item.options).toContain(item.answer);
      expect(new Set(item.options).size).toBe(item.options.length);
      expect(item.options.length).toBeLessThanOrEqual(4);
      expect(item.en).toBeTruthy();
    }
  });

  it('respects the level filter', async () => {
    const items = await buildClozeSet('A1', 5);
    for (const item of items) expect(item.level).toBe('A1');
  });
});
