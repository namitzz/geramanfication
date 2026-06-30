import { Link } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { Flame, BookOpen, Layers, ArrowRight, Zap } from 'lucide-react';
import { getDueCards } from '../utils/srs';
import { allDecks } from '../content/decks';

const HomePage = () => {
  const { progress, srsRecords } = useAppStore();

  const allCardIds = allDecks.flatMap((deck) => deck.cards.map((card) => card.id));
  const dueCards = getDueCards(allCardIds, srsRecords);

  // Lightweight leveling: 100 XP per level.
  const level = Math.floor(progress.xp / 100) + 1;
  const xpIntoLevel = progress.xp % 100;

  const stats = [
    {
      icon: Flame,
      value: progress.streak,
      label: 'day streak',
      color: 'text-orange-500',
    },
    {
      icon: BookOpen,
      value: progress.wordsLearned,
      label: 'words learned',
      color: 'text-green-500',
    },
    {
      icon: Layers,
      value: dueCards.length,
      label: 'due to review',
      color: 'text-brand-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero / level card */}
      <section className="rounded-2xl p-6 bg-gradient-to-br from-brand-600 to-indigo-500 text-white shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm">Willkommen zurück 👋</p>
            <h1 className="text-2xl font-bold">Level {level}</h1>
          </div>
          <div className="chip bg-white/20 text-white">
            <Zap size={16} />
            {progress.xp} XP
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-white/25 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${xpIntoLevel}%` }}
          />
        </div>
        <p className="text-xs text-white/80 mt-2">
          {100 - xpIntoLevel} XP to Level {level + 1}
        </p>
      </section>

      {/* Stat chips */}
      <section className="grid grid-cols-3 gap-3">
        {stats.map(({ icon: Icon, value, label, color }) => (
          <div key={label} className="card p-4 text-center">
            <Icon className={`mx-auto mb-1 ${color}`} size={22} />
            <p className="text-2xl font-bold leading-tight">{value}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{label}</p>
          </div>
        ))}
      </section>

      {/* Primary actions */}
      <section className="space-y-3">
        {dueCards.length > 0 && (
          <Link
            to="/review"
            className="btn-primary w-full py-4 text-lg shadow-card"
          >
            Continue Review ({dueCards.length})
            <ArrowRight size={20} />
          </Link>
        )}
        <Link
          to="/learn"
          className="card-interactive flex items-center justify-between p-5"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="text-brand-500" size={24} />
            <div>
              <p className="font-semibold">Start Learning</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Vocabulary, grammar & sentences
              </p>
            </div>
          </div>
          <ArrowRight className="text-gray-400" size={20} />
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
