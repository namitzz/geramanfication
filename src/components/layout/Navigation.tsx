import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

/* Custom identity icons (from the design handoff — not an icon library). */
const TrailIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 19c2-7 5-10 8-10s3 5 8-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="4" cy="19" r="1.6" fill="currentColor" />
    <circle cx="20" cy="6" r="1.6" fill="currentColor" />
  </svg>
);
const PracticeIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const WordsIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 5c3-1 5-1 8 1 3-2 5-2 8-1v13c-3-1-5-1-8 1-3-2-5-2-8-1z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 6v13" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const YouIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M6 8 4 3l5 3M18 8l2-5-5 3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M5 11a7 7 0 0 1 14 0c0 5-4 9-7 9s-7-4-7-9z" stroke="currentColor" strokeWidth="2" />
    <circle cx="9.5" cy="12" r="1" fill="currentColor" />
    <circle cx="14.5" cy="12" r="1" fill="currentColor" />
  </svg>
);

const TABS: { path: string; icon: ReactNode; label: string }[] = [
  { path: '/', icon: TrailIcon, label: 'Learn' },
  { path: '/practice', icon: PracticeIcon, label: 'Practice' },
  { path: '/words', icon: WordsIcon, label: 'Words' },
  { path: '/you', icon: YouIcon, label: 'You' },
];

const Navigation = () => {
  const location = useLocation();

  return (
    <nav
      className="pb-safe fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t"
      style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
    >
      <div className="flex px-2 pb-2 pt-2.5">
        {TABS.map(({ path, icon, label }) => {
          const isActive =
            path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className="press flex flex-1 flex-col items-center gap-[5px] py-1"
            >
              <span
                className="flex h-8 w-14 items-center justify-center rounded-full transition-colors"
                style={
                  isActive
                    ? { color: 'var(--primary)', background: 'var(--primary-soft)' }
                    : { color: 'var(--faint)' }
                }
              >
                {icon}
              </span>
              <span
                className="text-[11px] font-semibold"
                style={{ color: isActive ? 'var(--primary)' : 'var(--faint)' }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
