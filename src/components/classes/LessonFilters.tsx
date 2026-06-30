import { Search, ChevronDown } from 'lucide-react';
import { formatTopic } from '../../content/classes/types';

interface Props {
  searchQuery: string;
  onSearch: (q: string) => void;
  topics: string[];
  selectedTopic: string;
  onTopic: (t: string) => void;
  showOnlyStarred: boolean;
  onToggleStarred: () => void;
  shuffled?: boolean;
  onToggleShuffle?: () => void;
}

/** Search + topic + starred (+ optional shuffle) controls, shared by both views. */
const LessonFilters = ({
  searchQuery,
  onSearch,
  topics,
  selectedTopic,
  onTopic,
  showOnlyStarred,
  onToggleStarred,
  shuffled,
  onToggleShuffle,
}: Props) => (
  <div className="mb-6 flex flex-wrap gap-3">
    <div className="relative flex-1 min-w-[200px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search lessons…"
        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:border-brand-500 focus:outline-none"
      />
    </div>

    <div className="relative">
      <select
        value={selectedTopic}
        onChange={(e) => onTopic(e.target.value)}
        className="appearance-none pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:border-brand-500 focus:outline-none cursor-pointer"
      >
        {topics.map((topic) => (
          <option key={topic} value={topic}>
            {formatTopic(topic)}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
    </div>

    {onToggleShuffle && (
      <button
        onClick={onToggleShuffle}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          shuffled ? 'bg-brand-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        🔀 Shuffle
      </button>
    )}

    <button
      onClick={onToggleStarred}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        showOnlyStarred ? 'bg-yellow-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      ⭐ Starred
    </button>
  </div>
);

export default LessonFilters;
