import { useEffect, useMemo, useState } from 'react';
import { Search, Volume2 } from 'lucide-react';
import type { Card, CEFRLevel } from '../types';
import { loadVocabularyDecks } from '../content/vocabulary';
import { speak } from '../utils/tts';
import { useApp } from '../store/app';
import { Stagger, Item } from '../motion/Reveal';

const LEVELS = ['All', 'A1', 'A2', 'B1', 'B2', 'C1'] as const;
const PAGE = 50;
const tint: Record<string, string> = { der: '#5b8cff', die: '#ff6b9d', das: '#37d29a' };

export default function Library() {
  const srsRecords = useApp((s) => s.srsRecords);
  const [words, setWords] = useState<Card[] | null>(null);
  const [q, setQ] = useState('');
  const [level, setLevel] = useState<(typeof LEVELS)[number]>('All');
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => {
    loadVocabularyDecks().then((decks) => setWords(decks.flatMap((d) => d.cards)));
  }, []);

  const filtered = useMemo(() => {
    if (!words) return [];
    const s = q.trim().toLowerCase();
    return words.filter((w) => {
      if (level !== 'All' && (w.level ?? 'A1') !== (level as CEFRLevel)) return false;
      if (!s) return true;
      return w.de.toLowerCase().includes(s) || w.en.toLowerCase().includes(s);
    });
  }, [words, q, level]);

  return (
    <div className="space-y-4">
      <h1 className="display text-[30px]">Library</h1>

      <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
        <Search size={18} className="text-faint" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setLimit(PAGE);
          }}
          placeholder="Search German or English…"
          className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint"
        />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-1">
        {LEVELS.map((lv) => (
          <button
            key={lv}
            onClick={() => {
              setLevel(lv);
              setLimit(PAGE);
            }}
            className="mono shrink-0 pb-1 text-sm font-semibold"
            style={{
              color: level === lv ? 'var(--accent)' : 'var(--faint)',
              borderBottom: `2px solid ${level === lv ? 'var(--accent)' : 'transparent'}`,
            }}
          >
            {lv}
          </button>
        ))}
      </div>

      {!words ? (
        <p className="text-muted py-10 text-center text-sm">Loading word bank…</p>
      ) : (
        <Stagger>
          {filtered.slice(0, limit).map((w) => {
            const box = srsRecords[w.id]?.box ?? 0;
            return (
              <Item key={w.id}>
                <div className="flex items-center gap-3 border-b py-3" style={{ borderColor: 'var(--line)' }}>
                  <button onClick={() => speak(w.de, 'de-DE')} style={{ color: 'var(--accent)' }} aria-label={`Pronounce ${w.de}`}>
                    <Volume2 size={18} />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p lang="de" className="truncate font-medium">
                      {w.article && <span style={{ color: tint[w.article] }}>{w.article} </span>}
                      {w.de}
                    </p>
                    <p className="text-faint truncate text-sm">{w.en}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        className="h-1 w-2.5 rounded-full"
                        style={{ background: n <= box ? 'var(--accent)' : 'var(--line)' }}
                      />
                    ))}
                  </div>
                </div>
              </Item>
            );
          })}
          {filtered.length === 0 && <p className="text-muted py-10 text-center text-sm">No matches.</p>}
          {filtered.length > limit && (
            <button
              onClick={() => setLimit((l) => l + PAGE)}
              className="text-muted mt-4 w-full py-3 text-sm font-medium"
            >
              Show more ({filtered.length - limit})
            </button>
          )}
        </Stagger>
      )}
    </div>
  );
}
