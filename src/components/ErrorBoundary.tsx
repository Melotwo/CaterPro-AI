import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4 font-sans text-center">
            <div className="max-w-md">
                <span className="mx-auto text-6xl mb-4 block">⚠️</span>
                <h1 className="text-3xl font-bold text-white">
                    CaterProAi Loading...
                </h1>
                <p className="mt-4 text-lg text-slate-300">
                    An unexpected error occurred. Please try reloading the page.
                </p>
                <button
                    onClick={this.handleReload}
                    className="mt-8 inline-flex items-center justify-center bg-emerald-deep hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                    <span className="mr-2 text-xl">🔄</span>
                    Reload Application
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}
