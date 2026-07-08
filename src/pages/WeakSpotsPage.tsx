import { useMemo, useState } from 'react';
import { Target } from 'lucide-react';
import { FuchsMini } from '../components/Fuchs';
import type { Card, Mistake } from '../types';
import { useAppStore } from '../stores/appStore';
import Flashcard from '../components/flashcards/Flashcard';
import SessionResults from '../components/practice/SessionResults';
import BackButton from '../components/BackButton';

const SOURCE_LABELS: Record<Mistake['source'], string> = {
  vocab: 'Vocabulary',
  grammar: 'Grammar',
  sentence: 'Sentences',
  cloze: 'Cloze',
  article: 'Der·Die·Das',
  classes: 'Classes',
  speak: 'Speaking',
};

const toCard = (m: Mistake): Card => ({ id: m.id, de: m.de, en: m.en });

const WeakSpotsPage = () => {
  const { mistakes, clearMistake, recordSession } = useAppStore();

  const [queue, setQueue] = useState<Mistake[] | null>(null); // null = overview
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const all = useMemo(
    () => Object.values(mistakes).sort((a, b) => b.ts - a.ts),
    [mistakes]
  );

  const bySource = useMemo(() => {
    const counts: Partial<Record<Mistake['source'], number>> = {};
    for (const m of all) counts[m.source] = (counts[m.source] ?? 0) + 1;
    return counts;
  }, [all]);

  const start = () => {
    setQueue(all);
    setIndex(0);
    setScore(0);
    setDone(false);
  };

  const handleAnswer = (correct: boolean) => {
    if (!queue) return;
    const current = queue[index];
    if (correct) {
      // Fixed it — remove from the weakness queue for good.
      clearMistake(current.id);
      setScore((s) => s + 1);
    }
    if (index < queue.length - 1) {
      setIndex(index + 1);
    } else {
      setXpEarned(recordSession(score + (correct ? 1 : 0), queue.length));
      setDone(true);
    }
  };

  // ----- Results -----
  if (done && queue) {
    return (
      <SessionResults
        score={score}
        total={queue.length}
        accent="brand"
        xpEarned={xpEarned}
        onRetry={() => {
          setQueue(null);
          setDone(false);
        }}
        onExit={() => {
          setQueue(null);
          setDone(false);
        }}
        exitLabel="Back"
      />
    );
  }

  // ----- Session -----
  if (queue && queue[index]) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {index + 1} of {queue.length}
          </span>
          <span className="chip text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {SOURCE_LABELS[queue[index].source]}
          </span>
        </div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-brand-500 h-full transition-all duration-300"
            style={{ width: `${((index + 1) / queue.length) * 100}%` }}
          />
        </div>
        <Flashcard card={toCard(queue[index])} onGrade={(g) => handleAnswer(g !== 'again')} />
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          Good or Easy reels the thread in — a comeback.
        </p>
      </div>
    );
  }

  // ----- Overview -----
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <BackButton />
      <header>
        <span className="rule-tag-amber">Comebacks</span>
        <h1 className="fr text-[24px] font-semibold mb-1.5" style={{ color: 'var(--ink)' }}>
          Chase the loose threads
        </h1>
        <p className="text-sm leading-6" style={{ color: 'var(--muted)' }}>
          Every slip becomes a thread Fuchs wants to catch. Reel one in to make
          it a comeback.
        </p>
      </header>

      {all.length === 0 ? (
        <div className="card flex flex-col items-center p-10 text-center">
          <div className="fx-breathe">
            <FuchsMini size={64} mood="sleep" />
          </div>
          <p className="fr mt-4 text-xl font-semibold" style={{ color: 'var(--ink)' }}>No loose threads</p>
          <p className="mt-1.5 max-w-[250px] text-sm leading-6" style={{ color: 'var(--muted)' }}>
            Fuchs is resting easy. Slip up in any drill and the thread lands
            here to chase.
          </p>
        </div>
      ) : (
        <>
          <div className="card p-6">
            <p className="text-4xl font-bold mb-1">{all.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              threads to chase
            </p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(bySource) as Mistake['source'][]).map((s) => (
                <span
                  key={s}
                  className="chip text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300"
                >
                  {SOURCE_LABELS[s]}: {bySource[s]}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={start}
            className="btn-primary press w-full py-4 text-lg"
          >
            <Target size={22} /> Chase them down
          </button>
        </>
      )}
    </div>
  );
};

export default WeakSpotsPage;
