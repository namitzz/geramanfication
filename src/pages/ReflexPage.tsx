import { useEffect, useRef, useState } from 'react';
import { Timer, Zap, Flame, RotateCw } from 'lucide-react';
import type { Article, CEFRLevel } from '../types';
import { genderHint, loadGenderNouns, type GenderNoun } from '../content/gender';
import { useAppStore } from '../stores/appStore';
import BackButton from '../components/BackButton';
import { sfxAnswer } from '../utils/sfx';

const ROUND_SECONDS = 45;
const ARTICLES: Article[] = ['der', 'die', 'das'];
const LEVELS: (CEFRLevel | 'all')[] = ['all', 'A1', 'A2', 'B1', 'B2', 'C1'];

const ARTICLE_STYLE: Record<Article, string> = {
  der: 'bg-sky-600 hover:bg-sky-700',
  die: 'bg-rose-600 hover:bg-rose-700',
  das: 'bg-emerald-600 hover:bg-emerald-700',
};

type Phase = 'setup' | 'playing' | 'done';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ReflexPage = () => {
  const [phase, setPhase] = useState<Phase>('setup');
  const [level, setLevel] = useState<CEFRLevel | 'all'>('all');
  const [queue, setQueue] = useState<GenderNoun[]>([]);
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; hint: string | null } | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const lockRef = useRef(false);

  const recordSession = useAppStore((s) => s.recordSession);
  const recordMistake = useAppStore((s) => s.recordMistake);

  // Round countdown.
  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) {
      setXpEarned(recordSession(correct, Math.max(total, 1)));
      setPhase('done');
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft, correct, total, recordSession]);

  const start = async () => {
    const nouns = await loadGenderNouns();
    const pool = level === 'all' ? nouns : nouns.filter((n) => n.level === level);
    // Bias toward common words: shuffle the most frequent slice.
    setQueue(shuffle(pool.slice(0, 300)));
    setIndex(0);
    setTimeLeft(ROUND_SECONDS);
    setCorrect(0);
    setTotal(0);
    setCombo(0);
    setBestCombo(0);
    setFeedback(null);
    setXpEarned(0);
    lockRef.current = false;
    setPhase('playing');
  };

  const answer = (a: Article) => {
    if (lockRef.current) return;
    const noun = queue[index];
    const ok = a === noun.article;
    lockRef.current = true;
    sfxAnswer(ok);
    setTotal((t) => t + 1);
    if (ok) {
      setCorrect((c) => c + 1);
      setCombo((c) => {
        const next = c + 1;
        setBestCombo((b) => Math.max(b, next));
        return next;
      });
    } else {
      setCombo(0);
      recordMistake({
        id: `article-${noun.de.toLowerCase()}`,
        de: `${noun.article} ${noun.de}`,
        en: noun.en,
        source: 'article',
      });
    }
    setFeedback({ ok, hint: ok ? null : genderHint(noun.de, noun.article) });
    setTimeout(() => {
      setFeedback(null);
      setIndex((i) => (i + 1) % queue.length);
      lockRef.current = false;
    }, ok ? 250 : 1200);
  };

  // ---- Setup ----
  if (phase === 'setup') {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <BackButton />
        <header>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Timer size={28} className="text-rose-500" />
            Der·Die·Das Reflex
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {ROUND_SECONDS} seconds. Tap the article. Build a combo.
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
                      ? 'bg-rose-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {l === 'all' ? 'All' : l}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={start}
            className="btn w-full py-4 text-lg text-white bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600"
          >
            <Zap size={22} /> Start Round
          </button>
        </div>
      </div>
    );
  }

  // ---- Results ----
  if (phase === 'done') {
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <div className="max-w-xl mx-auto">
        <div className="card p-8 text-center space-y-4 screen-in">
          <Flame className="mx-auto text-orange-500" size={64} />
          <h2 className="text-3xl font-bold">Time!</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/40">
              <p className="text-3xl font-bold">{correct}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">correct</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/40">
              <p className="text-3xl font-bold">{accuracy}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">accuracy</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/40">
              <p className="text-3xl font-bold">×{bestCombo}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">best combo</p>
            </div>
          </div>
          {xpEarned > 0 && (
            <div className="chip bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
              <Zap size={16} />+{xpEarned} XP
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <button
              onClick={start}
              className="btn px-6 py-3 text-white bg-rose-600 hover:bg-rose-700"
            >
              <RotateCw size={18} /> Again
            </button>
            <button
              onClick={() => setPhase('setup')}
              className="btn px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white"
            >
              Level
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Playing ----
  const noun = queue[index];
  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <span
          className={`chip ${
            timeLeft <= 10
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300'
              : 'bg-gray-100 dark:bg-gray-700'
          }`}
        >
          <Timer size={16} /> {timeLeft}s
        </span>
        <span className="chip bg-gray-100 dark:bg-gray-700">✓ {correct}</span>
        {combo >= 2 && (
          <span className="chip bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 fx-snap">
            <Flame size={16} /> ×{combo}
          </span>
        )}
      </div>

      <div className="mb-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-rose-500 to-orange-400 h-full transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / ROUND_SECONDS) * 100}%` }}
        />
      </div>

      <div key={index} className="card p-8 text-center fx-snap">
        <p className="text-4xl font-bold mb-1">{noun.de}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{noun.en}</p>
      </div>

      {feedback && !feedback.ok ? (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-center fx-snap">
          <p className="font-semibold text-red-600 dark:text-red-400">
            {noun.article} {noun.de}
          </p>
          {feedback.hint && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              💡 {feedback.hint}
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {ARTICLES.map((a) => (
            <button
              key={a}
              onClick={() => answer(a)}
              className={`btn py-5 text-xl text-white ${ARTICLE_STYLE[a]}`}
            >
              {a}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReflexPage;
