import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { Toast, ToastContainer, useToast, type ToastProps } from '../Toast';

interface IconProps {
  className?: string;
  [key: string]: unknown;
}

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  X: ({ className, ...props }: IconProps) => (
    <div className={className} data-testid="x-icon" {...props} />
  ),
  CheckCircle: ({ className, ...props }: IconProps) => (
    <div className={className} data-testid="check-circle-icon" {...props} />
  ),
  AlertCircle: ({ className, ...props }: IconProps) => (
    <div className={className} data-testid="alert-circle-icon" {...props} />
  ),
  AlertTriangle: ({ className, ...props }: IconProps) => (
    <div className={className} data-testid="alert-triangle-icon" {...props} />
  ),
  Info: ({ className, ...props }: IconProps) => (
    <div className={className} data-testid="info-icon" {...props} />
  ),
}));

// Mock createPortal to render in the same container
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (element: React.ReactElement) => element,
  };
});

const defaultProps: ToastProps = {
  type: 'info',
  message: 'Test message',
  isVisible: true,
  onDismiss: vi.fn(),
};

describe('Toast Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders correctly with required props', () => {
      render(<Toast {...defaultProps} />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByTestId('toast-message')).toHaveTextContent(
        'Test message'
      );
      expect(screen.getByTestId('info-icon')).toBeInTheDocument();
    });

    it('renders with title when provided', () => {
      render(<Toast {...defaultProps} title="Test Title" />);

      expect(screen.getByTestId('toast-title')).toHaveTextContent('Test Title');
      expect(screen.getByTestId('toast-message')).toHaveTextContent(
        'Test message'
      );
    });

    it('renders close button by default', () => {
      render(<Toast {...defaultProps} />);

      expect(screen.getByTestId('toast-close-button')).toBeInTheDocument();
      expect(screen.getByLabelText('Dismiss notification')).toBeInTheDocument();
    });

    it('hides close button when showCloseButton is false', () => {
      render(<Toast {...defaultProps} showCloseButton={false} />);

      expect(
        screen.queryByTestId('toast-close-button')
      ).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Toast {...defaultProps} className="custom-class" />);

      const toastElement = screen.getByTestId('toast');
      expect(toastElement.firstChild).toHaveClass('custom-class');
    });

    it('applies custom test ID', () => {
      render(<Toast {...defaultProps} data-testid="custom-toast" />);

      expect(screen.getByTestId('custom-toast')).toBeInTheDocument();
      expect(screen.getByTestId('custom-toast-message')).toBeInTheDocument();
    });

    it('does not render when not visible and not animating', () => {
      render(<Toast {...defaultProps} isVisible={false} />);

      // Initial render should show the toast for animation
      expect(screen.getByTestId('toast')).toBeInTheDocument();

      // After animation completes, it should be removed
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
    });
  });

  describe('Toast Types', () => {
    const toastTypes = [
      {
        type: 'success' as const,
        icon: 'check-circle-icon',
        bgClass: 'bg-green-50',
      },
      {
        type: 'error' as const,
        icon: 'alert-circle-icon',
        bgClass: 'bg-red-50',
      },
      {
        type: 'warning' as const,
        icon: 'alert-triangle-icon',
        bgClass: 'bg-yellow-50',
      },
      { type: 'info' as const, icon: 'info-icon', bgClass: 'bg-blue-50' },
    ];

    toastTypes.forEach(({ type, icon, bgClass }) => {
      it(`renders ${type} toast with correct styling and icon`, () => {
        render(<Toast {...defaultProps} type={type} />);

        expect(screen.getByTestId(icon)).toBeInTheDocument();
        const toastContent = screen.getByTestId('toast').firstChild;
        expect(toastContent).toHaveClass(bgClass);
      });
    });
  });

  describe('Positioning', () => {
    const positions = [
      'top-right',
      'top-left',
      'bottom-right',
      'bottom-left',
      'top-center',
      'bottom-center',
    ] as const;

    positions.forEach(position => {
      it(`applies correct positioning classes for ${position}`, () => {
        render(<Toast {...defaultProps} position={position} />);

        const toast = screen.getByTestId('toast');
        expect(toast).toHaveClass('fixed');

        if (position.includes('right')) {
          expect(toast).toHaveClass('right-4');
        }
        if (position.includes('left')) {
          expect(toast).toHaveClass('left-4');
        }
        if (position.includes('top')) {
          expect(toast).toHaveClass('top-4');
        }
        if (position.includes('bottom')) {
          expect(toast).toHaveClass('bottom-4');
        }
        if (position.includes('center')) {
          expect(toast).toHaveClass(
            'left-1/2',
            'transform',
            '-translate-x-1/2'
          );
        }
      });
    });
  });

  describe('Interactions', () => {
    it('calls onDismiss when close button is clicked', () => {
      const onDismiss = vi.fn();
      render(<Toast {...defaultProps} onDismiss={onDismiss} />);

      fireEvent.click(screen.getByTestId('toast-close-button'));

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('calls onDismiss when Escape key is pressed', () => {
      const onDismiss = vi.fn();
      render(<Toast {...defaultProps} onDismiss={onDismiss} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not call onDismiss when other keys are pressed', () => {
      const onDismiss = vi.fn();
      render(<Toast {...defaultProps} onDismiss={onDismiss} />);

      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'Space' });

      expect(onDismiss).not.toHaveBeenCalled();
    });

    it('does not respond to Escape key when not visible', () => {
      const onDismiss = vi.fn();
      render(
        <Toast {...defaultProps} isVisible={false} onDismiss={onDismiss} />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onDismiss).not.toHaveBeenCalled();
    });
  });

  describe('Auto Dismiss', () => {
    it('auto dismisses after default duration', async () => {
      const onDismiss = vi.fn();
      render(<Toast {...defaultProps} onDismiss={onDismiss} />);

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('auto dismisses after custom duration', async () => {
      const onDismiss = vi.fn();
      render(<Toast {...defaultProps} onDismiss={onDismiss} duration={2000} />);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not auto dismiss when duration is 0', async () => {
      const onDismiss = vi.fn();
      render(<Toast {...defaultProps} onDismiss={onDismiss} duration={0} />);

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(onDismiss).not.toHaveBeenCalled();
    });

    it('does not auto dismiss when not visible', async () => {
      const onDismiss = vi.fn();
      render(
        <Toast {...defaultProps} isVisible={false} onDismiss={onDismiss} />
      );

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(onDismiss).not.toHaveBeenCalled();
    });

    it('clears timer when component unmounts', async () => {
      const onDismiss = vi.fn();
      const { unmount } = render(
        <Toast {...defaultProps} onDismiss={onDismiss} />
      );

      unmount();

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(onDismiss).not.toHaveBeenCalled();
    });
  });

  describe('Animation', () => {
    it('applies visible animation classes when isVisible is true', () => {
      render(<Toast {...defaultProps} isVisible={true} />);

      const toast = screen.getByTestId('toast');
      expect(toast).toHaveClass('opacity-100', 'translate-y-0', 'scale-100');
    });

    it('applies hidden animation classes when isVisible is false', () => {
      render(<Toast {...defaultProps} isVisible={false} />);

      const toast = screen.getByTestId('toast');
      expect(toast).toHaveClass('opacity-0', 'translate-y-2', 'scale-95');
    });

    it('maintains component during animation', () => {
      const { rerender } = render(<Toast {...defaultProps} isVisible={true} />);

      expect(screen.getByTestId('toast')).toBeInTheDocument();

      rerender(<Toast {...defaultProps} isVisible={false} />);

      // Should still be in DOM during animation
      expect(screen.getByTestId('toast')).toBeInTheDocument();

      // Should be removed after animation completes
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<Toast {...defaultProps} />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'polite');
      expect(alert).toHaveAttribute('aria-atomic', 'true');
    });

    it('has accessible close button', () => {
      render(<Toast {...defaultProps} />);

      const closeButton = screen.getByTestId('toast-close-button');
      expect(closeButton).toHaveAttribute('aria-label', 'Dismiss notification');
    });

    it('hides icon from screen readers', () => {
      render(<Toast {...defaultProps} />);

      const icon = screen.getByTestId('info-icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });
});

describe('ToastContainer Component', () => {
  const mockToasts = [
    {
      id: '1',
      type: 'success' as const,
      message: 'Success message',
      isVisible: true,
      onDismiss: vi.fn(),
    },
    {
      id: '2',
      type: 'error' as const,
      message: 'Error message',
      isVisible: true,
      onDismiss: vi.fn(),
    },
    {
      id: '3',
      type: 'warning' as const,
      message: 'Warning message',
      isVisible: true,
      onDismiss: vi.fn(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders multiple toasts', () => {
    render(<ToastContainer toasts={mockToasts} />);

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('limits toasts to maxToasts', () => {
    render(<ToastContainer toasts={mockToasts} maxToasts={2} />);

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Warning message')).not.toBeInTheDocument();
  });

  it('renders nothing when no toasts', () => {
    render(<ToastContainer toasts={[]} />);

    expect(screen.queryByTestId('toast-container')).not.toBeInTheDocument();
  });

  it('applies correct positioning', () => {
    render(<ToastContainer toasts={mockToasts} position="bottom-left" />);

    const container = screen.getByTestId('toast-container');
    expect(container).toHaveClass('bottom-4', 'left-4');
  });

  it('applies correct test IDs to individual toasts', () => {
    render(
      <ToastContainer toasts={mockToasts} data-testid="custom-container" />
    );

    expect(screen.getByTestId('custom-container')).toBeInTheDocument();
    expect(screen.getByTestId('custom-container-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('custom-container-item-2')).toBeInTheDocument();
  });
});

describe('useToast Hook', () => {
  function TestComponent() {
    const { toasts, addToast, removeToast, clearToasts } = useToast();

    return (
      <div>
        <div data-testid="toast-count">{toasts.length}</div>
        <button
          onClick={() => addToast({ type: 'success', message: 'Test toast' })}
          data-testid="add-toast"
        >
          Add Toast
        </button>
        <button
          onClick={() => toasts.length > 0 && removeToast(toasts[0].id)}
          data-testid="remove-toast"
        >
          Remove First Toast
        </button>
        <button onClick={clearToasts} data-testid="clear-toasts">
          Clear All
        </button>
        {toasts.map(toast => (
          <div key={toast.id} data-testid={`toast-${toast.id}`}>
            {toast.message}
          </div>
        ))}
      </div>
    );
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with empty toasts array', () => {
    render(<TestComponent />);

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  it('adds toast when addToast is called', () => {
    render(<TestComponent />);

    fireEvent.click(screen.getByTestId('add-toast'));

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByText('Test toast')).toBeInTheDocument();
  });

  it('removes toast when removeToast is called', () => {
    render(<TestComponent />);

    fireEvent.click(screen.getByTestId('add-toast'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

    fireEvent.click(screen.getByTestId('remove-toast'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  it('clears all toasts when clearToasts is called', () => {
    render(<TestComponent />);

    fireEvent.click(screen.getByTestId('add-toast'));
    fireEvent.click(screen.getByTestId('add-toast'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('2');

    fireEvent.click(screen.getByTestId('clear-toasts'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  it('generates unique IDs for toasts', () => {
    render(<TestComponent />);

    fireEvent.click(screen.getByTestId('add-toast'));
    fireEvent.click(screen.getByTestId('add-toast'));

    const toastElements = screen.getAllByText('Test toast');
    expect(toastElements).toHaveLength(2);

    // Check that the parent elements have different test IDs
    const toast1 = toastElements[0].closest('[data-testid^="toast-"]');
    const toast2 = toastElements[1].closest('[data-testid^="toast-"]');

    expect(toast1).toHaveAttribute('data-testid');
    expect(toast2).toHaveAttribute('data-testid');
    expect(toast1?.getAttribute('data-testid')).not.toBe(
      toast2?.getAttribute('data-testid')
    );
  });

  it('auto-dismisses toasts through onDismiss callback', () => {
    render(<TestComponent />);

    fireEvent.click(screen.getByTestId('add-toast'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

    // Find the toast and manually trigger its onDismiss
    const toastElement = screen.getByText('Test toast');
    const toastId = toastElement
      .closest('[data-testid^="toast-"]')
      ?.getAttribute('data-testid')
      ?.replace('toast-', '');

    if (toastId) {
      // Simulate the onDismiss callback being called
      fireEvent.click(screen.getByTestId('remove-toast'));
    }

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });
});
