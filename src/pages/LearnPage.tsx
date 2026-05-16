import { Link } from 'react-router-dom';
import { allDecks } from '../content/decks';
import { BookOpen, ArrowRight } from 'lucide-react';
import { allPhase2Sections } from '../content/phase2Content';

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
type CefrLevel = (typeof LEVEL_ORDER)[number];

const LearnPage = () => {
  const phase1Decks = allDecks
    .filter((deck) => !deck.id.startsWith('phase2'))
    .sort((a, b) => {
      const aLevel = LEVEL_ORDER.indexOf((a.level ?? 'A1') as CefrLevel);
      const bLevel = LEVEL_ORDER.indexOf((b.level ?? 'A1') as CefrLevel);

      if (aLevel !== bLevel) {
        return aLevel - bLevel;
      }

      return a.name.localeCompare(b.name);
    });

  const groupedPhase1Decks = LEVEL_ORDER.map((level) => ({
    level,
    decks: phase1Decks.filter((deck) => deck.level === level),
  })).filter((group) => group.decks.length > 0);

  const renderDeck = (deck: typeof allDecks[0]) => (
    <Link
      key={deck.id}
      to={`/deck/${deck.id}`}
      className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="text-blue-500" size={22} />
            <h2 className="text-xl font-semibold">{deck.name}</h2>
            {deck.level && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {deck.level}
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{deck.description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">{deck.cards.length} cards</p>
        </div>
        <ArrowRight className="text-gray-400 flex-shrink-0 mt-1" size={22} />
      </div>
    </Link>
  );

  const renderPhase2Section = (section: typeof allPhase2Sections[0]) => {
    const deck = allDecks.find((d) => d.id === section.deckId);

    return (
      <div key={section.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="text-blue-500" size={22} />
            <h3 className="text-xl font-semibold">{section.title}</h3>
            {deck?.level && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                {deck.level}
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{section.description}</p>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">📚 Key Rule:</h4>
            <p className="text-gray-700 dark:text-gray-300">{section.rule}</p>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">💡 Key Points:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              {section.keyPoints.map((point, idx) => (
                <li key={idx} className="text-sm">{point}</li>
              ))}
            </ul>
          </div>
        </div>

        {deck && (
          <Link
            to={`/deck/${section.deckId}`}
            className="block p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-1">⚡ Practice Now → Flashcards</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{deck.cards.length} cards ready to practice</p>
              </div>
              <ArrowRight className="text-blue-500 flex-shrink-0" size={28} />
            </div>
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Learn</h1>
        <p className="text-gray-600 dark:text-gray-400">Master German through structured learning: Learn → Practice → Flashcards</p>
      </header>

      <section className="space-y-4">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Phase 1: Fundamentals</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Now sorted by level (A1 → C2)</p>
        </div>

        <div className="space-y-6">
          {groupedPhase1Decks.map((group) => (
            <div key={group.level} className="space-y-3">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-500 dark:text-gray-400">{group.level}</h3>
              <div className="space-y-4">{group.decks.map(renderDeck)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Phase 2: Applied Learning</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Daily routines, verb structures, and real-world usage.</p>
        </div>

        <div className="space-y-6">{allPhase2Sections.map(renderPhase2Section)}</div>
      </section>
    </div>
  );
};

export default LearnPage;
