import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Card } from '../types';
import { loadVocabularyDecks } from '../content/vocabulary';
import { buildAdaptiveSession } from '../lib/adaptive';
import { initializeSrsRecord, updateSrsRecordOnReview, isCardDue } from '../utils/srs';
import { useApp } from '../store/app';
import Flashcard from '../features/study/Flashcard';
import { spring } from '../motion/springs';

export default function Session({ mode }: { mode: 'daily' | 'review' }) {
  const navigate = useNavigate();
  const {
    rolloverDaily,
    advanceDailyCursor,
    getSrsRecord,
    updateSrsRecord,
    recordSession,
    recordMistake,
  } = useApp();

  const [queue, setQueue] = useState<Card[] | null>(null);
  const [index, setIndex] = useState(0);
  const tally = useRef({ correct: 0, total: 0, xp: 0 });

  useEffect(() => {
    if (mode === 'daily') rolloverDaily();
  }, [mode, rolloverDaily]);

  useEffect(() => {
    const { srsRecords, mistakes, settings } = useApp.getState();
    if (mode === 'daily') {
      // Adaptive: due reviews → weak spots → new frontier, capped at the goal.
      buildAdaptiveSession(settings.dailyGoal, srsRecords, mistakes).then((s) => setQueue(s.cards));
    } else {
      loadVocabularyDecks().then((decks) => {
        const byId = new Map<string, Card>();
        for (const c of decks.flatMap((d) => d.cards)) byId.set(c.id, c);
        const due = Object.keys(srsRecords)
          .filter((id) => isCardDue(srsRecords[id]))
          .map((id) => byId.get(id))
          .filter((c): c is Card => Boolean(c));
        setQueue(due);
      });
    }
  }, [mode]);

  const total = queue?.length ?? 0;
  const current = queue?.[index];

  const finish = () =>
    navigate('/results', {
      replace: true,
      state: { ...tally.current, mode, streak: useApp.getState().progress.streak },
    });

  const grade = (correct: boolean) => {
    if (!current) return;
    const existing = getSrsRecord(current.id);
    const record = existing ?? initializeSrsRecord(current.id);
    updateSrsRecord(updateSrsRecordOnReview(record, correct));
    if (correct && !existing) {
      const p = useApp.getState().progress;
      useApp.setState({ progress: { ...p, wordsLearned: p.wordsLearned + 1 } });
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
    if (mode === 'daily') advanceDailyCursor();

    const next = index + 1;
    setIndex(next);
    if (next >= total) setTimeout(finish, 260);
  };

  if (!queue) {
    return <div className="py-24 text-center text-muted">Loading…</div>;
  }

  if (queue.length === 0 || index >= queue.length) {
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

  const pct = total ? index / total : 0;

  return (
    <div className="min-h-[80vh]">
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate('/')} aria-label="Close" className="text-faint">
          <X size={22} />
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--line)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--flame-gradient)' }}
            animate={{ width: `${pct * 100}%` }}
            transition={spring.gentle}
          />
        </div>
        <span className="mono text-faint text-sm">
          {index + 1}/{total}
        </span>
      </div>

      {current && <Flashcard key={current.id} card={current} onGrade={grade} />}
    </div>
  );
}
