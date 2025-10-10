import type { SrsRecord, LeitnerBox } from '../types';

// Calculate next review date based on Leitner box
export const calculateNextReviewDate = (box: LeitnerBox): string => {
  const now = new Date();
  let daysToAdd = 0;

  switch (box) {
    case 1:
      daysToAdd = 1; // Review tomorrow
      break;
    case 2:
      daysToAdd = 3; // Review in 3 days
      break;
    case 3:
      daysToAdd = 7; // Review in 1 week
      break;
    case 4:
      daysToAdd = 14; // Review in 2 weeks
      break;
    case 5:
      daysToAdd = 30; // Review in 1 month
      break;
  }

  now.setDate(now.getDate() + daysToAdd);
  return now.toISOString();
};

// Initialize a new SRS record for a card
export const initializeSrsRecord = (cardId: string): SrsRecord => {
  return {
    cardId,
    box: 1,
    lastReviewed: new Date().toISOString(),
    nextDue: calculateNextReviewDate(1),
    successStreak: 0,
  };
};

// Update SRS record based on user response
export const updateSrsRecordOnReview = (
  record: SrsRecord,
  correct: boolean
): SrsRecord => {
  const now = new Date().toISOString();

  if (correct) {
    // Move to next box (max 5)
    const newBox = Math.min(record.box + 1, 5) as LeitnerBox;
    return {
      ...record,
      box: newBox,
      lastReviewed: now,
      nextDue: calculateNextReviewDate(newBox),
      successStreak: record.successStreak + 1,
    };
  } else {
    // Move back to box 1
    return {
      ...record,
      box: 1,
      lastReviewed: now,
      nextDue: calculateNextReviewDate(1),
      successStreak: 0,
    };
  }
};

// Check if a card is due for review
export const isCardDue = (record: SrsRecord | undefined): boolean => {
  if (!record) return true; // New cards are always due
  return new Date(record.nextDue) <= new Date();
};

// Get cards that are due for review
export const getDueCards = (
  cardIds: string[],
  srsRecords: Record<string, SrsRecord>
): string[] => {
  return cardIds.filter((id) => isCardDue(srsRecords[id]));
};
