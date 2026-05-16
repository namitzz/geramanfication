import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { allDecks } from '../content/decks';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { allPhase2Sections } from '../content/phase2Content';

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
type CefrLevel = (typeof LEVEL_ORDER)[number];

const DECK_LEVELS: Record<string, CefrLevel> = {
  greetings: 'A1',
  numbers: 'A1',
  days: 'A1',
  'common-verbs': 'A1',
  'a1-basics': 'A1',
  'travel-phrasebook': 'A1',
  'german-sentences': 'A2',
  nationalities: 'A1',
  family: 'A1',
  possessives: 'A1',
  languages: 'A1',
  'phase2-daily-routine-vocab': 'A2',
  'phase2-separable-inseparable': 'A2',
  'phase2-reflexive-verbs': 'A2',
  'phase2-time-expressions': 'A2',
  'phase2-wohin-wo': 'A2',
  'phase2-herr-ihssen': 'B1',
  'phase2-practice-sentences': 'B1',
};

const LearnPage = () => {
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel | 'ALL'>('ALL');

  const phase1Decks = allDecks.filter((deck) => !deck.id.startsWith('phase2'));

  const sortedPhase1Decks = useMemo(() => {
    const filtered = selectedLevel === 'ALL'
      ? phase1Decks
      : phase1Decks.filter((deck) => DECK_LEVELS[deck.id] === selectedLevel);

    return filtered.sort((a, b) => {
      const aLevel = LEVEL_ORDER.indexOf(DECK_LEVELS[a.id] ?? 'A1');
      const bLevel = LEVEL_ORDER.indexOf(DECK_LEVELS[b.id] ?? 'A1');
      if (aLevel !== bLevel) return aLevel - bLevel;
      return a.name.localeCompare(b.name);
    });
  }, [phase1Decks, selectedLevel]);

  const renderDeck = (deck: typeof allDecks[0]) => {
    const level = DECK_LEVELS[deck.id] ?? 'A1';

    return (
      <Link
        key={deck.id}
        to={`/deck/${deck.id}`}
        className="group block rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/90 dark:bg-gray-800/90 p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                <BookOpen className="text-blue-500" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{deck.name}</h2>
              <span className="text-xs font-semibold tracking-wide px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                {level}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {deck.description}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {deck.cards.length} cards
            </p>
          </div>
          <ArrowRight className="text-gray-400 group-hover:text-blue-500 flex-shrink-0 mt-1 transition-colors" size={22} />
        </div>
      </Link>
    );
  };

  const renderPhase2Section = (section: typeof allPhase2Sections[0]) => {
    const deck = allDecks.find((d) => d.id === section.deckId);
    const level = DECK_LEVELS[section.deckId] ?? 'A2';

    return (
      <div key={section.id} className="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-3">
              <BookOpen className="text-blue-500" size={24} />
              <h3 className="text-xl font-semibold">{section.title}</h3>
            </div>
            <span className="text-xs font-semibold tracking-wide px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">{level}</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{section.description}</p>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">📚 Key Rule</h4>
            <p className="text-gray-700 dark:text-gray-300">{section.rule}</p>
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
      <header className="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 p-6 bg-gradient-to-r from-white to-blue-50/60 dark:from-gray-800 dark:to-gray-800/80">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} className="text-blue-500" />
          <h1 className="text-3xl font-bold">Learn</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Structured German learning with CEFR level sorting and focused practice.
        </p>
      </header>

      <section className="space-y-4">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Phase 1: Fundamentals</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sorted by level (A1 → C2). Pick a level for focused study.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['ALL', ...LEVEL_ORDER] as const).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 text-sm rounded-full border transition-colors ${selectedLevel === level
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-blue-400 text-gray-700 dark:text-gray-300'
              }`}
            >
              {level === 'ALL' ? 'All Levels' : level}
            </button>
          ))}
        </div>

        <div className="space-y-4">{sortedPhase1Decks.map(renderDeck)}</div>
      </section>

      <section className="space-y-4">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Phase 2: Applied Learning</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Learn the concept → practice immediately with flashcards.</p>
        </div>

        <div className="space-y-6">{allPhase2Sections.map(renderPhase2Section)}</div>
      </section>
    </div>
  );
};

export default LearnPage;
