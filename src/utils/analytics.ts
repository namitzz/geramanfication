/**
 * Privacy-friendly, cookieless analytics — optional and consent-free by design.
 *
 * Inert unless VITE_PLAUSIBLE_DOMAIN is set at build time. Uses a Plausible-
 * compatible script (works with Plausible cloud, self-hosted Plausible, or
 * Umami's Plausible-compatible endpoint). No cookies, no cross-site tracking,
 * no personal data — so it needs no consent banner under GDPR. We only learn
 * which screens and features get used, never who used them.
 */

const DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
// Defaults to Plausible cloud; override for self-hosted or Umami.
const SRC =
  (import.meta.env.VITE_PLAUSIBLE_SRC as string | undefined) ??
  'https://plausible.io/js/script.js';

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string | number> }) => void;
  }
}

export const analyticsEnabled = (): boolean => !!DOMAIN;

/** Inject the analytics script once. No-op if unconfigured or already loaded. */
export function initAnalytics(): void {
  if (!DOMAIN || typeof document === 'undefined') return;
  if (document.querySelector('script[data-tovo-analytics]')) return;
  const s = document.createElement('script');
  s.defer = true;
  s.setAttribute('data-domain', DOMAIN);
  s.setAttribute('data-tovo-analytics', '');
  s.src = SRC;
  document.head.appendChild(s);
}

/** Record a custom event (e.g. "session_complete"). No-op if disabled. */
export function track(event: string, props?: Record<string, string | number>): void {
  if (!DOMAIN) return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    /* analytics must never break the app */
  }
}

/** SPA pageview — call on route change (the base script only fires once). */
export function trackPageview(): void {
  track('pageview');
}
