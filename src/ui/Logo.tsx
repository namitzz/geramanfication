import { useId } from 'react';
import { APP_NAME } from '../brand';

/**
 * Tovo mark — two overlapping lenses (one language coming into focus through
 * another); the overlap darkens where they meet. Tinted in the fiery palette.
 */
export function LogoMark({ size = 24 }: { size?: number }) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, '');
  const clip = `lens-${raw}`;
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <circle cx="62" cy="48" r="27" />
        </clipPath>
      </defs>
      <circle cx="34" cy="48" r="27" fill="var(--flame-3)" />
      <circle cx="62" cy="48" r="27" fill="var(--flame-4)" />
      <circle cx="34" cy="48" r="27" clipPath={`url(#${clip})`} fill="var(--flame-2)" />
    </svg>
  );
}

/** Full lockup: mark + Sora wordmark. */
export default function Logo({ size = 22 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2 select-none">
      <LogoMark size={size + 6} />
      <span
        style={{
          fontFamily: "'Sora', system-ui, sans-serif",
          fontWeight: 800,
          fontSize: size,
          letterSpacing: '-0.01em',
          color: 'var(--ink)',
        }}
      >
        {APP_NAME}
      </span>
    </span>
  );
}
