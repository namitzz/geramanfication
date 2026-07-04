import { describe, it, expect } from 'vitest';
import { getDailyPuzzle, seededScramble, shareText, MAX_ATTEMPTS } from '../content/daily';
import { loadGenderNouns, genderHint } from '../content/gender';
import { loadCognatesDeck } from '../content/cognates';
import { useAppStore } from '../stores/appStore';

describe('daily sprint', () => {
  it('is deterministic for the same date', async () => {
    const date = new Date(2026, 6, 15);
    const a = await getDailyPuzzle(date);
    const b = await getDailyPuzzle(date);
    expect(a.item.de).toBe(b.item.de);
    expect(a.scrambled).toEqual(b.scrambled);
    expect(a.number).toBe(b.number);
  });

  it('changes across days and stays beginner-sized', async () => {
    const puzzles = await Promise.all(
      [10, 11, 12, 13, 14].map((d) => getDailyPuzzle(new Date(2026, 6, d)))
    );
    const sentences = new Set(puzzles.map((p) => p.item.de));
    expect(sentences.size).toBeGreaterThan(1);
    for (const p of puzzles) {
      expect(p.item.tokens.length).toBeGreaterThanOrEqual(4);
      expect(p.item.tokens.length).toBeLessThanOrEqual(8);
      expect(['A1', 'A2']).toContain(p.item.level);
      // Scramble must never present the solved order.
      expect(p.scrambled.join(' ')).not.toBe(p.item.tokens.join(' '));
    }
  });

  it('never returns the original order from seededScramble', () => {
    for (let seed = 0; seed < 50; seed++) {
      const tokens = ['Ich', 'wohne', 'in', 'Berlin'];
      expect(seededScramble(tokens, seed).join(' ')).not.toBe(tokens.join(' '));
    }
  });

  it('formats share text like Wordle', () => {
    expect(shareText(12, 2, true)).toContain('#12');
    expect(shareText(12, 2, true)).toContain(`2/${MAX_ATTEMPTS}`);
    expect(shareText(12, 3, false)).toContain(`X/${MAX_ATTEMPTS}`);
  });
});

describe('gender reflex', () => {
  it('loads only nouns with a real article', async () => {
    const nouns = await loadGenderNouns();
    expect(nouns.length).toBeGreaterThan(500);
    for (const n of nouns.slice(0, 200)) {
      expect(['der', 'die', 'das']).toContain(n.article);
      expect(n.de).toBeTruthy();
      expect(n.en).toBeTruthy();
    }
  });

  it('gives rule hints for classic endings', () => {
    expect(genderHint('Zeitung', 'die')).toContain('-ung');
    expect(genderHint('Mädchen', 'das')).toContain('-chen');
    expect(genderHint('Haus', 'das')).toBeNull(); // no rule applies
  });
});

describe('cognates', () => {
  it('builds a non-empty deck of look-alike words', async () => {
    const deck = await loadCognatesDeck();
    expect(deck.cards.length).toBeGreaterThan(10);
    expect(deck.cards.length).toBeLessThanOrEqual(50);
    for (const c of deck.cards) {
      expect(c.de.length).toBeGreaterThanOrEqual(3);
      expect(['A1', 'A2']).toContain(c.level);
    }
  });
});

describe('vocabulary mining store', () => {
  it('adds and removes mined words', () => {
    const { addMinedWord, removeMinedWord } = useAppStore.getState();
    addMinedWord({ id: 'mined-haus', de: 'Haus', en: 'house' });
    expect(useAppStore.getState().minedWords['mined-haus'].de).toBe('Haus');
    removeMinedWord('mined-haus');
    expect(useAppStore.getState().minedWords['mined-haus']).toBeUndefined();
  });
});
