import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';
import type { CEFRLevel } from '../types';
import { loadVocabularyByLevel, type LevelSummary } from '../content/vocabulary';

const LEVEL_ACCENT: Record<CEFRLevel, string> = {
  A1: 'bg-green-500',
  A2: 'bg-teal-500',
  B1: 'bg-blue-500',
  B2: 'bg-indigo-500',
  C1: 'bg-purple-500',
};

const VocabularyPage = () => {
  const [levels, setLevels] = useState<LevelSummary[] | null>(null);
  const [active, setActive] = useState<CEFRLevel>('A1');

  useEffect(() => {
    let mounted = true;
    loadVocabularyByLevel().then((data) => {
      if (mounted) setLevels(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!levels) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Loading vocabulary…
        </p>
      </div>
    );
  }

  const activeLevel = levels.find((l) => l.level === active)!;
  const totalWords = levels.reduce((sum, l) => sum + l.wordCount, 0);

  return (
    <div className="space-y-6">
      <header className="mb-2">
        <h1 className="text-3xl font-bold mb-2">Vocabulary</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {totalWords.toLocaleString()} words across CEFR levels A1–C1, ordered by
          frequency. Pick a level, then a set.
        </p>
      </header>

      {/* Level selector */}
      <div className="flex flex-wrap gap-2">
        {levels.map((l) => (
          <button
            key={l.level}
            onClick={() => setActive(l.level)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              active === l.level
                ? `${LEVEL_ACCENT[l.level]} text-white`
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {l.level}
            <span className="ml-2 text-xs opacity-80">{l.wordCount}</span>
          </button>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-1">{activeLevel.label}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {activeLevel.wordCount} words · {activeLevel.decks.length} sets
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {activeLevel.decks.map((deck) => (
            <Link
              key={deck.id}
              to={`/deck/${deck.id}`}
              className="card-interactive block p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Layers className="text-brand-500 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold">{deck.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {deck.cards.length} cards
                    </p>
                  </div>
                </div>
                <ArrowRight className="text-gray-400 flex-shrink-0" size={20} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VocabularyPage;
