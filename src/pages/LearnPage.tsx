import { Link } from 'react-router-dom';
import { allDecks } from '../content/decks';
import { BookOpen, ArrowRight } from 'lucide-react';
import { allPhase2Sections } from '../content/phase2Content';

const LearnPage = () => {
  // Separate Phase 1 and Phase 2 decks
  const phase1Decks = allDecks.filter(deck => !deck.id.startsWith('phase2'));

  const renderDeck = (deck: typeof allDecks[0]) => (
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
  );
  
  const renderPhase2Section = (section: typeof allPhase2Sections[0]) => {
    // Find the corresponding deck
    const deck = allDecks.find(d => d.id === section.deckId);
    
    return (
      <div key={section.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {/* Learn Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="text-blue-500" size={24} />
            <h3 className="text-xl font-semibold">{section.title}</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {section.description}
          </p>
          
          {/* Rule */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
              📚 Key Rule:
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              {section.rule}
            </p>
          </div>
          
          {/* Key Points */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              💡 Key Points:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              {section.keyPoints.map((point, idx) => (
                <li key={idx} className="text-sm">{point}</li>
              ))}
            </ul>
          </div>
          
          {/* Examples */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              ✨ Examples:
            </h4>
            <div className="space-y-2">
              {section.examples.slice(0, 3).map((example, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-sm">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    🇩🇪 {example.de}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    🇬🇧 {example.en}
                  </p>
                  {example.note && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 italic">
                      {example.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Practice Link */}
        {deck && (
          <Link
            to={`/deck/${section.deckId}`}
            className="block p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-1">
                  ⚡ Practice Now → Flashcards
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {deck.cards.length} cards ready to practice
                </p>
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
        <p className="text-gray-600 dark:text-gray-400">
          Master German through structured learning: Learn → Practice → Flashcards
        </p>
      </header>

      {/* Phase 1 Section */}
      <section className="space-y-4">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Phase 1: Fundamentals
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Build your foundation with essential vocabulary, grammar, and phrases
          </p>
        </div>
        <div className="space-y-4">
          {phase1Decks.map(renderDeck)}
        </div>
      </section>

      {/* Phase 2 Section */}
      <section className="space-y-4">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Phase 2: Applied Learning
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Daily routines, verb structures, and real-world usage. <span className="font-semibold">Every section links to practice.</span>
          </p>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>💡 Phase 2 = Phase 1 Structure:</strong> Each section below follows the exact same flow:
            <strong> Learn the concept → Practice with flashcards</strong>. No passive reading!
          </p>
        </div>

        {/* Phase 2 Learning Sections */}
        <div className="space-y-6">
          {allPhase2Sections.map(renderPhase2Section)}
        </div>
      </section>
    </div>
  );
};

export default LearnPage;
