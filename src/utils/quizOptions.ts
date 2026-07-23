import type { Card } from '../types';

/** Fisher–Yates shuffle (unbiased, unlike Array.sort with a random comparator). */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Break an English gloss into its component meanings for overlap checks:
 * "to go, to walk" -> ["go", "walk"], "the house" -> ["house"]. Leading
 * "to"/articles are dropped so "to run" and "run" count as the same meaning.
 */
function glossParts(en: string): string[] {
  return en
    .toLowerCase()
    .split(/[,;/]|\bor\b/)
    .map((s) => s.replace(/\([^)]*\)/g, '').replace(/^\s*(to|the|a|an)\s+/, '').trim())
    .filter(Boolean);
}

/**
 * Pick up to `count` distractor glosses from ranked candidate tiers (most
 * related first). A candidate is skipped if it shares a meaning with the
 * correct answer or with a distractor already chosen — so two entries glossed
 * "car" (or one "car" and another "car, automobile") never appear together.
 */
function pickDistractors(correct: string, tiers: string[][], count: number): string[] {
  const chosenParts = new Set(glossParts(correct));
  const conflicts = (en: string): boolean => {
    if (en === correct) return true;
    const parts = glossParts(en);
    return parts.length === 0 || parts.some((p) => chosenParts.has(p));
  };

  const distractors: string[] = [];
  for (const tier of tiers) {
    for (const en of shuffle(tier)) {
      if (distractors.length >= count) break;
      if (conflicts(en)) continue;
      distractors.push(en);
      glossParts(en).forEach((p) => chosenParts.add(p));
    }
    if (distractors.length >= count) break;
  }
  return distractors;
}

/**
 * Assemble a shuffled multiple-choice set from the correct gloss plus meaning-
 * aware distractors drawn from ranked candidate pools (most related first).
 * Widening tiers guarantee enough options even when the closest pool is small.
 */
export function buildOptions(
  correct: string,
  rankedPools: string[][],
  count = 3,
): string[] {
  return shuffle([correct, ...pickDistractors(correct, rankedPools, count)]);
}

/**
 * Card variant: distractors prefer the same part of speech AND CEFR level,
 * widening to same-POS, same-level, then anything, so a noun is tested against
 * nouns of the same level rather than "seven".
 */
export function buildChoiceOptions(
  card: Card,
  primaryPool: Card[],
  fallbackPool: Card[] = [],
): string[] {
  const en = (cards: Card[]) => cards.map((c) => c.en);
  const rankedPools = [
    en(primaryPool.filter((c) => c.partOfSpeech === card.partOfSpeech && c.level === card.level)),
    en(primaryPool.filter((c) => c.partOfSpeech === card.partOfSpeech)),
    en(primaryPool.filter((c) => c.level === card.level)),
    en(primaryPool),
    en(fallbackPool),
  ];
  return buildOptions(card.en, rankedPools);
}
