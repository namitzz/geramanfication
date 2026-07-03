import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { allDecks } from '../content/decks';
import { useAppStore } from '../stores/appStore';
import { initializeSrsRecord, updateSrsRecordOnReview, getDueCards } from '../utils/srs';
import Flashcard from '../components/flashcards/Flashcard';
import MultipleChoiceQuiz from '../components/quiz/MultipleChoiceQuiz';
import TypeInQuiz from '../components/quiz/TypeInQuiz';
import ModeToggle, { type QuizMode } from '../components/quiz/ModeToggle';
import { ArrowLeft, CheckCircle } from 'lucide-react';

type Mode = QuizMode;

const ReviewPage = () => {
  const navigate = useNavigate();
  const { updateSrsRecord, getSrsRecord, progress, updateProgress, srsRecords } = useAppStore();

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

  const handleAnswer = (correct: boolean) => {
    // Get or initialize SRS record
    let record = getSrsRecord(currentCard.id);
    if (!record) {
      record = initializeSrsRecord(currentCard.id);
    }

    // Update SRS record
    const updatedRecord = updateSrsRecordOnReview(record, correct);
    updateSrsRecord(updatedRecord);

    // Update progress
    if (correct) {
      updateProgress({
        totalReviews: progress.totalReviews + 1,
        wordsLearned: progress.wordsLearned + (record.box === 1 ? 1 : 0),
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

    // Distinct distractors that differ from the correct answer.
    const distractors = [
      ...new Set(allCards.map((c) => c.en).filter((en) => en !== correct)),
    ]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

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
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {currentIndex + 1} / {dueCards.length}
        </div>
      </header>

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Review</h2>
      </div>

      <ModeToggle mode={mode} onChange={setMode} />

      {/* Render based on mode */}
      {mode === 'flashcard' && (
        <Flashcard card={currentCard} onAnswer={handleAnswer} />
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
