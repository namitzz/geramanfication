import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { allDecks } from '../content/decks';
import { useAppStore } from '../stores/appStore';
import { initializeSrsRecord, updateSrsRecordOnReview, getDueCards, gradeSrsRecord, type SrsGrade } from '../utils/srs';
import Flashcard from '../components/flashcards/Flashcard';
import MultipleChoiceQuiz from '../components/quiz/MultipleChoiceQuiz';
import TypeInQuiz from '../components/quiz/TypeInQuiz';
import ModeToggle, { type QuizMode } from '../components/quiz/ModeToggle';
import { ArrowLeft, CheckCircle } from 'lucide-react';

type Mode = QuizMode;

const ReviewPage = () => {
  const navigate = useNavigate();
  const { updateSrsRecord, getSrsRecord, progress, updateProgress, srsRecords, recordMistake } =
    useAppStore();

  // Get all cards and filter for due cards
  const allCards = allDecks.flatMap(deck => deck.cards);
  const allCardIds = allCards.map(card => card.id);
  const dueCardIds = getDueCards(allCardIds, srsRecords);
  const dueCards = allCards.filter(card => dueCardIds.includes(card.id));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<Mode>('flashcard');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // If no due cards, mark as complete
    if (dueCards.length === 0) {
      setIsComplete(true);
    }
  }, [dueCards.length]);

  if (dueCards.length === 0 || isComplete) {
    return (
      <div className="text-center py-12 space-y-6">
        <CheckCircle className="mx-auto text-green-500" size={80} />
        <h1 className="text-3xl font-bold">All Caught Up! 🎉</h1>
        <p className="text-gray-600 dark:text-gray-400">
          No cards are due for review right now. Great job!
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="btn-primary block w-full max-w-md mx-auto py-3 px-6"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate('/learn')}
            className="block w-full max-w-md mx-auto py-3 px-6 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            Browse Decks
          </button>
        </div>
      </div>
    );
  }

  const currentCard = dueCards[currentIndex];

  const handleGrade = (grade: SrsGrade) => {
    let record = getSrsRecord(currentCard.id);
    if (!record) record = initializeSrsRecord(currentCard.id);
    updateSrsRecord(gradeSrsRecord(record, grade));
    afterAnswer(grade !== 'again', record.box);
  };

  const handleAnswer = (correct: boolean) => {
    let record = getSrsRecord(currentCard.id);
    if (!record) {
      record = initializeSrsRecord(currentCard.id);
    }
    const updatedRecord = updateSrsRecordOnReview(record, correct);
    updateSrsRecord(updatedRecord);
    afterAnswer(correct, record.box);
  };

  const afterAnswer = (correct: boolean, previousBox: number) => {

    // Update progress
    if (correct) {
      updateProgress({
        totalReviews: progress.totalReviews + 1,
        wordsLearned: progress.wordsLearned + (previousBox === 1 ? 1 : 0),
      });
    } else {
      recordMistake({
        id: `vocab-${currentCard.id}`,
        de: currentCard.article
          ? `${currentCard.article} ${currentCard.de}`
          : currentCard.de,
        en: currentCard.en,
        source: 'vocab',
      });
    }

    // Move to next card or complete
    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  const generateMultipleChoiceOptions = (): string[] => {
    const correct = currentCard.en;

    // Prefer same-part-of-speech distractors so options feel related.
    const shuffled = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
    const samePos = currentCard.partOfSpeech
      ? allCards.filter((c) => c.partOfSpeech === currentCard.partOfSpeech)
      : [];
    const pool = [...shuffled(samePos), ...shuffled(allCards)];
    const distractors: string[] = [];
    for (const c of pool) {
      if (distractors.length >= 3) break;
      if (c.en !== correct && !distractors.includes(c.en)) {
        distractors.push(c.en);
      }
    }

    return [correct, ...distractors].sort(() => Math.random() - 0.5);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-3">
          {currentIndex > 0 && (
            <button
              onClick={() => setCurrentIndex(currentIndex - 1)}
              className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
            >
              ‹ Prev
            </button>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {currentIndex + 1} / {dueCards.length}
          </div>
        </div>
      </header>

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Review</h2>
      </div>

      <ModeToggle mode={mode} onChange={setMode} />

      {/* Render based on mode */}
      {mode === 'flashcard' && (
        <Flashcard card={currentCard} onGrade={handleGrade} />
      )}
      {mode === 'multiple-choice' && (
        <MultipleChoiceQuiz
          card={currentCard}
          options={generateMultipleChoiceOptions()}
          onAnswer={handleAnswer}
        />
      )}
      {mode === 'type-in' && (
        <TypeInQuiz card={currentCard} onAnswer={handleAnswer} />
      )}
    </div>
  );
};

export default ReviewPage;
