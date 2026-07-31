import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, ArrowRight } from 'lucide-react';
import type { CEFRLevel } from '../types';
import { useApp } from '../store/app';
import { computeFluency, getLevelTotals } from '../lib/adaptive';
import ProgressRing from '../motion/ProgressRing';
import Counter from '../motion/Counter';
import { Stagger, Item } from '../motion/Reveal';
import Pressable from '../motion/Pressable';
import { spring } from '../motion/springs';

export default function Fluency() {
  const navigate = useNavigate();
  const { srsRecords, mistakes } = useApp();
  const [totals, setTotals] = useState<Record<CEFRLevel, number> | null>(null);

  useEffect(() => {
    getLevelTotals().then(setTotals);
  }, []);

  const f = useMemo(
    () => (totals ? computeFluency(srsRecords, mistakes, totals) : null),
    [totals, srsRecords, mistakes],
  );

  if (!f) return <div className="py-24 text-center text-muted">Loading…</div>;

  return (
    <Stagger className="space-y-7">
      <Item>
        <h1 className="display text-[30px]">Fluency</h1>
        <p className="text-muted text-sm">How close you are to conversational — for real.</p>
      </Item>

      {/* Conversational score */}
      <Item className="flex flex-col items-center py-2">
        <ProgressRing progress={f.conversationalPct / 100} size={196} stroke={14} gradient>
          <span className="display text-5xl">
            <Counter value={f.conversationalPct} />%
          </span>
          <span className="text-faint mt-1 text-sm">to conversational</span>
        </ProgressRing>
        <p className="text-muted mt-4 text-sm">
          <span className="mono font-semibold" style={{ color: 'var(--ink)' }}>
            <Counter value={f.masteredTotal} />
          </span>{' '}
          words mastered
        </p>
      </Item>

      {/* Estimated level */}
      <Item>
        <div className="card px-5 py-5">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-faint text-sm">estimated level</span>
            <span className="mono text-2xl font-semibold" style={{ color: 'var(--accent)' }}>
              {f.estimatedLevel}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--line)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--flame-gradient)' }}
              initial={{ width: 0 }}
              animate={{ width: `${f.toNextPct}%` }}
              transition={spring.gentle}
            />
          </div>
          {f.nextLevel && (
            <p className="text-faint mt-2 text-xs">
              {f.toNextPct}% of the way to {f.nextLevel}
            </p>
          )}
        </div>
      </Item>

      {/* Per-level mastery */}
      <Item>
        <p className="eyebrow text-faint mb-3">mastery by level</p>
        <div className="card divide-y" style={{ borderColor: 'var(--line)' }}>
          {f.levels.map((l) => (
            <div key={l.level} className="flex items-center gap-3 px-5 py-3">
              <span className="mono w-8 text-sm font-semibold">{l.level}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--line)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'var(--accent)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round(l.pct * 100)}%` }}
                  transition={spring.gentle}
                />
              </div>
              <span className="mono text-faint w-16 text-right text-xs">
                {l.mastered}/{l.total}
              </span>
            </div>
          ))}
        </div>
      </Item>

      {/* Weak areas */}
      <Item>
        <p className="eyebrow text-faint mb-3">weak areas</p>
        {f.weakAreas.length === 0 ? (
          <div className="card px-5 py-5 text-sm text-muted">No weak spots yet — keep going.</div>
        ) : (
          <div className="space-y-3">
            {f.weakAreas.map((w) => (
              <Pressable
                key={w.source}
                onClick={() => navigate(w.route)}
                className="card flex w-full items-center justify-between px-5 py-4"
              >
                <span className="text-left">
                  <span className="block font-semibold">{w.source}</span>
                  <span className="text-faint text-sm">
                    {w.count} miss{w.count > 1 ? 'es' : ''} to fix
                  </span>
                </span>
                <span className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--accent)' }}>
                  Practice <ArrowRight size={16} />
                </span>
              </Pressable>
            ))}
          </div>
        )}
      </Item>

      {/* Focus */}
      <Item>
        <Pressable
          onClick={() => navigate(f.focus.route)}
          className="flex w-full items-center gap-4 rounded-3xl px-6 py-5 text-left"
          style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)' }}
        >
          <Target size={22} style={{ color: 'var(--accent)' }} />
          <span className="flex-1">
            <span className="text-faint block text-xs">focus next</span>
            <span className="font-semibold" style={{ color: 'var(--ink)' }}>
              {f.focus.label}
            </span>
          </span>
          <ArrowRight size={20} style={{ color: 'var(--accent)' }} />
        </Pressable>
      </Item>
    </Stagger>
  );
}
