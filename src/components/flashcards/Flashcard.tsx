import { useEffect, useState } from 'react';
import type { Card } from '../../types';
import { Volume2, RotateCw } from 'lucide-react';
import { speak } from '../../utils/tts';
import { useAppStore } from '../../stores/appStore';

interface FlashcardProps {
  card: Card;
  onAnswer: (correct: boolean) => void;
}

const Flashcard = ({ card, onAnswer }: FlashcardProps) => {
  const [flipped, setFlipped] = useState(false);
  const { settings } = useAppStore();

  // New card -> always start on the German side (never leak the answer).
  useEffect(() => {
    setFlipped(false);
  }, [card.id]);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (settings.ttsEnabled) speak(card.de, 'de-DE');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 3D flip card */}
      <div
        className="flip-scene relative min-h-[300px] cursor-pointer"
        onClick={() => setFlipped((f) => !f)}
        role="button"
        aria-label={flipped ? 'Show German side' : 'Reveal translation'}
      >
        <div className={`flip-inner relative min-h-[300px] ${flipped ? 'is-flipped' : ''}`}>
          {/* Front: German */}
          <div className="flip-face absolute inset-0 card p-8 flex flex-col justify-between">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <h2 className="text-3xl font-bold mb-2">
                {card.article && (
                  <span className="text-brand-600 dark:text-brand-400 mr-2">
                    {card.article}
                  </span>
                )}
                {card.de}
              </h2>
              {card.partOfSpeech && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  {card.partOfSpeech}
                </p>
              )}
              <button
                className="mt-6 p-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full transition-colors"
                onClick={handleSpeak}
                aria-label="Pronounce word"
              >
                <Volume2 size={24} />
              </button>
            </div>
            <div className="flex items-center justify-center mt-4 text-gray-400 dark:text-gray-500">
              <RotateCw size={18} className="mr-2" />
              <span className="text-sm">Tap to flip</span>
            </div>
          </div>

          {/* Back: English */}
          <div className="flip-face flip-back absolute inset-0 card p-8 flex flex-col justify-between">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <h2 className="text-3xl font-bold mb-2 text-green-600 dark:text-green-400">
                {card.en}
              </h2>
              {card.exampleDe && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
                  🇩🇪 {card.exampleDe}
                </p>
              )}
              {card.note && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 italic">
                  💡 {card.note}
                </p>
              )}
            </div>
            <div className="flex items-center justify-center mt-4 text-gray-400 dark:text-gray-500">
              <RotateCw size={18} className="mr-2" />
              <span className="text-sm">Tap to flip back</span>
            </div>
          </div>
        </div>
      </div>

      {flipped && (
        <div className="flex gap-4 mt-6 animate-fade-in-up">
          <button
            className="btn flex-1 py-3 bg-red-500 hover:bg-red-600 text-white"
            onClick={() => onAnswer(false)}
          >
            Again
          </button>
          <button
            className="btn flex-1 py-3 bg-green-500 hover:bg-green-600 text-white"
            onClick={() => onAnswer(true)}
          >
            Got it!
          </button>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
