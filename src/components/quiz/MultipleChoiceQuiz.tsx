import { useEffect, useState } from 'react';
import type { Card } from '../../types';
import { speak } from '../../utils/tts';
import { useAppStore } from '../../stores/appStore';
import { sfxAnswer } from '../../utils/sfx';

interface MultipleChoiceQuizProps {
  card: Card;
  options: string[];
  onAnswer: (correct: boolean) => void;
}

const MultipleChoiceQuiz = ({ card, options, onAnswer }: MultipleChoiceQuizProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const ttsEnabled = useAppStore((s) => s.settings.ttsEnabled);

  // Pronounce each new German prompt automatically.
  useEffect(() => {
    if (ttsEnabled) {
      const id = setTimeout(() => speak(card.de, 'de-DE'), 300);
      return () => clearTimeout(id);
    }
  }, [card.id, card.de, ttsEnabled]);

  const handleSelect = (option: string) => {
    if (showResult) return;
    
    setSelected(option);
    setShowResult(true);
    
    const isCorrect = option === card.en;
    sfxAnswer(isCorrect);
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelected(null);
      setShowResult(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card p-8">
        <h3 className="text-xl font-semibold mb-6 text-center">
          What does this mean?
        </h3>

        <div className="mb-6 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-center">
          <p className="text-2xl font-bold">
            {card.article && (
              <span className="text-brand-600 dark:text-brand-400 mr-2">
                {card.article}
              </span>
            )}
            {card.de}
          </p>
        </div>

        <div className="space-y-3">
          {options.map((option, index) => {
            const isSelected = selected === option;
            const isCorrect = option === card.en;
            
            let bgColor = 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600';
            if (showResult && isSelected) {
              bgColor = isCorrect
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white';
            } else if (showResult && isCorrect) {
              bgColor = 'bg-green-500 text-white';
            }

            return (
              <button
                key={index}
                className={`w-full p-4 rounded-lg font-medium transition-all duration-150 active:scale-[0.98] ${bgColor}`}
                onClick={() => handleSelect(option)}
                disabled={showResult}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceQuiz;
