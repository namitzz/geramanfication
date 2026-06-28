import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SrsRecord, UserSettings, ProgressStats } from '../types';

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
  
  // Reset all data
  resetAllData: () => void;
}

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
      
      // Reset all data
      resetAllData: () =>
        set({
          srsRecords: {},
          settings: defaultSettings,
          progress: defaultProgress,
          reviewQueue: [],
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
