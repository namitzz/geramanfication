import { useEffect, useState } from 'react';
import { getLevelOffsets, type LevelOffset } from '../content/dailyWords';
import { useAppStore } from '../stores/appStore';

/**
 * Lets a learner start the daily program at their real CEFR level instead of
 * always at word #1. Highlights the level the cursor is currently in.
 */
const LevelJumper = ({ compact = false }: { compact?: boolean }) => {
  const [offsets, setOffsets] = useState<LevelOffset[]>([]);
  const cursor = useAppStore((s) => s.dailyReview.cursor);
  const jumpDailyTo = useAppStore((s) => s.jumpDailyTo);

  useEffect(() => {
    getLevelOffsets().then(setOffsets);
  }, []);

  if (offsets.length === 0) return null;

  // The current level is the last one whose offset the cursor has reached.
  const current = [...offsets].reverse().find((o) => cursor >= o.offset)?.level;

  return (
    <div className={compact ? '' : 'text-center'}>
      {!compact && (
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
          Start at your level
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        {offsets.map((o) => {
          const active = o.level === current;
          return (
            <button
              key={o.level}
              onClick={() => jumpDailyTo(o.offset)}
              aria-pressed={active}
              title={`${o.count} words · start at word ${o.offset + 1}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                active
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {o.level}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LevelJumper;
