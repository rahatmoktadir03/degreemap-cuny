import React from "react";

interface State {
  error: Error | null;
}

interface Props {
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Surface in console so dev can see the real stack.
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback(this.state.error, this.reset);
      return (
        <div className="rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-6 text-sm">
          <p className="font-semibold text-red-700 dark:text-red-300">Something went wrong.</p>
          <p className="mt-1 text-red-600 dark:text-red-400">{this.state.error.message}</p>
          <button
            type="button"
            onClick={this.reset}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-600 text-white text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
