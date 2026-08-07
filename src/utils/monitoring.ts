/**
 * Error monitoring (Sentry) — completely optional and privacy-conscious.
 *
 * Inert unless VITE_SENTRY_DSN is set at build time, so local dev and any
 * un-configured build ship zero tracking. Sentry is loaded lazily (its own
 * async chunk) so it never weighs down first paint. We strip PII: no IP, no
 * request bodies — just the error and a coarse breadcrumb trail.
 */

const DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;

export const monitoringEnabled = (): boolean => !!DSN;

export async function initMonitoring(): Promise<void> {
  if (!DSN) return;
  try {
    const Sentry = await import('@sentry/react');
    Sentry.init({
      dsn: DSN,
      environment: import.meta.env.MODE,
      // Keep it light: capture errors, sample a slice of performance traces.
      tracesSampleRate: 0.1,
      sendDefaultPii: false,
      // Don't fingerprint users; we only want to fix crashes.
      beforeSend(event) {
        if (event.user) delete event.user.ip_address;
        return event;
      },
    });
  } catch {
    /* monitoring must never break the app */
  }
}

/** Report a handled error (e.g. from the ErrorBoundary). No-op if disabled. */
export async function captureError(error: unknown): Promise<void> {
  if (!DSN) return;
  try {
    const Sentry = await import('@sentry/react');
    Sentry.captureException(error);
  } catch {
    /* ignore */
  }
}
