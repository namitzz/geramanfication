import type { CEFRLevel } from '../../types';
import { buildGrammarQuestions } from '../../content/grammar';
import { buildClozeSet } from '../../content/sentences';
import { loadVocabularyDecks } from '../../content/vocabulary';
import { buildChoiceOptions, buildOptions } from '../../utils/quizOptions';
import mcqData from '../../content/mcq-hard.json';
import lessonsData from '../../content/classes/lessons.json';
import { formatTopic, type Lesson } from '../../content/classes/types';
import type { QuizItem, QuizMode } from './types';

interface HardMCQ {
  id: string;
  question: string;
  options: string[];
  correct: number;
  category: string;
}

const shuffle = <T>(a: T[]): T[] => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

/** Build a set of choice-quiz items for any mode from the shared content builders. */
export async function buildQuiz(
  mode: QuizMode,
  level: CEFRLevel | 'all',
  count: number,
): Promise<QuizItem[]> {
  if (mode === 'grammar') {
    const qs = await buildGrammarQuestions('all', level, count);
    return qs.map((q) => ({
      prompt: q.prompt,
      promptSub: `${q.category} · ${q.level}`,
      promptDe: q.kind !== 'meaning',
      options: q.options,
      correctIndex: q.correctIndex,
      optionsDe: true,
      explanation: q.explanation,
      miss: { id: `grammar-${q.id}`, de: q.prompt, en: q.options[q.correctIndex] },
    }));
  }

  if (mode === 'cloze') {
    const items = await buildClozeSet(level, count);
    return items.map((it) => {
      const gapped = it.tokens.map((t, i) => (i === it.blankIndex ? '____' : t)).join(' ');
      const full = it.tokens.join(' ');
      return {
        prompt: gapped,
        promptDe: true,
        promptSub: 'fill the gap',
        speakReveal: full,
        options: it.options,
        correctIndex: it.options.indexOf(it.answer),
        optionsDe: true,
        explanation: it.en,
        miss: { id: `cloze-${it.id}`, de: full, en: it.en },
      };
    });
  }

  if (mode === 'hard') {
    return shuffle(mcqData as HardMCQ[])
      .slice(0, count)
      .map((q) => ({
        prompt: q.question,
        promptSub: q.category,
        options: q.options,
        correctIndex: q.correct,
        optionsDe: true,
        miss: { id: `grammar-${q.id}`, de: q.question, en: q.options[q.correct] },
      }));
  }

  if (mode === 'classes') {
    const lessons = lessonsData as Lesson[];
    const allEn = lessons.map((l) => l.en);
    return shuffle(lessons)
      .slice(0, count)
      .map((l) => {
        const options = buildOptions(l.en, [allEn]);
        return {
          prompt: l.de,
          promptDe: true,
          promptSub: formatTopic(l.topic),
          speak: l.de,
          options,
          correctIndex: options.indexOf(l.en),
          optionsDe: false,
          miss: { id: `classes-${l.id}`, de: l.de, en: l.en },
        };
      });
  }

  // vocab multiple choice
  const decks = await loadVocabularyDecks();
  let cards = decks.flatMap((d) => d.cards);
  if (level !== 'all') cards = cards.filter((c) => (c.level ?? 'A1') === level);
  const pool = cards;
  return shuffle(cards)
    .slice(0, count)
    .map((card) => {
      const options = buildChoiceOptions(card, pool);
      return {
        prompt: card.article ? `${card.article} ${card.de}` : card.de,
        promptDe: true,
        promptSub: 'what does this mean?',
        speak: card.de,
        options,
        correctIndex: options.indexOf(card.en),
        optionsDe: false,
        miss: { id: `vocab-${card.id}`, de: card.de, en: card.en },
      };
    });
}
