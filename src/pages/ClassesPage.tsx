import { useState, useEffect, useCallback } from 'react';
import { Volume2, Star, Search, RotateCw, Check, X, ArrowLeft, ArrowRight, BookOpen, GraduationCap, ChevronDown } from 'lucide-react';
import { speak, getGermanVoice } from '../utils/tts';
import { isAnswerCorrect } from '../utils/stringMatch';
import lessonsData from '../content/classes/lessons.json';

interface Lesson {
  id: string;
  de: string;
  en: string;
  topic: string;
  notes?: string;
  type: string;
}

type QuizMode = 'multiple-choice' | 'type-in';
type ViewMode = 'flashcards' | 'quiz';

const ClassesPage = () => {
  // Lessons and filtering
  const [lessons] = useState<Lesson[]>(lessonsData);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>(lessonsData);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());
  const [showOnlyStarred, setShowOnlyStarred] = useState(false);

  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>('flashcards');

  // Flashcard state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(false);

  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizMode, setQuizMode] = useState<QuizMode>('multiple-choice');
  const [quizQuestions, setQuizQuestions] = useState<Lesson[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [showQuizFeedback, setShowQuizFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [mistakes, setMistakes] = useState<Lesson[]>([]);
  const [reviewingMistakes, setReviewingMistakes] = useState(false);

  // Audio state
  const [hasGermanVoice, setHasGermanVoice] = useState(true);
  const [showVoiceWarning, setShowVoiceWarning] = useState(false);

  // Load starred items from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('classes-starred');
    if (stored) {
      setStarredIds(new Set(JSON.parse(stored)));
    }
  }, []);

  // Check for German voice on mount
  useEffect(() => {
    const checkVoice = () => {
      const germanVoice = getGermanVoice();
      setHasGermanVoice(germanVoice !== null);
      if (germanVoice === null) {
        setShowVoiceWarning(true);
        setTimeout(() => setShowVoiceWarning(false), 5000);
      }
    };

    // Wait for voices to load
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', checkVoice, { once: true });
    } else {
      checkVoice();
    }
  }, []);

  // Get unique topics
  const topics = ['all', ...Array.from(new Set(lessons.map(l => l.topic)))];

  // Filter lessons based on topic, search, and starred
  useEffect(() => {
    let filtered = lessons;

    if (selectedTopic !== 'all') {
      filtered = filtered.filter(l => l.topic === selectedTopic);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(l =>
        l.de.toLowerCase().includes(query) ||
        l.en.toLowerCase().includes(query) ||
        (l.notes && l.notes.toLowerCase().includes(query))
      );
    }

    if (showOnlyStarred) {
      filtered = filtered.filter(l => starredIds.has(l.id));
    }

    if (shuffled) {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }

    setFilteredLessons(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedTopic, searchQuery, showOnlyStarred, shuffled, lessons, starredIds]);

  // Keyboard shortcuts
  useEffect(() => {
    if (showQuiz) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          setIsFlipped(f => !f);
          break;
        case 'arrowleft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'arrowright':
          e.preventDefault();
          handleNext();
          break;
        case 'a':
          e.preventDefault();
          if (filteredLessons[currentIndex]) {
            handleSpeak(filteredLessons[currentIndex].de);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, filteredLessons, showQuiz]);

  const toggleStar = (id: string) => {
    const newStarred = new Set(starredIds);
    if (newStarred.has(id)) {
      newStarred.delete(id);
    } else {
      newStarred.add(id);
    }
    setStarredIds(newStarred);
    localStorage.setItem('classes-starred', JSON.stringify(Array.from(newStarred)));
  };

  const handleSpeak = async (text: string) => {
    try {
      await speak(text, 'de-DE');
    } catch (error) {
      console.error('TTS error:', error);
      if (!hasGermanVoice) {
        setShowVoiceWarning(true);
        setTimeout(() => setShowVoiceWarning(false), 5000);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredLessons.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const startQuiz = useCallback((mode: QuizMode) => {
    const questions = selectedTopic === 'all'
      ? [...filteredLessons].sort(() => Math.random() - 0.5).slice(0, 10)
      : [...filteredLessons].sort(() => Math.random() - 0.5).slice(0, Math.min(10, filteredLessons.length));
    
    setQuizQuestions(questions);
    setQuizMode(mode);
    setShowQuiz(true);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizTotal(0);
    setMistakes([]);
    setQuizAnswer('');
    setShowQuizFeedback(false);
  }, [filteredLessons, selectedTopic]);

  const generateMCOptions = (correct: Lesson): string[] => {
    const options = [correct.en];
    const otherLessons = lessons.filter(l => l.id !== correct.id);
    
    while (options.length < 4 && otherLessons.length > 0) {
      const random = otherLessons[Math.floor(Math.random() * otherLessons.length)];
      if (!options.includes(random.en)) {
        options.push(random.en);
      }
      otherLessons.splice(otherLessons.indexOf(random), 1);
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

  const checkMCAnswer = (selected: string) => {
    const currentQuestion = quizQuestions[currentQuizIndex];
    const correct = selected === currentQuestion.en;
    
    setIsCorrect(correct);
    setShowQuizFeedback(true);
    setQuizTotal(quizTotal + 1);
    
    if (correct) {
      setQuizScore(quizScore + 1);
    } else {
      setMistakes([...mistakes, currentQuestion]);
    }

    setTimeout(() => {
      if (currentQuizIndex < quizQuestions.length - 1) {
        setCurrentQuizIndex(currentQuizIndex + 1);
        setShowQuizFeedback(false);
      } else {
        // Quiz complete
        setShowQuizFeedback(false);
      }
    }, 1500);
  };

  const checkTypeInAnswer = () => {
    const currentQuestion = quizQuestions[currentQuizIndex];
    const correct = isAnswerCorrect(quizAnswer.trim(), currentQuestion.en, 3);
    
    setIsCorrect(correct);
    setShowQuizFeedback(true);
    setQuizTotal(quizTotal + 1);
    
    if (correct) {
      setQuizScore(quizScore + 1);
    } else {
      setMistakes([...mistakes, currentQuestion]);
    }

    setTimeout(() => {
      if (currentQuizIndex < quizQuestions.length - 1) {
        setCurrentQuizIndex(currentQuizIndex + 1);
        setQuizAnswer('');
        setShowQuizFeedback(false);
      } else {
        // Quiz complete
        setShowQuizFeedback(false);
      }
    }, 1500);
  };

  const reviewMistakes = () => {
    setReviewingMistakes(true);
    setFilteredLessons(mistakes);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowQuiz(false);
  };

  const currentLesson = filteredLessons[currentIndex];

  if (showQuiz && currentQuizIndex < quizQuestions.length) {
    const currentQuestion = quizQuestions[currentQuizIndex];
    const mcOptions = quizMode === 'multiple-choice' ? generateMCOptions(currentQuestion) : [];

    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              setShowQuiz(false);
              setViewMode('quiz');
            }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft size={20} />
            <span>Back to Quiz Options</span>
          </button>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Score: {quizScore}/{quizTotal}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Question {currentQuizIndex + 1} of {quizQuestions.length}
            </span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {quizMode === 'multiple-choice' ? 'Multiple Choice' : 'Type In'}
            </span>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold">{currentQuestion.de}</h2>
              <button
                onClick={() => handleSpeak(currentQuestion.de)}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
                aria-label="Pronounce"
              >
                <Volume2 size={20} />
              </button>
            </div>
          </div>

          {quizMode === 'multiple-choice' ? (
            <div className="space-y-3">
              {mcOptions.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => checkMCAnswer(option)}
                  disabled={showQuizFeedback}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    showQuizFeedback && option === currentQuestion.en
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : showQuizFeedback
                      ? 'border-gray-300 dark:border-gray-600 opacity-50'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                value={quizAnswer}
                onChange={(e) => setQuizAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !showQuizFeedback && checkTypeInAnswer()}
                placeholder="Type the English translation..."
                disabled={showQuizFeedback}
                className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none"
                autoFocus
              />
              <button
                onClick={checkTypeInAnswer}
                disabled={showQuizFeedback || !quizAnswer.trim()}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
              >
                Submit Answer
              </button>
            </div>
          )}

          {showQuizFeedback && (
            <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <Check className="text-green-600 dark:text-green-400" size={24} />
                    <span className="text-green-600 dark:text-green-400 font-semibold">Correct!</span>
                  </>
                ) : (
                  <>
                    <X className="text-red-600 dark:text-red-400" size={24} />
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      Incorrect. The answer is: {currentQuestion.en}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showQuiz && currentQuizIndex >= quizQuestions.length) {
    // Quiz complete
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <GraduationCap className="mx-auto text-blue-500 mb-4" size={80} />
          <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
          <p className="text-xl mb-6">
            Your Score: {quizScore} / {quizTotal} ({Math.round((quizScore / quizTotal) * 100)}%)
          </p>
          
          {mistakes.length > 0 && (
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                You missed {mistakes.length} {mistakes.length === 1 ? 'question' : 'questions'}
              </p>
              <button
                onClick={reviewMistakes}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors"
              >
                Review Mistakes
              </button>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => startQuiz(quizMode)}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => {
                setShowQuiz(false);
                setViewMode('quiz');
              }}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              Back to Quiz Options
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BookOpen size={32} />
          Classes
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Learn German with interactive flashcards and quizzes
        </p>
      </div>

      {/* Voice Warning */}
      {showVoiceWarning && (
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            💡 No German voice detected. Install a German voice in your OS/browser settings for native TTS pronunciation.
          </p>
        </div>
      )}

      {/* Mode Selection */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => {
            setViewMode('flashcards');
            setShowQuiz(false);
          }}
          className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${
            viewMode === 'flashcards'
              ? 'bg-blue-500 text-white shadow-lg scale-105'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <BookOpen size={24} />
            <span>Flashcards</span>
          </div>
        </button>
        <button
          onClick={() => {
            setViewMode('quiz');
            setShowQuiz(false);
          }}
          className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${
            viewMode === 'quiz'
              ? 'bg-green-500 text-white shadow-lg scale-105'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <GraduationCap size={24} />
            <span>Quiz Yourself</span>
          </div>
        </button>
      </div>

      {/* Flashcards View */}
      {viewMode === 'flashcards' && !showQuiz && (
        <div>
          {/* How to Use */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">How to Use:</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Press <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded">Space</kbd> to flip cards</li>
              <li>• Use <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded">←</kbd> <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded">→</kbd> to navigate</li>
              <li>• Press <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded">A</kbd> to play audio</li>
              <li>• Star difficult items to review later</li>
            </ul>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lessons..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="relative">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                {topics.map(topic => (
                  <option key={topic} value={topic}>
                    {topic === 'all' ? 'All Topics' : topic.replace('_', ' ').replace('week1 ', 'Week 1: ')}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>

            <button
              onClick={() => setShuffled(!shuffled)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                shuffled
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              🔀 Shuffle
            </button>

            <button
              onClick={() => setShowOnlyStarred(!showOnlyStarred)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showOnlyStarred
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              ⭐ Starred
            </button>
          </div>

          {/* Flashcard Display */}
          {filteredLessons.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No lessons found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 min-h-[300px] flex flex-col justify-between cursor-pointer transition-transform hover:scale-105"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  {!isFlipped ? (
                    <>
                      <div className="mb-4 w-full">
                        <h2 className="text-3xl font-bold mb-2">{currentLesson.de}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          {currentLesson.topic.replace('_', ' ').replace('week1 ', 'Week 1: ')} • {currentLesson.type}
                        </p>
                      </div>
                      <button
                        className="mt-4 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(currentLesson.de);
                        }}
                        aria-label="Pronounce word"
                      >
                        <Volume2 size={24} />
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-3xl font-bold mb-2 text-green-600 dark:text-green-400">
                        {currentLesson.en}
                      </h2>
                      {currentLesson.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 italic">
                          💡 {currentLesson.notes}
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

              {/* Navigation */}
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <ArrowLeft size={20} />
                  Previous
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentIndex + 1} / {filteredLessons.length}
                  </span>
                  <button
                    onClick={() => toggleStar(currentLesson.id)}
                    className={`p-2 rounded-full transition-colors ${
                      starredIds.has(currentLesson.id)
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    }`}
                    aria-label="Star this card"
                  >
                    <Star size={20} fill={starredIds.has(currentLesson.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === filteredLessons.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Next
                  <ArrowRight size={20} />
                </button>
              </div>

              {/* Progress Info */}
              <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="font-semibold mb-2">Progress</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Lessons:</span>
                    <span className="font-semibold">{lessons.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Starred:</span>
                    <span className="font-semibold">{starredIds.size}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Quiz View */}
      {viewMode === 'quiz' && !showQuiz && (
        <div>
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="font-semibold mb-2 text-green-900 dark:text-green-100">Quiz Mode</h3>
            <p className="text-sm text-green-800 dark:text-green-200">
              Test your knowledge with interactive quizzes. Choose between multiple choice or type-in format.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lessons..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="relative">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                {topics.map(topic => (
                  <option key={topic} value={topic}>
                    {topic === 'all' ? 'All Topics' : topic.replace('_', ' ').replace('week1 ', 'Week 1: ')}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>

            <button
              onClick={() => setShowOnlyStarred(!showOnlyStarred)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showOnlyStarred
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              ⭐ Starred
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="font-semibold mb-2 text-lg">Multiple Choice</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Choose the correct English translation from 4 options
              </p>
              <button
                onClick={() => startQuiz('multiple-choice')}
                disabled={filteredLessons.length < 4}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
              >
                Start Multiple Choice Quiz
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="font-semibold mb-2 text-lg">Type-In</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Type the English translation (fuzzy matching enabled)
              </p>
              <button
                onClick={() => startQuiz('type-in')}
                disabled={filteredLessons.length === 0}
                className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
              >
                Start Type-In Quiz
              </button>
            </div>
          </div>

          {reviewingMistakes && mistakes.length > 0 && (
            <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
              <h3 className="font-semibold mb-2 text-yellow-900 dark:text-yellow-100">
                Reviewing Mistakes
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-4">
                You're now reviewing {mistakes.length} items you got wrong. Star them for later!
              </p>
              <button
                onClick={() => {
                  setReviewingMistakes(false);
                  setFilteredLessons(lessons);
                }}
                className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors"
              >
                Back to All Lessons
              </button>
            </div>
          )}

          {/* Progress Info */}
          <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-2">Progress</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Lessons:</span>
                <span className="font-semibold">{lessons.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Starred:</span>
                <span className="font-semibold">{starredIds.size}</span>
              </div>
              {quizTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Last Score:</span>
                  <span className="font-semibold">
                    {quizScore}/{quizTotal} ({Math.round((quizScore / quizTotal) * 100)}%)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesPage;
