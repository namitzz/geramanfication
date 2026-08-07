import { useRef, type ReactNode, type PointerEvent, type CSSProperties } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { spring } from './springs';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  strength?: number;
  disabled?: boolean;
  'aria-label'?: string;
}

/** Primary CTA that springs toward the pointer, then snaps back on leave. */
export default function MagneticButton({
  children,
  onClick,
  className,
  style,
  strength = 0.35,
  disabled,
  ...rest
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 250, damping: 18 });
  const y = useSpring(my, { stiffness: 250, damping: 18 });

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerUp={reset}
      onClick={onClick}
      disabled={disabled}
      style={{ x, y, ...style }}
      whileTap={reduce ? undefined : { scale: 0.96 }}
      transition={spring.snappy}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
