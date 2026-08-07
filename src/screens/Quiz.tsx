import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import type { CEFRLevel } from '../types';
import { speak } from '../utils/tts';
import { useApp } from '../store/app';
import { useQuizSession } from '../features/quiz/useQuizSession';
import QuizShell from '../features/quiz/QuizShell';
import ChoiceGrid from '../features/quiz/ChoiceGrid';
import SessionResults from '../features/quiz/SessionResults';
import { buildQuiz } from '../features/quiz/providers';
import type { QuizItem, QuizMode } from '../features/quiz/types';
import MagneticButton from '../motion/MagneticButton';
import Pressable from '../motion/Pressable';
import { spring } from '../motion/springs';

const LEVELS: (CEFRLevel | 'all')[] = ['all', 'A1', 'A2', 'B1', 'B2', 'C1'];
const COUNTS = [10, 15, 20];

export default function Quiz({ mode, title }: { mode: QuizMode; title: string }) {
  const navigate = useNavigate();
  const ttsEnabled = useApp((s) => s.settings.ttsEnabled);

  const [phase, setPhase] = useState<'setup' | 'playing'>('setup');
  const [level, setLevel] = useState<CEFRLevel | 'all'>('all');
  const [count, setCount] = useState(12);
  const [items, setItems] = useState<QuizItem[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const session = useQuizSession(items.length);
  const current = items[session.index];

  const start = async () => {
    setLoading(true);
    const built = await buildQuiz(mode, level, count);
    setItems(built);
    setSelected(null);
    session.reset();
    setLoading(false);
    setPhase('playing');
  };

  // Pronounce the prompt/word when a new question shows.
  useEffect(() => {
    if (phase !== 'playing' || !current) return;
    setSelected(null);
    if (ttsEnabled && current.speak) {
      const t = setTimeout(() => speak(current.speak!, 'de-DE'), 300);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.index, phase]);

  const pick = (i: number) => {
    if (selected !== null || !current) return;
    setSelected(i);
    const correct = i === current.correctIndex;
    session.submit(correct, current.miss);
    if (ttsEnabled && current.speakReveal) speak(current.speakReveal, 'de-DE');
    setTimeout(() => session.advance(), 1350);
  };

  // ---- setup ----
  if (phase === 'setup') {
    return (
      <div className="min-h-[80vh]">
        <h1 className="display mb-1 text-[30px]">{title}</h1>
        <p className="text-muted mb-8">Pick your range, then go.</p>

        {mode !== 'hard' && (
          <div className="mb-7">
            <p className="eyebrow text-faint mb-3">level</p>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <Pressable
                  key={l}
                  onClick={() => setLevel(l)}
                  className="mono rounded-xl px-4 py-2 text-sm font-semibold"
                  style={
                    level === l
                      ? { background: 'var(--accent)', color: 'var(--accent-ink)' }
                      : { background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--line)' }
                  }
                >
                  {l === 'all' ? 'All' : l}
                </Pressable>
              ))}
            </div>
          </div>
        )}

        <div className="mb-10">
          <p className="eyebrow text-faint mb-3">questions</p>
          <div className="flex gap-2">
            {COUNTS.map((c) => (
              <Pressable
                key={c}
                onClick={() => setCount(c)}
                className="mono flex-1 rounded-xl py-3 font-semibold"
                style={
                  count === c
                    ? { background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)' }
                    : { background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--line)' }
                }
              >
                {c}
              </Pressable>
            ))}
          </div>
        </div>

        <MagneticButton
          onClick={start}
          disabled={loading}
          className="w-full rounded-2xl bg-accent py-4 font-semibold text-accent-ink"
        >
          {loading ? 'Loading…' : 'Start'}
        </MagneticButton>
      </div>
    );
  }

  // ---- done ----
  if (session.finished) {
    return (
      <SessionResults
        correct={session.tally.correct}
        total={session.tally.total}
        xp={session.tally.xp}
        onRetry={() => setPhase('setup')}
        onExit={() => navigate('/practice')}
      />
    );
  }

  if (!current) return <div className="py-24 text-center text-muted">Loading…</div>;

  return (
    <QuizShell index={session.index} total={items.length} onClose={() => navigate('/practice')}>
      <motion.div
        key={session.index}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.snappy}
      >
        <div className="card mb-6 px-6 py-8 text-center">
          {current.promptSub && <p className="eyebrow text-faint mb-3">{current.promptSub}</p>}
          <h2
            lang={current.promptDe ? 'de' : undefined}
            className="display text-[26px] leading-snug"
          >
            {current.prompt}
          </h2>
          {(current.speak || current.promptDe) && (
            <button
              onClick={() => speak(current.speak ?? current.prompt, 'de-DE')}
              className="glass mx-auto mt-5 flex h-11 w-11 items-center justify-center rounded-full"
              style={{ color: 'var(--accent)' }}
              aria-label="Pronounce"
            >
              <Volume2 size={18} />
            </button>
          )}
        </div>

        <ChoiceGrid
          options={current.options}
          correctIndex={current.correctIndex}
          selected={selected}
          onPick={pick}
          lang={current.optionsDe ? 'de' : undefined}
        />

        {selected !== null && current.explanation && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted mt-5 text-center text-sm italic"
          >
            {current.explanation}
          </motion.p>
        )}
      </motion.div>
    </QuizShell>
  );
}
