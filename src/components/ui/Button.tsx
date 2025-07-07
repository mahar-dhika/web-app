import { clsx } from 'clsx';
import React, { forwardRef } from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

/**
 * Button Component
 * A reusable button component with multiple variants, sizes, and states
 * Follows accessibility best practices and supports loading states
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      children,
      className,
      onClick,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'transition-colors',
      'duration-200',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'disabled:pointer-events-none',
      'rounded-md',
    ];

    const variantClasses = {
      primary: [
        'bg-blue-600',
        'text-white',
        'hover:bg-blue-700',
        'focus:ring-blue-500',
        'border',
        'border-transparent',
      ],
      secondary: [
        'bg-gray-200',
        'text-gray-900',
        'hover:bg-gray-300',
        'focus:ring-gray-500',
        'border',
        'border-gray-300',
      ],
      danger: [
        'bg-red-600',
        'text-white',
        'hover:bg-red-700',
        'focus:ring-red-500',
        'border',
        'border-transparent',
      ],
    };

    const sizeClasses = {
      sm: ['px-3', 'py-1.5', 'text-sm'],
      md: ['px-4', 'py-2', 'text-sm'],
      lg: ['px-6', 'py-3', 'text-base'],
    };

    const loadingClasses = loading ? ['cursor-wait'] : [];

    const buttonClasses = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      loadingClasses,
      className
    );

    const isDisabled = disabled || loading;

    const handleClick = () => {
      if (!isDisabled && onClick) {
        onClick();
      }
    };

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={isDisabled}
        onClick={handleClick}
        aria-disabled={isDisabled}
        aria-label={loading ? 'Loading...' : undefined}
        data-testid="button"
        {...props}
      >
        {loading && (
          <svg
            className={clsx('animate-spin mr-2', {
              'h-3 w-3': size === 'sm',
              'h-4 w-4': size === 'md',
              'h-5 w-5': size === 'lg',
            })}
            fill="none"
            viewBox="0 0 24 24"
            data-testid="loading-spinner"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        <span className={loading ? 'opacity-75' : ''}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
