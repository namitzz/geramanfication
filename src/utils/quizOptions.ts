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
 * Build a multiple-choice option set: the correct English answer plus up to
 * three plausible distractors, then shuffled.
 *
 * Quality rules that keep the options sensible:
 *  - Distractors prefer the same part of speech AND CEFR level, falling back
 *    through wider pools so a noun is tested against nouns, not "seven".
 *  - A distractor is rejected if it shares a meaning with the correct answer
 *    or with a distractor already chosen — so two entries glossed "car" (or
 *    one glossed "car" and another "car, automobile") never appear together,
 *    which is the common ambiguity in a frequency corpus.
 *
 * Returns as many options as the pool can supply (ideally 4).
 */
export function buildChoiceOptions(
  card: Card,
  primaryPool: Card[],
  fallbackPool: Card[] = [],
): string[] {
  const correct = card.en;
  const correctParts = new Set(glossParts(correct));
  const chosenParts = new Set(correctParts);

  const conflicts = (en: string): boolean => {
    if (en === correct) return true;
    const parts = glossParts(en);
    return parts.length === 0 || parts.some((p) => chosenParts.has(p));
  };

  // Ranked tiers: most-related first, widening to guarantee enough options.
  const samePosLevel = primaryPool.filter(
    (c) => c.partOfSpeech === card.partOfSpeech && c.level === card.level,
  );
  const samePos = primaryPool.filter((c) => c.partOfSpeech === card.partOfSpeech);
  const sameLevel = primaryPool.filter((c) => c.level === card.level);
  const tiers = [samePosLevel, samePos, sameLevel, primaryPool, fallbackPool];

  const distractors: string[] = [];
  for (const tier of tiers) {
    for (const c of shuffle(tier)) {
      if (distractors.length >= 3) break;
      if (conflicts(c.en)) continue;
      distractors.push(c.en);
      glossParts(c.en).forEach((p) => chosenParts.add(p));
    }
    if (distractors.length >= 3) break;
  }

  return shuffle([correct, ...distractors]);
}
