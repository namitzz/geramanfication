import { Link, useLocation } from 'react-router-dom';
import { FuchsMark } from '../Fuchs';
import InstallButton from '../InstallButton';
import { useAppStore } from '../../stores/appStore';

/** Streak flame (amber is reserved for Fuchs + this flame). */
const Flame = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 3c1.6 3.2 4.2 4.3 4.2 7.4a4.2 4.2 0 1 1-8.4 0C7.8 8.4 8.6 7 10 6c-.2 1.6 2 2.2 2-3z"
      fill="var(--amber)"
    />
  </svg>
);

const greeting = (): string => {
  const h = new Date().getHours();
  if (h < 5) return 'Gute Nacht';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

/**
 * Gradient header spanning the top of every main tab: brand + streak/XP +
 * theme toggle; on the Learn tab it also carries the greeting, the "The Trail"
 * title, and the daily-goal bar. The body overlaps it with a 24px radius.
 */
const GradientHeader = () => {
  const { progress, settings, updateSettings } = useAppStore();
  const isHome = useLocation().pathname === '/';

  const dayGoal = Math.max(settings.dailyGoal, 1);
  const dayPct = Math.min(100, Math.round((progress.xpToday / dayGoal) * 100));

  return (
    <header className="bg-grad relative z-20 px-[22px] pt-4 text-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <Link to="/" className="press flex items-center gap-2">
          <FuchsMark size={22} />
          <span className="fr text-[19px] font-semibold">DeutschSprint</span>
        </Link>
        <div className="flex items-center gap-3.5 text-sm font-semibold">
          <InstallButton />
          <span className="flex items-center gap-1.5" style={{ color: '#FFE4C7' }} title={`${progress.streak}-day streak`}>
            <Flame />
            {progress.streak}
          </span>
          <span style={{ color: '#E4E1FF' }} title="Today's XP toward your daily goal">
            {progress.xpToday}/{dayGoal} XP
          </span>
          <button
            onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            className="press flex h-7 w-7 items-center justify-center rounded-full border border-white/35 bg-white/10 text-[13px]"
            aria-label="Toggle theme"
          >
            {settings.darkMode ? '☀' : '☾'}
          </button>
        </div>
      </div>

      {isHome && (
        <div className="mx-auto max-w-4xl">
          <p className="mt-4 text-[13px] font-medium" style={{ color: '#D9D6FA' }}>
            {greeting()}
          </p>
          <h1 className="fr mt-0.5 text-[30px] font-semibold">The Trail</h1>
          <div className="mt-4 flex items-center gap-2.5">
            <div className="h-1.5 flex-1 overflow-hidden rounded bg-white/[0.22]">
              <div
                className="h-full rounded transition-all duration-500"
                style={{ width: `${dayPct}%`, background: 'var(--amber)' }}
              />
            </div>
            <span className="whitespace-nowrap text-xs font-semibold" style={{ color: '#E4E1FF' }}>
              Daily goal · {dayPct}%
            </span>
          </div>
        </div>
      )}

      {/* Body overlap: cream sheet with a 24px top radius. */}
      <div className="h-6" />
      <div
        className="absolute inset-x-0 -bottom-px h-6 rounded-t-3xl"
        style={{ background: 'var(--bg)' }}
      />
    </header>
  );
};

export default GradientHeader;
