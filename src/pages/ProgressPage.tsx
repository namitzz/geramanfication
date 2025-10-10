import { useAppStore } from '../stores/appStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, BookOpen, Target, TrendingUp } from 'lucide-react';

const ProgressPage = () => {
  const { progress, srsRecords } = useAppStore();

  // Calculate box distribution
  const boxDistribution = [1, 2, 3, 4, 5].map((box) => ({
    box: `Box ${box}`,
    count: Object.values(srsRecords).filter((r) => r.box === box).length,
  }));

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Progress</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your learning journey
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="text-orange-500" size={28} />
            <span className="text-sm text-gray-600 dark:text-gray-400">Streak</span>
          </div>
          <p className="text-4xl font-bold">{progress.streak}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">days in a row</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="text-blue-500" size={28} />
            <span className="text-sm text-gray-600 dark:text-gray-400">Words</span>
          </div>
          <p className="text-4xl font-bold">{progress.wordsLearned}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">learned</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3 mb-2">
            <Target className="text-green-500" size={28} />
            <span className="text-sm text-gray-600 dark:text-gray-400">Reviews</span>
          </div>
          <p className="text-4xl font-bold">{progress.totalReviews}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">completed</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-purple-500" size={28} />
            <span className="text-sm text-gray-600 dark:text-gray-400">Cards</span>
          </div>
          <p className="text-4xl font-bold">{Object.keys(srsRecords).length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">in system</p>
        </div>
      </div>

      {/* Leitner Box Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Leitner Box Distribution</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Cards in each spaced repetition box
        </p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={boxDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="box" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p>📦 Box 1: Review tomorrow</p>
          <p>📦 Box 2: Review in 3 days</p>
          <p>📦 Box 3: Review in 1 week</p>
          <p>📦 Box 4: Review in 2 weeks</p>
          <p>📦 Box 5: Review in 1 month</p>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Learning Stats</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Last Review</span>
            <span className="font-medium">
              {progress.lastReviewDate
                ? new Date(progress.lastReviewDate).toLocaleDateString()
                : 'Never'}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Total Cards</span>
            <span className="font-medium">{Object.keys(srsRecords).length}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Average Success</span>
            <span className="font-medium">
              {Object.keys(srsRecords).length > 0
                ? Math.round(
                    (Object.values(srsRecords).reduce((sum, r) => sum + r.successStreak, 0) /
                      Object.keys(srsRecords).length) *
                      100
                  ) / 100
                : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
