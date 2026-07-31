import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SrsRecord } from '../types';

export type Theme = 'dark' | 'light';

export interface Settings {
  name: string;
  theme: Theme;
  dailyGoal: number;
  ttsEnabled: boolean;
}
export interface Progress {
  xp: number;
  streak: number;
  wordsLearned: number;
  totalReviews: number;
  lastReviewDate: string;
}
export interface DailyReview {
  date: string;
  dayStart: number;
  cursor: number;
}
export interface Mistake {
  id: string;
  de: string;
  en: string;
  ts: number;
}

interface AppState {
  onboarded: boolean;
  completeOnboarding: () => void;

  settings: Settings;
  updateSettings: (s: Partial<Settings>) => void;
  toggleTheme: () => void;

  progress: Progress;
  /** Award XP + advance the daily streak; returns XP earned. */
  recordSession: (correct: number, total: number) => number;

  srsRecords: Record<string, SrsRecord>;
  getSrsRecord: (id: string) => SrsRecord | undefined;
  updateSrsRecord: (r: SrsRecord) => void;

  mistakes: Record<string, Mistake>;
  recordMistake: (m: Omit<Mistake, 'ts'>) => void;
  clearMistake: (id: string) => void;

  daily: DailyReview;
  rolloverDaily: () => void;
  advanceDailyCursor: () => void;
  jumpDailyTo: (cursor: number) => void;

  reset: () => void;
}

const XP_PER_CORRECT = 10;
const MISTAKE_CAP = 120;

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
export const getTodayKey = () => dayKey(new Date());

const defaultSettings: Settings = { name: '', theme: 'dark', dailyGoal: 20, ttsEnabled: true };
const defaultProgress: Progress = {
  xp: 0,
  streak: 0,
  wordsLearned: 0,
  totalReviews: 0,
  lastReviewDate: '',
};
const defaultDaily: DailyReview = { date: '', dayStart: 0, cursor: 0 };

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      onboarded: false,
      completeOnboarding: () => set({ onboarded: true }),

      settings: defaultSettings,
      updateSettings: (s) => set((st) => ({ settings: { ...st.settings, ...s } })),
      toggleTheme: () =>
        set((st) => ({
          settings: { ...st.settings, theme: st.settings.theme === 'dark' ? 'light' : 'dark' },
        })),

      progress: defaultProgress,
      recordSession: (correct, total) => {
        const xpEarned = correct * XP_PER_CORRECT;
        const { progress } = get();
        const today = getTodayKey();
        const yesterday = dayKey(new Date(Date.now() - 86_400_000));
        let streak = progress.streak;
        if (progress.lastReviewDate !== today) {
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

      srsRecords: {},
      getSrsRecord: (id) => get().srsRecords[id],
      updateSrsRecord: (r) =>
        set((st) => ({ srsRecords: { ...st.srsRecords, [r.cardId]: r } })),

      mistakes: {},
      recordMistake: (m) =>
        set((st) => {
          const next = { ...st.mistakes, [m.id]: { ...m, ts: Date.now() } };
          const ids = Object.keys(next);
          if (ids.length > MISTAKE_CAP) {
            ids
              .sort((a, b) => next[a].ts - next[b].ts)
              .slice(0, ids.length - MISTAKE_CAP)
              .forEach((id) => delete next[id]);
          }
          return { mistakes: next };
        }),
      clearMistake: (id) =>
        set((st) => {
          const next = { ...st.mistakes };
          delete next[id];
          return { mistakes: next };
        }),

      daily: defaultDaily,
      rolloverDaily: () =>
        set((st) => {
          const today = getTodayKey();
          if (st.daily.date === today) return {};
          return { daily: { date: today, dayStart: st.daily.cursor, cursor: st.daily.cursor } };
        }),
      advanceDailyCursor: () =>
        set((st) => ({ daily: { ...st.daily, cursor: st.daily.cursor + 1 } })),
      jumpDailyTo: (cursor) => set({ daily: { date: getTodayKey(), dayStart: cursor, cursor } }),

      reset: () =>
        set({
          onboarded: false,
          settings: defaultSettings,
          progress: defaultProgress,
          srsRecords: {},
          mistakes: {},
          daily: defaultDaily,
        }),
    }),
    {
      name: 'deutschsprint-v4',
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<AppState>;
        return {
          ...current,
          ...saved,
          settings: { ...defaultSettings, ...saved.settings },
          progress: { ...defaultProgress, ...saved.progress },
        };
      },
    },
  ),
);
