import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, CheckCircle, Flame, Zap } from 'lucide-react';
import type { Card } from '../types';
import { getDailyBatch, WORDS_PER_DAY } from '../content/dailyWords';
import { useAppStore } from '../stores/appStore';
import { initializeSrsRecord, updateSrsRecordOnReview } from '../utils/srs';
import Flashcard from '../components/flashcards/Flashcard';
import MultipleChoiceQuiz from '../components/quiz/MultipleChoiceQuiz';
import TypeInQuiz from '../components/quiz/TypeInQuiz';
import ModeToggle, { type QuizMode } from '../components/quiz/ModeToggle';
import BackButton from '../components/BackButton';
import { buildChoiceOptions } from '../utils/quizOptions';

/**
 * Today's words: 50 new words per day, resuming mid-batch across visits.
 * Every answered card persists the cursor, feeds the SRS system, awards XP,
 * and keeps the daily streak alive — even for partial sessions.
 */
const TodayPage = () => {
  const {
    dailyReview,
    rolloverDaily,
    advanceDailyCursor,
    updateSrsRecord,
    getSrsRecord,
    progress,
    updateProgress,
    recordSession,
    recordMistake,
  } = useAppStore();

  const [batch, setBatch] = useState<Card[] | null>(null);
  const [mode, setMode] = useState<QuizMode>('flashcard');
  const [xpToday, setXpToday] = useState(0);

  // Start a fresh batch when the stored one belongs to an earlier day.
  useEffect(() => {
    rolloverDaily();
  }, [rolloverDaily]);

  useEffect(() => {
    if (dailyReview.date) {
      getDailyBatch(dailyReview.dayStart).then(setBatch);
    }
  }, [dailyReview.date, dailyReview.dayStart]);

  const position = dailyReview.cursor - dailyReview.dayStart;
  const total = batch?.length ?? WORDS_PER_DAY;
  const doneForToday = batch !== null && position >= total;
  const currentCard = batch?.[position];

  const handleAnswer = (correct: boolean) => {
    if (!currentCard) return;

    // Feed the SRS system so these words come back in "Review due".
    let record = getSrsRecord(currentCard.id);
    if (!record) record = initializeSrsRecord(currentCard.id);
    updateSrsRecord(updateSrsRecordOnReview(record, correct));

    if (correct && record.box === 1) {
      updateProgress({ wordsLearned: progress.wordsLearned + 1 });
    }
    if (!correct) {
      recordMistake({
        id: `vocab-${currentCard.id}`,
        de: currentCard.article
          ? `${currentCard.article} ${currentCard.de}`
          : currentCard.de,
        en: currentCard.en,
        source: 'vocab',
      });
    }

    // Per-card XP/streak so partial sessions still count for the day.
    setXpToday((xp) => xp + recordSession(correct ? 1 : 0, 1));
    advanceDailyCursor();
  };

  const mcOptions = (): string[] => {
    if (!batch || !currentCard) return [];
    return buildChoiceOptions(currentCard, batch);
  };

  if (!batch) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-gray-400">
        Loading today's words…
      </div>
    );
  }

  // ----- Done for today -----
  if (doneForToday) {
    return (
      <div className="max-w-xl mx-auto text-center py-10 space-y-6 animate-fade-in-up">
        <CheckCircle className="mx-auto text-green-500" size={72} />
        <h1 className="text-3xl font-bold">Done for today! 🎉</h1>
        <p className="text-gray-600 dark:text-gray-400">
          You went through {total} words. Come back tomorrow for the next{' '}
          {WORDS_PER_DAY}.
        </p>
        <div className="flex justify-center gap-3">
          <span className="chip bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300">
            <Flame size={16} /> {progress.streak}-day streak
          </span>
          {xpToday > 0 && (
            <span className="chip bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
              <Zap size={16} /> +{xpToday} XP
            </span>
          )}
        </div>
        <div className="space-y-3">
          <Link to="/weak" className="btn-primary block w-full max-w-sm mx-auto py-3">
            Fix weak spots
          </Link>
          <Link
            to="/"
            className="btn block w-full max-w-sm mx-auto py-3 bg-gray-500 hover:bg-gray-600 text-white"
          >
            Home
          </Link>
        </div>
      </div>
    );
  }

  // ----- Session -----
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <BackButton />
        <span className="chip text-xs bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
          <CalendarCheck size={14} /> Today's words
        </span>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {position + 1} / {total}
        </div>
      </header>

      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-brand-500 to-violet-500 h-full transition-all duration-300"
          style={{ width: `${(position / total) * 100}%` }}
        />
      </div>

      <ModeToggle mode={mode} onChange={setMode} />

      {currentCard && mode === 'flashcard' && (
        <Flashcard card={currentCard} onAnswer={handleAnswer} />
      )}
      {currentCard && mode === 'multiple-choice' && (
        <MultipleChoiceQuiz
          card={currentCard}
          options={mcOptions()}
          onAnswer={handleAnswer}
        />
      )}
      {currentCard && mode === 'type-in' && (
        <TypeInQuiz card={currentCard} onAnswer={handleAnswer} />
      )}

      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
        Progress saves automatically — leave and pick up where you stopped.
      </p>
    </div>
  );
};

export default TodayPage;
