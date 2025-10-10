import { useState } from 'react';
import type { Card } from '../../types';

interface MultipleChoiceQuizProps {
  card: Card;
  options: string[];
  onAnswer: (correct: boolean) => void;
}

const MultipleChoiceQuiz = ({ card, options, onAnswer }: MultipleChoiceQuizProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (option: string) => {
    if (showResult) return;
    
    setSelected(option);
    setShowResult(true);
    
    const isCorrect = option === card.en;
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelected(null);
      setShowResult(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-semibold mb-6 text-center">
          What does this mean?
        </h3>
        
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <p className="text-2xl font-bold">
            {card.article && (
              <span className="text-blue-600 dark:text-blue-400 mr-2">
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
                className={`w-full p-4 rounded-lg font-medium transition-colors ${bgColor}`}
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
