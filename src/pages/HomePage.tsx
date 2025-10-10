import { Link } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { Flame, Target, BookOpen } from 'lucide-react';
import { getDueCards } from '../utils/srs';
import { allDecks } from '../content/decks';

const HomePage = () => {
  const { progress, settings, srsRecords } = useAppStore();

  // Calculate total due cards across all decks
  const allCardIds = allDecks.flatMap(deck => deck.cards.map(card => card.id));
  const dueCards = getDueCards(allCardIds, srsRecords);

  return (
    <div className="space-y-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">🇩🇪 DeutschSprint</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Learn German with flashcards & spaced repetition
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="text-orange-500" size={24} />
            <span className="text-sm text-gray-600 dark:text-gray-400">Streak</span>
          </div>
          <p className="text-3xl font-bold">{progress.streak}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">days</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-blue-500" size={24} />
            <span className="text-sm text-gray-600 dark:text-gray-400">Daily Goal</span>
          </div>
          <p className="text-3xl font-bold">{settings.dailyGoal}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">words/day</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="text-green-500" size={24} />
            <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-bold">{progress.wordsLearned}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">words learned</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{dueCards.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">due for review</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {dueCards.length > 0 && (
          <Link
            to="/review"
            className="block w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-center transition-colors shadow-lg"
          >
            Continue Review ({dueCards.length} cards)
          </Link>
        )}

        <Link
          to="/learn"
          className="block w-full py-4 px-6 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-center transition-colors"
        >
          Browse Decks
        </Link>

        <Link
          to="/grammar"
          className="block w-full py-4 px-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold text-center transition-colors"
        >
          Grammar Lessons
        </Link>
      </div>

      {/* Today's Goal Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Today's Progress</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Math.min(progress.totalReviews, settings.dailyGoal)} / {settings.dailyGoal}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{
              width: `${Math.min((progress.totalReviews / settings.dailyGoal) * 100, 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
