import { Link } from 'react-router-dom';
import { allDecks } from '../content/decks';
import { BookOpen, ArrowRight, FileText } from 'lucide-react';

const LearnPage = () => {
  // Separate Phase 1 and Phase 2 decks
  const phase1Decks = allDecks.filter(deck => !deck.id.startsWith('phase2'));
  const phase2Decks = allDecks.filter(deck => deck.id.startsWith('phase2'));

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

  return (
    <div className="space-y-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Learn</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Progress through phases to build your German language skills
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
            <span className="font-semibold">Continuation of Phase 1</span> – Build fluency with daily routines, 
            complex verb structures, and real-world reading comprehension
          </p>
        </div>
        
        {/* Phase 2 Focus Areas */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
            Phase 2 Focus Areas:
          </h3>
          <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>• Daily routines (Alltagsroutine) with authentic contexts</li>
            <li>• Separable, inseparable, and reflexive verbs in practice</li>
            <li>• Time expressions (12-hour and 24-hour formats)</li>
            <li>• Reading comprehension: Herr Ihßen – Ein Tag im Leben eines Journalisten</li>
            <li>• Retrieval practice and active recall exercises</li>
            <li>• Writing tasks and error correction</li>
          </ul>
        </div>

        {/* Phase 2 Decks */}
        <div className="space-y-4">
          {phase2Decks.map(renderDeck)}
        </div>

        {/* Phase 2 Materials Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="text-blue-500" size={24} />
            <h3 className="text-xl font-semibold">Phase 2 Additional Materials</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Supplementary materials to enhance your Phase 2 learning experience:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">📄</span>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>sokrates hausaufgabe.docx</strong> – Homework assignments for daily routines
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">📄</span>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Retrieval Practice – Tägliche Routine.pdf</strong> – Active recall exercises
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">📄</span>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Herr Ihßen.pdf</strong> – Reading comprehension about a journalist's day
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">📄</span>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Herr Ihßen (1).pdf</strong> – Additional reading materials
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">📊</span>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Meine Alltagsroutine.pptx</strong> – Visual presentation on daily routines
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">📝</span>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Test Your German.pdf</strong> – Comprehensive Phase 2 assessment
              </span>
            </li>
          </ul>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
            Materials are available in the <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">public/phase2</code> directory
          </p>
        </div>
      </section>
    </div>
  );
};

export default LearnPage;
