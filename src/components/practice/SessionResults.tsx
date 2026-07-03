import { Trophy, RotateCw, Zap } from 'lucide-react';

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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8 text-center animate-fade-in-up">
        <Trophy className="mx-auto text-yellow-500 mb-4" size={72} />
        <h2 className="text-3xl font-bold mb-2">Session Complete!</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          {emoji} {message}
        </p>

        <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-6 mb-6">
          <div className="text-5xl font-bold mb-2">
            {score} / {total}
          </div>
          <div className="text-xl text-gray-700 dark:text-gray-300">
            {percentage}% Correct
          </div>
          {xpEarned != null && xpEarned > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-semibold">
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
