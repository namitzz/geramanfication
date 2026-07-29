import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { spring } from './springs';

/** Universal spring press-scale wrapper for any tappable button. */
export default function Pressable({ children, ...props }: HTMLMotionProps<'button'>) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      whileTap={reduce ? undefined : { scale: 0.955 }}
      transition={spring.snappy}
      {...props}
    >
      {children}
    </motion.button>
  );
}
