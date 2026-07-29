import { useEffect, useState } from 'react';
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from 'framer-motion';

/** Number that counts up to its value with an ease-out curve. */
export default function Counter({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const [n, setN] = useState(0);

  useMotionValueEvent(mv, 'change', (v) => setN(Math.round(v)));
  useEffect(() => {
    if (reduce) {
      setN(value);
      return;
    }
    const controls = animate(mv, value, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [value, mv, reduce]);

  return <span className={className}>{n}</span>;
}
