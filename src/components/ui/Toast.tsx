import { clsx } from 'clsx';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  /**
   * The type of toast notification
   */
  type: ToastType;

  /**
   * The title of the toast
   */
  title?: string;

  /**
   * The message content of the toast
   */
  message: string;

  /**
   * Whether the toast is visible
   */
  isVisible: boolean;

  /**
   * Function to call when the toast should be dismissed
   */
  onDismiss: () => void;

  /**
   * Auto dismiss duration in milliseconds (0 to disable auto dismiss)
   */
  duration?: number;

  /**
   * Whether to show the close button
   */
  showCloseButton?: boolean;

  /**
   * Position of the toast
   */
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';

  /**
   * Custom className for the toast
   */
  className?: string;

  /**
   * Test ID for testing purposes
   */
  'data-testid'?: string;
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
};

export function Toast({
  type,
  title,
  message,
  isVisible,
  onDismiss,
  duration = 5000,
  showCloseButton = true,
  position = 'top-right',
  className = '',
  'data-testid': testId = 'toast',
}: ToastProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto dismiss
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onDismiss]);

  // Animation handling
  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match animation duration

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onDismiss]);

  if (!isVisible && !isAnimating) {
    return null;
  }

  const Icon = toastIcons[type];

  const toastContent = (
    <div
      className={clsx(
        'fixed z-50 max-w-sm w-full transition-all duration-300 ease-in-out',
        positionStyles[position],
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-2 scale-95'
      )}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      data-testid={testId}
    >
      <div
        className={clsx(
          'p-4 rounded-lg border shadow-lg',
          toastStyles[type],
          className
        )}
      >
        <div className="flex items-start">
          {/* Icon */}
          <div className="flex-shrink-0">
            <Icon
              className={clsx('h-5 w-5', iconStyles[type])}
              data-testid={`${testId}-icon`}
              aria-hidden="true"
            />
          </div>

          {/* Content */}
          <div className="ml-3 flex-1">
            {title && (
              <h3
                className="text-sm font-medium"
                data-testid={`${testId}-title`}
              >
                {title}
              </h3>
            )}
            <p
              className={clsx('text-sm', title ? 'mt-1' : '')}
              data-testid={`${testId}-message`}
            >
              {message}
            </p>
          </div>

          {/* Close button */}
          {showCloseButton && (
            <div className="ml-3 flex-shrink-0">
              <button
                type="button"
                className={clsx(
                  'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                  type === 'success' &&
                    'text-green-500 hover:bg-green-100 focus:ring-green-500',
                  type === 'error' &&
                    'text-red-500 hover:bg-red-100 focus:ring-red-500',
                  type === 'warning' &&
                    'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-500',
                  type === 'info' &&
                    'text-blue-500 hover:bg-blue-100 focus:ring-blue-500'
                )}
                onClick={onDismiss}
                data-testid={`${testId}-close-button`}
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(toastContent, document.body);
}

// Toast Container for managing multiple toasts
export interface ToastContainerProps {
  /**
   * Array of toast configurations
   */
  toasts: Array<ToastProps & { id: string }>;

  /**
   * Position for all toasts in the container
   */
  position?: ToastProps['position'];

  /**
   * Maximum number of toasts to show at once
   */
  maxToasts?: number;

  /**
   * Test ID for testing purposes
   */
  'data-testid'?: string;
}

export function ToastContainer({
  toasts,
  position = 'top-right',
  maxToasts = 5,
  'data-testid': testId = 'toast-container',
}: ToastContainerProps) {
  // Limit the number of visible toasts
  const visibleToasts = toasts.slice(0, maxToasts);

  if (visibleToasts.length === 0) {
    return null;
  }

  const containerStyles = {
    'top-right': 'top-4 right-4 flex-col',
    'top-left': 'top-4 left-4 flex-col',
    'bottom-right': 'bottom-4 right-4 flex-col-reverse',
    'bottom-left': 'bottom-4 left-4 flex-col-reverse',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2 flex-col',
    'bottom-center':
      'bottom-4 left-1/2 transform -translate-x-1/2 flex-col-reverse',
  };

  const container = (
    <div
      className={clsx(
        'fixed z-50 flex space-y-2 max-w-sm w-full',
        containerStyles[position]
      )}
      data-testid={testId}
    >
      {visibleToasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          position={position}
          data-testid={`${testId}-item-${toast.id}`}
        />
      ))}
    </div>
  );

  return createPortal(container, document.body);
}

// Hook for managing toast state
export interface UseToastReturn {
  toasts: Array<ToastProps & { id: string }>;
  addToast: (toast: Omit<ToastProps, 'isVisible' | 'onDismiss'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const addToast = (
    toast: Omit<ToastProps, 'isVisible' | 'onDismiss'>
  ): string => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      ...toast,
      id,
      isVisible: true,
      onDismiss: () => removeToast(id),
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
  };
}
