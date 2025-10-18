import { describe, it, expect } from 'vitest';
import { allDecks, sentencesDeck } from '../content/decks';

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
      const greetingCards = sentencesDeck.cards.filter(card => 
        card.de.includes('Hallo') || card.de.includes('Guten Morgen')
      );
      expect(greetingCards.length).toBeGreaterThan(0);
    });

    it('should contain "where you\'re from" sentences', () => {
      const locationCards = sentencesDeck.cards.filter(card => 
        card.de.includes('Ich komme aus') || card.de.includes('Ich wohne in')
      );
      expect(locationCards.length).toBeGreaterThan(0);
    });

    it('should contain language-related sentences', () => {
      const languageCards = sentencesDeck.cards.filter(card => 
        card.de.includes('spreche') || card.de.includes('Sprachen')
      );
      expect(languageCards.length).toBeGreaterThan(0);
    });

    it('should contain well-being related sentences', () => {
      const wellBeingCards = sentencesDeck.cards.filter(card => 
        card.de.includes('Wie geht') || card.de.includes('Es geht mir')
      );
      expect(wellBeingCards.length).toBeGreaterThan(0);
    });

    it('should have all cards with phrase partOfSpeech', () => {
      const allPhrase = sentencesDeck.cards.every(card => card.partOfSpeech === 'phrase');
      expect(allPhrase).toBe(true);
    });

    it('should have unique card IDs', () => {
      const ids = sentencesDeck.cards.map(card => card.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(sentencesDeck.cards.length);
    });
  });

  describe('allDecks', () => {
    it('should have 7 decks total', () => {
      expect(allDecks).toHaveLength(7);
    });

    it('should have all decks with unique IDs', () => {
      const ids = allDecks.map(deck => deck.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(allDecks.length);
    });
  });
});
