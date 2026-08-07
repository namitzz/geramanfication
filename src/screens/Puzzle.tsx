import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, Check, X } from 'lucide-react';
import { getDailyPuzzle, loadResult, saveResult, MAX_ATTEMPTS, type DailyPuzzle } from '../content/daily';
import { speak } from '../utils/tts';
import MagneticButton from '../motion/MagneticButton';
import { Stagger, Item } from '../motion/Reveal';

const norm = (s: string) => s.toLowerCase().replace(/[.,!?;:„"»«]/g, '').replace(/\s+/g, ' ').trim();

function share(number: number, attemptsUsed: number, solved: boolean) {
  const squares = '🟧'.repeat(solved ? attemptsUsed - 1 : attemptsUsed) + (solved ? '🟩' : '⬛');
  const text = `Tovo Daily #${number} 🔥 ${solved ? `${attemptsUsed}/${MAX_ATTEMPTS}` : `X/${MAX_ATTEMPTS}`}\n${squares}\nhttps://namitzz.github.io/Tovo/`;
  if (navigator.share) navigator.share({ text }).catch(() => {});
  else navigator.clipboard?.writeText(text);
}

export default function Puzzle() {
  const navigate = useNavigate();
  const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null);
  const [pool, setPool] = useState<{ w: string; k: number }[]>([]);
  const [answer, setAnswer] = useState<{ w: string; k: number }[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<'playing' | 'solved' | 'failed'>('playing');
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    getDailyPuzzle().then((p) => {
      setPuzzle(p);
      setPool(p.scrambled.map((w, i) => ({ w, k: i })));
      const prev = loadResult(p.day);
      if (prev) {
        setAttempts(prev.attemptsUsed);
        setStatus(prev.solved ? 'solved' : 'failed');
      }
    });
  }, []);

  if (!puzzle) return <div className="py-24 text-center text-muted">Loading…</div>;
  const done = status !== 'playing';

  const check = () => {
    if (answer.length === 0) return;
    const ok = norm(answer.map((a) => a.w).join(' ')) === norm(puzzle.item.de);
    const used = attempts + 1;
    setAttempts(used);
    if (ok) {
      setStatus('solved');
      saveResult(puzzle.day, { attemptsUsed: used, solved: true });
      speak(puzzle.item.de, 'de-DE');
    } else if (used >= MAX_ATTEMPTS) {
      setStatus('failed');
      saveResult(puzzle.day, { attemptsUsed: used, solved: false });
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 500);
      setPool((p) => [...p, ...answer]);
      setAnswer([]);
    }
  };

  return (
    <Stagger className="space-y-6">
      <Item>
        <p className="eyebrow text-faint">daily puzzle</p>
        <h1 className="display text-[30px]">
          #{puzzle.number} <span className="text-faint text-lg">· {puzzle.item.level}</span>
        </h1>
        <p className="text-muted mt-1 text-sm">Unscramble the sentence. {MAX_ATTEMPTS} tries.</p>
      </Item>

      {/* attempt pips */}
      <Item>
        <div className="flex gap-2">
          {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full"
              style={{ background: i < attempts ? (status === 'solved' && i === attempts - 1 ? 'var(--good)' : 'var(--flame-3)') : 'var(--line)' }}
            />
          ))}
        </div>
      </Item>

      {done ? (
        <Item>
          <div className="card px-6 py-8 text-center">
            <div className="mb-3 flex justify-center" style={{ color: status === 'solved' ? 'var(--good)' : 'var(--bad)' }}>
              {status === 'solved' ? <Check size={40} /> : <X size={40} />}
            </div>
            <p className="display text-2xl mb-2">{status === 'solved' ? 'Solved!' : 'Out of tries'}</p>
            <p lang="de" className="text-muted">{puzzle.item.de}</p>
            <p className="text-faint mt-1 text-sm">{puzzle.item.en}</p>
            <MagneticButton
              onClick={() => share(puzzle.number, attempts, status === 'solved')}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-accent px-6 py-3 font-semibold text-accent-ink"
            >
              <Share2 size={18} /> Share
            </MagneticButton>
          </div>
          <button onClick={() => navigate('/')} className="text-muted mt-4 w-full py-3 font-medium">
            Back to Today
          </button>
        </Item>
      ) : (
        <Item>
          <motion.div
            animate={wrong ? { x: [0, -8, 8, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="card min-h-[92px] flex flex-wrap content-start gap-2 p-4"
          >
            {answer.map((t) => (
              <motion.button
                key={t.k}
                layout
                onClick={() => {
                  setPool((p) => [...p, t]);
                  setAnswer((a) => a.filter((x) => x.k !== t.k));
                }}
                lang="de"
                className="rounded-xl px-3 py-2 text-sm font-medium"
                style={{ background: 'var(--elevated)' }}
              >
                {t.w}
              </motion.button>
            ))}
          </motion.div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {pool.map((t) => (
              <motion.button
                key={t.k}
                layout
                onClick={() => {
                  setAnswer((a) => [...a, t]);
                  setPool((p) => p.filter((x) => x.k !== t.k));
                }}
                lang="de"
                className="glass rounded-xl px-3 py-2 text-sm font-medium"
              >
                {t.w}
              </motion.button>
            ))}
          </div>

          <MagneticButton
            onClick={check}
            disabled={answer.length === 0}
            className="mt-6 w-full rounded-2xl bg-accent py-4 font-semibold text-accent-ink"
          >
            Check ({MAX_ATTEMPTS - attempts} left)
          </MagneticButton>
        </Item>
      )}
    </Stagger>
  );
}
