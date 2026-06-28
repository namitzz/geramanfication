import { Trophy, RotateCw } from 'lucide-react';

interface SessionResultsProps {
  score: number;
  total: number;
  accentClass?: string; // tailwind bg color for buttons, e.g. 'bg-purple-500'
  onRetry: () => void;
  onExit: () => void;
  exitLabel?: string;
}

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
  accentClass = 'bg-blue-500',
  onRetry,
  onExit,
  exitLabel = 'Back to Setup',
}: SessionResultsProps) => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const { message, emoji } = grade(percentage);
  const hoverClass = accentClass.replace('-500', '-600');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
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
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onRetry}
            className={`px-6 py-3 ${accentClass} hover:${hoverClass} text-white rounded-lg font-semibold transition-colors flex items-center gap-2`}
          >
            <RotateCw size={20} />
            Try Again
          </button>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            {exitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionResults;
