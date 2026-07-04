import { useEffect, useState } from 'react';
import { Dumbbell, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import type { CEFRLevel } from '../types';
import {
  buildGrammarQuestions,
  getGrammarCategories,
  type GrammarQuestion,
} from '../content/grammar';
import { useAppStore } from '../stores/appStore';
import SessionResults from '../components/practice/SessionResults';

const LEVELS: (CEFRLevel | 'all')[] = ['all', 'A1', 'A2', 'B1', 'B2', 'C1'];

type Phase = 'setup' | 'playing' | 'done';

const GrammarPage = () => {
  const [phase, setPhase] = useState<Phase>('setup');
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState<CEFRLevel | 'all'>('all');
  const [count, setCount] = useState(10);

  const [questions, setQuestions] = useState<GrammarQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  const recordSession = useAppStore((s) => s.recordSession);
  const recordMistake = useAppStore((s) => s.recordMistake);

  useEffect(() => {
    getGrammarCategories().then(setCategories);
  }, []);

  const start = async () => {
    const qs = await buildGrammarQuestions(category, level, count);
    setQuestions(qs);
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setPhase('playing');
  };

  const choose = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    const q = questions[index];
    if (i === q.correctIndex) {
      setScore((s) => s + 1);
    } else {
      // Remember the rule as a de/en pair for Smart Review.
      const correct = q.options[q.correctIndex];
      recordMistake({
        id: `grammar-${q.id}`,
        de: q.kind === 'meaning' ? q.prompt : correct,
        en: q.kind === 'meaning' ? correct : q.prompt,
        source: 'grammar',
      });
    }
  };

  const next = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setXpEarned(recordSession(score, questions.length));
      setPhase('done');
    }
  };

  // ----- Setup -----
  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Dumbbell size={30} className="text-purple-500" />
            Grammar Gym
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tap to match rules and examples.
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Topic</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 cursor-pointer focus:border-purple-500 focus:outline-none"
              >
                <option value="all">All topics</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Level</label>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    level === l
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {l === 'all' ? 'All' : l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Questions: {count}
            </label>
            <input
              type="range"
              min={5}
              max={25}
              step={5}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            onClick={start}
            className="w-full py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
          >
            <Dumbbell size={22} />
            Start Workout
          </button>
        </div>
      </div>
    );
  }

  // ----- Results -----
  if (phase === 'done') {
    return (
      <SessionResults
        score={score}
        total={questions.length}
        accent="purple"
        xpEarned={xpEarned}
        onRetry={start}
        onExit={() => setPhase('setup')}
      />
    );
  }

  // ----- Playing -----
  const q = questions[index];
  if (!q) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-gray-400">
        No questions for this selection. Try a different topic or level.
        <div className="mt-4">
          <button
            onClick={() => setPhase('setup')}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          {index + 1} of {questions.length}
        </span>
        <span className="font-semibold text-purple-600 dark:text-purple-400">
          Score: {score}
        </span>
      </div>

      <div className="mb-6 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-purple-500 h-full transition-all duration-300"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div key={index} className="card p-6 animate-fade-in-up">
        <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold mb-3">
          {q.category} · {q.level}
        </span>
        {q.promptSub && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {q.promptSub}
          </p>
        )}
        <h2 className="text-xl font-bold mb-6">{q.prompt}</h2>

        <div className="space-y-3">
          {q.options.map((option, i) => {
            let cls =
              'w-full p-4 text-left rounded-lg border-2 transition-all font-medium';
            if (revealed) {
              if (i === q.correctIndex) {
                cls += ' border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
              } else if (i === selected) {
                cls += ' border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
              } else {
                cls += ' border-gray-300 dark:border-gray-600 opacity-50';
              }
            } else {
              cls += ' border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10';
            }
            return (
              <button key={i} onClick={() => choose(i)} disabled={revealed} className={cls}>
                <div className="flex items-center gap-3">
                  <span className="flex-1">{option}</span>
                  {revealed && i === q.correctIndex && (
                    <CheckCircle className="text-green-500 flex-shrink-0" size={22} />
                  )}
                  {revealed && i === selected && i !== q.correctIndex && (
                    <XCircle className="text-red-500 flex-shrink-0" size={22} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {revealed && (
          <>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-gray-700 dark:text-gray-300 animate-pop">
              💡 {q.explanation}
            </div>
            <button
              onClick={next}
              className="w-full mt-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
            >
              {index < questions.length - 1 ? 'Next' : 'See Results'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GrammarPage;
