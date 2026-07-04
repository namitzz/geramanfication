import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../stores/appStore';

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
