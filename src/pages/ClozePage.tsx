import { useState } from 'react';
import { TextCursorInput, CheckCircle, XCircle } from 'lucide-react';
import type { CEFRLevel } from '../types';
import { buildClozeSet, type ClozeItem } from '../content/sentences';
import { speak } from '../utils/tts';
import { useAppStore } from '../stores/appStore';
import SessionResults from '../components/practice/SessionResults';
import BackButton from '../components/BackButton';
import { sfxAnswer } from '../utils/sfx';

type Phase = 'setup' | 'playing' | 'done';

const LEVELS: (CEFRLevel | 'all')[] = ['all', 'A1', 'A2', 'B1', 'B2', 'C1'];

const ClozePage = () => {
  const [phase, setPhase] = useState<Phase>('setup');
  const [level, setLevel] = useState<CEFRLevel | 'all'>('A1');
  const [count, setCount] = useState(10);

  const [items, setItems] = useState<ClozeItem[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  // Per-question chosen option; enables going back to answered questions.
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [xpEarned, setXpEarned] = useState(0);

  const recordSession = useAppStore((s) => s.recordSession);
  const recordMistake = useAppStore((s) => s.recordMistake);
  const ttsEnabled = useAppStore((s) => s.settings.ttsEnabled);

  const current = items[index];
  const selected = answers[index] ?? null;
  const revealed = selected !== null;

  const start = async () => {
    const set = await buildClozeSet(level, count);
    setItems(set);
    setIndex(0);
    setScore(0);
    setAnswers(new Array(set.length).fill(null));
    setPhase('playing');
  };

  const choose = (option: string) => {
    if (revealed || !current) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = option;
      return next;
    });
    const correct = option === current.answer;
    sfxAnswer(correct);
    if (correct) {
      setScore((s) => s + 1);
    } else {
      recordMistake({
        id: `cloze-${current.id}`,
        de: current.tokens.join(' '),
        en: current.en,
        source: 'cloze',
      });
    }
    // Hear the complete sentence once the gap is filled.
    if (ttsEnabled) speak(current.tokens.join(' ')).catch(() => {});
  };

  const next = () => {
    if (index < items.length - 1) {
      setIndex(index + 1);
    } else {
      setXpEarned(recordSession(score, items.length));
      setPhase('done');
    }
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <BackButton />
        <header>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <TextCursorInput size={30} className="text-brand-600" />
            Cloze
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill the gap in real German sentences.
          </p>
        </header>

        <div className="card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Level</label>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    level === l
                      ? 'bg-brand-600 text-white'
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
              Sentences: {count}
            </label>
            <input
              type="range"
              min={5}
              max={20}
              step={5}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            onClick={start}
            className="btn w-full py-4 bg-brand-600 hover:bg-brand-700 text-white text-lg"
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <SessionResults
        score={score}
        total={items.length}
        accent="brand"
        xpEarned={xpEarned}
        onRetry={start}
        onExit={() => setPhase('setup')}
      />
    );
  }

  if (!current) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-gray-400">
        No sentences for this selection.
        <div className="mt-4">
          <button
            onClick={() => setPhase('setup')}
            className="btn px-6 py-3 bg-brand-600 text-white"
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
        <BackButton onClick={() => setPhase('setup')} />
        <span className="text-gray-600 dark:text-gray-400">
          {index + 1} of {items.length}
        </span>
        <span className="font-semibold text-brand-600 dark:text-brand-400">
          Score: {score}
        </span>
      </div>

      <div className="mb-6 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-brand-600 h-full transition-all duration-300"
          style={{ width: `${((index + 1) / items.length) * 100}%` }}
        />
      </div>

      <div key={index} className="card p-6 space-y-6 screen-in">
        <span className="chip text-xs bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300">
          {current.level}
        </span>

        {/* Sentence with the gap */}
        <p className="text-2xl font-bold text-center leading-relaxed">
          {current.tokens.map((t, i) =>
            i === current.blankIndex ? (
              <span
                key={i}
                className={`inline-block min-w-[80px] border-b-4 mx-1 text-center ${
                  revealed
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-brand-400 text-transparent'
                }`}
              >
                {revealed ? current.answer : '____'}
              </span>
            ) : (
              <span key={i}>{t} </span>
            )
          )}
        </p>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {current.options.map((option, i) => {
            let cls =
              'p-4 rounded-lg border-2 font-medium transition-all duration-150 active:scale-[0.98]';
            if (revealed) {
              if (option === current.answer) {
                cls += ' border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
              } else if (option === selected) {
                cls += ' border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
              } else {
                cls += ' border-gray-300 dark:border-gray-600 opacity-50';
              }
            } else {
              cls += ' border-gray-300 dark:border-gray-600 hover:border-brand-400';
            }
            return (
              <button key={i} onClick={() => choose(option)} disabled={revealed} className={cls}>
                <span className="inline-flex items-center gap-2">
                  {option}
                  {revealed && option === current.answer && (
                    <CheckCircle className="text-green-500" size={18} />
                  )}
                  {revealed && option === selected && option !== current.answer && (
                    <XCircle className="text-red-500" size={18} />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="fx-snap space-y-3">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              🇬🇧 {current.en}
            </p>
            <div className="flex gap-3">
              {index > 0 && (
                <button
                  onClick={prev}
                  className="btn px-5 py-3 bg-gray-200 dark:bg-gray-700"
                >
                  ← Prev
                </button>
              )}
              <button
                onClick={next}
                className="btn flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white"
              >
                {index < items.length - 1 ? 'Next' : 'See Results'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClozePage;
