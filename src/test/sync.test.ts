import { describe, it, expect } from 'vitest';
import { mergeState } from '../lib/sync';
import type { SyncableState } from '../store/app';

const base = (): SyncableState => ({
  onboarded: false,
  settings: { name: '', theme: 'dark', dailyGoal: 20, ttsEnabled: true, reminderEnabled: false, reminderTime: '19:00' },
  progress: { xp: 0, streak: 0, wordsLearned: 0, totalReviews: 0, lastReviewDate: '' },
  srsRecords: {},
  mistakes: {},
  daily: { date: '', dayStart: 0, cursor: 0 },
});

const srs = (cardId: string, box: number, lastReviewed: string) => ({
  cardId,
  box: box as 1 | 2 | 3 | 4 | 5,
  lastReviewed,
  nextDue: lastReviewed,
  successStreak: box,
});

describe('mergeState', () => {
  it('unions SRS records from both sides (loses nothing)', () => {
    const local = base();
    local.srsRecords = { 'v-A1-1': srs('v-A1-1', 2, '2026-01-01') };
    const remote = base();
    remote.srsRecords = { 'v-A1-2': srs('v-A1-2', 3, '2026-01-02') };

    const merged = mergeState(local, remote);
    expect(Object.keys(merged.srsRecords).sort()).toEqual(['v-A1-1', 'v-A1-2']);
  });

  it('keeps the more-advanced SRS record on conflict (higher box wins)', () => {
    const local = base();
    local.srsRecords = { c: srs('c', 4, '2026-01-01') };
    const remote = base();
    remote.srsRecords = { c: srs('c', 2, '2026-06-01') };

    expect(mergeState(local, remote).srsRecords.c.box).toBe(4);
  });

  it('takes the higher of each progress counter', () => {
    const local = base();
    local.progress = { xp: 500, streak: 3, wordsLearned: 40, totalReviews: 100, lastReviewDate: '2026-02-01' };
    const remote = base();
    remote.progress = { xp: 300, streak: 7, wordsLearned: 60, totalReviews: 80, lastReviewDate: '2026-03-01' };

    const p = mergeState(local, remote).progress;
    expect(p).toMatchObject({ xp: 500, streak: 7, wordsLearned: 60, totalReviews: 100 });
    expect(p.lastReviewDate).toBe('2026-03-01');
  });

  it('keeps the newer mistake entry per id and adopts a cloud name when local is empty', () => {
    const local = base();
    local.mistakes = { m: { id: 'm', de: 'alt', en: 'old', ts: 100 } };
    const remote = base();
    remote.mistakes = { m: { id: 'm', de: 'neu', en: 'new', ts: 200 } };
    remote.settings = { ...remote.settings, name: 'Namit' };

    const merged = mergeState(local, remote);
    expect(merged.mistakes.m.de).toBe('neu');
    expect(merged.settings.name).toBe('Namit');
  });
});
