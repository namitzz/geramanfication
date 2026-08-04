import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Volume2, Sparkles } from 'lucide-react';
import type { Card, CEFRLevel } from '../types';
import { loadVocabularyDecks } from '../content/vocabulary';
import { loadGrammarRules, type GrammarRule } from '../content/grammar';
import { loadLexicon, analyze, splitCompound, type Analysis, type LexEntry } from '../content/nlp';
import { speak } from '../utils/tts';
import { useApp } from '../store/app';
import { Stagger, Item } from '../motion/Reveal';
import { spring } from '../motion/springs';

type Seg = 'words' | 'grammar' | 'analyze';
const SEGMENTS: { id: Seg; label: string }[] = [
  { id: 'words', label: 'Words' },
  { id: 'grammar', label: 'Grammar' },
  { id: 'analyze', label: 'Analyzer' },
];
const tint: Record<string, string> = { der: '#5b8cff', die: '#ff6b9d', das: '#37d29a' };

/* ------------------------------------------------------------------ Words */
const LEVELS = ['All', 'A1', 'A2', 'B1', 'B2', 'C1'] as const;
const PAGE = 50;

function WordsPanel() {
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
            style={{ color: level === lv ? 'var(--accent)' : 'var(--faint)', borderBottom: `2px solid ${level === lv ? 'var(--accent)' : 'transparent'}` }}
          >
            {lv}
          </button>
        ))}
      </div>
      {!words ? (
        <p className="text-muted py-10 text-center text-sm">Loading…</p>
      ) : (
        <div>
          {filtered.slice(0, limit).map((w) => {
            const box = srsRecords[w.id]?.box ?? 0;
            return (
              <div key={w.id} className="flex items-center gap-3 border-b py-3" style={{ borderColor: 'var(--line)' }}>
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
                    <span key={n} className="h-1 w-2.5 rounded-full" style={{ background: n <= box ? 'var(--accent)' : 'var(--line)' }} />
                  ))}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <p className="text-muted py-10 text-center text-sm">No matches.</p>}
          {filtered.length > limit && (
            <button onClick={() => setLimit((l) => l + PAGE)} className="text-muted mt-4 w-full py-3 text-sm font-medium">
              Show more ({filtered.length - limit})
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Grammar */
function GrammarPanel() {
  const [rules, setRules] = useState<GrammarRule[] | null>(null);
  const [q, setQ] = useState('');
  useEffect(() => {
    loadGrammarRules().then(setRules);
  }, []);
  const filtered = useMemo(() => {
    if (!rules) return [];
    const s = q.trim().toLowerCase();
    if (!s) return rules;
    return rules.filter((r) => (r.rule_english + r.rule_german + r.category_name).toLowerCase().includes(s));
  }, [rules, q]);

  return (
    <div className="space-y-4">
      <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
        <Search size={18} className="text-faint" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search grammar rules…" className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint" />
      </div>
      {!rules ? (
        <p className="text-muted py-10 text-center text-sm">Loading…</p>
      ) : (
        <div className="space-y-3">
          {filtered.slice(0, 60).map((r) => (
            <div key={r.id} className="card px-5 py-4">
              <div className="mb-1 flex items-center gap-2">
                <span className="eyebrow text-accent">{r.category_name}</span>
                <span className="mono text-faint text-[10px]">{r.cefr_levels.join(' ')}</span>
              </div>
              <p className="font-medium">{r.rule_english}</p>
              {r.example_de && (
                <p lang="de" className="text-muted mt-2 text-sm italic">
                  „{r.example_de}“ <span className="text-faint not-italic">— {r.example_en}</span>
                </p>
              )}
            </div>
          ))}
          {filtered.length === 0 && <p className="text-muted py-10 text-center text-sm">No matches.</p>}
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- Analyzer */
function AnalyzerPanel() {
  const [text, setText] = useState('Ich möchte einen Termin beim Zahnarzt machen.');
  const [lexicon, setLexicon] = useState<Map<string, LexEntry> | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [selected, setSelected] = useState<{ word: string; entry?: LexEntry; parts?: { part: string; entry: LexEntry }[] } | null>(null);

  useEffect(() => {
    loadLexicon().then(setLexicon);
  }, []);

  const run = () => {
    if (!lexicon) return;
    setSelected(null);
    setAnalysis(analyze(text, lexicon));
  };

  const onWord = (word: string, entry?: LexEntry) => {
    if (!lexicon) return;
    if (entry) {
      setSelected({ word, entry });
    } else {
      const parts = splitCompound(word.toLowerCase(), lexicon);
      setSelected({ word, parts: parts ?? undefined });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-muted text-sm">Paste German — tap any word for its meaning; compound words break apart.</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        lang="de"
        className="glass w-full rounded-2xl px-4 py-3 outline-none placeholder:text-faint"
        placeholder="Paste German text…"
      />
      <button onClick={run} disabled={!lexicon} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-3 font-semibold text-accent-ink">
        <Sparkles size={18} /> Analyze
      </button>

      {analysis && (
        <>
          <div className="text-faint text-sm">
            {Math.round(analysis.coverage * 100)}% known · {analysis.knownWords}/{analysis.totalWords} words
          </div>
          <p lang="de" className="text-lg leading-relaxed">
            {analysis.tokens.map((t, i) =>
              t.isWord ? (
                <button
                  key={i}
                  onClick={() => onWord(t.text, t.annotation?.entry)}
                  className="rounded px-0.5"
                  style={{
                    color: t.annotation?.entry ? 'var(--ink)' : 'var(--accent)',
                    textDecoration: t.annotation?.entry ? 'none' : 'underline dotted',
                    textUnderlineOffset: 3,
                  }}
                >
                  {t.text}
                </button>
              ) : (
                <span key={i}>{t.text}</span>
              ),
            )}
          </p>
        </>
      )}

      {selected && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={spring.snappy} className="card px-5 py-4">
          <p lang="de" className="text-lg font-semibold">
            {selected.word}
          </p>
          {selected.entry ? (
            <p className="text-muted text-sm">
              {selected.entry.gender && selected.entry.gender !== '-' && (
                <span style={{ color: tint[selected.entry.gender] }}>{selected.entry.gender} · </span>
              )}
              {selected.entry.en}
              <span className="text-faint"> · {selected.entry.pos} · {selected.entry.level}</span>
            </p>
          ) : selected.parts && selected.parts.length ? (
            <div className="mt-1">
              <p className="text-faint mb-1 text-xs">compound</p>
              {selected.parts.map((p, i) => (
                <p key={i} className="text-muted text-sm">
                  <span lang="de" className="font-medium">
                    {p.part}
                  </span>{' '}
                  — {p.entry.en}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-faint text-sm">Not in the dictionary.</p>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default function Library() {
  const [seg, setSeg] = useState<Seg>('words');
  return (
    <Stagger className="space-y-5">
      <Item>
        <h1 className="display text-[30px]">Library</h1>
      </Item>
      <Item>
        <div className="glass relative flex rounded-2xl p-1">
          {SEGMENTS.map((s) => (
            <button key={s.id} onClick={() => setSeg(s.id)} className="relative flex-1 rounded-xl py-2 text-sm font-semibold">
              {seg === s.id && <motion.span layoutId="lib-seg" className="absolute inset-0 rounded-xl bg-accent-soft" transition={spring.snappy} />}
              <span className="relative" style={{ color: seg === s.id ? 'var(--accent)' : 'var(--muted)' }}>
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </Item>
      <Item>
        {seg === 'words' && <WordsPanel />}
        {seg === 'grammar' && <GrammarPanel />}
        {seg === 'analyze' && <AnalyzerPanel />}
      </Item>
    </Stagger>
  );
}
