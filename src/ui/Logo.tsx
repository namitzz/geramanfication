import { APP_NAME } from '../brand';

/** Flame glyph filled with the fiery gradient — the inim mark. */
export function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="inimFlame" x1="4" y1="23" x2="20" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--flame-2)" />
          <stop offset="52%" stopColor="var(--flame-3)" />
          <stop offset="100%" stopColor="var(--flame-5)" />
        </linearGradient>
      </defs>
      <path
        d="M12 23c-3.9 0-7-2.6-7-6.4 0-2.4 1.3-4.3 2.6-6C9 8.9 10.4 7.1 10 4c2.5 1.6 4.2 4 4.2 6.3 0 .9-.3 1.7-.8 2.4 1-.4 1.7-1.4 1.9-2.7 1.3 1.5 1.9 3.4 1.9 5.6 0 3.8-3.2 6.4-7.1 6.4Z"
        fill="url(#inimFlame)"
      />
    </svg>
  );
}

/** Full lockup: mark + lowercase wordmark. */
export default function Logo({ size = 22 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2 select-none">
      <LogoMark size={size + 6} />
      <span className="text-[20px] font-semibold lowercase" style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}>
        {APP_NAME}
      </span>
    </span>
  );
}
