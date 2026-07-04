import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Card, Mistake, SrsRecord, UserSettings, ProgressStats } from '../types';

interface AppState {
  // SRS Records
  srsRecords: Record<string, SrsRecord>;
  updateSrsRecord: (record: SrsRecord) => void;
  getSrsRecord: (cardId: string) => SrsRecord | undefined;
  
  // Settings
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  
  // Progress
  progress: ProgressStats;
  updateProgress: (progress: Partial<ProgressStats>) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  /**
   * Record a finished practice session: awards XP, advances the daily streak,
   * and counts reviews. Returns the XP earned so the UI can show it.
   */
  recordSession: (correct: number, total: number) => number;
  
  // Review queue
  reviewQueue: string[];
  setReviewQueue: (cardIds: string[]) => void;

  // Vocabulary mining: words the user saved from the Analyzer
  minedWords: Record<string, Card>;
  addMinedWord: (card: Card) => void;
  removeMinedWord: (cardId: string) => void;

  // Smart Review: wrong answers remembered across all practice modes
  mistakes: Record<string, Mistake>;
  recordMistake: (mistake: Omit<Mistake, 'ts'>) => void;
  clearMistake: (id: string) => void;

  // Reset all data
  resetAllData: () => void;
}

/** Keep only the newest mistakes so the queue stays reviewable. */
const MISTAKE_CAP = 100;

const defaultSettings: UserSettings = {
  darkMode: false,
  fontSize: 'medium',
  ttsEnabled: true,
  dailyGoal: 20,
  dyslexicFont: false,
};

const defaultProgress: ProgressStats = {
  streak: 0,
  wordsLearned: 0,
  totalReviews: 0,
  lastReviewDate: '',
  xp: 0,
};

const XP_PER_CORRECT = 10;

/** Local YYYY-MM-DD for day comparisons. */
const dayKey = (d: Date): string =>
  `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // SRS Records
      srsRecords: {},
      updateSrsRecord: (record) =>
        set((state) => ({
          srsRecords: {
            ...state.srsRecords,
            [record.cardId]: record,
          },
        })),
      getSrsRecord: (cardId) => get().srsRecords[cardId],
      
      // Settings
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      
      // Progress
      progress: defaultProgress,
      updateProgress: (newProgress) =>
        set((state) => ({
          progress: { ...state.progress, ...newProgress },
        })),
      incrementStreak: () =>
        set((state) => ({
          progress: { ...state.progress, streak: state.progress.streak + 1 },
        })),
      resetStreak: () =>
        set((state) => ({
          progress: { ...state.progress, streak: 0 },
        })),
      recordSession: (correct, total) => {
        const xpEarned = correct * XP_PER_CORRECT;
        const { progress } = get();
        const today = dayKey(new Date());
        const yesterday = dayKey(new Date(Date.now() - 86_400_000));

        let streak = progress.streak;
        if (progress.lastReviewDate !== today) {
          // First session today: extend streak if yesterday, else restart.
          streak = progress.lastReviewDate === yesterday ? streak + 1 : 1;
        }

        set({
          progress: {
            ...progress,
            xp: progress.xp + xpEarned,
            totalReviews: progress.totalReviews + total,
            streak,
            lastReviewDate: today,
          },
        });
        return xpEarned;
      },
      
      // Review queue
      reviewQueue: [],
      setReviewQueue: (cardIds) => set({ reviewQueue: cardIds }),

      // Vocabulary mining
      minedWords: {},
      addMinedWord: (card) =>
        set((state) => ({
          minedWords: { ...state.minedWords, [card.id]: card },
        })),
      removeMinedWord: (cardId) =>
        set((state) => {
          const next = { ...state.minedWords };
          delete next[cardId];
          return { minedWords: next };
        }),

      // Smart Review mistakes
      mistakes: {},
      recordMistake: (mistake) =>
        set((state) => {
          const next = {
            ...state.mistakes,
            [mistake.id]: { ...mistake, ts: Date.now() },
          };
          const ids = Object.keys(next);
          if (ids.length > MISTAKE_CAP) {
            ids
              .sort((a, b) => next[a].ts - next[b].ts) // oldest first
              .slice(0, ids.length - MISTAKE_CAP)
              .forEach((id) => delete next[id]);
          }
          return { mistakes: next };
        }),
      clearMistake: (id) =>
        set((state) => {
          const next = { ...state.mistakes };
          delete next[id];
          return { mistakes: next };
        }),

      // Reset all data
      resetAllData: () =>
        set({
          srsRecords: {},
          settings: defaultSettings,
          progress: defaultProgress,
          reviewQueue: [],
          minedWords: {},
          mistakes: {},
        }),
    }),
    {
      name: 'deutschsprint-storage',
      // Backfill newly-added fields (e.g. xp) for users with older saved state.
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<AppState>;
        return {
          ...current,
          ...saved,
          settings: { ...defaultSettings, ...saved.settings },
          progress: { ...defaultProgress, ...saved.progress },
        };
      },
    }
  )
);
