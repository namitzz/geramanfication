import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Article } from '../types';
import { loadGenderNouns, type GenderNoun } from '../content/gender';
import { speak } from '../utils/tts';
import { useApp } from '../store/app';
import { useQuizSession } from '../features/quiz/useQuizSession';
import QuizShell from '../features/quiz/QuizShell';
import SessionResults from '../features/quiz/SessionResults';
import MagneticButton from '../motion/MagneticButton';
import { spring } from '../motion/springs';

const ARTICLES: Article[] = ['der', 'die', 'das'];
const TINT: Record<Article, string> = { der: '#5b8cff', die: '#ff6b9d', das: '#37d29a' };
const ROUNDS = 15;

export default function Reflex() {
  const navigate = useNavigate();
  const ttsEnabled = useApp((s) => s.settings.ttsEnabled);
  const [phase, setPhase] = useState<'setup' | 'playing'>('setup');
  const [items, setItems] = useState<GenderNoun[]>([]);
  const [picked, setPicked] = useState<Article | null>(null);
  const session = useQuizSession(items.length);
  const current = items[session.index];

  const start = async () => {
    const all = await loadGenderNouns();
    setItems([...all].sort(() => Math.random() - 0.5).slice(0, ROUNDS));
    session.reset();
    setPicked(null);
    setPhase('playing');
  };

  useEffect(() => {
    setPicked(null);
  }, [session.index]);

  const pick = (a: Article) => {
    if (picked || !current) return;
    setPicked(a);
    const correct = a === current.article;
    if (ttsEnabled) speak(`${current.article} ${current.de}`, 'de-DE');
    session.submit(
      correct,
      correct ? undefined : { id: `gender-${current.de}`, de: `${current.article} ${current.de}`, en: current.en },
    );
    setTimeout(() => session.advance(), 950);
  };

  if (phase === 'setup') {
    return (
      <div className="flex min-h-[80vh] flex-col justify-center">
        <h1 className="display text-[34px] mb-2">Reflex</h1>
        <p className="text-muted mb-10">
          der, die or das? Snap-decide the gender for {ROUNDS} nouns. The article + word is read aloud so it sticks.
        </p>
        <MagneticButton onClick={start} className="w-full rounded-2xl bg-accent py-4 font-semibold text-accent-ink">
          Start
        </MagneticButton>
      </div>
    );
  }

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
      <motion.div key={session.index} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={spring.snappy}>
        <div className="card mb-7 px-6 py-11 text-center">
          <p className="eyebrow text-faint mb-4">der · die · das?</p>
          <h2 lang="de" className="display text-[42px]">
            {current.de}
          </h2>
          <p className="text-faint mt-2 text-sm">{current.en}</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {ARTICLES.map((a) => {
            let bg = 'var(--surface)';
            let col = TINT[a];
            let border = 'var(--line)';
            if (picked) {
              if (a === current.article) {
                bg = 'var(--good-soft)';
                col = 'var(--good)';
                border = 'var(--good)';
              } else if (a === picked) {
                bg = 'var(--bad-soft)';
                col = 'var(--bad)';
                border = 'var(--bad)';
              } else {
                col = 'var(--faint)';
              }
            }
            return (
              <motion.button
                key={a}
                onClick={() => pick(a)}
                disabled={!!picked}
                whileTap={{ scale: 0.95 }}
                transition={spring.snappy}
                className="mono rounded-2xl py-6 text-xl font-bold"
                style={{ background: bg, color: col, border: `1px solid ${border}` }}
              >
                {a}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </QuizShell>
  );
}
