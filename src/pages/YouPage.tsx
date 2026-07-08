import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fuchs } from '../components/Fuchs';
import { useAppStore } from '../stores/appStore';

/** Words mastered (Leitner box 5) before Fuchs is full-grown. */
const GROW_THRESHOLD = 25;
const XP_PER_LEVEL = 100;

const YouPage = () => {
  const navigate = useNavigate();
  const { progress, srsRecords, mistakes, updateOnboarding } = useAppStore();

  const mastered = useMemo(
    () => Object.values(srsRecords).filter((r) => r.box >= 5).length,
    [srsRecords]
  );
  const weakCount = Object.keys(mistakes).length;
  const grown = mastered >= GROW_THRESHOLD;

  const lvl = Math.floor(progress.xp / XP_PER_LEVEL) + 1;
  const xpIn = progress.xp % XP_PER_LEVEL;

  const leitnerCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    for (const r of Object.values(srsRecords)) counts[r.box - 1]++;
    return counts;
  }, [srsRecords]);

  /* Weekday dots: streak days ending today. */
  const week = useMemo(() => {
    const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0
    return labels.map((label, i) => {
      const daysAgo = (todayIdx - i + 7) % 7;
      const active = i <= todayIdx && daysAgo < progress.streak;
      return { label, active };
    });
  }, [progress.streak]);

  const badges = [
    {
      label: 'Week streak',
      sub: 'Seven days in a row',
      earned: progress.streak >= 7,
      icon: <path d="M12 3c1.6 3.2 4.2 4.3 4.2 7.4a4.2 4.2 0 1 1-8.4 0C7.8 8.4 8.6 7 10 6c-.2 1.6 2 2.2 2-3z" />,
    },
    {
      label: 'Century',
      sub: '100 reviews done',
      earned: progress.totalReviews >= 100,
      icon: (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12h8M12 8v8" />
        </>
      ),
    },
    {
      label: 'Wortschatz',
      sub: 'Learn 100 words',
      earned: progress.wordsLearned >= 100,
      icon: <path d="M4 5c3-1 5-1 8 1 3-2 5-2 8-1v13c-3-1-5-1-8 1-3-2-5-2-8-1z" />,
    },
    {
      label: 'Full-grown Fuchs',
      sub: `Master ${GROW_THRESHOLD} words`,
      earned: grown,
      icon: (
        <>
          <path d="M5 10 2 4l6 3M19 10l3-6-6 3" />
          <path d="M4 12a8 8 0 0 1 16 0c0 5-4 8-8 8s-8-3-8-8z" />
        </>
      ),
    },
  ];

  return (
    <div>
      <h2 className="fr mb-4 text-[26px] font-semibold" style={{ color: 'var(--ink)' }}>
        You &amp; Fuchs
      </h2>

      {/* Fuchs companion */}
      <div className="bg-grad shadow-hero mb-3 flex items-center gap-2 rounded-[22px] px-5 py-[18px]">
        <div className="fx-breathe flex-shrink-0">
          <Fuchs variant={grown ? 'grown' : 'kit'} size={86} />
        </div>
        <div className="flex-1">
          <p className="fr text-xl font-semibold text-white">
            {grown ? 'Fuchs, full-grown' : 'Fuchs, a young kit'}
          </p>
          <p className="mb-3 mt-1 text-[13px] leading-[1.35]" style={{ color: 'rgba(255,255,255,.9)' }}>
            {grown ? 'His coat is bright and sharp — you did that.' : 'Master words to help his coat grow in.'}
          </p>
          <div className="h-2 overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((mastered / GROW_THRESHOLD) * 100))}%`,
                background: 'var(--amber)',
              }}
            />
          </div>
          <p className="mt-1.5 text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,.85)' }}>
            {mastered} words mastered · {grown ? 'fully grown' : `${GROW_THRESHOLD - mastered} more to grow`}
          </p>
        </div>
      </div>

      {/* Streak strip */}
      <div className="mb-3 flex items-center gap-3.5 rounded-[18px] px-[18px] py-4" style={{ background: 'var(--amber-soft)' }}>
        <div className="flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 3c1.6 3.2 4.2 4.3 4.2 7.4a4.2 4.2 0 1 1-8.4 0C7.8 8.4 8.6 7 10 6c-.2 1.6 2 2.2 2-3z" fill="var(--amber)" />
          </svg>
          <div>
            <p className="fr text-[30px] font-semibold leading-none" style={{ color: 'var(--amber-deep)' }}>
              {progress.streak}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold" style={{ color: 'var(--muted)' }}>
              day streak
            </p>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-[5px]">
          {week.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className="h-[11px] w-[11px] rounded-full"
                style={{ background: d.active ? 'var(--amber)' : 'color-mix(in srgb, var(--amber) 25%, transparent)' }}
              />
              <span className="text-[10px] font-semibold" style={{ color: 'var(--faint)' }}>
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Level progress */}
      <div className="mb-3 rounded-[18px] p-[18px]" style={{ background: 'var(--primary-soft)' }}>
        <div className="mb-3 flex items-baseline justify-between">
          <span className="fr text-[28px] font-semibold leading-none" style={{ color: 'var(--primary-ink)' }}>
            Level {lvl}
          </span>
          <span className="text-xs font-semibold" style={{ color: 'var(--primary-ink)' }}>
            {progress.xp.toLocaleString()} XP
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full" style={{ background: 'color-mix(in srgb, var(--primary) 20%, transparent)' }}>
          <div className="bg-grad-soft h-full rounded-full" style={{ width: `${xpIn}%` }} />
        </div>
        <p className="mt-2 text-[11px] font-semibold opacity-80" style={{ color: 'var(--primary-ink)' }}>
          {XP_PER_LEVEL - xpIn} XP to level {lvl + 1}
        </p>
      </div>

      {/* Two differentiated tiles */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-[18px] p-4" style={{ background: 'var(--good-soft)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--good)' }}>
            <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          <p className="fr mt-2.5 text-[26px] font-semibold leading-none" style={{ color: 'var(--good)' }}>
            {mastered}
          </p>
          <p className="mt-1 text-xs font-semibold" style={{ color: 'var(--muted)' }}>
            words mastered
          </p>
        </div>
        <button onClick={() => navigate('/weak')} className="press rounded-[18px] p-4 text-left" style={{ background: 'var(--amber-soft)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--amber-deep)' }}>
            <path d="M7 17c-4-1-4-8 1-9 4-1 7 2 6 6-1 3-5 2-5-1 0-2 3-3 4-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="17.5" cy="7" r="1.4" fill="currentColor" />
          </svg>
          <p className="fr mt-2.5 text-[26px] font-semibold leading-none" style={{ color: 'var(--amber-deep)' }}>
            {weakCount}
          </p>
          <p className="mt-1 text-xs font-semibold" style={{ color: 'var(--muted)' }}>
            loose threads
          </p>
        </button>
      </div>

      {/* Spaced repetition boxes */}
      <p className="eyebrow mb-3" style={{ color: 'var(--faint)' }}>
        Spaced repetition
      </p>
      <div className="mb-6 flex gap-[7px]">
        {leitnerCounts.map((c, i) => (
          <div
            key={i}
            className="flex-1 rounded-[13px] px-1 py-3 text-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
          >
            <p className="fr text-xl font-semibold leading-none" style={{ color: i === 4 ? 'var(--good)' : 'var(--ink)' }}>
              {c}
            </p>
            <p className="mt-1.5 text-[9px] font-semibold" style={{ color: 'var(--faint)' }}>
              {['1 day', '3 days', '1 wk', '2 wk', '1 mo'][i]}
            </p>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <p className="eyebrow mb-2" style={{ color: 'var(--faint)' }}>
        Achievements
      </p>
      <div className="mb-6" style={{ borderTop: '1px solid var(--line)' }}>
        {badges.map((b) => (
          <div
            key={b.label}
            className="flex items-center gap-3 px-0.5 py-[13px]"
            style={{ borderBottom: '1px solid var(--line)', opacity: b.earned ? 1 : 0.55 }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: b.earned ? 'var(--primary)' : 'var(--faint)', flexShrink: 0 }}
            >
              {b.icon}
            </svg>
            <div className="flex-1">
              <p className="fr text-[15px] font-medium" style={{ color: 'var(--ink)' }}>
                {b.label}
              </p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                {b.sub}
              </p>
            </div>
            <span className="text-xs font-bold" style={{ color: b.earned ? 'var(--good)' : 'var(--faint)' }}>
              {b.earned ? '✓' : 'Locked'}
            </span>
          </div>
        ))}
      </div>

      {/* Settings + restart */}
      <div className="flex flex-col gap-2.5">
        <button
          onClick={() => navigate('/settings')}
          className="press w-full rounded-[14px] py-3 text-sm font-semibold"
          style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }}
        >
          Settings
        </button>
        <button
          onClick={() => {
            updateOnboarding({ done: false, goal: null, daily: null });
            navigate('/');
          }}
          className="press w-full rounded-[14px] py-3 text-sm font-semibold"
          style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--muted)' }}
        >
          Restart onboarding
        </button>
      </div>
    </div>
  );
};

export default YouPage;
