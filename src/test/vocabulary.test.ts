import { describe, it, expect } from 'vitest';
import {
  CEFR_LEVELS,
  cleanMeaning,
  loadVocabularyDecks,
  loadVocabularyByLevel,
} from '../content/vocabulary';

describe('vocabulary content', () => {
  it('builds decks for every CEFR level', async () => {
    const decks = await loadVocabularyDecks();
    expect(decks.length).toBeGreaterThan(0);
    for (const level of CEFR_LEVELS) {
      const levelDecks = decks.filter((d) =>
        d.id.startsWith(`vocab-${level.toLowerCase()}-`)
      );
      expect(levelDecks.length).toBeGreaterThan(0);
    }
  });

  it('gives every card a stable, unique id', async () => {
    const decks = await loadVocabularyDecks();
    const ids = decks.flatMap((d) => d.cards.map((c) => c.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('caps decks at 50 cards and carries level metadata', async () => {
    const decks = await loadVocabularyDecks();
    for (const deck of decks) {
      expect(deck.cards.length).toBeLessThanOrEqual(50);
      expect(deck.cards.length).toBeGreaterThan(0);
      for (const card of deck.cards) {
        expect(card.de).toBeTruthy();
        expect(card.en).toBeTruthy();
        expect(CEFR_LEVELS).toContain(card.level);
      }
    }
  });

  it('excludes proper nouns (pos "name")', async () => {
    const decks = await loadVocabularyDecks();
    const partsOfSpeech = decks.flatMap((d) =>
      d.cards.map((c) => c.partOfSpeech)
    );
    expect(partsOfSpeech).not.toContain('name');
  });

  it('excludes grammatical-label "translations" (e.g. imperative/plural of)', async () => {
    const decks = await loadVocabularyDecks();
    const meanings = decks.flatMap((d) => d.cards.map((c) => c.en.toLowerCase()));
    for (const m of meanings) {
      expect(m).not.toContain('imperative');
      expect(m).not.toContain('plural of');
      expect(m).not.toContain('genitive');
      expect(m).not.toMatch(/^(singular|plural)$/);
    }
  });

  it('cleans awkward dictionary glosses for display', () => {
    expect(cleanMeaning('house; dwelling')).toBe('house');
    expect(cleanMeaning('free [not imprisoned]')).toBe('free');
    expect(cleanMeaning('to go (on foot)')).toBe('to go');
    expect(cleanMeaning('plain')).toBe('plain');
  });

  it('summarizes word counts per level', async () => {
    const summaries = await loadVocabularyByLevel();
    expect(summaries.map((s) => s.level)).toEqual(CEFR_LEVELS);
    for (const s of summaries) {
      expect(s.wordCount).toBeGreaterThan(0);
      expect(s.decks.length).toBeGreaterThan(0);
    }
  });
});
