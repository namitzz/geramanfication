/**
 * Der/Die/Das Reflex content: noun pools with articles, plus ending-based
 * gender rules used as teaching hints after a wrong answer.
 */

import type { Article, CEFRLevel } from '../types';
import { isUsableTranslation } from './vocabulary';

interface RawVocab {
  german: string;
  english: string;
  gender: string;
  pos: string;
  frequency_rank: number;
  level: CEFRLevel;
}

export interface GenderNoun {
  de: string;
  en: string;
  article: Article;
  level: CEFRLevel;
  freq: number;
}

let nounsPromise: Promise<GenderNoun[]> | null = null;

/** All nouns with a known article, deduped, frequency-ordered. */
export function loadGenderNouns(): Promise<GenderNoun[]> {
  if (!nounsPromise) {
    nounsPromise = import('./generated/vocab.json').then((mod) => {
      const rows = mod.default as RawVocab[];
      const seen = new Set<string>();
      const nouns: GenderNoun[] = [];
      for (const r of rows) {
        if (r.pos !== 'noun') continue;
        if (r.gender !== 'der' && r.gender !== 'die' && r.gender !== 'das') continue;
        if (!isUsableTranslation(r.english)) continue;
        const key = r.german.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        nouns.push({
          de: r.german,
          en: r.english,
          article: r.gender,
          level: r.level,
          freq: r.frequency_rank,
        });
      }
      return nouns.sort((a, b) => a.freq - b.freq);
    });
  }
  return nounsPromise;
}

/** Ending/prefix patterns that reliably signal a gender. Checked in order. */
const GENDER_RULES: { article: Article; pattern: RegExp; label: string }[] = [
  { article: 'das', pattern: /(chen|lein)$/i, label: '-chen / -lein → das' },
  { article: 'die', pattern: /(ung|heit|keit|schaft|ion|tät|enz|ei|ie|ik|ur)$/i, label: '-ung, -heit, -keit, -schaft, -ion, -tät… → die' },
  { article: 'der', pattern: /(ling|ismus|ant|ist|or|ich|ig)$/i, label: '-ling, -ismus, -ant, -ist, -or… → der' },
  { article: 'das', pattern: /(um|ment|ma)$/i, label: '-um, -ment, -ma → das' },
  { article: 'das', pattern: /^ge/i, label: 'Ge- words are often das' },
  { article: 'die', pattern: /e$/i, label: 'words ending in -e are usually die' },
  { article: 'der', pattern: /er$/i, label: 'words ending in -er are often der' },
];

/** A rule hint explaining a noun's gender, when one applies. */
export function genderHint(noun: string, article: Article): string | null {
  for (const rule of GENDER_RULES) {
    if (rule.article === article && rule.pattern.test(noun)) {
      return rule.label;
    }
  }
  return null;
}
