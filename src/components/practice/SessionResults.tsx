import { useEffect, useMemo, useRef, useState } from 'react';
import { Trophy, RotateCw, Zap } from 'lucide-react';
import { sfxComplete } from '../../utils/sfx';

interface SessionResultsProps {
  score: number;
  total: number;
  /** Accent for the retry button. Must be a key so Tailwind sees full class names. */
  accent?: 'brand' | 'purple' | 'emerald';
  xpEarned?: number;
  onRetry: () => void;
  onExit: () => void;
  exitLabel?: string;
}

// Full class strings (not built at runtime) so Tailwind compiles them.
const ACCENT_CLASSES: Record<NonNullable<SessionResultsProps['accent']>, string> = {
  brand: 'bg-brand-600 hover:bg-brand-700',
  purple: 'bg-purple-500 hover:bg-purple-600',
  emerald: 'bg-emerald-500 hover:bg-emerald-600',
};

function grade(percentage: number): { message: string; emoji: string } {
  if (percentage >= 90) return { message: 'Ausgezeichnet! Excellent!', emoji: '🏆' };
  if (percentage >= 75) return { message: 'Sehr gut! Very good!', emoji: '🎉' };
  if (percentage >= 60) return { message: 'Gut! Good!', emoji: '👍' };
  if (percentage >= 40) return { message: 'Not bad, keep practicing!', emoji: '💪' };
  return { message: 'Keep learning, you got this!', emoji: '📚' };
}

const CONFETTI_COLORS = ['#ef2140', '#ffce00', '#ffffff', '#8b5cf6', '#34d399'];

/** Full-screen falling confetti, rendered once on mount. */
const Confetti = ({ count = 28 }: { count?: number }) => {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        animationDelay: `${Math.random() * 0.6}s`,
        animationDuration: `${2 + Math.random() * 1.4}s`,
        transform: `rotate(${Math.random() * 360}deg)`,
      })),
    [count]
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pieces.map((style, i) => (
        <span key={i} className="confetti-piece" style={style} />
      ))}
    </div>
  );
};

/** Animated count-up for the score number. */
const CountUp = ({ value }: { value: number }) => {
  const [shown, setShown] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    const t0 = performance.now();
    const duration = 700;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3)))); // ease-out
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);
  return <>{shown}</>;
};

const SessionResults = ({
  score,
  total,
  accent = 'brand',
  xpEarned,
  onRetry,
  onExit,
  exitLabel = 'Back to Setup',
}: SessionResultsProps) => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const { message, emoji } = grade(percentage);
  const celebrate = percentage >= 60;

  useEffect(() => {
    sfxComplete();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      {celebrate && <Confetti />}
      <div className="card p-8 text-center animate-spring-in">
        <Trophy
          className={`mx-auto text-gold-500 mb-4 ${celebrate ? 'animate-glow-pulse' : ''}`}
          size={72}
        />
        <h2 className="text-3xl font-bold mb-2">Session Complete!</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          {emoji} {message}
        </p>

        <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-6 mb-6">
          <div className="text-5xl font-bold mb-2">
            <CountUp value={score} /> / {total}
          </div>
          <div className="text-xl text-gray-700 dark:text-gray-300">
            {percentage}% Correct
          </div>
          {xpEarned != null && xpEarned > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 text-gold-600 dark:text-gold-400 font-semibold shadow-glow-gold">
              <Zap size={18} />+{xpEarned} XP
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onRetry}
            className={`btn px-6 py-3 ${ACCENT_CLASSES[accent]} text-white`}
          >
            <RotateCw size={20} />
            Try Again
          </button>
          <button
            onClick={onExit}
            className="btn px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white"
          >
            {exitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionResults;
