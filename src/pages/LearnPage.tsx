import { Link } from 'react-router-dom';
import { allDecks } from '../content/decks';
import { BookOpen, ArrowRight, Library, Dumbbell, MessageSquareText, Sparkles, Timer, Magnet, Pickaxe } from 'lucide-react';
import type { Deck } from '../types';
import { useAppStore } from '../stores/appStore';

const interactiveModes = [
  {
    to: '/vocabulary',
    icon: Library,
    title: 'Vocabulary',
    blurb: '8,000+ words · A1–C1',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    to: '/grammar',
    icon: Dumbbell,
    title: 'Grammar Gym',
    blurb: 'Rules by doing',
    gradient: 'from-purple-500 to-fuchsia-600',
  },
  {
    to: '/sentences',
    icon: MessageSquareText,
    title: 'Sentence Lab',
    blurb: 'Build · listen · translate',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    to: '/analyzer',
    icon: Sparkles,
    title: 'Analyzer',
    blurb: 'Break down any German text',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    to: '/reflex',
    icon: Timer,
    title: 'Der·Die·Das',
    blurb: '45s article reflex game',
    gradient: 'from-rose-500 to-red-600',
  },
  {
    to: '/deck/cognates',
    icon: Magnet,
    title: 'Already Know',
    blurb: 'German ≈ English words',
    gradient: 'from-cyan-500 to-sky-600',
  },
];

const LearnPage = () => {
  const starterDecks = allDecks.filter((d) => !d.id.startsWith('phase2'));
  const topicDecks = allDecks.filter((d) => d.id.startsWith('phase2'));
  const minedCount = Object.keys(useAppStore((s) => s.minedWords)).length;

  const DeckCard = (deck: Deck) => (
    <Link
      key={deck.id}
      to={`/deck/${deck.id}`}
      className="card-interactive flex items-center justify-between p-4"
    >
      <div className="flex items-center gap-3 min-w-0">
        <BookOpen className="text-brand-500 flex-shrink-0" size={22} />
        <div className="min-w-0">
          <p className="font-semibold truncate">{deck.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {deck.cards.length} cards
          </p>
        </div>
      </div>
      <ArrowRight className="text-gray-400 flex-shrink-0" size={20} />
    </Link>
  );

  return (
    <div className="space-y-8">
      {/* Interactive practice modes */}
      <section className="grid grid-cols-2 sm:grid-cols-3 gap-3 stagger">
        {interactiveModes.map(({ to, icon: Icon, title, blurb, gradient }) => (
          <Link
            key={to}
            to={to}
            className={`rounded-2xl p-4 bg-gradient-to-br ${gradient} text-white shadow-card transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]`}
          >
            <Icon size={24} className="mb-2" />
            <h2 className="font-semibold leading-tight">{title}</h2>
            <p className="text-[11px] text-white/85">{blurb}</p>
          </Link>
        ))}
      </section>

      {minedCount > 0 && (
        <Link
          to="/deck/mined"
          className="card-interactive flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <Pickaxe className="text-amber-500" size={22} />
            <div>
              <p className="font-semibold">My Mined Words</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {minedCount} words you saved from the Analyzer
              </p>
            </div>
          </div>
          <ArrowRight className="text-gray-400" size={20} />
        </Link>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Starter decks
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 stagger">
          {starterDecks.map(DeckCard)}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          More topics
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 stagger">
          {topicDecks.map(DeckCard)}
        </div>
      </section>
    </div>
  );
};

export default LearnPage;
