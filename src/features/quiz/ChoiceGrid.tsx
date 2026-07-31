import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { spring } from '../../motion/springs';

interface Props {
  options: string[];
  correctIndex: number;
  selected: number | null; // null until answered
  onPick: (i: number) => void;
  lang?: string;
  columns?: 1 | 2;
}

/** Option buttons with spring correct/incorrect reveal + number-key shortcuts. */
export default function ChoiceGrid({ options, correctIndex, selected, onPick, lang, columns = 1 }: Props) {
  const answered = selected !== null;

  useEffect(() => {
    if (answered) return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) onPick(n - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [answered, options.length, onPick]);

  return (
    <div className={columns === 2 ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
      {options.map((opt, i) => {
        const isCorrect = i === correctIndex;
        const isPicked = i === selected;
        let style: React.CSSProperties = {};
        if (answered) {
          if (isCorrect) style = { background: 'var(--good-soft)', borderColor: 'var(--good)', color: 'var(--good)' };
          else if (isPicked) style = { background: 'var(--bad-soft)', borderColor: 'var(--bad)', color: 'var(--bad)' };
          else style = { opacity: 0.45 };
        }
        return (
          <motion.button
            key={i}
            onClick={() => !answered && onPick(i)}
            disabled={answered}
            whileTap={answered ? undefined : { scale: 0.97 }}
            animate={answered && (isCorrect || isPicked) ? { scale: [1, 1.03, 1] } : {}}
            transition={spring.snappy}
            lang={isCorrect || isPicked ? lang : undefined}
            className="card flex w-full items-center justify-between px-5 py-4 text-left font-medium"
            style={{ ...style }}
          >
            <span className="flex items-center gap-3">
              <span
                className="mono flex h-6 w-6 items-center justify-center rounded-md text-xs"
                style={{ background: 'var(--elevated)', color: 'var(--faint)' }}
              >
                {i + 1}
              </span>
              <span lang={lang}>{opt}</span>
            </span>
            {answered && isCorrect && <Check size={18} style={{ color: 'var(--good)' }} />}
            {answered && isPicked && !isCorrect && <X size={18} style={{ color: 'var(--bad)' }} />}
          </motion.button>
        );
      })}
    </div>
  );
}
