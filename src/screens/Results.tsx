import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Zap } from 'lucide-react';
import ProgressRing from '../motion/ProgressRing';
import Counter from '../motion/Counter';
import MagneticButton from '../motion/MagneticButton';
import { spring } from '../motion/springs';

interface ResultState {
  correct: number;
  total: number;
  xp: number;
  streak: number;
  mode: 'daily' | 'review';
}

export default function Results() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: ResultState | null };

  useEffect(() => {
    if (!state) navigate('/', { replace: true });
  }, [state, navigate]);
  if (!state) return null;

  const acc = state.total ? state.correct / state.total : 0;
  const pct = Math.round(acc * 100);

  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center text-center">
      <p className="eyebrow text-faint mb-6">session complete</p>

      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring.bouncy}>
        <ProgressRing progress={acc} size={188} stroke={14} gradient>
          <span className="display text-5xl">
            <Counter value={pct} />%
          </span>
          <span className="text-faint mt-1 text-sm">accuracy</span>
        </ProgressRing>
      </motion.div>

      <p className="display mt-8 text-2xl">
        {state.correct} / {state.total} correct
      </p>

      <div className="mt-6 flex gap-3">
        <div className="glass flex items-center gap-2 rounded-full px-4 py-2">
          <Zap size={16} style={{ color: 'var(--accent)' }} />
          <span className="mono font-semibold">
            +<Counter value={state.xp} /> XP
          </span>
        </div>
        <div className="glass flex items-center gap-2 rounded-full px-4 py-2">
          <Flame size={16} style={{ color: '#ff9f43' }} />
          <span className="mono font-semibold">{state.streak} day</span>
        </div>
      </div>

      <div className="mt-12 w-full max-w-xs space-y-3">
        <MagneticButton
          onClick={() => navigate('/review')}
          className="w-full rounded-2xl bg-accent py-4 font-semibold text-accent-ink"
        >
          Review weak spots
        </MagneticButton>
        <button onClick={() => navigate('/')} className="text-muted w-full py-3 font-medium">
          Back to Today
        </button>
      </div>
    </div>
  );
}
