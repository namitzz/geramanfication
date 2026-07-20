import { useEffect, useState } from 'react';
import type { Card } from '../../types';
import { isAnswerCorrect } from '../../utils/stringMatch';
import { speak } from '../../utils/tts';
import { useAppStore } from '../../stores/appStore';
import { Check, X } from 'lucide-react';
import { sfxAnswer } from '../../utils/sfx';

interface TypeInQuizProps {
  card: Card;
  onAnswer: (correct: boolean) => void;
}

const TypeInQuiz = ({ card, onAnswer }: TypeInQuizProps) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const ttsEnabled = useAppStore((s) => s.settings.ttsEnabled);

  // Pronounce each new German prompt automatically.
  useEffect(() => {
    if (ttsEnabled) {
      const id = setTimeout(() => speak(card.de, 'de-DE'), 300);
      return () => clearTimeout(id);
    }
  }, [card.id, card.de, ttsEnabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const correct = isAnswerCorrect(userAnswer, card.en);
    sfxAnswer(correct);
    setIsCorrect(correct);
    setShowResult(true);

    setTimeout(() => {
      onAnswer(correct);
      setUserAnswer('');
      setShowResult(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card p-8">
        <h3 className="text-xl font-semibold mb-6 text-center">
          Type the English translation
        </h3>

        <div className="mb-6 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-center">
          <p lang="de" className="text-2xl font-bold">
            {card.article && (
              <span className="text-brand-600 dark:text-brand-400 mr-2">
                {card.article}
              </span>
            )}
            {card.de}
          </p>
          {card.partOfSpeech && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
              {card.partOfSpeech}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="w-full p-4 pr-12 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:border-brand-500 dark:focus:border-brand-400"
              disabled={showResult}
              autoFocus
            />
            {showResult && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isCorrect ? (
                  <Check className="text-green-500" size={24} />
                ) : (
                  <X className="text-red-500" size={24} />
                )}
              </div>
            )}
          </div>

          {showResult && !isCorrect && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Correct answer: <strong>{card.en}</strong>
              </p>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full mt-4 py-3 px-6"
            disabled={showResult || !userAnswer.trim()}
          >
            Check Answer
          </button>
        </form>
      </div>
    </div>
  );
};

export default TypeInQuiz;
