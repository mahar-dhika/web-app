import { clsx } from 'clsx';

export interface SpinnerProps {
  /**
   * Size of the spinner
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Color theme of the spinner
   */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';

  /**
   * Whether to show loading text
   */
  showText?: boolean;

  /**
   * Custom loading text
   */
  text?: string;

  /**
   * Position of text relative to spinner
   */
  textPosition?: 'bottom' | 'right';

  /**
   * Custom className
   */
  className?: string;

  /**
   * Test ID for testing purposes
   */
  'data-testid'?: string;

  /**
   * Accessible label for screen readers
   */
  'aria-label'?: string;
}

const sizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const colorClasses = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-500',
};

const textSizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

export function Spinner({
  size = 'md',
  color = 'primary',
  showText = false,
  text = 'Loading...',
  textPosition = 'bottom',
  className = '',
  'data-testid': testId = 'spinner',
  'aria-label': ariaLabel = 'Loading',
}: SpinnerProps) {
  const spinnerElement = (
    <svg
      className={clsx(
        'animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      fill="none"
      viewBox="0 0 24 24"
      data-testid={`${testId}-icon`}
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (!showText) {
    return (
      <div
        className="inline-flex items-center justify-center"
        data-testid={testId}
        role="status"
        aria-label={ariaLabel}
      >
        {spinnerElement}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'inline-flex items-center',
        textPosition === 'bottom' ? 'flex-col' : 'flex-row'
      )}
      data-testid={testId}
      role="status"
      aria-label={ariaLabel}
    >
      {spinnerElement}
      <span
        className={clsx(
          textSizeClasses[size],
          colorClasses[color],
          textPosition === 'bottom' ? 'mt-2' : 'ml-3'
        )}
        data-testid={`${testId}-text`}
      >
        {text}
      </span>
    </div>
  );
}

// Overlay Spinner for full-page loading
export interface SpinnerOverlayProps extends Omit<SpinnerProps, 'className'> {
  /**
   * Whether the overlay is visible
   */
  isVisible: boolean;

  /**
   * Background opacity of the overlay
   */
  backdropOpacity?: 'light' | 'medium' | 'dark';

  /**
   * Custom className for the overlay
   */
  overlayClassName?: string;

  /**
   * Custom className for the spinner
   */
  spinnerClassName?: string;
}

const backdropClasses = {
  light: 'bg-white bg-opacity-50',
  medium: 'bg-white bg-opacity-75',
  dark: 'bg-black bg-opacity-50',
};

export function SpinnerOverlay({
  isVisible,
  backdropOpacity = 'medium',
  overlayClassName = '',
  spinnerClassName = '',
  size = 'lg',
  showText = true,
  text = 'Loading...',
  'data-testid': testId = 'spinner-overlay',
  ...spinnerProps
}: SpinnerOverlayProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex items-center justify-center',
        backdropClasses[backdropOpacity],
        overlayClassName
      )}
      data-testid={testId}
    >
      <Spinner
        size={size}
        showText={showText}
        text={text}
        className={spinnerClassName}
        data-testid={`${testId}-spinner`}
        {...spinnerProps}
      />
    </div>
  );
}
