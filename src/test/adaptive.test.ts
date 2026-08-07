import { describe, it, expect } from 'vitest';
import type { Card, CEFRLevel, SrsRecord } from '../types';
import type { Mistake } from '../store/app';
import { selectAdaptive, computeFluency } from '../lib/adaptive';

const card = (id: string): Card => ({ id, de: id, en: id, level: 'A1' });
const rec = (cardId: string, box: number, dueOffsetMs: number): SrsRecord => ({
  cardId,
  box: box as SrsRecord['box'],
  lastReviewed: new Date().toISOString(),
  nextDue: new Date(Date.now() + dueOffsetMs).toISOString(),
  successStreak: 0,
});
const miss = (id: string, ts: number): Mistake => ({ id, de: id, en: id, ts });

describe('selectAdaptive', () => {
  const ordered = ['v-A1-1', 'v-A1-2', 'v-A1-3', 'v-A1-4', 'v-A1-5'].map(card);
  const byId = new Map(ordered.map((c) => [c.id, c]));

  it('orders due → weak → new and reports counts', () => {
    const srs: Record<string, SrsRecord> = {
      'v-A1-1': rec('v-A1-1', 2, -1000), // due
      'v-A1-2': rec('v-A1-2', 3, 86_400_000), // studied, not due
    };
    const mistakes: Record<string, Mistake> = { 'vocab-v-A1-3': miss('vocab-v-A1-3', 1) };

    const { cards, counts } = selectAdaptive(byId, ordered, srs, mistakes, 4);
    expect(cards.map((c) => c.id)).toEqual(['v-A1-1', 'v-A1-3', 'v-A1-4', 'v-A1-5']);
    expect(counts).toEqual({ due: 1, weak: 1, fresh: 2 });
  });

  it('respects the goal cap and dedupes', () => {
    const srs: Record<string, SrsRecord> = { 'v-A1-1': rec('v-A1-1', 1, -1000) };
    // weak points at the same card that is already due -> must not double count
    const mistakes: Record<string, Mistake> = { 'vocab-v-A1-1': miss('vocab-v-A1-1', 1) };
    const { cards, counts } = selectAdaptive(byId, ordered, srs, mistakes, 2);
    expect(cards).toHaveLength(2);
    expect(new Set(cards.map((c) => c.id)).size).toBe(2);
    expect(counts.due).toBe(1);
    expect(counts.weak).toBe(0);
  });
});

describe('computeFluency', () => {
  const totals: Record<CEFRLevel, number> = { A1: 10, A2: 10, B1: 10, B2: 10, C1: 10 };

  it('counts mastery and groups weak areas', () => {
    const srs: Record<string, SrsRecord> = {
      'v-A1-1': rec('v-A1-1', 5, 86_400_000),
      'v-A1-2': rec('v-A1-2', 5, 86_400_000),
      'v-A1-3': rec('v-A1-3', 2, 86_400_000),
    };
    const mistakes: Record<string, Mistake> = {
      'grammar-1': miss('grammar-1', 1),
      'grammar-2': miss('grammar-2', 2),
      'vocab-v-A1-3': miss('vocab-v-A1-3', 3),
    };
    const f = computeFluency(srs, mistakes, totals);
    expect(f.masteredTotal).toBe(2);
    expect(f.studiedTotal).toBe(3);
    expect(f.estimatedLevel).toBe('—'); // below A1 milestone
    expect(f.weakAreas[0]).toEqual({ source: 'Grammar', count: 2, route: '/quiz/grammar' });
    expect(f.focus.label).toBe('Grammar is your weak spot');
  });

  it('maps mastered-word milestones to a level + conversational %', () => {
    const srs: Record<string, SrsRecord> = {};
    for (let i = 0; i < 300; i++) srs[`v-A1-${i}`] = rec(`v-A1-${i}`, 5, 86_400_000);
    const f = computeFluency(srs, {}, totals);
    expect(f.masteredTotal).toBe(300);
    expect(f.estimatedLevel).toBe('A1');
    expect(f.nextLevel).toBe('A2');
    expect(f.conversationalPct).toBe(20); // 300 / 1500
  });
});
