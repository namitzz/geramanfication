import { useEffect, useMemo, useState } from 'react';
import type { Card, CEFRLevel } from '../types';
import { loadVocabularyDecks } from '../content/vocabulary';
import { allDecks } from '../content/decks';
import { useAppStore } from '../stores/appStore';
import { speak } from '../utils/tts';

const LEVELS = ['All', 'A1', 'A2', 'B1', 'B2', 'C1'] as const;
type LevelFilter = (typeof LEVELS)[number];

const PAGE = 60;

/**
 * Words — the word bank. Search across the full corpus, filter by CEFR level,
 * hear any word, and see its Leitner box as a 5-segment pips bar.
 */
const WordsPage = () => {
  const srsRecords = useAppStore((s) => s.srsRecords);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<LevelFilter>('All');
  const [limit, setLimit] = useState(PAGE);
  const [vocab, setVocab] = useState<Card[] | null>(null);

  useEffect(() => {
    // Curated deck words first (the ones users actually study), then the
    // full frequency-ordered corpus.
    loadVocabularyDecks().then((decks) => {
      const curated = allDecks.flatMap((d) => d.cards);
      const corpus = decks.flatMap((d) => d.cards);
      setVocab([...curated, ...corpus]);
    });
  }, []);

  const filtered = useMemo(() => {
    if (!vocab) return [];
    const q = query.trim().toLowerCase();
    return vocab.filter((w) => {
      const levelOk = filter === 'All' || w.level === (filter as CEFRLevel) || (!w.level && filter === 'A1');
      if (!levelOk) return false;
      if (!q) return true;
      return w.de.toLowerCase().includes(q) || w.en.toLowerCase().includes(q);
    });
  }, [vocab, query, filter]);

  const boxOf = (id: string) => srsRecords[id]?.box ?? 0;

  return (
    <div>
      <h2 className="fr mb-3.5 text-[26px] font-semibold" style={{ color: 'var(--ink)' }}>
        Word bank
      </h2>

      {/* Search */}
      <div
        className="mb-3.5 flex items-center gap-2.5 rounded-[14px] px-3.5 py-3"
        style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="var(--faint)" strokeWidth="2" />
          <path d="m20 20-3-3" stroke="var(--faint)" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(PAGE);
          }}
          placeholder="Search German or English…"
          className="flex-1 bg-transparent text-[15px] font-medium outline-none"
          style={{ color: 'var(--ink)' }}
        />
      </div>

      {/* Level tabs */}
      <div className="mb-2 flex flex-wrap gap-4">
        {LEVELS.map((lv) => {
          const on = filter === lv;
          return (
            <button
              key={lv}
              onClick={() => {
                setFilter(lv);
                setLimit(PAGE);
              }}
              className="pb-1 text-[13px] font-bold tracking-wide"
              style={{
                color: on ? 'var(--primary)' : 'var(--faint)',
                borderBottom: `2px solid ${on ? 'var(--primary)' : 'transparent'}`,
              }}
            >
              {lv}
            </button>
          );
        })}
      </div>

      {/* Rows */}
      {!vocab ? (
        <p className="py-10 text-center text-sm" style={{ color: 'var(--muted)' }}>
          Loading word bank…
        </p>
      ) : (
        <>
          <div>
            {filtered.slice(0, limit).map((w) => {
              const bx = boxOf(w.id);
              return (
                <div
                  key={w.id}
                  className="flex items-center gap-3 px-0.5 py-[13px]"
                  style={{ borderBottom: '1px solid var(--line)' }}
                >
                  <button
                    onClick={() => speak(w.de)}
                    className="press flex flex-shrink-0"
                    style={{ color: 'var(--primary)' }}
                    aria-label={`Pronounce ${w.de}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M4 9h3l4-3v12l-4-3H4z" fill="currentColor" />
                      <path d="M15 8a4 4 0 0 1 0 8" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="fr text-[17px] font-medium" style={{ color: 'var(--ink)' }}>
                      {w.article ? `${w.article} ${w.de}` : w.de}
                    </p>
                    <p className="mt-px truncate text-[13px]" style={{ color: 'var(--muted)' }}>
                      {w.en}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[10px] font-bold tracking-wide" style={{ color: 'var(--primary)' }}>
                      {w.level ?? 'A1'}
                    </span>
                    <div className="flex gap-[3px]" title={bx ? `Leitner box ${bx}` : 'Not studied yet'}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          className="h-1 w-[13px] rounded-sm"
                          style={{ background: n <= bx ? 'var(--primary)' : 'var(--ring)' }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm" style={{ color: 'var(--muted)' }}>
              No words match "{query}".
            </p>
          )}
          {filtered.length > limit && (
            <button
              onClick={() => setLimit((l) => l + PAGE)}
              className="press mt-4 w-full rounded-[14px] py-3 text-sm font-semibold"
              style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--muted)' }}
            >
              Show more ({filtered.length - limit} left)
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default WordsPage;
