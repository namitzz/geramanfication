import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { stagger, riseItem } from './springs';

/** Container that cascades its <Item> children in on mount. */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  );
}

export function Item({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={riseItem} className={className}>
      {children}
    </motion.div>
  );
}
