import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Card } from '../types';
import { getDailyBatch, WORDS_PER_DAY } from '../content/dailyWords';
import { loadVocabularyDecks } from '../content/vocabulary';
import { initializeSrsRecord, updateSrsRecordOnReview, isCardDue } from '../utils/srs';
import { useApp } from '../store/app';
import Flashcard from '../features/study/Flashcard';
import { spring } from '../motion/springs';

export default function Session({ mode }: { mode: 'daily' | 'review' }) {
  const navigate = useNavigate();
  const {
    daily,
    rolloverDaily,
    advanceDailyCursor,
    getSrsRecord,
    updateSrsRecord,
    recordSession,
    recordMistake,
    progress,
  } = useApp();

  const [queue, setQueue] = useState<Card[] | null>(null);
  const [index, setIndex] = useState(0); // used by review mode
  const tally = useRef({ correct: 0, total: 0, xp: 0 });

  useEffect(() => {
    if (mode === 'daily') rolloverDaily();
  }, [mode, rolloverDaily]);

  useEffect(() => {
    if (mode === 'daily') {
      getDailyBatch(daily.dayStart).then(setQueue);
    } else {
      loadVocabularyDecks().then((decks) => {
        const byId = new Map<string, Card>();
        for (const c of decks.flatMap((d) => d.cards)) byId.set(c.id, c);
        const records = useApp.getState().srsRecords;
        const due = Object.keys(records)
          .filter((id) => isCardDue(records[id]))
          .map((id) => byId.get(id))
          .filter((c): c is Card => Boolean(c));
        setQueue(due);
      });
    }
  }, [mode, daily.dayStart]);

  const position = mode === 'daily' ? daily.cursor - daily.dayStart : index;
  const total = queue?.length ?? (mode === 'daily' ? WORDS_PER_DAY : 0);
  const current = queue?.[position];

  const finish = useMemo(
    () => () =>
      navigate('/results', {
        replace: true,
        state: { ...tally.current, mode, streak: useApp.getState().progress.streak },
      }),
    [navigate, mode],
  );

  const grade = (correct: boolean) => {
    if (!current) return;
    const record = getSrsRecord(current.id) ?? initializeSrsRecord(current.id);
    const wasNew = record.box === 1;
    updateSrsRecord(updateSrsRecordOnReview(record, correct));
    if (correct && wasNew) {
      useApp.setState({ progress: { ...progress, wordsLearned: progress.wordsLearned + 1 } });
    }
    if (!correct) {
      recordMistake({
        id: `vocab-${current.id}`,
        de: current.article ? `${current.article} ${current.de}` : current.de,
        en: current.en,
      });
    }
    tally.current.correct += correct ? 1 : 0;
    tally.current.total += 1;
    tally.current.xp += recordSession(correct ? 1 : 0, 1);

    const next = position + 1;
    if (mode === 'daily') advanceDailyCursor();
    else setIndex(next);
    if (next >= (queue?.length ?? 0)) setTimeout(finish, 260);
  };

  if (!queue) {
    return <div className="py-24 text-center text-muted">Loading…</div>;
  }

  if (queue.length === 0 || position >= queue.length) {
    // review with nothing due, or daily already complete
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <p className="display text-3xl mb-2">All caught up</p>
        <p className="text-muted mb-8">Nothing to study here right now.</p>
        <button onClick={() => navigate('/')} className="rounded-2xl bg-accent px-6 py-3 font-semibold text-accent-ink">
          Back to Today
        </button>
      </div>
    );
  }

  const pct = total ? position / total : 0;

  return (
    <div className="min-h-[80vh]">
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate('/')} aria-label="Close" className="text-faint">
          <X size={22} />
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--line)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--accent)' }}
            animate={{ width: `${pct * 100}%` }}
            transition={spring.gentle}
          />
        </div>
        <span className="mono text-faint text-sm">
          {position + 1}/{total}
        </span>
      </div>

      {current && <Flashcard key={current.id} card={current} onGrade={grade} />}
    </div>
  );
}
