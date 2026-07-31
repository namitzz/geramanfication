import { motion } from 'framer-motion';
import { Zap, RotateCcw } from 'lucide-react';
import ProgressRing from '../../motion/ProgressRing';
import Counter from '../../motion/Counter';
import MagneticButton from '../../motion/MagneticButton';
import { spring } from '../../motion/springs';

/** Inline end-of-quiz summary reused by every mode (accuracy ring + XP). */
export default function SessionResults({
  correct,
  total,
  xp,
  onRetry,
  onExit,
}: {
  correct: number;
  total: number;
  xp: number;
  onRetry: () => void;
  onExit: () => void;
}) {
  const acc = total ? correct / total : 0;
  const pct = Math.round(acc * 100);
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <p className="eyebrow text-faint mb-6">complete</p>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring.bouncy}>
        <ProgressRing progress={acc} size={186} stroke={14} gradient>
          <span className="display text-5xl">
            <Counter value={pct} />%
          </span>
          <span className="text-faint mt-1 text-sm">accuracy</span>
        </ProgressRing>
      </motion.div>

      <p className="display mt-8 text-2xl">
        {correct} / {total} correct
      </p>
      <div className="glass mt-5 flex items-center gap-2 rounded-full px-4 py-2">
        <Zap size={16} style={{ color: 'var(--accent)' }} />
        <span className="mono font-semibold">
          +<Counter value={xp} /> XP
        </span>
      </div>

      <div className="mt-11 w-full max-w-xs space-y-3">
        <MagneticButton
          onClick={onRetry}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-4 font-semibold text-accent-ink"
        >
          <RotateCcw size={18} /> Again
        </MagneticButton>
        <button onClick={onExit} className="text-muted w-full py-3 font-medium">
          Done
        </button>
      </div>
    </div>
  );
}
