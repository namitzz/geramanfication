import { useEffect, useState } from 'react';
import { CalendarDays, Share2, Check, Volume2 } from 'lucide-react';
import {
  MAX_ATTEMPTS,
  getDailyPuzzle,
  loadResult,
  saveResult,
  shareText,
  type DailyPuzzle,
  type DailyResult,
} from '../content/daily';
import { speak } from '../utils/tts';
import { useAppStore } from '../stores/appStore';

const DailySprintPage = () => {
  const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null);
  const [result, setResult] = useState<DailyResult | null>(null);
  const [bank, setBank] = useState<string[]>([]);
  const [assembled, setAssembled] = useState<number[]>([]);
  const [attempt, setAttempt] = useState(1);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [copied, setCopied] = useState(false);

  const recordSession = useAppStore((s) => s.recordSession);

  useEffect(() => {
    getDailyPuzzle().then((p) => {
      setPuzzle(p);
      setBank(p.scrambled);
      setResult(loadResult(p.day));
    });
  }, []);

  if (!puzzle) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-gray-400">
        Loading today’s puzzle…
      </div>
    );
  }

  const finish = (solved: boolean, attemptsUsed: number) => {
    const r = { solved, attemptsUsed };
    saveResult(puzzle.day, r);
    setResult(r);
    // Solving early earns more: 3/2/1 correct out of 3.
    recordSession(solved ? MAX_ATTEMPTS - attemptsUsed + 1 : 0, MAX_ATTEMPTS);
    if (solved) speak(puzzle.item.de).catch(() => {});
  };

  const check = () => {
    const built = assembled.map((i) => bank[i]).join(' ');
    if (built === puzzle.item.tokens.join(' ')) {
      finish(true, attempt);
    } else if (attempt >= MAX_ATTEMPTS) {
      finish(false, attempt);
    } else {
      setAttempt(attempt + 1);
      setAssembled([]);
      setWrongFlash(true);
      setTimeout(() => setWrongFlash(false), 600);
    }
  };

  const share = async () => {
    const text = shareText(puzzle.number, result!.attemptsUsed, result!.solved);
    try {
      if (navigator.share) await navigator.share({ text });
      else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // user cancelled share — nothing to do
    }
  };

  // ---- Finished state (today already played) ----
  if (result) {
    const squares =
      '🟥'.repeat(result.solved ? result.attemptsUsed - 1 : result.attemptsUsed) +
      (result.solved ? '🟩' : '⬛');
    return (
      <div className="max-w-xl mx-auto space-y-6 text-center">
        <header>
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <CalendarDays className="text-brand-500" size={28} />
            Daily Sprint #{puzzle.number}
          </h1>
        </header>

        <div className="card p-8 space-y-4 screen-in">
          <p className="text-4xl">{result.solved ? '🎉' : '😅'}</p>
          <p className="text-2xl">{squares}</p>
          <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
            <p className="text-xl font-bold flex items-center justify-center gap-2">
              🇩🇪 {puzzle.item.de}
              <button
                onClick={() => speak(puzzle.item.de)}
                className="p-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full"
                aria-label="Pronounce"
              >
                <Volume2 size={16} />
              </button>
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              🇬🇧 {puzzle.item.en}
            </p>
          </div>
          <button onClick={share} className="btn-primary w-full py-3">
            {copied ? <Check size={20} /> : <Share2 size={20} />}
            {copied ? 'Copied!' : 'Share result'}
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Next puzzle at midnight. Komm morgen wieder! 👋
          </p>
        </div>
      </div>
    );
  }

  // ---- Playing ----
  const canCheck = assembled.length === bank.length;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <CalendarDays className="text-brand-500" size={28} />
          Daily Sprint #{puzzle.number}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          One sentence a day. Build the German.
        </p>
      </header>

      <div className={`card p-6 space-y-5 ${wrongFlash ? 'fx-snap' : ''}`}>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-brand-600 dark:text-brand-400">
            Attempt {attempt} / {MAX_ATTEMPTS}
          </span>
          <span className="chip text-xs bg-gray-100 dark:bg-gray-700">
            {puzzle.item.level}
          </span>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Build the German for:
          </p>
          <p className="text-xl font-semibold">{puzzle.item.en}</p>
        </div>

        <div
          className={`min-h-[56px] p-3 rounded-lg border-2 border-dashed flex flex-wrap gap-2 transition-colors ${
            wrongFlash
              ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          {assembled.map((bankIdx, pos) => (
            <button
              key={pos}
              onClick={() => setAssembled(assembled.filter((_, p) => p !== pos))}
              className="px-3 py-1.5 rounded-md bg-brand-100 dark:bg-brand-900/30 text-brand-800 dark:text-brand-200 font-medium"
            >
              {bank[bankIdx]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {bank.map((word, i) => {
            const used = assembled.includes(i);
            return (
              <button
                key={i}
                disabled={used}
                onClick={() => setAssembled([...assembled, i])}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  used
                    ? 'opacity-30 bg-gray-200 dark:bg-gray-700'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {word}
              </button>
            );
          })}
        </div>

        <button
          onClick={check}
          disabled={!canCheck}
          className="btn-primary w-full py-3 disabled:opacity-40"
        >
          Check
        </button>
      </div>
    </div>
  );
};

export default DailySprintPage;
