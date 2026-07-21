import { useEffect, useMemo, useState } from 'react';
import { Volume2, Check, X, ArrowLeft, GraduationCap, RotateCw } from 'lucide-react';
import { isAnswerCorrect } from '../../utils/stringMatch';
import type { Lesson } from '../../content/classes/types';
import { useAppStore } from '../../stores/appStore';

export type ClassQuizMode = 'multiple-choice' | 'type-in';

interface Props {
  pool: Lesson[]; // filtered lessons to draw questions from
  allLessons: Lesson[]; // full set, for plausible distractors
  mode: ClassQuizMode;
  onSpeak: (text: string) => void;
  onExit: () => void;
}

function pickQuestions(pool: Lesson[]): Lesson[] {
  return [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
}

const QuizRunner = ({ pool, allLessons, mode, onSpeak, onExit }: Props) => {
  const [questions, setQuestions] = useState<Lesson[]>(() => pickQuestions(pool));
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<Lesson[]>([]);

  const done = index >= questions.length;
  const current = questions[index];
  const ttsEnabled = useAppStore((s) => s.settings.ttsEnabled);
  const recordMistake = useAppStore((s) => s.recordMistake);
  const recordSession = useAppStore((s) => s.recordSession);

  // Pronounce each new question's German automatically.
  useEffect(() => {
    if (ttsEnabled && current) {
      const id = setTimeout(() => onSpeak(current.de), 300);
      return () => clearTimeout(id);
    }
  }, [index, current, ttsEnabled, onSpeak]);

  const options = useMemo(() => {
    if (mode !== 'multiple-choice' || !current) return [];
    const opts = [current.en];
    const others = allLessons.filter((l) => l.id !== current.id);
    while (opts.length < 4 && others.length) {
      const r = others.splice(Math.floor(Math.random() * others.length), 1)[0];
      if (!opts.includes(r.en)) opts.push(r.en);
    }
    return opts.sort(() => Math.random() - 0.5);
    // Re-roll only when the question changes.
  }, [current, mode, allLessons]);

  const grade = (isRight: boolean) => {
    setCorrect(isRight);
    setRevealed(true);
    if (isRight) setScore((s) => s + 1);
    else {
      setMistakes((m) => [...m, current]);
      recordMistake({
        id: `classes-${current.id}`,
        de: current.de,
        en: current.en,
        source: 'classes',
      });
    }
    // Award XP once, on the final question of the set.
    if (index === questions.length - 1) {
      recordSession(score + (isRight ? 1 : 0), questions.length);
    }
    setTimeout(() => {
      setIndex((i) => i + 1);
      setAnswer('');
      setRevealed(false);
    }, 1400);
  };

  const restart = (newPool: Lesson[]) => {
    setQuestions(pickQuestions(newPool));
    setIndex(0);
    setScore(0);
    setMistakes([]);
    setAnswer('');
    setRevealed(false);
  };

  // ---- Results ----
  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto card p-8 text-center animate-fade-in-up">
        <GraduationCap className="mx-auto text-brand-500 mb-4" size={72} />
        <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
        <p className="text-xl mb-6">
          {score} / {questions.length} ({pct}%)
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {mistakes.length > 0 && (
            <button
              onClick={() => restart(mistakes)}
              className="btn px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Review {mistakes.length} missed
            </button>
          )}
          <button
            onClick={() => restart(pool)}
            className="btn-primary px-6 py-3"
          >
            <RotateCw size={18} /> Retake
          </button>
          <button onClick={onExit} className="btn px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white">
            Done
          </button>
        </div>
      </div>
    );
  }

  // ---- Session ----
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onExit} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
          <ArrowLeft size={20} /> <span>Back</span>
        </button>
        <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
          {score} / {index} · Q{index + 1}/{questions.length}
        </span>
      </div>

      <div key={index} className="card p-8 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <h2 lang="de" className="text-3xl font-bold">{current.de}</h2>
          <button
            onClick={() => onSpeak(current.de)}
            className="p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full"
            aria-label="Pronounce"
          >
            <Volume2 size={20} />
          </button>
        </div>

        {mode === 'multiple-choice' ? (
          <div className="space-y-3">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => grade(opt === current.en)}
                disabled={revealed}
                className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                  revealed && opt === current.en
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : revealed
                    ? 'border-gray-300 dark:border-gray-600 opacity-50'
                    : 'border-gray-300 dark:border-gray-600 hover:border-brand-500'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && !revealed && answer.trim() && grade(isAnswerCorrect(answer.trim(), current.en, 3))
              }
              placeholder="Type the English translation…"
              disabled={revealed}
              autoFocus
              className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:border-brand-500 focus:outline-none"
            />
            <button
              onClick={() => grade(isAnswerCorrect(answer.trim(), current.en, 3))}
              disabled={revealed || !answer.trim()}
              className="btn-primary w-full py-3"
            >
              Submit
            </button>
          </div>
        )}

        {revealed && (
          <div className={`mt-4 p-4 rounded-lg animate-pop ${correct ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <div className="flex items-center gap-2 font-semibold">
              {correct ? (
                <>
                  <Check className="text-green-600 dark:text-green-400" size={22} />
                  <span className="text-green-600 dark:text-green-400">Correct!</span>
                </>
              ) : (
                <>
                  <X className="text-red-600 dark:text-red-400" size={22} />
                  <span className="text-red-600 dark:text-red-400">Answer: {current.en}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizRunner;
