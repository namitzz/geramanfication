import { Link } from 'react-router-dom';
import { allDecks } from '../content/decks';
import { BookOpen, ArrowRight } from 'lucide-react';

const LearnPage = () => {
  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Learn</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a deck to start learning
        </p>
      </header>

      <div className="space-y-4">
        {allDecks.map((deck) => (
          <Link
            key={deck.id}
            to={`/deck/${deck.id}`}
            className="block bg-white dark:bg-gray-800 rounded-lg p-6 shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="text-blue-500" size={24} />
                  <h2 className="text-xl font-semibold">{deck.name}</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {deck.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {deck.cards.length} cards
                </p>
              </div>
              <ArrowRight className="text-gray-400 flex-shrink-0 ml-4" size={24} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LearnPage;
