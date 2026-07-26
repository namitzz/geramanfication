import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

/**
 * Catches render-time errors anywhere below it and shows a recoverable screen
 * instead of a blank white page. Progress lives in localStorage, so reloading
 * never loses data.
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface it for debugging; no external logging in an offline-first PWA.
    console.error('Unhandled error:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <div className="text-5xl mb-4" aria-hidden>🦊</div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The app hit an unexpected error. Your progress is saved — reloading
            usually fixes it.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary px-6 py-3"
            >
              Reload
            </button>
            <button
              onClick={() => this.setState({ error: null })}
              className="btn px-6 py-3 bg-gray-200 dark:bg-gray-700"
            >
              Try again
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-400 break-words">
            {this.state.error.message}
          </p>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
