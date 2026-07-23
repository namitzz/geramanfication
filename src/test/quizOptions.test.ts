import { describe, it, expect } from 'vitest';
import type { Card } from '../types';
import { buildChoiceOptions, buildOptions } from '../utils/quizOptions';

const card = (id: string, en: string, extra: Partial<Card> = {}): Card => ({
  id,
  de: id,
  en,
  ...extra,
});

describe('buildChoiceOptions', () => {
  const correct = card('c', 'car', { partOfSpeech: 'noun', level: 'A1' });

  it('always includes the correct answer', () => {
    const pool = [card('1', 'house'), card('2', 'dog'), card('3', 'tree'), card('4', 'street')];
    const opts = buildChoiceOptions(correct, pool);
    expect(opts).toContain('car');
  });

  it('returns distinct options', () => {
    const pool = [card('1', 'house'), card('2', 'dog'), card('3', 'tree'), card('4', 'street')];
    const opts = buildChoiceOptions(correct, pool);
    expect(new Set(opts).size).toBe(opts.length);
  });

  it('never offers a distractor that shares a meaning with the correct answer', () => {
    // A duplicate gloss and an overlapping compound gloss must both be filtered.
    const pool = [
      card('1', 'car'), // duplicate meaning
      card('2', 'car, automobile'), // overlapping meaning
      card('3', 'house'),
      card('4', 'dog'),
      card('5', 'tree'),
    ];
    const opts = buildChoiceOptions(correct, pool);
    const distractors = opts.filter((o) => o !== 'car');
    expect(distractors).not.toContain('car');
    expect(distractors).not.toContain('car, automobile');
  });

  it('does not offer two distractors that share a meaning', () => {
    const pool = [
      card('1', 'quick'),
      card('2', 'quick, fast'), // shares "quick" with card 1
      card('3', 'house'),
      card('4', 'dog'),
    ];
    const opts = buildChoiceOptions(card('c', 'car'), pool);
    const hasQuick = opts.includes('quick');
    const hasQuickFast = opts.includes('quick, fast');
    expect(hasQuick && hasQuickFast).toBe(false);
  });

  it('prefers distractors of the same part of speech when enough exist', () => {
    const pool = [
      card('n1', 'house', { partOfSpeech: 'noun' }),
      card('n2', 'dog', { partOfSpeech: 'noun' }),
      card('n3', 'tree', { partOfSpeech: 'noun' }),
      card('v1', 'to run', { partOfSpeech: 'verb' }),
      card('v2', 'to eat', { partOfSpeech: 'verb' }),
    ];
    const opts = buildChoiceOptions(card('c', 'car', { partOfSpeech: 'noun' }), pool);
    const distractors = opts.filter((o) => o !== 'car');
    // All three distractors should be the nouns, not the verbs.
    for (const d of distractors) {
      expect(['house', 'dog', 'tree']).toContain(d);
    }
  });

  it('degrades gracefully with a tiny pool', () => {
    const opts = buildChoiceOptions(correct, [card('1', 'house')]);
    expect(opts).toContain('car');
    expect(opts).toContain('house');
    expect(new Set(opts).size).toBe(opts.length);
  });
});

describe('buildOptions (generic, used by the Classes quiz)', () => {
  it('draws from the first non-empty tier before widening', () => {
    const opts = buildOptions('hello', [
      ['hi there', 'good morning', 'good evening'], // same-topic tier
      ['the dog', 'to run'], // wider tier — should not be needed
    ]);
    expect(opts).toContain('hello');
    for (const o of opts.filter((x) => x !== 'hello')) {
      expect(['hi there', 'good morning', 'good evening']).toContain(o);
    }
  });

  it('rejects distractors that share a meaning with the answer', () => {
    // Exact duplicate and a comma-overlapping gloss must both be filtered.
    const opts = buildOptions('please', [
      ['please', 'please, go ahead', 'thank you', 'sorry'],
    ]);
    const distractors = opts.filter((o) => o !== 'please');
    expect(distractors).not.toContain('please');
    expect(distractors).not.toContain('please, go ahead');
  });
});
