// File purpose: Catch React errors and prevent full app crashes
// Related: App.jsx wraps entire app with this
// Should not include: Business logic, data management

import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg-secondary)]">
          <div className="max-w-md w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-2xl p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-danger)]/10 flex items-center justify-center">
              <AlertTriangle size={32} className="text-[var(--color-danger)]" />
            </div>

            <h1 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
              Something went wrong
            </h1>

            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              The app encountered an unexpected error. Your data is safe. Try reloading the page.
            </p>

            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-xs text-[var(--color-text-secondary)] cursor-pointer hover:text-[var(--color-accent)] mb-2">
                  Technical details
                </summary>
                <pre className="text-xs bg-[var(--color-bg-secondary)] p-3 rounded-lg overflow-auto max-h-32 text-[var(--color-text-secondary)]">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 py-2.5 text-sm font-medium border border-[var(--color-border-primary)] rounded-lg hover:bg-[var(--color-hover-bg)] transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 text-sm font-semibold bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 transition-all"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
