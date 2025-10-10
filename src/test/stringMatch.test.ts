import { describe, it, expect } from 'vitest';
import { levenshteinDistance, isAnswerCorrect } from '../utils/stringMatch';

describe('stringMatch utilities', () => {
  describe('levenshteinDistance', () => {
    it('should return 0 for identical strings', () => {
      expect(levenshteinDistance('hello', 'hello')).toBe(0);
    });

    it('should calculate correct distance for different strings', () => {
      expect(levenshteinDistance('hello', 'hallo')).toBe(1);
      expect(levenshteinDistance('cat', 'hat')).toBe(1);
      expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
    });
  });

  describe('isAnswerCorrect', () => {
    it('should return true for exact matches', () => {
      expect(isAnswerCorrect('hello', 'hello')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(isAnswerCorrect('Hello', 'hello')).toBe(true);
      expect(isAnswerCorrect('HELLO', 'hello')).toBe(true);
    });

    it('should handle whitespace', () => {
      expect(isAnswerCorrect(' hello ', 'hello')).toBe(true);
    });

    it('should allow small typos', () => {
      expect(isAnswerCorrect('helo', 'hello')).toBe(true);
      expect(isAnswerCorrect('hell', 'hello')).toBe(true);
    });

    it('should reject answers that are too different', () => {
      expect(isAnswerCorrect('goodbye', 'hello')).toBe(false);
    });
  });
});
