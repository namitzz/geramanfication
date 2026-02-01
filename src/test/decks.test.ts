import { describe, it, expect } from 'vitest';
import type { Card } from '../types';
import {
  allDecks,
  sentencesDeck,
  nationalitiesDeck,
  familyDeck,
  possessivesDeck,
  languagesDeck,
  phase2DailyRoutineVocabDeck,
  phase2SeparableInseparableDeck,
  phase2ReflexiveVerbsDeck,
  phase2TimeExpressionsDeck,
  phase2WohinWoDeck,
  phase2HerrIhssenDeck,
  phase2PracticeSentencesDeck,
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
    it('should have 18 decks total (11 Phase 1 + 7 Phase 2)', () => {
      expect(allDecks).toHaveLength(18);
    });

    it('should have all decks with unique IDs', () => {
      const ids = allDecks.map((deck) => deck.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(allDecks.length);
    });

    it('should contain all expected Phase 1 decks', () => {
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

    it('should contain all expected Phase 2 decks', () => {
      const deckIds = allDecks.map((deck) => deck.id);
      expect(deckIds).toContain('phase2-daily-routine-vocab');
      expect(deckIds).toContain('phase2-separable-inseparable');
      expect(deckIds).toContain('phase2-reflexive-verbs');
      expect(deckIds).toContain('phase2-time-expressions');
      expect(deckIds).toContain('phase2-wohin-wo');
      expect(deckIds).toContain('phase2-herr-ihssen');
      expect(deckIds).toContain('phase2-practice-sentences');
    });
  });

  describe('Phase 2 Decks', () => {
    describe('phase2DailyRoutineVocabDeck', () => {
      it('should be included in allDecks', () => {
        expect(allDecks).toContain(phase2DailyRoutineVocabDeck);
      });

      it('should have correct id and name', () => {
        expect(phase2DailyRoutineVocabDeck.id).toBe('phase2-daily-routine-vocab');
        expect(phase2DailyRoutineVocabDeck.name).toBe('Daily Routine Vocabulary');
      });

      it('should have 15 cards', () => {
        expect(phase2DailyRoutineVocabDeck.cards).toHaveLength(15);
      });

      it('should contain time-of-day expressions', () => {
        const hasTimeExpressions = phase2DailyRoutineVocabDeck.cards.some(
          (card: Card) => card.de === 'Morgen' || card.de === 'Abend'
        );
        expect(hasTimeExpressions).toBe(true);
      });
    });

    describe('phase2SeparableInseparableDeck', () => {
      it('should be included in allDecks', () => {
        expect(allDecks).toContain(phase2SeparableInseparableDeck);
      });

      it('should have correct id', () => {
        expect(phase2SeparableInseparableDeck.id).toBe('phase2-separable-inseparable');
      });

      it('should have 15 cards', () => {
        expect(phase2SeparableInseparableDeck.cards).toHaveLength(15);
      });

      it('should contain separable and inseparable verbs', () => {
        const hasSeparable = phase2SeparableInseparableDeck.cards.some(
          (card: Card) => card.de === 'aufstehen' || card.de === 'einkaufen'
        );
        const hasInseparable = phase2SeparableInseparableDeck.cards.some(
          (card: Card) => card.de === 'beginnen' || card.de === 'verstehen'
        );
        expect(hasSeparable && hasInseparable).toBe(true);
      });
    });

    describe('phase2ReflexiveVerbsDeck', () => {
      it('should be included in allDecks', () => {
        expect(allDecks).toContain(phase2ReflexiveVerbsDeck);
      });

      it('should have correct id', () => {
        expect(phase2ReflexiveVerbsDeck.id).toBe('phase2-reflexive-verbs');
      });

      it('should have 15 cards', () => {
        expect(phase2ReflexiveVerbsDeck.cards).toHaveLength(15);
      });

      it('should contain reflexive verbs', () => {
        const hasReflexiveVerbs = phase2ReflexiveVerbsDeck.cards.some(
          (card: Card) => card.de === 'sich waschen' || card.de === 'sich anziehen'
        );
        expect(hasReflexiveVerbs).toBe(true);
      });
    });

    describe('phase2TimeExpressionsDeck', () => {
      it('should be included in allDecks', () => {
        expect(allDecks).toContain(phase2TimeExpressionsDeck);
      });

      it('should have correct id', () => {
        expect(phase2TimeExpressionsDeck.id).toBe('phase2-time-expressions');
      });

      it('should have 15 cards', () => {
        expect(phase2TimeExpressionsDeck.cards).toHaveLength(15);
      });

      it('should contain time expressions', () => {
        const hasTimeExpressions = phase2TimeExpressionsDeck.cards.some(
          (card: Card) => card.de === 'Um wie viel Uhr?' || card.de.includes('halb')
        );
        expect(hasTimeExpressions).toBe(true);
      });
    });

    describe('phase2WohinWoDeck', () => {
      it('should be included in allDecks', () => {
        expect(allDecks).toContain(phase2WohinWoDeck);
      });

      it('should have correct id', () => {
        expect(phase2WohinWoDeck.id).toBe('phase2-wohin-wo');
      });

      it('should have 15 cards', () => {
        expect(phase2WohinWoDeck.cards).toHaveLength(15);
      });

      it('should contain location and direction phrases', () => {
        const hasLocationDirection = phase2WohinWoDeck.cards.some(
          (card: Card) => card.de === 'Wo bist du?' || card.de === 'Wohin gehst du?'
        );
        expect(hasLocationDirection).toBe(true);
      });
    });

    describe('phase2HerrIhssenDeck', () => {
      it('should be included in allDecks', () => {
        expect(allDecks).toContain(phase2HerrIhssenDeck);
      });

      it('should have correct id', () => {
        expect(phase2HerrIhssenDeck.id).toBe('phase2-herr-ihssen');
      });

      it('should have 15 cards', () => {
        expect(phase2HerrIhssenDeck.cards).toHaveLength(15);
      });

      it('should contain reading comprehension vocabulary', () => {
        const hasReadingVocab = phase2HerrIhssenDeck.cards.some(
          (card: Card) => card.de === 'Zeitung' || card.de === 'Journalist'
        );
        expect(hasReadingVocab).toBe(true);
      });
    });

    describe('phase2PracticeSentencesDeck', () => {
      it('should be included in allDecks', () => {
        expect(allDecks).toContain(phase2PracticeSentencesDeck);
      });

      it('should have correct id', () => {
        expect(phase2PracticeSentencesDeck.id).toBe('phase2-practice-sentences');
      });

      it('should have 10 cards', () => {
        expect(phase2PracticeSentencesDeck.cards).toHaveLength(10);
      });

      it('should contain complete sentences', () => {
        const hasCompleteSentences = phase2PracticeSentencesDeck.cards.every(
          (card: Card) => card.de.includes(' ') && card.en.includes(' ')
        );
        expect(hasCompleteSentences).toBe(true);
      });
    });
  });
});
