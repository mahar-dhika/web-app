import { Component, ErrorInfo, ReactNode } from 'react';
import { TestLogger } from '../shared/utils/testLogger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 * Logs errors for debugging and provides retry mechanism
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    TestLogger.logTestResult(
      'UNIT',
      'ErrorBoundary - Component Error Caught',
      'FAIL',
      `${error.message} - Stack: ${error.stack} - Component Stack: ${errorInfo.componentStack}`
    );

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    TestLogger.logTestStart('UNIT', 'ErrorBoundary - Retry Attempt');

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    TestLogger.logTestResult(
      'UNIT',
      'ErrorBoundary - Retry Attempt',
      'PASS',
      'State reset successfully'
    );
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          className="error-boundary-container flex min-h-screen items-center justify-center bg-gray-50 px-4"
          data-testid="error-boundary"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Something went wrong
                </h3>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                We're sorry, but something unexpected happened. Please try
                again.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 p-3 bg-gray-100 rounded border text-xs">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    Error Details (Development Mode)
                  </summary>
                  <div className="text-red-600 font-mono whitespace-pre-wrap">
                    <strong>Error:</strong> {this.state.error.message}
                    {this.state.error.stack && (
                      <>
                        <br />
                        <strong>Stack:</strong>
                        <br />
                        {this.state.error.stack}
                      </>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <>
                        <br />
                        <strong>Component Stack:</strong>
                        <br />
                        {this.state.errorInfo.componentStack}
                      </>
                    )}
                  </div>
                </details>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                data-testid="retry-button"
              >
                Try Again
              </button>

              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                data-testid="reload-button"
              >
                Reload Page
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                If this problem persists, please contact support.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
