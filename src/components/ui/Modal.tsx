import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;

  /**
   * Function to call when the modal should be closed
   */
  onClose: () => void;

  /**
   * Modal title
   */
  title?: string;

  /**
   * Modal content
   */
  children: React.ReactNode;

  /**
   * Modal size variant
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * Whether clicking outside the modal should close it
   */
  closeOnOverlayClick?: boolean;

  /**
   * Whether pressing Escape should close the modal
   */
  closeOnEscape?: boolean;

  /**
   * Whether to show the close button
   */
  showCloseButton?: boolean;

  /**
   * Custom className for the modal content
   */
  className?: string;

  /**
   * Custom className for the modal overlay
   */
  overlayClassName?: string;

  /**
   * Whether to prevent body scroll when modal is open
   */
  preventBodyScroll?: boolean;

  /**
   * Optional footer content
   */
  footer?: React.ReactNode;

  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;

  /**
   * ARIA describedby for accessibility
   */
  ariaDescribedby?: string;
}

/**
 * Modal Component
 *
 * A flexible modal dialog component with support for:
 * - Multiple sizes (sm, md, lg, xl, full)
 * - Focus management and trap
 * - Escape key and overlay click handling
 * - Portal rendering for proper z-index stacking
 * - Full accessibility support
 * - Body scroll prevention
 * - TypeScript integration
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  overlayClassName,
  preventBodyScroll = true,
  footer,
  ariaLabel,
  ariaDescribedby,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previouslyFocusedElement.current = document.activeElement as HTMLElement;

      // Focus the modal
      const focusModal = () => {
        if (modalRef.current) {
          const focusableElement = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement;

          if (focusableElement) {
            focusableElement.focus();
          } else {
            modalRef.current.focus();
          }
        }
      };

      // Small delay to ensure modal is rendered
      setTimeout(focusModal, 10);
    } else {
      // Restore focus to previously focused element
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    }
  }, [isOpen]);

  // Body scroll prevention
  useEffect(() => {
    if (isOpen && preventBodyScroll) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen, preventBodyScroll]);

  // Escape key handling
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeOnEscape, onClose]);

  // Focus trap
  useEffect(() => {
    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleTabKey);
      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, [isOpen]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'animate-in fade-in duration-200',
        overlayClassName
      )}
      onClick={handleOverlayClick}
      data-testid="modal-overlay"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title}
        aria-describedby={ariaDescribedby}
        tabIndex={-1}
        className={clsx(
          'relative w-full bg-white rounded-lg shadow-xl',
          'animate-in zoom-in-95 duration-200',
          'focus:outline-none',
          sizeClasses[size],
          className
        )}
        data-testid="modal-content"
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-secondary-200">
            {title && (
              <h2
                className="text-lg font-semibold text-secondary-900"
                data-testid="modal-title"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onClose}
                className="p-2 h-auto"
                aria-label="Close modal"
                data-testid="modal-close-button"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6" data-testid="modal-body">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="px-6 py-4 border-t border-secondary-200 bg-secondary-50"
            data-testid="modal-footer"
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Render modal in portal
  return createPortal(modalContent, document.body);
};

export default Modal;
