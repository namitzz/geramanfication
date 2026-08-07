import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { pageVariants } from './springs';

/** Wraps a route so it springs in and fades out under AnimatePresence. */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">
      {children}
    </motion.div>
  );
}
