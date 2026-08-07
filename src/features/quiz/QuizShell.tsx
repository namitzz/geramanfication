import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { spring } from '../../motion/springs';

/** Top bar (close + animated progress + count) shared by every quiz mode. */
export default function QuizShell({
  index,
  total,
  children,
  onClose,
}: {
  index: number;
  total: number;
  children: ReactNode;
  onClose?: () => void;
}) {
  const navigate = useNavigate();
  const pct = total ? index / total : 0;
  return (
    <div className="min-h-[80vh]">
      <div className="mb-8 flex items-center gap-4">
        <button onClick={onClose ?? (() => navigate('/practice'))} aria-label="Close" className="text-faint">
          <X size={22} />
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--line)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--flame-gradient)' }}
            animate={{ width: `${pct * 100}%` }}
            transition={spring.gentle}
          />
        </div>
        <span className="mono text-faint text-sm">
          {Math.min(index + 1, total)}/{total}
        </span>
      </div>
      {children}
    </div>
  );
}
