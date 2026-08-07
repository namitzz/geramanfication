import { motion, useReducedMotion } from 'framer-motion';
import { Flame } from 'lucide-react';

/** Streak indicator with a live flame-gradient flicker. */
export default function StreakFlame({ count, size = 18 }: { count: number; size?: number }) {
  const reduce = useReducedMotion();
  const active = count > 0;
  return (
    <span className="inline-flex items-center gap-1.5">
      <motion.span
        style={{ display: 'inline-flex', color: active ? 'var(--flame-3)' : 'var(--faint)' }}
        animate={reduce || !active ? undefined : { scale: [1, 1.12, 0.97, 1.05, 1], rotate: [0, -3, 3, -1, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Flame size={size} fill={active ? 'var(--flame-4)' : 'none'} />
      </motion.span>
      <span
        className="mono font-semibold"
        style={
          active
            ? {
                background: 'var(--flame-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }
            : { color: 'var(--faint)' }
        }
      >
        {count}
      </span>
    </span>
  );
}
