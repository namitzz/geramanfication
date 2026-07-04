import { useEffect, useMemo, useState } from 'react';
import { Sparkles, Volume2, Wand2, Pickaxe, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CEFRLevel, Card } from '../types';
import {
  analyze,
  loadLexicon,
  splitCompound,
  type Analysis,
  type AnalyzedWord,
  type CompoundPart,
  type LexEntry,
} from '../content/nlp';
import { POS_MAP } from '../content/vocabulary';
import { speak } from '../utils/tts';
import { useAppStore } from '../stores/appStore';

/** Build a practice card from a lexicon entry (id keyed by the German word). */
function toMinedCard(entry: LexEntry): Card {
  return {
    id: `mined-${entry.de.toLowerCase()}`,
    de: entry.de,
    en: entry.en,
    partOfSpeech: POS_MAP[entry.pos],
    article:
      entry.gender === 'der' || entry.gender === 'die' || entry.gender === 'das'
        ? entry.gender
        : undefined,
    level: entry.level,
    frequencyRank: entry.freq,
  };
}

const EXAMPLE =
  'Ich heiße Anna und wohne in Berlin. Ich lerne Deutsch, weil es mir gefällt.';

const LEVEL_COLOR: Record<CEFRLevel, string> = {
  A1: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  A2: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  B1: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  B2: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  C1: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
};
const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

const AnalyzerPage = () => {
  const [lexicon, setLexicon] = useState<Map<string, LexEntry> | null>(null);
  const [text, setText] = useState(EXAMPLE);
  const [debounced, setDebounced] = useState(EXAMPLE);
  const [selected, setSelected] = useState<AnalyzedWord | null>(null);

  const { minedWords, addMinedWord, removeMinedWord } = useAppStore();
  const minedCount = Object.keys(minedWords).length;

  useEffect(() => {
    loadLexicon().then(setLexicon);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(text), 250);
    return () => clearTimeout(id);
  }, [text]);

  const analysis: Analysis | null = useMemo(
    () => (lexicon ? analyze(debounced, lexicon) : null),
    [lexicon, debounced]
  );

  const [compound, setCompound] = useState<{
    word: string;
    parts: CompoundPart[];
  } | null>(null);

  // Try to split unknown words into known compound parts (Haus+Arbeit).
  const compoundSplits = useMemo(() => {
    const map = new Map<string, CompoundPart[]>();
    if (!lexicon || !analysis) return map;
    for (const word of analysis.unknown) {
      if (map.has(word)) continue;
      const parts = splitCompound(word, lexicon);
      if (parts) map.set(word, parts);
    }
    return map;
  }, [lexicon, analysis]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles size={28} className="text-brand-500" />
          Analyzer
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Paste German text — get a word-by-word breakdown.
        </p>
      </header>

      <div className="card p-4 space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Type or paste German…"
          className="w-full p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-brand-500 focus:outline-none resize-y"
        />
        <button
          onClick={() => setText(EXAMPLE)}
          className="btn text-sm px-3 py-1.5 bg-gray-100 dark:bg-gray-700"
        >
          <Wand2 size={15} /> Load example
        </button>
      </div>

      {!lexicon && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          Loading lexicon…
        </p>
      )}

      {analysis && analysis.totalWords > 0 && (
        <>
          {/* Coverage summary */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="font-semibold">
                {analysis.knownWords} / {analysis.totalWords} words recognized
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {Math.round(analysis.coverage * 100)}% coverage
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-300"
                style={{ width: `${analysis.coverage * 100}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {LEVELS.map((l) =>
                analysis.levelCounts[l] > 0 ? (
                  <span key={l} className={`chip text-xs ${LEVEL_COLOR[l]}`}>
                    {l}: {analysis.levelCounts[l]}
                  </span>
                ) : null
              )}
            </div>
          </div>

          {/* Annotated text */}
          <div className="card p-4 leading-loose text-lg">
            {analysis.tokens.map((t, i) => {
              if (!t.isWord) return <span key={i}>{t.text}</span>;
              const a = t.annotation!;
              if (!a.entry) {
                const parts = compoundSplits.get(t.text);
                if (parts) {
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setCompound({ word: t.text, parts });
                        setSelected(null);
                      }}
                      className="rounded px-1 mx-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 underline decoration-dotted transition-colors hover:brightness-95"
                      title="Compound word — tap to split"
                    >
                      {t.text}
                    </button>
                  );
                }
                return (
                  <span
                    key={i}
                    className="underline decoration-dotted decoration-gray-400 text-gray-500 dark:text-gray-400"
                    title="Not in dictionary"
                  >
                    {t.text}
                  </span>
                );
              }
              return (
                <button
                  key={i}
                  onClick={() => {
                    setSelected(a);
                    setCompound(null);
                  }}
                  className={`rounded px-1 mx-0.5 transition-colors ${LEVEL_COLOR[a.entry.level]} hover:brightness-95`}
                >
                  {t.text}
                </button>
              );
            })}
          </div>

          {/* Selected word detail */}
          {selected?.entry && (
            <div className="card p-5 animate-fade-in-up">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {selected.entry.gender && (
                      <span className="text-brand-600 dark:text-brand-400 font-semibold">
                        {selected.entry.gender}
                      </span>
                    )}
                    <h3 className="text-2xl font-bold">{selected.entry.de}</h3>
                    <button
                      onClick={() => speak(selected.entry!.de)}
                      className="p-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full"
                      aria-label="Pronounce"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">
                    {selected.entry.en}
                  </p>
                  {selected.lemma && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      matched base form of “{selected.text}”
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`chip text-xs ${LEVEL_COLOR[selected.entry.level]}`}>
                    {selected.entry.level}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {selected.entry.pos}
                  </span>
                </div>
              </div>

              {/* Vocabulary mining */}
              {(() => {
                const card = toMinedCard(selected.entry!);
                const mined = card.id in minedWords;
                return (
                  <button
                    onClick={() =>
                      mined ? removeMinedWord(card.id) : addMinedWord(card)
                    }
                    className={`btn w-full mt-4 py-2.5 text-sm ${
                      mined
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {mined ? <Check size={16} /> : <Pickaxe size={16} />}
                    {mined ? 'Saved to My Words' : 'Mine this word'}
                  </button>
                );
              })()}
            </div>
          )}

          {/* Compound word breakdown */}
          {compound && (
            <div className="card p-5 animate-fade-in-up">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-2">
                Compound word
              </p>
              <h3 className="text-2xl font-bold mb-3">
                {compound.parts.map((p, i) => (
                  <span key={i}>
                    {i > 0 && <span className="text-amber-500 mx-0.5">·</span>}
                    {p.part}
                  </span>
                ))}
              </h3>
              <div className="space-y-2">
                {compound.parts.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20"
                  >
                    <div className="flex items-center gap-2">
                      {p.entry.gender && (
                        <span className="text-brand-600 dark:text-brand-400 font-semibold text-sm">
                          {p.entry.gender}
                        </span>
                      )}
                      <span className="font-semibold">{p.entry.de}</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {p.entry.en}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mined deck link */}
          {minedCount > 0 && (
            <Link
              to="/deck/mined"
              className="card-interactive flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <Pickaxe className="text-amber-500" size={20} />
                <div>
                  <p className="font-semibold">My Mined Words</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {minedCount} saved · practice with flashcards & quizzes
                  </p>
                </div>
              </div>
              <ArrowRight className="text-gray-400" size={20} />
            </Link>
          )}

          {(() => {
            // Splittable compounds are explained above, not "not found".
            const trulyUnknown = analysis.unknown.filter(
              (w) => !compoundSplits.has(w)
            );
            return trulyUnknown.length > 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Not found: {trulyUnknown.slice(0, 15).join(', ')}
                {trulyUnknown.length > 15 ? '…' : ''}
              </p>
            ) : null;
          })()}
        </>
      )}
    </div>
  );
};

export default AnalyzerPage;
