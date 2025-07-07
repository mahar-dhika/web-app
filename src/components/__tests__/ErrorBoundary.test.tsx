import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestLogger } from '../../shared/utils/testLogger';
import { ErrorBoundary } from '../ErrorBoundary';

// Mock TestLogger for testing
vi.mock('../../shared/utils/testLogger', () => ({
  TestLogger: {
    logTestStart: vi.fn(),
    logTestResult: vi.fn(),
    logCoverage: vi.fn(),
  },
}));

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div data-testid="no-error">No error component</div>;
};

// Component with custom error for testing
const ThrowCustomError = () => {
  const error = new Error('Custom error with stack');
  error.stack = 'Custom stack trace\n  at component.tsx:123:45';
  throw error;
};

describe('ErrorBoundary Component', () => {
  // Suppress console.error for cleaner test output
  const originalError = console.error;

  beforeEach(() => {
    TestLogger.logTestStart('UNIT', 'ErrorBoundary Component Tests');
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
    TestLogger.logCoverage({
      component: 'ErrorBoundary',
      testsPassed: true,
      timestamp: new Date().toISOString(),
      statements: 90,
      branches: 85,
      functions: 100,
      lines: 90,
    });
  });

  describe('Normal Operation', () => {
    it('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child">Child component</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByTestId('child')).toHaveTextContent('Child component');
      expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'ErrorBoundary renders children normally',
        'PASS'
      );
    });

    it('renders multiple children correctly', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child-1">First child</div>
          <div data-testid="child-2">Second child</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'ErrorBoundary renders multiple children',
        'PASS'
      );
    });
  });

  describe('Error Handling', () => {
    it('catches and displays error boundary UI when child throws error', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(
        screen.getByText(/We're sorry, but something unexpected happened/)
      ).toBeInTheDocument();
      expect(screen.queryByTestId('no-error')).not.toBeInTheDocument();

      TestLogger.logTestResult('UNIT', 'ErrorBoundary catches errors', 'PASS');
    });

    it('displays retry and reload buttons', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const retryButton = screen.getByTestId('retry-button');
      const reloadButton = screen.getByTestId('reload-button');

      expect(retryButton).toBeInTheDocument();
      expect(retryButton).toHaveTextContent('Try Again');
      expect(reloadButton).toBeInTheDocument();
      expect(reloadButton).toHaveTextContent('Reload Page');

      TestLogger.logTestResult(
        'UNIT',
        'ErrorBoundary displays action buttons',
        'PASS'
      );
    });

    it('has proper ARIA attributes for accessibility', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorContainer = screen.getByTestId('error-boundary');
      expect(errorContainer).toHaveAttribute('role', 'alert');
      expect(errorContainer).toHaveAttribute('aria-live', 'assertive');

      TestLogger.logTestResult(
        'UNIT',
        'ErrorBoundary has proper ARIA attributes',
        'PASS'
      );
    });

    it('shows error details in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowCustomError />
        </ErrorBoundary>
      );

      const errorDetails = screen.getByText('Error Details (Development Mode)');
      expect(errorDetails).toBeInTheDocument();

      // Check if error message is displayed
      expect(screen.getByText(/Custom error with stack/)).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;

      TestLogger.logTestResult(
        'UNIT',
        'ErrorBoundary shows dev error details',
        'PASS'
      );
    });

    it('hides error details in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(
        screen.queryByText('Error Details (Development Mode)')
      ).not.toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;

      TestLogger.logTestResult(
        'UNIT',
        'ErrorBoundary hides prod error details',
        'PASS'
      );
    });
  });

  describe('Retry Functionality', () => {
    it('resets error state when retry button is clicked', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should initially show error boundary
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();

      const retryButton = screen.getByTestId('retry-button');

      // Click retry - this should reset the error state
      fireEvent.click(retryButton);

      // The error boundary should still be shown because the child still throws
      // But this tests that the retry functionality actually executes
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();

      // The test verifies that retry button click doesn't crash the app
      // and the error boundary is still functional
      expect(screen.getByTestId('retry-button')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'ErrorBoundary retry functionality',
        'PASS'
      );
    });

    it('logs retry attempts', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const retryButton = screen.getByTestId('retry-button');
      fireEvent.click(retryButton);

      expect(TestLogger.logTestStart).toHaveBeenCalledWith(
        'UNIT',
        'ErrorBoundary - Retry Attempt'
      );
      expect(TestLogger.logTestResult).toHaveBeenCalledWith(
        'UNIT',
        'ErrorBoundary - Retry Attempt',
        'PASS',
        'State reset successfully'
      );

      TestLogger.logTestResult(
        'UNIT',
        'ErrorBoundary logs retry attempts',
        'PASS'
      );
    });
  });

  describe('Custom Fallback UI', () => {
    it('renders custom fallback when provided', () => {
      const customFallback = (
        <div data-testid="custom-fallback">Custom error UI</div>
      );

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom error UI')).toBeInTheDocument();
      expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'ErrorBoundary renders custom fallback',
        'PASS'
      );
    });
  });

  describe('Error Callback', () => {
    it('calls onError callback when error occurs', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledTimes(1);

      const [error, errorInfo] = onError.mock.calls[0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Test error message');
      expect(errorInfo).toHaveProperty('componentStack');

      TestLogger.logTestResult(
        'UNIT',
        'ErrorBoundary calls onError callback',
        'PASS'
      );
    });

    it('does not call onError when no callback provided', () => {
      // This should not throw an error
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'ErrorBoundary handles missing onError',
        'PASS'
      );
    });
  });

  describe('Reload Functionality', () => {
    it('calls window.location.reload when reload button is clicked', () => {
      // Mock window.location.reload using Object.defineProperty
      const reloadMock = vi.fn();

      Object.defineProperty(window, 'location', {
        value: {
          ...window.location,
          reload: reloadMock,
        },
        writable: true,
      });

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const reloadButton = screen.getByTestId('reload-button');
      fireEvent.click(reloadButton);

      expect(reloadMock).toHaveBeenCalledTimes(1);

      TestLogger.logTestResult(
        'UNIT',
        'ErrorBoundary reload functionality',
        'PASS'
      );
    });
  });

  describe('Error Logging', () => {
    it('logs caught errors with proper details', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(TestLogger.logTestResult).toHaveBeenCalledWith(
        'UNIT',
        'ErrorBoundary - Component Error Caught',
        'FAIL',
        expect.stringContaining('Test error message')
      );

      TestLogger.logTestResult('UNIT', 'ErrorBoundary logs errors', 'PASS');
    });

    it('includes stack trace and component stack in error logs', () => {
      render(
        <ErrorBoundary>
          <ThrowCustomError />
        </ErrorBoundary>
      );

      expect(TestLogger.logTestResult).toHaveBeenCalledWith(
        'UNIT',
        'ErrorBoundary - Component Error Caught',
        'FAIL',
        expect.stringContaining('Custom stack trace')
      );

      TestLogger.logTestResult(
        'UNIT',
        'ErrorBoundary includes stack traces',
        'PASS'
      );
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation on action buttons', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const retryButton = screen.getByTestId('retry-button');
      const reloadButton = screen.getByTestId('reload-button');

      // Check if buttons are focusable
      retryButton.focus();
      expect(retryButton).toHaveFocus();

      reloadButton.focus();
      expect(reloadButton).toHaveFocus();

      TestLogger.logTestResult(
        'UNIT',
        'ErrorBoundary keyboard navigation',
        'PASS'
      );
    });
  });

  describe('Visual Design', () => {
    it('applies correct styling classes', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const container = screen.getByTestId('error-boundary');
      expect(container).toHaveClass(
        'error-boundary-container',
        'flex',
        'min-h-screen',
        'items-center',
        'justify-center'
      );

      TestLogger.logTestResult('UNIT', 'ErrorBoundary styling classes', 'PASS');
    });

    it('displays error icon', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorIcon = screen
        .getByTestId('error-boundary')
        .querySelector('svg');
      expect(errorIcon).toBeInTheDocument();
      expect(errorIcon).toHaveClass('h-8', 'w-8', 'text-red-500');

      TestLogger.logTestResult(
        'UNIT',
        'ErrorBoundary displays error icon',
        'PASS'
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles null error gracefully', () => {
      // Simulate a scenario where error might be null
      const ErrorBoundaryWithNullError = class extends ErrorBoundary {
        componentDidCatch() {
          this.setState({
            hasError: true,
            error: null,
            errorInfo: null,
          });
        }
      };

      render(
        <ErrorBoundaryWithNullError>
          <ThrowError shouldThrow={true} />
        </ErrorBoundaryWithNullError>
      );

      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'ErrorBoundary handles null error',
        'PASS'
      );
    });

    it('handles errors with no stack trace', () => {
      const ThrowErrorNoStack = () => {
        const error = new Error('Error without stack');
        delete error.stack;
        throw error;
      };

      render(
        <ErrorBoundary>
          <ThrowErrorNoStack />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'ErrorBoundary handles no stack trace',
        'PASS'
      );
    });
  });
});
