import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, Volume2, MicOff } from 'lucide-react';
import type { CEFRLevel } from '../types';
import { buildSentenceSet, type SentenceItem } from '../content/sentences';
import { speak } from '../utils/tts';
import { isSpeechRecognitionAvailable, listenOnce } from '../utils/speech';
import { levenshteinDistance } from '../utils/stringMatch';
import { useApp } from '../store/app';
import { useQuizSession } from '../features/quiz/useQuizSession';
import QuizShell from '../features/quiz/QuizShell';
import SessionResults from '../features/quiz/SessionResults';
import MagneticButton from '../motion/MagneticButton';
import Pressable from '../motion/Pressable';
import { spring } from '../motion/springs';

const LEVELS: (CEFRLevel | 'all')[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
const PASS = 0.8;
const toWords = (s: string) =>
  s.toLowerCase().replace(/[^a-zà-ÿäöüß\s-]/gi, '').split(/\s+/).filter(Boolean);

interface WordHit {
  word: string;
  hit: boolean;
}
function scoreAttempt(target: string, transcript: string): WordHit[] {
  const words = toWords(target);
  const heard = toWords(transcript);
  let cur = 0;
  return words.map((word) => {
    for (let i = cur; i < heard.length; i++) {
      if (heard[i] === word || levenshteinDistance(heard[i], word) <= 1) {
        cur = i + 1;
        return { word, hit: true };
      }
    }
    return { word, hit: false };
  });
}

export default function Speak() {
  const navigate = useNavigate();
  const supported = useMemo(() => isSpeechRecognitionAvailable(), []);
  const ttsEnabled = useApp((s) => s.settings.ttsEnabled);

  const [phase, setPhase] = useState<'setup' | 'playing'>('setup');
  const [level, setLevel] = useState<CEFRLevel | 'all'>('A1');
  const [items, setItems] = useState<SentenceItem[]>([]);
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<WordHit[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const session = useQuizSession(items.length);
  const current = items[session.index];

  const start = async () => {
    setItems(await buildSentenceSet(level, 6, 8));
    session.reset();
    setResult(null);
    setError(null);
    setPhase('playing');
  };

  useEffect(() => {
    setResult(null);
    setError(null);
    if (phase === 'playing' && current && ttsEnabled) {
      const t = setTimeout(() => speak(current.de, 'de-DE'), 300);
      return () => clearTimeout(t);
    }
  }, [session.index, phase, current, ttsEnabled]);

  const listen = async () => {
    if (!current || listening) return;
    setError(null);
    setResult(null);
    setListening(true);
    try {
      const transcript = await listenOnce('de-DE');
      const hits = scoreAttempt(current.de, transcript);
      const ratio = hits.filter((h) => h.hit).length / Math.max(hits.length, 1);
      setResult(hits);
      session.submit(ratio >= PASS, ratio >= PASS ? undefined : { id: `speak-${current.id}`, de: current.de, en: current.en });
      setTimeout(() => {
        session.advance();
      }, 1600);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(
        msg === 'not-allowed'
          ? 'Microphone blocked — allow it in your browser settings.'
          : msg === 'no-speech'
            ? "Didn't catch that — try again a bit louder."
            : 'Speech recognition failed here. Chrome, Edge or Safari work best.',
      );
    } finally {
      setListening(false);
    }
  };

  if (!supported) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <MicOff size={48} className="text-faint mb-4" />
        <p className="display text-2xl mb-2">Speaking not available</p>
        <p className="text-muted max-w-xs">
          This browser doesn't support speech recognition. Try Chrome, Edge or Safari to practice speaking.
        </p>
      </div>
    );
  }

  if (phase === 'setup') {
    return (
      <div className="flex min-h-[80vh] flex-col justify-center">
        <h1 className="display text-[34px] mb-2">Speak & Score</h1>
        <p className="text-muted mb-8">Say the sentence out loud — scored word by word.</p>
        <p className="eyebrow text-faint mb-3">level</p>
        <div className="mb-9 flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <Pressable
              key={l}
              onClick={() => setLevel(l)}
              className="mono rounded-xl px-4 py-2 text-sm font-semibold"
              style={level === l ? { background: 'var(--accent)', color: 'var(--accent-ink)' } : { background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--line)' }}
            >
              {l}
            </Pressable>
          ))}
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
        <div className="card mb-7 px-6 py-9 text-center">
          <button
            onClick={() => speak(current.de, 'de-DE')}
            className="glass mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full"
            style={{ color: 'var(--accent)' }}
            aria-label="Hear it"
          >
            <Volume2 size={18} />
          </button>
          <p lang="de" className="display text-[24px] leading-snug">
            {result
              ? result.map((h, i) => (
                  <span key={i} style={{ color: h.hit ? 'var(--good)' : 'var(--bad)' }}>
                    {h.word}{' '}
                  </span>
                ))
              : current.de}
          </p>
          <p className="text-faint mt-3 text-sm">{current.en}</p>
        </div>

        <MagneticButton
          onClick={listen}
          disabled={listening || result !== null}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-semibold"
          style={{ background: listening ? 'var(--bad)' : 'var(--accent)', color: 'var(--accent-ink)' }}
        >
          <Mic size={20} /> {listening ? 'Listening…' : result ? 'Nice' : 'Tap & speak'}
        </MagneticButton>
        {error && <p className="mt-3 text-center text-sm" style={{ color: 'var(--bad)' }}>{error}</p>}
      </motion.div>
    </QuizShell>
  );
}
