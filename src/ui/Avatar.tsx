import { LogoMark } from './Logo';

/** Monogram in a flame-gradient ring; falls back to the flame mark. */
export default function Avatar({ name, size = 36 }: { name?: string; size?: number }) {
  const initial = (name?.trim()?.[0] ?? '').toUpperCase();
  return (
    <span
      className="relative inline-flex items-center justify-center rounded-full"
      style={{ width: size, height: size, padding: 2, background: 'var(--flame-gradient)' }}
    >
      <span
        className="flex h-full w-full items-center justify-center rounded-full font-semibold"
        style={{ background: 'var(--surface-solid)', color: 'var(--ink)', fontSize: size * 0.42 }}
      >
        {initial || <LogoMark size={size * 0.5} />}
      </span>
    </span>
  );
}
