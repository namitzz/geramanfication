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
};

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
    }
  )
);
