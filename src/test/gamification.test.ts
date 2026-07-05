import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore, getTodayKey } from '../stores/appStore';
import { getDailyBatch, WORDS_PER_DAY } from '../content/dailyWords';

const reset = () => useAppStore.getState().resetAllData();

describe('gamification (recordSession)', () => {
  beforeEach(reset);

  it('awards 10 XP per correct answer and tallies reviews', () => {
    const earned = useAppStore.getState().recordSession(5, 10);
    expect(earned).toBe(50);
    const { progress } = useAppStore.getState();
    expect(progress.xp).toBe(50);
    expect(progress.totalReviews).toBe(10);
  });

  it('starts the streak at 1 on first session', () => {
    useAppStore.getState().recordSession(3, 5);
    expect(useAppStore.getState().progress.streak).toBe(1);
  });

  it('does not increment the streak twice on the same day', () => {
    useAppStore.getState().recordSession(3, 5);
    useAppStore.getState().recordSession(2, 5);
    const { progress } = useAppStore.getState();
    expect(progress.streak).toBe(1);
    expect(progress.xp).toBe(50); // XP still accumulates
  });
});

describe('smart review (mistakes)', () => {
  beforeEach(reset);

  it('records and clears mistakes', () => {
    useAppStore.getState().recordMistake({
      id: 'vocab-x',
      de: 'das Haus',
      en: 'house',
      source: 'vocab',
    });
    expect(useAppStore.getState().mistakes['vocab-x'].de).toBe('das Haus');
    useAppStore.getState().clearMistake('vocab-x');
    expect(useAppStore.getState().mistakes['vocab-x']).toBeUndefined();
  });

  it('dedupes by id (same mistake twice = one entry)', () => {
    const { recordMistake } = useAppStore.getState();
    recordMistake({ id: 'a', de: 'x', en: 'y', source: 'cloze' });
    recordMistake({ id: 'a', de: 'x', en: 'y', source: 'cloze' });
    expect(Object.keys(useAppStore.getState().mistakes).length).toBe(1);
  });

  it('caps the queue at 100 newest', () => {
    const { recordMistake } = useAppStore.getState();
    for (let i = 0; i < 110; i++) {
      recordMistake({ id: `m-${i}`, de: `de${i}`, en: `en${i}`, source: 'vocab' });
    }
    expect(Object.keys(useAppStore.getState().mistakes).length).toBe(100);
  });
});

describe('daily words program', () => {
  beforeEach(reset);

  it('starts a fresh batch today on rollover', () => {
    useAppStore.getState().rolloverDaily();
    const d = useAppStore.getState().dailyReview;
    expect(d.date).toBe(getTodayKey());
    expect(d.dayStart).toBe(0);
    expect(d.cursor).toBe(0);
  });

  it('advancing the cursor persists mid-day progress', () => {
    useAppStore.getState().rolloverDaily();
    useAppStore.getState().advanceDailyCursor();
    useAppStore.getState().advanceDailyCursor();
    const d = useAppStore.getState().dailyReview;
    expect(d.cursor - d.dayStart).toBe(2);
    // Same-day rollover must not restart the batch.
    useAppStore.getState().rolloverDaily();
    expect(useAppStore.getState().dailyReview.cursor).toBe(2);
  });

  it("a new day's batch starts where the cursor left off", () => {
    // Simulate yesterday's state: 30 words consumed.
    useAppStore.setState({
      dailyReview: { date: 'yesterday', dayStart: 0, cursor: 30 },
    });
    useAppStore.getState().rolloverDaily();
    const d = useAppStore.getState().dailyReview;
    expect(d.date).toBe(getTodayKey());
    expect(d.dayStart).toBe(30); // yesterday's unfinished words are skipped past
    expect(d.cursor).toBe(30);
  });

  it('serves 50 real, ordered words per batch', async () => {
    const first = await getDailyBatch(0);
    const second = await getDailyBatch(WORDS_PER_DAY);
    expect(first.length).toBe(WORDS_PER_DAY);
    expect(second.length).toBe(WORDS_PER_DAY);
    // No overlap between day 1 and day 2.
    const ids = new Set(first.map((c) => c.id));
    for (const c of second) expect(ids.has(c.id)).toBe(false);
    // Day 1 starts with the easiest words (A1).
    expect(first[0].level).toBe('A1');
    for (const c of first) {
      expect(c.de).toBeTruthy();
      expect(c.en).toBeTruthy();
    }
  });
});
