import { describe, it, expect } from 'vitest';
import {
  allDecks,
  sentencesDeck,
  nationalitiesDeck,
  familyDeck,
  possessivesDeck,
  languagesDeck,
} from '../content/decks';

describe('Deck Content', () => {
  describe('sentencesDeck', () => {
    it('should be included in allDecks', () => {
      expect(allDecks).toContain(sentencesDeck);
    });

    it('should have correct id and name', () => {
      expect(sentencesDeck.id).toBe('german-sentences');
      expect(sentencesDeck.name).toBe('German Sentences');
    });

    it('should have 50 sentence cards', () => {
      expect(sentencesDeck.cards).toHaveLength(50);
    });

    it('should contain greeting sentences', () => {
      const greetingCards = sentencesDeck.cards.filter(
        (card) => card.de.includes('Hallo') || card.de.includes('Guten Morgen')
      );
      expect(greetingCards.length).toBeGreaterThan(0);
    });

    it("should contain 'where you're from' sentences", () => {
      const locationCards = sentencesDeck.cards.filter(
        (card) => card.de.includes('Ich komme aus') || card.de.includes('Ich wohne in')
      );
      expect(locationCards.length).toBeGreaterThan(0);
    });

    it('should contain language-related sentences', () => {
      const languageCards = sentencesDeck.cards.filter(
        (card) => card.de.includes('spreche') || card.de.includes('Sprachen')
      );
      expect(languageCards.length).toBeGreaterThan(0);
    });

    it('should contain well-being related sentences', () => {
      const wellBeingCards = sentencesDeck.cards.filter(
        (card) => card.de.includes('Wie geht') || card.de.includes('Es geht mir')
      );
      expect(wellBeingCards.length).toBeGreaterThan(0);
    });

    it('should have all cards with phrase partOfSpeech', () => {
      const allPhrase = sentencesDeck.cards.every((card) => card.partOfSpeech === 'phrase');
      expect(allPhrase).toBe(true);
    });

    it('should have unique card IDs', () => {
      const ids = sentencesDeck.cards.map((card) => card.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(sentencesDeck.cards.length);
    });
  });

  describe('nationalitiesDeck', () => {
    it('should be included in allDecks', () => {
      expect(allDecks).toContain(nationalitiesDeck);
    });

    it('should have correct id and name', () => {
      expect(nationalitiesDeck.id).toBe('nationalities');
      expect(nationalitiesDeck.name).toBe('Nationalities');
    });

    it('should have 15 nationality cards', () => {
      expect(nationalitiesDeck.cards).toHaveLength(15);
    });

    it('should contain masculine/feminine pairs', () => {
      const hasPairs = nationalitiesDeck.cards.some((card) => card.de.includes('/'));
      expect(hasPairs).toBe(true);
    });
  });

  describe('familyDeck', () => {
    it('should be included in allDecks', () => {
      expect(allDecks).toContain(familyDeck);
    });

    it('should have correct id and name', () => {
      expect(familyDeck.id).toBe('family');
      expect(familyDeck.name).toBe('Family Members');
    });

    it('should have 20 family cards', () => {
      expect(familyDeck.cards).toHaveLength(20);
    });

    it('should contain basic family members', () => {
      const hasMutter = familyDeck.cards.some((card) => card.de === 'Mutter');
      const hasVater = familyDeck.cards.some((card) => card.de === 'Vater');
      const hasBruder = familyDeck.cards.some((card) => card.de === 'Bruder');
      expect(hasMutter && hasVater && hasBruder).toBe(true);
    });

    it('should have articles for all nouns', () => {
      const allHaveArticles = familyDeck.cards.every((card) => card.article);
      expect(allHaveArticles).toBe(true);
    });
  });

  describe('possessivesDeck', () => {
    it('should be included in allDecks', () => {
      expect(allDecks).toContain(possessivesDeck);
    });

    it('should have correct id and name', () => {
      expect(possessivesDeck.id).toBe('possessives');
      expect(possessivesDeck.name).toBe('Possessives');
    });

    it('should have 15 possessive cards', () => {
      expect(possessivesDeck.cards).toHaveLength(15);
    });

    it('should contain mein/dein/sein/ihr examples', () => {
      const hasMein = possessivesDeck.cards.some((card) => card.de.includes('mein'));
      const hasDein = possessivesDeck.cards.some((card) => card.de.includes('dein'));
      const hasSein = possessivesDeck.cards.some((card) => card.de.includes('sein'));
      const hasIhr = possessivesDeck.cards.some((card) => card.de.includes('ihr'));
      expect(hasMein && hasDein && hasSein && hasIhr).toBe(true);
    });
  });

  describe('languagesDeck', () => {
    it('should be included in allDecks', () => {
      expect(allDecks).toContain(languagesDeck);
    });

    it('should have correct id and name', () => {
      expect(languagesDeck.id).toBe('languages');
      expect(languagesDeck.name).toBe('Languages');
    });

    it('should have 15 language cards', () => {
      expect(languagesDeck.cards).toHaveLength(15);
    });

    it('should contain common languages', () => {
      const hasDeutsch = languagesDeck.cards.some((card) => card.de === 'Deutsch');
      const hasEnglisch = languagesDeck.cards.some((card) => card.de === 'Englisch');
      expect(hasDeutsch && hasEnglisch).toBe(true);
    });
  });

  describe('allDecks', () => {
    it('should have 11 decks total', () => {
      expect(allDecks).toHaveLength(11);
    });

    it('should have all decks with unique IDs', () => {
      const ids = allDecks.map((deck) => deck.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(allDecks.length);
    });

    it('should contain all expected decks', () => {
      const deckIds = allDecks.map((deck) => deck.id);
      expect(deckIds).toContain('greetings');
      expect(deckIds).toContain('numbers');
      expect(deckIds).toContain('days');
      expect(deckIds).toContain('common-verbs');
      expect(deckIds).toContain('a1-basics');
      expect(deckIds).toContain('travel-phrasebook');
      expect(deckIds).toContain('german-sentences');
      expect(deckIds).toContain('nationalities');
      expect(deckIds).toContain('family');
      expect(deckIds).toContain('possessives');
      expect(deckIds).toContain('languages');
    });
  });
});
