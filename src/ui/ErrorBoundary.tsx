import { Component, type ErrorInfo, type ReactNode } from 'react';
import { captureError } from '../utils/monitoring';

/** Catches render errors and shows a recoverable screen; progress is in localStorage. */
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled error:', error, info.componentStack);
    captureError(error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-center">
        <div className="max-w-sm">
          <p className="eyebrow text-faint mb-3">something broke</p>
          <h1 className="display text-2xl mb-2">Let's try that again</h1>
          <p className="text-muted mb-6 text-sm">
            An unexpected error occurred. Your progress is saved.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-2xl bg-accent px-6 py-3 font-semibold text-accent-ink"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
