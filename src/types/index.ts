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
  /** Tactile right/wrong/finish sounds (separate from German speech audio). */
  sfxEnabled: boolean;
  /** Whether the user has picked a theme in the first-visit chooser. */
  themeChosen: boolean;
}

export type MistakeSource =
  | 'vocab'
  | 'grammar'
  | 'sentence'
  | 'cloze'
  | 'article'
  | 'classes'
  | 'speak';

/** A single wrong answer, remembered so Smart Review can circle back to it. */
export interface Mistake {
  id: string;
  de: string;
  en: string;
  source: MistakeSource;
  ts: number;
}

/**
 * Progress through the daily-words program: a persistent cursor into the
 * frequency-ordered vocabulary (A1 -> C1). Each day serves the next
 * WORDS_PER_DAY unseen words; quitting mid-batch resumes where you left off.
 */
export interface DailyReview {
  /** Day key (local YYYY-M-D) the current batch belongs to. */
  date: string;
  /** Cursor value at the start of today's batch. */
  dayStart: number;
  /** Total words consumed so far (across all days). */
  cursor: number;
}

export interface ProgressStats {
  streak: number;
  wordsLearned: number;
  totalReviews: number;
  lastReviewDate: string;
  /** Cumulative experience points earned across all practice modes. */
  xp: number;
}
