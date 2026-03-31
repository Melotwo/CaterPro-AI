import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// --- INLINE ERROR BOUNDARY ---
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("CaterProAI Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center p-6 font-sans text-center">
            <div className="max-w-md bg-white/5 p-12 rounded-[3rem] border border-white/10 backdrop-blur-xl">
                <span className="mx-auto text-7xl mb-6 block animate-bounce">👨‍🍳</span>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-4">
                    Kitchen Emergency
                </h1>
                <p className="text-lg text-white font-medium leading-relaxed mb-8">
                    The CaterProAI engine encountered a critical error. Let's reset the station and try again.
                </p>
                <button
                    onClick={this.handleReload}
                    className="w-full inline-flex items-center justify-center bg-[#10b981] hover:bg-[#059669] text-white font-black uppercase tracking-widest text-xs py-5 px-8 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_40px_rgba(16,185,129,0.2)]"
                >
                    <span className="mr-3 text-xl">🔄</span>
                    Reset Application
                </button>
                {this.state.error && (
                  <details className="mt-8 text-left">
                    <summary className="text-[10px] text-white cursor-pointer uppercase tracking-widest font-bold">Error Details</summary>
                    <pre className="mt-4 p-4 bg-black/40 rounded-xl text-[10px] text-red-400/80 overflow-auto max-h-32 font-mono">
                      {this.state.error.message}
                    </pre>
                  </details>
                )}
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <React.Suspense fallback={
        <div className="bg-[#0B0F19] text-white min-h-screen flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">👨‍🍳</div>
          </div>
          <div className="mt-8 font-black uppercase tracking-[0.5em] text-[10px] text-emerald-500 animate-pulse">
            CaterProAI Loading Station
          </div>
        </div>
      }>
        <App />
      </React.Suspense>
    </ErrorBoundary>
  </React.StrictMode>
);
