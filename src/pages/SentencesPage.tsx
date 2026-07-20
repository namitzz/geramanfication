import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MessageSquareText,
  Volume2,
  Check,
  X,
  Shuffle,
  Languages,
  Ear,
} from 'lucide-react';
import type { CEFRLevel } from '../types';
import {
  buildSentenceSet,
  getSentenceLevelCounts,
  type SentenceItem,
} from '../content/sentences';
import { speak, isTTSAvailable } from '../utils/tts';
import { isAnswerCorrect } from '../utils/stringMatch';
import { useAppStore } from '../stores/appStore';
import SessionResults from '../components/practice/SessionResults';
import BackButton from '../components/BackButton';
import { sfxAnswer } from '../utils/sfx';

type Mode = 'build' | 'listen' | 'translate';
type Phase = 'setup' | 'playing' | 'done';

const LEVELS: (CEFRLevel | 'all')[] = ['all', 'A1', 'A2', 'B1', 'B2', 'C1'];

const MODES: { id: Mode; label: string; icon: typeof Shuffle; blurb: string }[] = [
  { id: 'build', label: 'Build the sentence', icon: Shuffle, blurb: 'Tap the words into the right order' },
  { id: 'listen', label: 'Listen & type', icon: Ear, blurb: 'Hear it, then type what you heard' },
  { id: 'translate', label: 'Translate', icon: Languages, blurb: 'Type the English meaning' },
];

function shuffleTokens(tokens: string[]): string[] {
  const a = [...tokens];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // Avoid an accidental already-correct order for multi-word sentences.
  if (a.length > 1 && a.join(' ') === tokens.join(' ')) return shuffleTokens(tokens);
  return a;
}

const SentencesPage = () => {
  const [phase, setPhase] = useState<Phase>('setup');
  // Deep link support: /sentences?mode=build|listen|translate (Practice rows).
  const [searchParams] = useSearchParams();
  const urlMode = searchParams.get('mode');
  const [mode, setMode] = useState<Mode>(
    urlMode === 'listen' || urlMode === 'translate' || urlMode === 'build'
      ? urlMode
      : 'build'
  );
  const [level, setLevel] = useState<CEFRLevel | 'all'>('A1');
  const [count, setCount] = useState(10);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const [items, setItems] = useState<SentenceItem[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const recordSession = useAppStore((s) => s.recordSession);
  const recordMistake = useAppStore((s) => s.recordMistake);
  const ttsEnabled = useAppStore((s) => s.settings.ttsEnabled);

  // per-question working state
  const [text, setText] = useState('');
  const [bank, setBank] = useState<string[]>([]);
  const [assembled, setAssembled] = useState<number[]>([]); // indices into bank

  useEffect(() => {
    getSentenceLevelCounts().then(setCounts);
  }, []);

  const current = items[index];

  const ttsOk = useMemo(() => isTTSAvailable(), []);

  const loadQuestion = (item: SentenceItem) => {
    setText('');
    setRevealed(false);
    setAssembled([]);
    setBank(shuffleTokens(item.tokens));
    // Listen mode must speak (it IS the exercise); translate also hears the
    // German prompt automatically. Build stays silent until checked, since
    // hearing the word order would give the answer away.
    if (mode === 'listen' || (mode === 'translate' && ttsEnabled)) {
      // Slight delay so the page is mounted before speaking.
      setTimeout(() => speak(item.de).catch(() => {}), 250);
    }
  };

  const start = async () => {
    const set = await buildSentenceSet(level, count);
    setItems(set);
    setIndex(0);
    setScore(0);
    setPhase('playing');
    if (set[0]) loadQuestion(set[0]);
  };

  const grade = () => {
    if (!current) return;
    let correct = false;
    if (mode === 'build') {
      const built = assembled.map((i) => bank[i]).join(' ');
      correct = built === current.tokens.join(' ');
    } else if (mode === 'listen') {
      correct = isAnswerCorrect(text, current.de, 3);
    } else {
      correct = isAnswerCorrect(text, current.en, 3);
    }
    setWasCorrect(correct);
    sfxAnswer(correct);
    if (correct) {
      setScore((s) => s + 1);
    } else {
      recordMistake({
        id: `sentence-${current.id}`,
        de: current.de,
        en: current.en,
        source: 'sentence',
      });
    }
    setRevealed(true);
    // Hear the correct sentence after building it — audio reinforcement.
    if (mode === 'build' && ttsEnabled) {
      speak(current.de).catch(() => {});
    }
  };

  const next = () => {
    if (index < items.length - 1) {
      const ni = index + 1;
      setIndex(ni);
      loadQuestion(items[ni]);
    } else {
      setXpEarned(recordSession(score, items.length));
      setPhase('done');
    }
  };

  // ----- Setup -----
  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <BackButton />
        <header>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <MessageSquareText size={30} className="text-brand-600" />
            Sentence Lab
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real sentences. Build, hear, or translate.
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Mode</label>
            <div className="grid gap-3 sm:grid-cols-3">
              {MODES.map(({ id, label, icon: Icon, blurb }) => {
                const disabled = id === 'listen' && !ttsOk;
                return (
                  <button
                    key={id}
                    onClick={() => setMode(id)}
                    disabled={disabled}
                    className={`p-4 rounded-lg border-2 text-left transition-colors disabled:opacity-40 ${
                      mode === id
                        ? 'border-brand-600 bg-brand-50 dark:bg-brand-800'
                        : 'border-gray-300 dark:border-gray-600 hover:border-brand-400'
                    }`}
                  >
                    <Icon size={22} className="text-brand-600 mb-2" />
                    <div className="font-semibold text-sm">{label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {disabled ? 'Audio not available' : blurb}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

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
                  {counts[l] != null && (
                    <span className="ml-2 text-xs opacity-80">{counts[l]}</span>
                  )}
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
              min={5}
              max={20}
              step={5}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            onClick={start}
            className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold text-lg transition-colors"
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  // ----- Results -----
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

  // ----- Playing -----
  if (!current) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-gray-400">
        No sentences for this selection.
        <div className="mt-4">
          <button
            onClick={() => setPhase('setup')}
            className="px-6 py-3 bg-brand-600 text-white rounded-lg font-semibold"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  const canCheck =
    mode === 'build' ? assembled.length === bank.length : text.trim().length > 0;

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

      <div key={index} className="card p-6 space-y-5 screen-in">
        {/* Prompt */}
        {mode === 'build' && (
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Build the German for:
            </p>
            <p className="text-xl font-semibold">{current.en}</p>
          </div>
        )}
        {mode === 'translate' && (
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Translate to English:
            </p>
            <p lang="de" className="text-2xl font-bold">{current.de}</p>
          </div>
        )}
        {mode === 'listen' && (
          <div className="text-center">
            <button
              onClick={() => speak(current.de).catch(() => {})}
              className="inline-flex items-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold"
            >
              <Volume2 size={22} />
              Play again
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Type what you hear (German)
            </p>
          </div>
        )}

        {/* Build mode */}
        {mode === 'build' && (
          <>
            <div className="min-h-[56px] p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-wrap gap-2">
              {assembled.map((bankIdx, pos) => (
                <button
                  key={pos}
                  disabled={revealed}
                  onClick={() => setAssembled(assembled.filter((_, p) => p !== pos))}
                  className="px-3 py-1.5 rounded-md bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300 font-medium"
                >
                  {bank[bankIdx]}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {bank.map((word, i) => {
                const used = assembled.includes(i);
                return (
                  <button
                    key={i}
                    disabled={used || revealed}
                    onClick={() => setAssembled([...assembled, i])}
                    className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                      used
                        ? 'opacity-30 bg-gray-200 dark:bg-gray-700'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Text input modes */}
        {(mode === 'listen' || mode === 'translate') && (
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={revealed}
            autoFocus
            placeholder="Type your answer…"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !revealed && canCheck) grade();
            }}
            className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:border-emerald-500"
          />
        )}

        {/* Feedback */}
        {revealed && (
          <div
            className={`p-4 rounded-lg fx-snap ${
              wasCorrect
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-red-50 dark:bg-red-900/20'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold mb-1">
              {wasCorrect ? (
                <Check className="text-green-500" size={20} />
              ) : (
                <X className="text-red-500" size={20} />
              )}
              {wasCorrect ? 'Correct!' : 'Not quite'}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              🇩🇪 {current.de}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              🇬🇧 {current.en}
            </p>
          </div>
        )}

        {/* Actions */}
        {!revealed ? (
          <button
            onClick={grade}
            disabled={!canCheck}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white rounded-lg font-semibold transition-colors"
          >
            Check
          </button>
        ) : (
          <button
            onClick={next}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold transition-colors"
          >
            {index < items.length - 1 ? 'Next' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
};

export default SentencesPage;
