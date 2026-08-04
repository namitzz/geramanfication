import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Card } from '../types';
import { useApp } from '../store/app';
import Flashcard from '../features/study/Flashcard';
import { spring } from '../motion/springs';

/** Drill the cross-mode mistakes queue; a correct answer clears the weak spot. */
export default function WeakSpots() {
  const navigate = useNavigate();
  const { clearMistake, recordSession } = useApp();

  // Snapshot on entry so clearing items doesn't reshuffle the run.
  const [queue] = useState<Card[]>(() =>
    Object.values(useApp.getState().mistakes)
      .sort((a, b) => b.ts - a.ts)
      .map((m) => ({ id: m.id, de: m.de, en: m.en })),
  );
  const [index, setIndex] = useState(0);
  const tally = useRef({ correct: 0, total: 0, xp: 0 });
  const current = queue[index];
  const total = queue.length;

  const grade = (correct: boolean) => {
    if (!current) return;
    tally.current.correct += correct ? 1 : 0;
    tally.current.total += 1;
    tally.current.xp += recordSession(correct ? 1 : 0, 1);
    if (correct) clearMistake(current.id);
    const next = index + 1;
    setIndex(next);
    if (next >= total) {
      setTimeout(
        () =>
          navigate('/results', {
            replace: true,
            state: { ...tally.current, mode: 'review', streak: useApp.getState().progress.streak },
          }),
        260,
      );
    }
  };

  if (total === 0 || index >= total) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <p className="display text-3xl mb-2">No weak spots</p>
        <p className="text-muted mb-8">Nice — you've cleared everything you missed.</p>
        <button onClick={() => navigate('/')} className="rounded-2xl bg-accent px-6 py-3 font-semibold text-accent-ink">
          Back to Today
        </button>
      </div>
    );
  }

  const pct = total ? index / total : 0;

  return (
    <div className="min-h-[80vh]">
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate('/practice')} aria-label="Close" className="text-faint">
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
          {index + 1}/{total}
        </span>
      </div>
      {current && <Flashcard key={current.id} card={current} onGrade={grade} />}
    </div>
  );
}
