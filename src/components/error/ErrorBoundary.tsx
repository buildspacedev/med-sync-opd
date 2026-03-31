import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Standard React Class-based Error Boundary.
 * Catches rendering errors in its child component tree and displays a fallback UI.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Something went wrong</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              An unexpected error occurred while rendering this page. Our team has been notified.
            </p>
            <button
              onClick={this.handleRetry}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-lg shadow-blue-200"
            >
              Try again
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-8 p-4 bg-slate-800 text-red-400 rounded-lg text-left max-w-2xl overflow-auto text-xs font-mono">
              {this.state.error.toString()}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
