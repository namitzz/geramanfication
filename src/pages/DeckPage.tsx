import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allDecks } from '../content/decks';
import { useAppStore } from '../stores/appStore';
import { initializeSrsRecord, updateSrsRecordOnReview } from '../utils/srs';
import Flashcard from '../components/flashcards/Flashcard';
import MultipleChoiceQuiz from '../components/quiz/MultipleChoiceQuiz';
import TypeInQuiz from '../components/quiz/TypeInQuiz';
import { ArrowLeft, CheckCircle } from 'lucide-react';

type Mode = 'flashcard' | 'multiple-choice' | 'type-in';

const DeckPage = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { updateSrsRecord, getSrsRecord, progress, updateProgress } = useAppStore();

  const deck = allDecks.find((d) => d.id === deckId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<Mode>('flashcard');
  const [isComplete, setIsComplete] = useState(false);

  if (!deck) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 dark:text-gray-400">Deck not found</p>
      </div>
    );
  }

  const currentCard = deck.cards[currentIndex];

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
    if (currentIndex < deck.cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  const generateMultipleChoiceOptions = (): string[] => {
    const correct = currentCard.en;
    const allOptions = deck.cards
      .filter((c) => c.id !== currentCard.id)
      .map((c) => c.en);

    // Shuffle and take 3 wrong answers
    const shuffled = allOptions.sort(() => Math.random() - 0.5);
    const wrongOptions = shuffled.slice(0, 3);

    // Combine and shuffle again
    const options = [correct, ...wrongOptions].sort(() => Math.random() - 0.5);
    return options;
  };

  if (isComplete) {
    return (
      <div className="text-center py-12 space-y-6">
        <CheckCircle className="mx-auto text-green-500" size={80} />
        <h1 className="text-3xl font-bold">Deck Complete! 🎉</h1>
        <p className="text-gray-600 dark:text-gray-400">
          You've reviewed all {deck.cards.length} cards in this deck.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setIsComplete(false);
            }}
            className="block w-full max-w-md mx-auto py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
          >
            Review Again
          </button>
          <button
            onClick={() => navigate('/learn')}
            className="block w-full max-w-md mx-auto py-3 px-6 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            Back to Decks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <button
          onClick={() => navigate('/learn')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {currentIndex + 1} / {deck.cards.length}
        </div>
      </header>

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">{deck.name}</h2>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 justify-center mb-6">
        <button
          onClick={() => setMode('flashcard')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'flashcard'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Flashcard
        </button>
        <button
          onClick={() => setMode('multiple-choice')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'multiple-choice'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Multiple Choice
        </button>
        <button
          onClick={() => setMode('type-in')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'type-in'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Type In
        </button>
      </div>

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

export default DeckPage;
