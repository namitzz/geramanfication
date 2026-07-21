import { describe, it, expect } from 'vitest';
import { allDecks } from '../content/decks';
import mcqData from '../content/mcq-hard.json';
import lessonsData from '../content/classes/lessons.json';

interface MCQ {
  id: string;
  question: string;
  options: string[];
  correct: number;
  category: string;
}
interface Lesson {
  id: string;
  de: string;
  en: string;
  topic: string;
  type: string;
}

const mcqs = mcqData as MCQ[];
const lessons = lessonsData as Lesson[];

/**
 * Language names ("Deutsch") and nationality pairs ("Franzose / Französin")
 * correctly take no single article in German — exempt from the article rule.
 */
const ARTICLE_EXEMPT_DECKS = new Set(['languages', 'nationalities']);

describe('content quality: curated decks', () => {
  it('deck ids and card ids are unique', () => {
    const deckIds = allDecks.map((d) => d.id);
    expect(new Set(deckIds).size).toBe(deckIds.length);
    const cardIds = allDecks.flatMap((d) => d.cards.map((c) => c.id));
    expect(new Set(cardIds).size).toBe(cardIds.length);
  });

  it('no duplicate German entries within a deck', () => {
    for (const deck of allDecks) {
      const de = deck.cards.map((c) => c.de.toLowerCase());
      expect(new Set(de).size, `duplicates in ${deck.id}`).toBe(de.length);
    }
  });

  it('every card has non-empty German and English', () => {
    for (const deck of allDecks) {
      for (const card of deck.cards) {
        expect(card.de.trim(), `${deck.id}/${card.id}`).not.toBe('');
        expect(card.en.trim(), `${deck.id}/${card.id}`).not.toBe('');
      }
    }
  });

  it('nouns carry their article (except languages/nationalities)', () => {
    for (const deck of allDecks) {
      if (ARTICLE_EXEMPT_DECKS.has(deck.id)) continue;
      for (const card of deck.cards) {
        if (card.partOfSpeech === 'noun') {
          expect(card.article, `${deck.id}: "${card.de}" needs der/die/das`).toBeTruthy();
        }
      }
    }
  });
});

describe('content quality: MCQ bank', () => {
  it('question ids are unique', () => {
    const ids = mcqs.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('no fully identical questions (text + options)', () => {
    const keys = mcqs.map((q) => `${q.question}|${q.options.join(',')}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('options are distinct and the correct index is valid', () => {
    for (const q of mcqs) {
      expect(new Set(q.options).size, `${q.id} has duplicate options`).toBe(q.options.length);
      expect(q.correct, `${q.id} correct index`).toBeGreaterThanOrEqual(0);
      expect(q.correct, `${q.id} correct index`).toBeLessThan(q.options.length);
      expect(q.options[q.correct], `${q.id} correct answer`).toBeTruthy();
    }
  });
});

describe('content quality: course lessons', () => {
  it('lesson ids are unique and fields are non-empty', () => {
    const ids = lessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const l of lessons) {
      expect(l.de.trim(), l.id).not.toBe('');
      expect(l.en.trim(), l.id).not.toBe('');
    }
  });

  it('no fully identical lessons (same German + same English)', () => {
    const keys = lessons.map((l) => `${l.de.toLowerCase()}|${l.en.toLowerCase()}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
