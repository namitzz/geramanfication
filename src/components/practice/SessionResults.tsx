import { useEffect } from 'react';
import { Fuchs } from '../Fuchs';
import { sfxComplete } from '../../utils/sfx';

interface SessionResultsProps {
  score: number;
  total: number;
  /** Kept for API compatibility; results styling is now uniform. */
  accent?: 'brand' | 'purple' | 'emerald';
  xpEarned?: number;
  onRetry: () => void;
  onExit: () => void;
  exitLabel?: string;
}

function verdict(percentage: number): string {
  if (percentage >= 90) return 'Ausgezeichnet! Fuchs is impressed.';
  if (percentage >= 75) return 'Sehr gut — a sharp run.';
  if (percentage >= 60) return 'Gut! The trail continues.';
  if (percentage >= 40) return 'Solid — a few threads to chase.';
  return 'Every slip is a thread to reel back in.';
}

/** Session-complete screen: perk-Fuchs + stats (spec §exercise done states). */
const SessionResults = ({
  score,
  total,
  xpEarned,
  onRetry,
  onExit,
  exitLabel = 'Back to Setup',
}: SessionResultsProps) => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  useEffect(() => {
    sfxComplete();
  }, []);

  return (
    <div className="fx-fade-up mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center">
      <div className="fx-perk">
        <Fuchs variant="grown" mood="perk" size={110} />
      </div>
      <h2 className="fr mb-1.5 mt-3.5 text-[28px] font-semibold" style={{ color: 'var(--ink)' }}>
        Session complete
      </h2>
      <p className="mb-6 text-[15px]" style={{ color: 'var(--muted)' }}>
        {verdict(percentage)}
      </p>

      <div className="mb-7 flex gap-3">
        <div className="rounded-2xl px-6 py-3.5 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
          <p className="fr text-[26px] font-semibold" style={{ color: 'var(--primary)' }}>
            {score}/{total}
          </p>
          <p className="eyebrow mt-0.5" style={{ color: 'var(--faint)', fontSize: 11 }}>
            correct
          </p>
        </div>
        {xpEarned != null && xpEarned > 0 && (
          <div className="rounded-2xl px-6 py-3.5 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
            <p className="fr text-[26px] font-semibold" style={{ color: 'var(--ink)' }}>
              +{xpEarned}
            </p>
            <p className="eyebrow mt-0.5" style={{ color: 'var(--faint)', fontSize: 11 }}>
              XP earned
            </p>
          </div>
        )}
      </div>

      <div className="flex w-full flex-col gap-2.5">
        <button onClick={onRetry} className="btn-primary press w-full py-4">
          Try again
        </button>
        <button
          onClick={onExit}
          className="press w-full rounded-[14px] py-3.5 text-sm font-semibold"
          style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--muted)' }}
        >
          {exitLabel}
        </button>
      </div>
    </div>
  );
};

export default SessionResults;
