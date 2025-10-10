export type PartOfSpeech = "noun" | "verb" | "phrase" | "adj" | "adv";
export type Article = "der" | "die" | "das";
export type LeitnerBox = 1 | 2 | 3 | 4 | 5;

export interface Card {
  id: string;
  de: string;
  en: string;
  partOfSpeech?: PartOfSpeech;
  article?: Article;
  note?: string;
  audio?: string;
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
