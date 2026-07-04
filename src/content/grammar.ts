/**
 * Interactive grammar content, derived from the API-imported dataset
 * (src/content/generated/grammar.json). The raw JSON is dynamically imported so
 * it ships as a separate chunk.
 *
 * Instead of presenting rules as paragraphs to read, we turn each rule into
 * practice questions (match a rule to its meaning, or pick the example that
 * demonstrates it).
 */

import type { CEFRLevel } from '../types';

export interface GrammarRule {
  id: string;
  category_code: string;
  category_name: string;
  subcategory: string;
  rule_german: string;
  rule_english: string;
  example_de: string;
  example_en: string;
  notes: string;
  related_ids: string[];
  cefr_levels: CEFRLevel[];
  tags: string[];
  source: string;
  license_tag: string;
}

export type GrammarQuestionKind = 'meaning' | 'example';

export interface GrammarQuestion {
  id: string;
  kind: GrammarQuestionKind;
  /** Main prompt shown large. */
  prompt: string;
  /** Optional secondary line under the prompt. */
  promptSub?: string;
  options: string[];
  correctIndex: number;
  /** Shown after answering, to reinforce the rule. */
  explanation: string;
  category: string;
  level: CEFRLevel;
}

let rulesPromise: Promise<GrammarRule[]> | null = null;

export function loadGrammarRules(): Promise<GrammarRule[]> {
  if (!rulesPromise) {
    rulesPromise = import('./generated/grammar.json').then(
      (mod) => mod.default as GrammarRule[]
    );
  }
  return rulesPromise;
}

/** Distinct category names, sorted, for the topic picker. */
export async function getGrammarCategories(): Promise<string[]> {
  const rules = await loadGrammarRules();
  return Array.from(new Set(rules.map((r) => r.category_name))).sort();
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick `n` distinct distractor strings, preferring `preferred` (same-category
 * rules, so options feel related) and padding from `fallback`.
 */
function pickDistractors(
  preferred: string[],
  fallback: string[],
  exclude: string,
  n: number
): string[] {
  const seen = new Set<string>([exclude]);
  const out: string[] = [];
  for (const s of [...shuffle(preferred), ...shuffle(fallback)]) {
    if (out.length >= n) break;
    if (s && !seen.has(s)) {
      seen.add(s);
      out.push(s);
    }
  }
  return out;
}

/**
 * Build a gamified set of grammar questions.
 *
 * @param category  category name, or 'all'
 * @param level     CEFR level, or 'all'
 * @param count     desired number of questions
 */
export async function buildGrammarQuestions(
  category: string,
  level: CEFRLevel | 'all',
  count: number
): Promise<GrammarQuestion[]> {
  const rules = await loadGrammarRules();

  const pool = rules.filter((r) => {
    const catOk = category === 'all' || r.category_name === category;
    const lvlOk = level === 'all' || r.cefr_levels.includes(level);
    return catOk && r.rule_english && r.example_de && lvlOk;
  });

  const allMeanings = rules.map((r) => r.rule_english).filter(Boolean);
  const allExamples = rules.map((r) => r.example_de).filter(Boolean);

  const chosen = shuffle(pool).slice(0, count);

  return chosen.map((rule, i) => {
    const ruleLevel = rule.cefr_levels[0] ?? 'A1';
    // Same-topic rules make plausible wrong answers; random ones feel absurd.
    const sameCategory = rules.filter(
      (r) => r.category_name === rule.category_name && r.id !== rule.id
    );
    // Alternate question kinds for variety.
    const kind: GrammarQuestionKind = i % 2 === 0 ? 'meaning' : 'example';

    if (kind === 'meaning') {
      const correct = rule.rule_english;
      const distractors = pickDistractors(
        sameCategory.map((r) => r.rule_english),
        allMeanings,
        correct,
        3
      );
      const options = shuffle([correct, ...distractors]);
      return {
        id: `${rule.id}-meaning`,
        kind,
        prompt: rule.rule_german,
        promptSub: 'What does this rule mean?',
        options,
        correctIndex: options.indexOf(correct),
        explanation: `${rule.example_de} — ${rule.example_en}${
          rule.notes ? `  (${rule.notes})` : ''
        }`,
        category: rule.category_name,
        level: ruleLevel,
      };
    }

    const correct = rule.example_de;
    const distractors = pickDistractors(
      sameCategory.map((r) => r.example_de),
      allExamples,
      correct,
      3
    );
    const options = shuffle([correct, ...distractors]);
    return {
      id: `${rule.id}-example`,
      kind,
      prompt: rule.rule_english,
      promptSub: 'Which sentence demonstrates this rule?',
      options,
      correctIndex: options.indexOf(correct),
      explanation: `${rule.example_de} — ${rule.example_en}${
        rule.notes ? `  (${rule.notes})` : ''
      }`,
      category: rule.category_name,
      level: ruleLevel,
    };
  });
}
