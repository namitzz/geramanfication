import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Deck } from '../types';
import { getDeckById } from '../content/deckRegistry';
import { useAppStore } from '../stores/appStore';
import { initializeSrsRecord, updateSrsRecordOnReview } from '../utils/srs';
import Flashcard from '../components/flashcards/Flashcard';
import MultipleChoiceQuiz from '../components/quiz/MultipleChoiceQuiz';
import TypeInQuiz from '../components/quiz/TypeInQuiz';
import ModeToggle, { type QuizMode } from '../components/quiz/ModeToggle';
import { ArrowLeft, CheckCircle, Zap } from 'lucide-react';
import AudioDownloadButton from '../components/AudioDownloadButton';
import { buildChoiceOptions } from '../utils/quizOptions';

type Mode = QuizMode;

const DeckPage = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const {
    updateSrsRecord,
    getSrsRecord,
    progress,
    updateProgress,
    recordSession,
    recordMistake,
  } = useAppStore();

  const [deck, setDeck] = useState<Deck | undefined>();
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<Mode>('flashcard');
  const [isComplete, setIsComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setCurrentIndex(0);
    setIsComplete(false);
    setCorrectCount(0);
    setXpEarned(0);
    getDeckById(deckId ?? '').then((d) => {
      if (active) {
        setDeck(d);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [deckId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 dark:text-gray-400">Loading deck…</p>
      </div>
    );
  }

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

    // Track newly-learned words; reviews/XP/streak are tallied once at the end.
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
    const newCorrect = correctCount + (correct ? 1 : 0);
    setCorrectCount(newCorrect);

    // Move to next card or complete
    if (currentIndex < deck.cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setXpEarned(recordSession(newCorrect, deck.cards.length));
      setIsComplete(true);
    }
  };

  const generateMultipleChoiceOptions = (): string[] =>
    buildChoiceOptions(currentCard, deck.cards);

  if (isComplete) {
    return (
      <div className="text-center py-12 space-y-6">
        <CheckCircle className="mx-auto text-green-500" size={80} />
        <h1 className="text-3xl font-bold">Deck Complete! 🎉</h1>
        <p className="text-gray-600 dark:text-gray-400">
          You got {correctCount} / {deck.cards.length} correct.
        </p>
        {xpEarned > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-semibold">
            <Zap size={18} />+{xpEarned} XP
          </div>
        )}
        <div className="space-y-3">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setIsComplete(false);
              setCorrectCount(0);
              setXpEarned(0);
            }}
            className="btn-primary block w-full max-w-md mx-auto py-3 px-6"
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
            {currentIndex + 1} / {deck.cards.length}
          </div>
        </div>
      </header>

      <div className="text-center mb-4 space-y-2">
        <h2 className="text-2xl font-bold">{deck.name}</h2>
        <div className="flex justify-center">
          <AudioDownloadButton deckId={deck.id} />
        </div>
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

export default DeckPage;
