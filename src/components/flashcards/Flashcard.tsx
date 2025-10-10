import { useState } from 'react';
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

  const handleSpeak = async () => {
    if (settings.ttsEnabled) {
      try {
        await speak(card.de, 'de-DE');
      } catch (error) {
        console.error('TTS error:', error);
      }
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 min-h-[300px] flex flex-col justify-between cursor-pointer transition-transform hover:scale-105"
        onClick={handleFlip}
      >
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {!flipped ? (
            <>
              <div className="mb-4">
                <h2 className="text-3xl font-bold mb-2">
                  {card.article && (
                    <span className="text-blue-600 dark:text-blue-400 mr-2">
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
              </div>
              <button
                className="mt-4 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeak();
                }}
                aria-label="Pronounce word"
              >
                <Volume2 size={24} />
              </button>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-2 text-green-600 dark:text-green-400">
                {card.en}
              </h2>
              {card.note && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 italic">
                  💡 {card.note}
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-center mt-4 text-gray-400 dark:text-gray-500">
          <RotateCw size={20} className="mr-2" />
          <span className="text-sm">Tap to flip</span>
        </div>
      </div>

      {flipped && (
        <div className="flex gap-4 mt-6">
          <button
            className="flex-1 py-3 px-6 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            onClick={() => onAnswer(false)}
          >
            Again
          </button>
          <button
            className="flex-1 py-3 px-6 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
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
