import { describe, it, expect } from 'vitest';
import {
  generateGreetingsFlashcards,
  generateNationalityFlashcards,
  generateFamilyFlashcards,
  generatePossessivesFlashcards,
  generateVerbFlashcards,
  generateNumbersFlashcards,
  generateAllFlashcards,
  generateNegationMCQs,
  generateVerbMCQs,
  generateWordOrderMCQs,
  generatePossessiveMCQs,
  generateAllMCQs,
  generateVerbFillBlanks,
  generatePossessiveFillBlanks,
  generateNegationFillBlanks,
  generateAllFillBlanks,
  generateGreetingsTranslations,
  generateFamilyTranslations,
  generateNegationTranslations,
  generateAllTranslations,
  generateIntroductionDialogue,
  generateFormalDialogue,
  generateFamilyDialogue,
  generateAllDialogues,
  generateVowelLengthTasks,
  generatePronunciationRuleTasks,
  generateUmlautTasks,
  generateAllPronunciationTasks,
} from '../content/contentGenerator';

describe('Content Generator', () => {
  describe('Flashcard Generators', () => {
    it('should generate greetings flashcards', () => {
      const cards = generateGreetingsFlashcards();
      expect(cards.length).toBeGreaterThan(0);
      expect(cards[0]).toHaveProperty('front');
      expect(cards[0]).toHaveProperty('back');
      expect(cards[0]).toHaveProperty('category');
    });

    it('should generate nationality flashcards', () => {
      const cards = generateNationalityFlashcards();
      expect(cards.length).toBeGreaterThan(0);
      // Should have both masculine and feminine forms
      const hasMasculine = cards.some((c) => c.front.includes('masculine'));
      const hasFeminine = cards.some((c) => c.front.includes('feminine'));
      expect(hasMasculine).toBe(true);
      expect(hasFeminine).toBe(true);
    });

    it('should generate family flashcards', () => {
      const cards = generateFamilyFlashcards();
      expect(cards.length).toBeGreaterThan(0);
      // Should include articles in front
      const hasArticle = cards.some(
        (c) => c.front.includes('der') || c.front.includes('die') || c.front.includes('das')
      );
      expect(hasArticle).toBe(true);
    });

    it('should generate possessives flashcards', () => {
      const cards = generatePossessivesFlashcards();
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should generate verb flashcards', () => {
      const cards = generateVerbFlashcards();
      expect(cards.length).toBeGreaterThan(0);
      // Should have haben and sein conjugations
      const hasHaben = cards.some((c) => c.front.includes('haben'));
      const hasSein = cards.some((c) => c.front.includes('sein'));
      expect(hasHaben).toBe(true);
      expect(hasSein).toBe(true);
    });

    it('should generate numbers flashcards', () => {
      const cards = generateNumbersFlashcards();
      expect(cards.length).toBeGreaterThan(0);
      expect(cards.length).toBeGreaterThanOrEqual(20); // At least 0-20
    });

    it('should generate all flashcards combined', () => {
      const cards = generateAllFlashcards();
      expect(cards.length).toBeGreaterThan(50); // Should have many cards
    });
  });

  describe('MCQ Generators', () => {
    it('should generate negation MCQs with correct structure', () => {
      const mcqs = generateNegationMCQs();
      expect(mcqs.length).toBeGreaterThan(0);
      for (const mcq of mcqs) {
        expect(mcq).toHaveProperty('id');
        expect(mcq).toHaveProperty('question');
        expect(mcq).toHaveProperty('options');
        expect(mcq).toHaveProperty('correct');
        expect(mcq).toHaveProperty('explanation');
        expect(mcq).toHaveProperty('category');
        expect(mcq.options).toHaveLength(4);
        expect(mcq.correct).toBeGreaterThanOrEqual(0);
        expect(mcq.correct).toBeLessThan(4);
      }
    });

    it('should generate verb MCQs', () => {
      const mcqs = generateVerbMCQs();
      expect(mcqs.length).toBeGreaterThan(0);
      expect(mcqs[0].category).toContain('Verb');
    });

    it('should generate word order MCQs', () => {
      const mcqs = generateWordOrderMCQs();
      expect(mcqs.length).toBeGreaterThan(0);
      expect(mcqs[0].category).toBe('Word Order');
    });

    it('should generate possessive MCQs', () => {
      const mcqs = generatePossessiveMCQs();
      expect(mcqs.length).toBeGreaterThan(0);
    });

    it('should generate all MCQs combined', () => {
      const mcqs = generateAllMCQs();
      expect(mcqs.length).toBeGreaterThan(10);
    });
  });

  describe('Fill-in-the-Blank Generators', () => {
    it('should generate verb fill-in-the-blanks', () => {
      const blanks = generateVerbFillBlanks();
      expect(blanks.length).toBeGreaterThan(0);
      for (const blank of blanks) {
        expect(blank).toHaveProperty('sentence');
        expect(blank).toHaveProperty('answer');
        expect(blank).toHaveProperty('category');
        expect(blank.sentence).toContain('___');
      }
    });

    it('should generate possessive fill-in-the-blanks', () => {
      const blanks = generatePossessiveFillBlanks();
      expect(blanks.length).toBeGreaterThan(0);
    });

    it('should generate negation fill-in-the-blanks', () => {
      const blanks = generateNegationFillBlanks();
      expect(blanks.length).toBeGreaterThan(0);
    });

    it('should generate all fill-in-the-blanks combined', () => {
      const blanks = generateAllFillBlanks();
      expect(blanks.length).toBeGreaterThan(10);
    });
  });

  describe('Translation Exercise Generators', () => {
    it('should generate greetings translations', () => {
      const translations = generateGreetingsTranslations();
      expect(translations.length).toBeGreaterThan(0);
      for (const t of translations) {
        expect(t).toHaveProperty('source');
        expect(t).toHaveProperty('target');
        expect(t).toHaveProperty('direction');
        expect(t).toHaveProperty('category');
        expect(['EN_TO_DE', 'DE_TO_EN']).toContain(t.direction);
      }
    });

    it('should generate family translations', () => {
      const translations = generateFamilyTranslations();
      expect(translations.length).toBeGreaterThan(0);
    });

    it('should generate negation translations', () => {
      const translations = generateNegationTranslations();
      expect(translations.length).toBeGreaterThan(0);
    });

    it('should generate all translations combined', () => {
      const translations = generateAllTranslations();
      expect(translations.length).toBeGreaterThan(10);
    });
  });

  describe('Dialogue Generators', () => {
    it('should generate introduction dialogue', () => {
      const dialogue = generateIntroductionDialogue();
      expect(dialogue).toHaveProperty('title');
      expect(dialogue).toHaveProperty('context');
      expect(dialogue).toHaveProperty('lines');
      expect(dialogue.lines.length).toBeGreaterThan(5);
      for (const line of dialogue.lines) {
        expect(line).toHaveProperty('speaker');
        expect(line).toHaveProperty('de');
        expect(line).toHaveProperty('en');
      }
    });

    it('should generate formal dialogue', () => {
      const dialogue = generateFormalDialogue();
      expect(dialogue.lines.length).toBeGreaterThan(5);
      // Should use formal forms (Sie)
      const hasSie = dialogue.lines.some((l) => l.de.includes('Sie'));
      expect(hasSie).toBe(true);
    });

    it('should generate family dialogue', () => {
      const dialogue = generateFamilyDialogue();
      expect(dialogue.lines.length).toBeGreaterThan(5);
    });

    it('should generate all dialogues', () => {
      const dialogues = generateAllDialogues();
      expect(dialogues).toHaveLength(3);
    });
  });

  describe('Pronunciation Task Generators', () => {
    it('should generate vowel length tasks', () => {
      const tasks = generateVowelLengthTasks();
      expect(tasks.length).toBeGreaterThan(0);
      for (const task of tasks) {
        expect(task).toHaveProperty('type');
        expect(task).toHaveProperty('question');
        expect(task).toHaveProperty('answer');
        expect(task).toHaveProperty('explanation');
        expect(task.type).toBe('long_short_vowel');
        expect(['long', 'short']).toContain(task.answer);
      }
    });

    it('should generate pronunciation rule tasks', () => {
      const tasks = generatePronunciationRuleTasks();
      expect(tasks.length).toBeGreaterThan(0);
      expect(tasks[0].type).toBe('pronunciation_rule');
    });

    it('should generate umlaut tasks', () => {
      const tasks = generateUmlautTasks();
      expect(tasks.length).toBe(3); // ä, ö, ü
      expect(tasks[0].type).toBe('umlaut');
    });

    it('should generate all pronunciation tasks combined', () => {
      const tasks = generateAllPronunciationTasks();
      expect(tasks.length).toBeGreaterThan(10);
    });
  });
});
