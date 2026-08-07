import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Volume2, Check, X } from 'lucide-react';
import type { CEFRLevel } from '../types';
import { speak } from '../utils/tts';
import { isAnswerCorrect } from '../utils/stringMatch';
import { useApp } from '../store/app';
import { useQuizSession } from '../features/quiz/useQuizSession';
import QuizShell from '../features/quiz/QuizShell';
import SessionResults from '../features/quiz/SessionResults';
import { buildQuiz } from '../features/quiz/providers';
import type { QuizItem } from '../features/quiz/types';
import MagneticButton from '../motion/MagneticButton';
import Pressable from '../motion/Pressable';
import { spring } from '../motion/springs';

const LEVELS: (CEFRLevel | 'all')[] = ['all', 'A1', 'A2', 'B1', 'B2', 'C1'];
const COUNTS = [10, 15, 20];

export default function TypeQuiz() {
  const navigate = useNavigate();
  const ttsEnabled = useApp((s) => s.settings.ttsEnabled);
  const [phase, setPhase] = useState<'setup' | 'playing'>('setup');
  const [level, setLevel] = useState<CEFRLevel | 'all'>('all');
  const [count, setCount] = useState(12);
  const [items, setItems] = useState<QuizItem[]>([]);
  const [value, setValue] = useState('');
  const [result, setResult] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const session = useQuizSession(items.length);
  const current = items[session.index];
  const answer = current?.miss.en ?? '';

  const start = async () => {
    setLoading(true);
    setItems(await buildQuiz('mcq', level, count));
    session.reset();
    setResult(null);
    setValue('');
    setLoading(false);
    setPhase('playing');
  };

  useEffect(() => {
    if (phase !== 'playing' || !current) return;
    setValue('');
    setResult(null);
    inputRef.current?.focus();
    if (ttsEnabled && current.speak) {
      const t = setTimeout(() => speak(current.speak!, 'de-DE'), 300);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.index, phase]);

  const submit = () => {
    if (result !== null || !value.trim() || !current) return;
    const correct = isAnswerCorrect(value.trim(), answer);
    setResult(correct);
    session.submit(correct, current.miss);
    setTimeout(() => session.advance(), 1500);
  };

  if (phase === 'setup') {
    return (
      <div className="min-h-[80vh]">
        <h1 className="display mb-1 text-[30px]">Type-in</h1>
        <p className="text-muted mb-8">See the German, type the English.</p>
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

  const border =
    result === null ? 'var(--line-strong)' : result ? 'var(--good)' : 'var(--bad)';

  return (
    <QuizShell index={session.index} total={items.length} onClose={() => navigate('/practice')}>
      <motion.div key={session.index} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={spring.snappy}>
        <div className="card mb-6 px-6 py-9 text-center">
          <p className="eyebrow text-faint mb-3">type the English</p>
          <h2 lang="de" className="display text-[30px]">
            {current.prompt}
          </h2>
          <button
            onClick={() => speak(current.speak ?? current.prompt, 'de-DE')}
            className="glass mx-auto mt-5 flex h-11 w-11 items-center justify-center rounded-full"
            style={{ color: 'var(--accent)' }}
            aria-label="Pronounce"
          >
            <Volume2 size={18} />
          </button>
        </div>

        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          disabled={result !== null}
          placeholder="your answer…"
          autoCapitalize="off"
          autoCorrect="off"
          className="glass w-full rounded-2xl px-5 py-4 text-center text-lg outline-none placeholder:text-faint"
          style={{ borderColor: border, borderWidth: 1 }}
        />

        {result === null ? (
          <MagneticButton
            onClick={submit}
            disabled={!value.trim()}
            className="mt-4 w-full rounded-2xl bg-accent py-4 font-semibold text-accent-ink"
          >
            Check
          </MagneticButton>
        ) : (
          <div
            className="mt-4 flex items-center justify-center gap-2 rounded-2xl py-4 font-semibold"
            style={{ background: result ? 'var(--good-soft)' : 'var(--bad-soft)', color: result ? 'var(--good)' : 'var(--bad)' }}
          >
            {result ? <Check size={18} /> : <X size={18} />}
            {result ? 'Correct' : `Answer: ${answer}`}
          </div>
        )}
      </motion.div>
    </QuizShell>
  );
}
