import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { spring } from './springs';

interface Props {
  progress: number; // 0..1
  size?: number;
  stroke?: number;
  gradient?: boolean; // flame ramp stroke
  children?: ReactNode;
}

/** Circular goal/streak ring whose fill springs to the target value. */
export default function ProgressRing({
  progress,
  size = 148,
  stroke = 12,
  gradient = false,
  children,
}: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, progress));
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {gradient && (
          <defs>
            <linearGradient id="flameRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--flame-2)" />
              <stop offset="50%" stopColor="var(--flame-3)" />
              <stop offset="100%" stopColor="var(--flame-5)" />
            </linearGradient>
          </defs>
        )}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={gradient ? 'url(#flameRing)' : 'var(--accent)'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - p) }}
          transition={spring.gentle}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}
