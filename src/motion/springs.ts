import type { Transition, Variants } from 'framer-motion';

/** Named spring presets — the motion vocabulary for the whole app. */
export const spring = {
  snappy: { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 },
  gentle: { type: 'spring', stiffness: 210, damping: 26 },
  bouncy: { type: 'spring', stiffness: 520, damping: 22, mass: 0.9 },
  soft: { type: 'spring', stiffness: 140, damping: 20 },
} satisfies Record<string, Transition>;

/** Container/child variants for staggered list & grid reveals. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

export const riseItem: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: spring.gentle,
  },
};

/** Page enter/exit for route transitions. */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12, scale: 0.985 },
  enter: { opacity: 1, y: 0, scale: 1, transition: spring.snappy },
  exit: { opacity: 0, y: -8, scale: 0.99, transition: { duration: 0.18 } },
};
