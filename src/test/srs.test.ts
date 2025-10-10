import { describe, it, expect } from 'vitest';
import { calculateNextReviewDate, initializeSrsRecord, updateSrsRecordOnReview } from '../utils/srs';

describe('SRS utilities', () => {
  describe('calculateNextReviewDate', () => {
    it('should calculate next review for box 1 (1 day)', () => {
      const nextDate = new Date(calculateNextReviewDate(1));
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      expect(nextDate.getDate()).toBe(tomorrow.getDate());
    });

    it('should calculate next review for box 5 (30 days)', () => {
      const nextDate = new Date(calculateNextReviewDate(5));
      const inThirtyDays = new Date();
      inThirtyDays.setDate(inThirtyDays.getDate() + 30);
      
      expect(nextDate.getDate()).toBe(inThirtyDays.getDate());
    });
  });

  describe('initializeSrsRecord', () => {
    it('should create a new SRS record with box 1', () => {
      const record = initializeSrsRecord('card1');
      
      expect(record.cardId).toBe('card1');
      expect(record.box).toBe(1);
      expect(record.successStreak).toBe(0);
      expect(record.lastReviewed).toBeDefined();
      expect(record.nextDue).toBeDefined();
    });
  });

  describe('updateSrsRecordOnReview', () => {
    it('should move to next box on correct answer', () => {
      const record = initializeSrsRecord('card1');
      const updated = updateSrsRecordOnReview(record, true);
      
      expect(updated.box).toBe(2);
      expect(updated.successStreak).toBe(1);
    });

    it('should reset to box 1 on incorrect answer', () => {
      const record = initializeSrsRecord('card1');
      record.box = 3;
      record.successStreak = 5;
      
      const updated = updateSrsRecordOnReview(record, false);
      
      expect(updated.box).toBe(1);
      expect(updated.successStreak).toBe(0);
    });

    it('should not go beyond box 5', () => {
      const record = initializeSrsRecord('card1');
      record.box = 5;
      
      const updated = updateSrsRecordOnReview(record, true);
      
      expect(updated.box).toBe(5);
    });
  });
});
