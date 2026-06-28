export type PartOfSpeech =
  | "noun"
  | "verb"
  | "phrase"
  | "adj"
  | "adv"
  | "name"
  | "numeral"
  | "interjection"
  | "pronoun"
  | "conjunction"
  | "preposition"
  | "determiner"
  | "particle";
export type Article = "der" | "die" | "das";
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1";
export type LeitnerBox = 1 | 2 | 3 | 4 | 5;

export interface Card {
  id: string;
  de: string;
  en: string;
  partOfSpeech?: PartOfSpeech;
  article?: Article;
  note?: string;
  audio?: string;
  /** CEFR level for API-imported cards. */
  level?: CEFRLevel;
  /** Frequency rank within the level (1 = most common). */
  frequencyRank?: number;
  /** Example sentence in German, when available. */
  exampleDe?: string;
  /** English translation of the example sentence, when available. */
  exampleEn?: string;
}

export interface SrsRecord {
  cardId: string;
  box: LeitnerBox;
  lastReviewed: string;
  nextDue: string;
  successStreak: number;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: Card[];
}

export interface UserSettings {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  ttsEnabled: boolean;
  dailyGoal: number;
  dyslexicFont: boolean;
}

export interface ProgressStats {
  streak: number;
  wordsLearned: number;
  totalReviews: number;
  lastReviewDate: string;
}
