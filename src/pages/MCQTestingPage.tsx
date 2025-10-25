import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCw, Trophy, Brain, ChevronDown } from 'lucide-react';
import mcqData from '../content/mcq-hard.json';

interface MCQ {
  id: string;
  question: string;
  options: string[];
  correct: number;
  category: string;
}

const MCQTestingPage = () => {
  const [questions] = useState<MCQ[]>(mcqData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredQuestions, setFilteredQuestions] = useState<MCQ[]>([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState(20);
  const [wrongAnswers, setWrongAnswers] = useState<Array<{ question: MCQ; userAnswer: number }>>([]);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(questions.map(q => q.category)))].sort();

  useEffect(() => {
    let filtered = questions;
    
    if (selectedCategory !== 'all') {
      filtered = questions.filter(q => q.category === selectedCategory);
    }
    
    // Shuffle questions
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setFilteredQuestions(shuffled.slice(0, numberOfQuestions));
  }, [selectedCategory, questions, numberOfQuestions]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setAnsweredQuestions(0);
    setQuizCompleted(false);
    setWrongAnswers([]);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    setAnsweredQuestions(answeredQuestions + 1);
    
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correct;
    
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setWrongAnswers([...wrongAnswers, { question: currentQuestion, userAnswer: answerIndex }]);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setAnsweredQuestions(0);
    setWrongAnswers([]);
  };

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  if (!quizStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Brain size={32} className="text-purple-500" />
            MCQ Testing (Hard)
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test your German knowledge with 100+ challenging multiple-choice questions
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Quiz Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Questions: {numberOfQuestions}
              </label>
              <input
                type="range"
                min="10"
                max="110"
                step="10"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>10</span>
                <span>110</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h3 className="font-semibold mb-2 text-purple-900 dark:text-purple-100">
              About This Test
            </h3>
            <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
              <li>• 110 carefully crafted questions covering basic German grammar and vocabulary</li>
              <li>• Focus on articles, cases, prepositions, verb conjugations, and more</li>
              <li>• Designed for A1-A2 level learners seeking a challenge</li>
              <li>• Instant feedback on each answer</li>
              <li>• Review wrong answers at the end</li>
            </ul>
          </div>

          <button
            onClick={startQuiz}
            disabled={filteredQuestions.length === 0}
            className="w-full mt-6 py-4 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
          >
            <Brain size={24} />
            Start Quiz
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h3 className="font-semibold mb-2">Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Total Questions:</span>
              <p className="text-2xl font-bold">{questions.length}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Categories:</span>
              <p className="text-2xl font-bold">{categories.length - 1}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / answeredQuestions) * 100);
    let message = '';
    let emoji = '';
    
    if (percentage >= 90) {
      message = 'Ausgezeichnet! Excellent!';
      emoji = '🏆';
    } else if (percentage >= 75) {
      message = 'Sehr gut! Very good!';
      emoji = '🎉';
    } else if (percentage >= 60) {
      message = 'Gut! Good!';
      emoji = '👍';
    } else if (percentage >= 40) {
      message = 'Not bad, keep practicing!';
      emoji = '💪';
    } else {
      message = 'Keep learning, you got this!';
      emoji = '📚';
    }

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <Trophy className="mx-auto text-yellow-500 mb-4" size={80} />
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {emoji} {message}
          </p>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 mb-6">
            <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {score} / {answeredQuestions}
            </div>
            <div className="text-xl text-gray-700 dark:text-gray-300">
              {percentage}% Correct
            </div>
          </div>

          {wrongAnswers.length > 0 && (
            <div className="mb-6 text-left">
              <h3 className="text-xl font-semibold mb-4">Review Wrong Answers:</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {wrongAnswers.map(({ question, userAnswer }, idx) => (
                  <div key={idx} className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <p className="font-semibold mb-2">{question.question}</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-red-600 dark:text-red-400">
                        ❌ Your answer: {question.options[userAnswer]}
                      </p>
                      <p className="text-green-600 dark:text-green-400">
                        ✓ Correct answer: {question.options[question.correct]}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 italic">
                        Category: {question.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={startQuiz}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <RotateCw size={20} />
              Try Again
            </button>
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              Back to Setup
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Question {currentQuestionIndex + 1} of {filteredQuestions.length}
        </div>
        <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">
          Score: {score}/{answeredQuestions}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-purple-500 h-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold mb-3">
            {currentQuestion.category}
          </span>
          <h2 className="text-2xl font-bold mb-6">{currentQuestion.question}</h2>
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = 'w-full p-4 text-left rounded-lg border-2 transition-all font-medium';
            
            if (showFeedback) {
              if (index === currentQuestion.correct) {
                buttonClass += ' border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
              } else if (index === selectedAnswer) {
                buttonClass += ' border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
              } else {
                buttonClass += ' border-gray-300 dark:border-gray-600 opacity-50';
              }
            } else {
              if (index === selectedAnswer) {
                buttonClass += ' border-purple-500 bg-purple-50 dark:bg-purple-900/20';
              } else {
                buttonClass += ' border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
                className={buttonClass}
              >
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-semibold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showFeedback && index === currentQuestion.correct && (
                    <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                  )}
                  {showFeedback && index === selectedAnswer && index !== currentQuestion.correct && (
                    <XCircle className="text-red-500 flex-shrink-0" size={24} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="mt-6">
            <button
              onClick={handleNext}
              className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
            >
              {currentQuestionIndex < filteredQuestions.length - 1 ? 'Next Question' : 'See Results'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MCQTestingPage;
