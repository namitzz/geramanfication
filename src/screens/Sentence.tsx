import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Volume2, Check, X, Blocks, Ear, Languages } from 'lucide-react';
import type { CEFRLevel } from '../types';
import { buildSentenceSet, type SentenceItem } from '../content/sentences';
import { isAnswerCorrect } from '../utils/stringMatch';
import { speak } from '../utils/tts';
import { useApp } from '../store/app';
import { useQuizSession } from '../features/quiz/useQuizSession';
import QuizShell from '../features/quiz/QuizShell';
import SessionResults from '../features/quiz/SessionResults';
import MagneticButton from '../motion/MagneticButton';
import Pressable from '../motion/Pressable';
import { spring } from '../motion/springs';

type Mode = 'build' | 'dictation' | 'translate';
const LEVELS: (CEFRLevel | 'all')[] = ['all', 'A1', 'A2', 'B1', 'B2', 'C1'];
const COUNTS = [8, 12, 16];
const norm = (s: string) => s.toLowerCase().replace(/[.,!?;:„"»«]/g, '').replace(/\s+/g, ' ').trim();
const shuffle = <T,>(a: T[]) => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

const MODES: { id: Mode; icon: typeof Blocks; title: string; sub: string }[] = [
  { id: 'build', icon: Blocks, title: 'Build', sub: 'Put the words in order' },
  { id: 'dictation', icon: Ear, title: 'Dictation', sub: 'Listen, then type it' },
  { id: 'translate', icon: Languages, title: 'Translate', sub: 'German → English' },
];

/** Tap tokens into the right order to rebuild the German sentence. */
function Build({ item, onResult }: { item: SentenceItem; onResult: (c: boolean) => void }) {
  const [pool, setPool] = useState(() => shuffle(item.tokens.map((w, i) => ({ w, k: i }))));
  const [answer, setAnswer] = useState<{ w: string; k: number }[]>([]);
  const [checked, setChecked] = useState<boolean | null>(null);

  useEffect(() => {
    setPool(shuffle(item.tokens.map((w, i) => ({ w, k: i }))));
    setAnswer([]);
    setChecked(null);
  }, [item]);

  const pick = (t: { w: string; k: number }) => {
    if (checked !== null) return;
    setAnswer((a) => [...a, t]);
    setPool((p) => p.filter((x) => x.k !== t.k));
  };
  const unpick = (t: { w: string; k: number }) => {
    if (checked !== null) return;
    setPool((p) => [...p, t]);
    setAnswer((a) => a.filter((x) => x.k !== t.k));
  };
  const check = () => {
    const correct = norm(answer.map((a) => a.w).join(' ')) === norm(item.tokens.join(' '));
    setChecked(correct);
    onResult(correct);
  };

  return (
    <div>
      <div
        className="card min-h-[92px] flex flex-wrap content-start gap-2 p-4"
        style={
          checked === null
            ? undefined
            : { borderColor: checked ? 'var(--good)' : 'var(--bad)', background: checked ? 'var(--good-soft)' : 'var(--bad-soft)' }
        }
      >
        {answer.map((t) => (
          <motion.button
            key={t.k}
            layout
            onClick={() => unpick(t)}
            className="rounded-xl px-3 py-2 text-sm font-medium"
            style={{ background: 'var(--elevated)' }}
            lang="de"
          >
            {t.w}
          </motion.button>
        ))}
      </div>

      {checked === false && (
        <p lang="de" className="text-muted mt-3 text-center text-sm">
          {item.tokens.join(' ')}
        </p>
      )}

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {pool.map((t) => (
          <motion.button
            key={t.k}
            layout
            onClick={() => pick(t)}
            className="glass rounded-xl px-3 py-2 text-sm font-medium"
            lang="de"
          >
            {t.w}
          </motion.button>
        ))}
      </div>

      {checked === null && (
        <MagneticButton
          onClick={check}
          disabled={answer.length === 0}
          className="mt-6 w-full rounded-2xl bg-accent py-4 font-semibold text-accent-ink"
        >
          Check
        </MagneticButton>
      )}
    </div>
  );
}

/** Type the German (dictation) or English (translate) answer. */
function TypeAnswer({
  item,
  mode,
  onResult,
}: {
  item: SentenceItem;
  mode: 'dictation' | 'translate';
  onResult: (c: boolean) => void;
}) {
  const ttsEnabled = useApp((s) => s.settings.ttsEnabled);
  const [value, setValue] = useState('');
  const [result, setResult] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const target = mode === 'dictation' ? item.de : item.en;

  useEffect(() => {
    setValue('');
    setResult(null);
    inputRef.current?.focus();
    if (mode === 'dictation' && ttsEnabled) {
      const t = setTimeout(() => speak(item.de, 'de-DE'), 300);
      return () => clearTimeout(t);
    }
  }, [item, mode, ttsEnabled]);

  const submit = () => {
    if (result !== null || !value.trim()) return;
    const correct = isAnswerCorrect(value.trim(), target, 3);
    setResult(correct);
    onResult(correct);
  };

  return (
    <div>
      <div className="card mb-6 px-6 py-8 text-center">
        {mode === 'dictation' ? (
          <>
            <p className="eyebrow text-faint mb-4">type what you hear</p>
            <button
              onClick={() => speak(item.de, 'de-DE')}
              className="glass mx-auto flex h-14 w-14 items-center justify-center rounded-full"
              style={{ color: 'var(--accent)' }}
              aria-label="Play again"
            >
              <Volume2 size={22} />
            </button>
          </>
        ) : (
          <>
            <p className="eyebrow text-faint mb-3">translate to English</p>
            <p lang="de" className="display text-[22px] leading-snug">
              {item.de}
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        disabled={result !== null}
        placeholder="your answer…"
        lang={mode === 'dictation' ? 'de' : undefined}
        autoCapitalize={mode === 'dictation' ? 'off' : 'sentences'}
        autoCorrect="off"
        className="glass w-full rounded-2xl px-5 py-4 outline-none placeholder:text-faint"
        style={{ borderColor: result === null ? 'var(--line-strong)' : result ? 'var(--good)' : 'var(--bad)', borderWidth: 1 }}
      />

      {result === null ? (
        <MagneticButton onClick={submit} disabled={!value.trim()} className="mt-4 w-full rounded-2xl bg-accent py-4 font-semibold text-accent-ink">
          Check
        </MagneticButton>
      ) : (
        <div
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-center font-semibold"
          style={{ background: result ? 'var(--good-soft)' : 'var(--bad-soft)', color: result ? 'var(--good)' : 'var(--bad)' }}
        >
          {result ? <Check size={18} /> : <X size={18} />}
          <span lang={mode === 'dictation' ? 'de' : undefined}>{result ? 'Correct' : target}</span>
        </div>
      )}
    </div>
  );
}

export default function Sentence() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'setup' | 'playing'>('setup');
  const [mode, setMode] = useState<Mode>('build');
  const [level, setLevel] = useState<CEFRLevel | 'all'>('all');
  const [count, setCount] = useState(12);
  const [items, setItems] = useState<SentenceItem[]>([]);
  const [advancing, setAdvancing] = useState(false);

  const session = useQuizSession(items.length);
  const current = items[session.index];
  const maxWords = useMemo(() => (mode === 'build' ? 9 : 12), [mode]);

  const start = async () => {
    const set = await buildSentenceSet(level, count, maxWords);
    setItems(set);
    session.reset();
    setAdvancing(false);
    setPhase('playing');
  };

  const onResult = (correct: boolean) => {
    if (advancing) return;
    setAdvancing(true);
    session.submit(correct, correct ? undefined : { id: `sentence-${current.id}`, de: current.de, en: current.en });
    setTimeout(() => {
      session.advance();
      setAdvancing(false);
    }, 1300);
  };

  if (phase === 'setup') {
    return (
      <div className="min-h-[80vh]">
        <h1 className="display mb-1 text-[30px]">Sentence Lab</h1>
        <p className="text-muted mb-7">Real sentences, three ways.</p>

        <div className="mb-7 space-y-2.5">
          {MODES.map((m) => (
            <Pressable
              key={m.id}
              onClick={() => setMode(m.id)}
              className="card flex w-full items-center gap-4 px-5 py-4 text-left"
              style={mode === m.id ? { borderColor: 'var(--accent)', background: 'var(--accent-soft)' } : undefined}
            >
              <m.icon size={20} style={{ color: mode === m.id ? 'var(--accent)' : 'var(--muted)' }} />
              <span>
                <span className="block font-semibold">{m.title}</span>
                <span className="text-faint text-sm">{m.sub}</span>
              </span>
            </Pressable>
          ))}
        </div>

        <div className="mb-6">
          <p className="eyebrow text-faint mb-3">level</p>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <Pressable
                key={l}
                onClick={() => setLevel(l)}
                className="mono rounded-xl px-4 py-2 text-sm font-semibold"
                style={level === l ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : { background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--line)' }}
              >
                {l === 'all' ? 'All' : l}
              </Pressable>
            ))}
          </div>
        </div>

        <div className="mb-9">
          <p className="eyebrow text-faint mb-3">sentences</p>
          <div className="flex gap-2">
            {COUNTS.map((c) => (
              <Pressable
                key={c}
                onClick={() => setCount(c)}
                className="mono flex-1 rounded-xl py-3 font-semibold"
                style={count === c ? { background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)' } : { background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--line)' }}
              >
                {c}
              </Pressable>
            ))}
          </div>
        </div>

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
        {mode === 'build' ? (
          <Build item={current} onResult={onResult} />
        ) : (
          <TypeAnswer item={current} mode={mode} onResult={onResult} />
        )}
      </motion.div>
    </QuizShell>
  );
}
