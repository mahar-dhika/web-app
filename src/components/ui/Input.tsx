import React, { forwardRef, useState } from 'react';
import { clsx } from 'clsx';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /**
   * Input type
   */
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';

  /**
   * Input placeholder text
   */
  placeholder?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Whether the input is disabled
   */
  disabled?: boolean;

  /**
   * Input value
   */
  value?: string;

  /**
   * Change handler that receives the string value
   */
  onChange?: (value: string) => void;

  /**
   * Input label
   */
  label?: string;

  /**
   * Help text to display below the input
   */
  helpText?: string;

  /**
   * Whether the input is required
   */
  required?: boolean;

  /**
   * Input size variant
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether to show character count
   */
  showCharCount?: boolean;

  /**
   * Maximum character length
   */
  maxLength?: number;

  /**
   * Additional className for the input wrapper
   */
  wrapperClassName?: string;

  /**
   * Left icon component
   */
  leftIcon?: React.ComponentType<{ className?: string }>;

  /**
   * Right icon component
   */
  rightIcon?: React.ComponentType<{ className?: string }>;
}

/**
 * Input Component
 *
 * A flexible input component with support for:
 * - Multiple input types (text, email, password, search, etc.)
 * - Error states with validation messages
 * - Loading and disabled states
 * - Icons and character count
 * - Full accessibility support
 * - TypeScript integration
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      placeholder,
      error,
      disabled = false,
      value,
      onChange,
      label,
      helpText,
      required = false,
      size = 'md',
      showCharCount = false,
      maxLength,
      wrapperClassName,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = type === 'password' && showPassword ? 'text' : type;
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const helpId = `${inputId}-help`;

    const hasError = Boolean(error);
    const characterCount = value?.length || 0;
    const isOverLimit = maxLength ? characterCount > maxLength : false;

    // Size-based styling
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    };

    const iconSizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange?.(newValue);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(prev => !prev);
    };

    const inputClasses = clsx(
      // Base styles
      'w-full border rounded-md transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'placeholder:text-secondary-400',

      // Size-specific styles
      sizeClasses[size],

      // State-specific styles
      {
        // Default state
        'border-secondary-300 bg-white text-secondary-900':
          !hasError && !disabled,
        'focus:border-primary-500 focus:ring-primary-500/20':
          !hasError && !disabled && isFocused,

        // Error state
        'border-danger-300 bg-danger-50 text-danger-900': hasError && !disabled,
        'focus:border-danger-500 focus:ring-danger-500/20':
          hasError && !disabled && isFocused,

        // Disabled state
        'border-secondary-200 bg-secondary-50 text-secondary-500 cursor-not-allowed':
          disabled,

        // Icon padding adjustments
        'pl-10': LeftIcon && size === 'sm',
        'pl-11': LeftIcon && size === 'md',
        'pl-12': LeftIcon && size === 'lg',
        'pr-10': (RightIcon || type === 'password') && size === 'sm',
        'pr-11': (RightIcon || type === 'password') && size === 'md',
        'pr-12': (RightIcon || type === 'password') && size === 'lg',
      },

      className
    );

    const wrapperClasses = clsx('relative', wrapperClassName);

    return (
      <div className={wrapperClasses}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={clsx('block text-sm font-medium mb-1', {
              'text-secondary-700': !hasError,
              'text-danger-700': hasError,
              'text-secondary-500': disabled,
            })}
          >
            {label}
            {required && (
              <span className="text-danger-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {LeftIcon && (
            <div
              className={clsx(
                'absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none',
                {
                  'text-secondary-400': !hasError && !disabled,
                  'text-danger-400': hasError && !disabled,
                  'text-secondary-300': disabled,
                }
              )}
            >
              <LeftIcon className={iconSizeClasses[size]} />
            </div>
          )}

          {/* Input Element */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            className={inputClasses}
            aria-invalid={hasError}
            aria-describedby={clsx({
              [errorId]: hasError,
              [helpId]: helpText,
            })}
            data-testid="input-element"
            {...props}
          />

          {/* Right Icon or Password Toggle */}
          {(RightIcon || type === 'password') && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {type === 'password' ? (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={disabled}
                  className={clsx(
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 rounded p-1',
                    'transition-colors duration-200',
                    {
                      'text-secondary-400 hover:text-secondary-600': !disabled,
                      'text-secondary-300 cursor-not-allowed': disabled,
                    }
                  )}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  data-testid="password-toggle"
                >
                  {showPassword ? (
                    <EyeOff className={iconSizeClasses[size]} />
                  ) : (
                    <Eye className={iconSizeClasses[size]} />
                  )}
                </button>
              ) : RightIcon ? (
                <div
                  className={clsx('pointer-events-none', {
                    'text-secondary-400': !hasError && !disabled,
                    'text-danger-400': hasError && !disabled,
                    'text-secondary-300': disabled,
                  })}
                >
                  <RightIcon className={iconSizeClasses[size]} />
                </div>
              ) : null}
            </div>
          )}

          {/* Error Icon */}
          {hasError && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <AlertCircle
                className={clsx(iconSizeClasses[size], 'text-danger-400')}
              />
            </div>
          )}
        </div>

        {/* Help Text and Character Count */}
        {(helpText || showCharCount) && (
          <div className="flex justify-between items-center mt-1">
            {helpText && (
              <p
                id={helpId}
                className={clsx('text-sm', {
                  'text-secondary-600': !hasError,
                  'text-danger-600': hasError,
                  'text-secondary-500': disabled,
                })}
              >
                {helpText}
              </p>
            )}

            {showCharCount && (
              <span
                className={clsx('text-sm', {
                  'text-secondary-500': !isOverLimit,
                  'text-danger-500': isOverLimit,
                })}
                data-testid="character-count"
              >
                {characterCount}
                {maxLength && `/${maxLength}`}
              </span>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p
            id={errorId}
            className="mt-1 text-sm text-danger-600"
            role="alert"
            data-testid="error-message"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
