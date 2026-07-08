import { useMemo, useState } from 'react';
import { Mic, Volume2, MicOff } from 'lucide-react';
import type { CEFRLevel } from '../types';
import { buildSentenceSet, type SentenceItem } from '../content/sentences';
import { speak } from '../utils/tts';
import { isSpeechRecognitionAvailable, listenOnce } from '../utils/speech';
import { levenshteinDistance } from '../utils/stringMatch';
import { useAppStore } from '../stores/appStore';
import SessionResults from '../components/practice/SessionResults';
import BackButton from '../components/BackButton';
import { sfxAnswer } from '../utils/sfx';

type Phase = 'setup' | 'playing' | 'done';

const LEVELS: (CEFRLevel | 'all')[] = ['all', 'A1', 'A2', 'B1', 'B2', 'C1'];
const PASS_RATIO = 0.8;

/** Lowercased, punctuation-free word list (ASR output has no reliable casing). */
const toWords = (s: string): string[] =>
  s
    .toLowerCase()
    .replace(/[^a-zà-ÿäöüß\s-]/gi, '')
    .split(/\s+/)
    .filter(Boolean);

interface WordResult {
  word: string;
  hit: boolean;
}

/** Match target words in order against the transcript (exact or 1 typo). */
function scoreAttempt(target: string, transcript: string): WordResult[] {
  const targetWords = toWords(target);
  const heard = toWords(transcript);
  let cursor = 0;
  return targetWords.map((word) => {
    for (let i = cursor; i < heard.length; i++) {
      if (heard[i] === word || levenshteinDistance(heard[i], word) <= 1) {
        cursor = i + 1;
        return { word, hit: true };
      }
    }
    return { word, hit: false };
  });
}

const SpeakPage = () => {
  const supported = useMemo(() => isSpeechRecognitionAvailable(), []);

  const [phase, setPhase] = useState<Phase>('setup');
  const [level, setLevel] = useState<CEFRLevel | 'all'>('A1');
  const [count, setCount] = useState(5);

  const [items, setItems] = useState<SentenceItem[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<WordResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recordSession = useAppStore((s) => s.recordSession);
  const recordMistake = useAppStore((s) => s.recordMistake);
  const current = items[index];

  const start = async () => {
    const set = await buildSentenceSet(level, count, 8);
    setItems(set);
    setIndex(0);
    setScore(0);
    setResult(null);
    setError(null);
    setPhase('playing');
    if (set[0]) setTimeout(() => speak(set[0].de).catch(() => {}), 300);
  };

  const listen = async () => {
    if (!current || listening) return;
    setError(null);
    setResult(null);
    setListening(true);
    try {
      const transcript = await listenOnce('de-DE');
      const words = scoreAttempt(current.de, transcript);
      const ratio = words.filter((w) => w.hit).length / words.length;
      setResult(words);
      sfxAnswer(ratio >= PASS_RATIO);
      if (ratio >= PASS_RATIO) {
        setScore((s) => s + 1);
      } else {
        recordMistake({
          id: `speak-${current.id}`,
          de: current.de,
          en: current.en,
          source: 'speak',
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'not-allowed') {
        setError('Microphone access was denied — allow it in your browser settings.');
      } else if (msg === 'no-speech') {
        setError("Didn't catch anything — try speaking a bit louder.");
      } else {
        setError('Speech recognition failed here. Chrome, Edge, or Safari work best.');
      }
    } finally {
      setListening(false);
    }
  };

  const next = () => {
    if (index < items.length - 1) {
      const ni = index + 1;
      setIndex(ni);
      setResult(null);
      setError(null);
      setTimeout(() => speak(items[ni].de).catch(() => {}), 300);
    } else {
      setXpEarned(recordSession(score, items.length));
      setPhase('done');
    }
  };

  if (!supported) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-4">
        <MicOff className="mx-auto text-gray-400" size={56} />
        <h1 className="text-2xl font-bold">Speaking practice unavailable</h1>
        <p className="text-gray-600 dark:text-gray-400">
          This browser doesn't support speech recognition. Try Chrome, Edge, or
          Safari to practice speaking German.
        </p>
      </div>
    );
  }

  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <BackButton />
        <header>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Mic size={30} className="text-brand-600" />
            Speak & Score
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Say the sentence out loud — get scored word by word.
          </p>
        </header>

        <div className="card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Level</label>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    level === l
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {l === 'all' ? 'All' : l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Sentences: {count}
            </label>
            <input
              type="range"
              min={3}
              max={15}
              step={1}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            onClick={start}
            className="btn w-full py-4 bg-brand-600 hover:bg-brand-700 text-white text-lg"
          >
            <Mic size={22} /> Start
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <SessionResults
        score={score}
        total={items.length}
        accent="brand"
        xpEarned={xpEarned}
        onRetry={start}
        onExit={() => setPhase('setup')}
      />
    );
  }

  if (!current) return null;

  const attempted = result !== null;
  const passed =
    attempted && result.filter((w) => w.hit).length / result.length >= PASS_RATIO;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 flex items-center justify-between text-sm">
        <BackButton onClick={() => setPhase('setup')} />
        <span className="text-gray-600 dark:text-gray-400">
          {index + 1} of {items.length}
        </span>
        <span className="font-semibold text-brand-600 dark:text-brand-400">
          Score: {score}
        </span>
      </div>

      <div className="mb-6 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-brand-600 h-full transition-all duration-300"
          style={{ width: `${((index + 1) / items.length) * 100}%` }}
        />
      </div>

      <div key={index} className="card p-6 space-y-6 screen-in text-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Say this sentence:
          </p>
          {/* Word-by-word coloring after an attempt */}
          <p className="text-2xl font-bold leading-relaxed">
            {attempted
              ? result.map((w, i) => (
                  <span
                    key={i}
                    className={
                      w.hit
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-500 underline decoration-wavy'
                    }
                  >
                    {w.word}{' '}
                  </span>
                ))
              : current.de}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {current.en}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => speak(current.de).catch(() => {})}
            className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full"
            aria-label="Hear it again"
          >
            <Volume2 size={22} />
          </button>
          <button
            onClick={listen}
            disabled={listening}
            className={`p-5 rounded-full text-white transition-all ${
              listening
                ? 'bg-brand-700 animate-pulse scale-110'
                : 'bg-brand-600 hover:bg-brand-700 active:scale-95'
            }`}
            aria-label="Speak now"
          >
            <Mic size={30} />
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {listening ? 'Listening… speak now' : 'Tap the mic, then speak'}
        </p>

        {error && (
          <p className="text-sm text-red-500 fx-snap">{error}</p>
        )}

        {attempted && (
          <div className="space-y-3 fx-snap">
            <p
              className={`font-semibold ${
                passed ? 'text-green-600 dark:text-green-400' : 'text-red-500'
              }`}
            >
              {passed
                ? `Sehr gut! ${result.filter((w) => w.hit).length}/${result.length} words`
                : `${result.filter((w) => w.hit).length}/${result.length} words — try the red ones again`}
            </p>
            <div className="flex justify-center gap-3">
              {!passed && (
                <button
                  onClick={listen}
                  className="btn px-5 py-2.5 bg-gray-200 dark:bg-gray-700"
                >
                  Retry
                </button>
              )}
              <button
                onClick={next}
                className="btn px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white"
              >
                {index < items.length - 1 ? 'Next' : 'Finish'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakPage;
