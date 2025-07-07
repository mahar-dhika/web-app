import { render, screen } from '@testing-library/react';
import { Spinner, SpinnerOverlay, type SpinnerProps } from '../Spinner';

const defaultProps: SpinnerProps = {};

describe('Spinner Component', () => {
  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      render(<Spinner {...defaultProps} />);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
      expect(screen.getByTestId('spinner-icon')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders with custom test ID', () => {
      render(<Spinner data-testid="custom-spinner" />);

      expect(screen.getByTestId('custom-spinner')).toBeInTheDocument();
      expect(screen.getByTestId('custom-spinner-icon')).toBeInTheDocument();
    });

    it('renders with custom aria-label', () => {
      render(<Spinner aria-label="Custom loading message" />);

      expect(
        screen.getByLabelText('Custom loading message')
      ).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Spinner className="custom-class" />);

      const icon = screen.getByTestId('spinner-icon');
      expect(icon).toHaveClass('custom-class');
    });
  });

  describe('Sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

    sizes.forEach(size => {
      it(`renders with ${size} size`, () => {
        render(<Spinner size={size} />);

        const icon = screen.getByTestId('spinner-icon');
        const sizeClasses = {
          xs: 'h-3 w-3',
          sm: 'h-4 w-4',
          md: 'h-6 w-6',
          lg: 'h-8 w-8',
          xl: 'h-12 w-12',
        };

        expect(icon).toHaveClass(sizeClasses[size]);
      });
    });
  });

  describe('Colors', () => {
    const colors = [
      'primary',
      'secondary',
      'success',
      'error',
      'warning',
      'info',
    ] as const;

    colors.forEach(color => {
      it(`renders with ${color} color`, () => {
        render(<Spinner color={color} />);

        const icon = screen.getByTestId('spinner-icon');
        const colorClasses = {
          primary: 'text-blue-600',
          secondary: 'text-gray-600',
          success: 'text-green-600',
          error: 'text-red-600',
          warning: 'text-yellow-600',
          info: 'text-blue-500',
        };

        expect(icon).toHaveClass(colorClasses[color]);
      });
    });
  });

  describe('Text Display', () => {
    it('does not show text by default', () => {
      render(<Spinner />);

      expect(screen.queryByTestId('spinner-text')).not.toBeInTheDocument();
    });

    it('shows default text when showText is true', () => {
      render(<Spinner showText />);

      expect(screen.getByTestId('spinner-text')).toBeInTheDocument();
      expect(screen.getByTestId('spinner-text')).toHaveTextContent(
        'Loading...'
      );
    });

    it('shows custom text when provided', () => {
      render(<Spinner showText text="Please wait..." />);

      expect(screen.getByTestId('spinner-text')).toHaveTextContent(
        'Please wait...'
      );
    });

    it('positions text at bottom by default', () => {
      render(<Spinner showText />);

      const container = screen.getByTestId('spinner');
      expect(container).toHaveClass('flex-col');

      const text = screen.getByTestId('spinner-text');
      expect(text).toHaveClass('mt-2');
    });

    it('positions text to the right when specified', () => {
      render(<Spinner showText textPosition="right" />);

      const container = screen.getByTestId('spinner');
      expect(container).toHaveClass('flex-row');

      const text = screen.getByTestId('spinner-text');
      expect(text).toHaveClass('ml-3');
    });

    it('applies correct text size based on spinner size', () => {
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
      const textSizeClasses = {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      };

      sizes.forEach(size => {
        const { unmount } = render(<Spinner size={size} showText />);

        const text = screen.getByTestId('spinner-text');
        expect(text).toHaveClass(textSizeClasses[size]);

        unmount();
      });
    });

    it('applies color to text matching spinner color', () => {
      render(<Spinner showText color="success" />);

      const text = screen.getByTestId('spinner-text');
      expect(text).toHaveClass('text-green-600');
    });
  });

  describe('Animation', () => {
    it('applies spin animation to the icon', () => {
      render(<Spinner />);

      const icon = screen.getByTestId('spinner-icon');
      expect(icon).toHaveClass('animate-spin');
    });

    it('has correct SVG structure', () => {
      render(<Spinner />);

      const icon = screen.getByTestId('spinner-icon');
      expect(icon.tagName).toBe('svg');
      expect(icon).toHaveAttribute('fill', 'none');
      expect(icon).toHaveAttribute('viewBox', '0 0 24 24');

      // Check for circle and path elements
      const circle = icon.querySelector('circle');
      const path = icon.querySelector('path');

      expect(circle).toBeInTheDocument();
      expect(path).toBeInTheDocument();

      expect(circle).toHaveAttribute('cx', '12');
      expect(circle).toHaveAttribute('cy', '12');
      expect(circle).toHaveAttribute('r', '10');
    });
  });

  describe('Accessibility', () => {
    it('has correct role and aria attributes', () => {
      render(<Spinner />);

      const container = screen.getByTestId('spinner');
      expect(container).toHaveAttribute('role', 'status');
      expect(container).toHaveAttribute('aria-label', 'Loading');
    });

    it('hides icon from screen readers', () => {
      render(<Spinner />);

      const icon = screen.getByTestId('spinner-icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('allows custom aria-label', () => {
      render(<Spinner aria-label="Processing your request" />);

      const container = screen.getByTestId('spinner');
      expect(container).toHaveAttribute(
        'aria-label',
        'Processing your request'
      );
    });
  });
});

describe('SpinnerOverlay Component', () => {
  describe('Visibility', () => {
    it('renders when isVisible is true', () => {
      render(<SpinnerOverlay isVisible={true} />);

      expect(screen.getByTestId('spinner-overlay')).toBeInTheDocument();
      expect(screen.getByTestId('spinner-overlay-spinner')).toBeInTheDocument();
    });

    it('does not render when isVisible is false', () => {
      render(<SpinnerOverlay isVisible={false} />);

      expect(screen.queryByTestId('spinner-overlay')).not.toBeInTheDocument();
    });
  });

  describe('Overlay Styling', () => {
    it('applies correct positioning classes', () => {
      render(<SpinnerOverlay isVisible={true} />);

      const overlay = screen.getByTestId('spinner-overlay');
      expect(overlay).toHaveClass(
        'fixed',
        'inset-0',
        'z-50',
        'flex',
        'items-center',
        'justify-center'
      );
    });

    it('applies default backdrop opacity', () => {
      render(<SpinnerOverlay isVisible={true} />);

      const overlay = screen.getByTestId('spinner-overlay');
      expect(overlay).toHaveClass('bg-white', 'bg-opacity-75');
    });

    it('applies light backdrop opacity', () => {
      render(<SpinnerOverlay isVisible={true} backdropOpacity="light" />);

      const overlay = screen.getByTestId('spinner-overlay');
      expect(overlay).toHaveClass('bg-white', 'bg-opacity-50');
    });

    it('applies dark backdrop opacity', () => {
      render(<SpinnerOverlay isVisible={true} backdropOpacity="dark" />);

      const overlay = screen.getByTestId('spinner-overlay');
      expect(overlay).toHaveClass('bg-black', 'bg-opacity-50');
    });

    it('applies custom overlay className', () => {
      render(
        <SpinnerOverlay isVisible={true} overlayClassName="custom-overlay" />
      );

      const overlay = screen.getByTestId('spinner-overlay');
      expect(overlay).toHaveClass('custom-overlay');
    });
  });

  describe('Spinner Integration', () => {
    it('renders with default spinner props', () => {
      render(<SpinnerOverlay isVisible={true} />);

      const spinner = screen.getByTestId('spinner-overlay-spinner');
      expect(spinner).toBeInTheDocument();

      // Check default props
      const icon = screen.getByTestId('spinner-overlay-spinner-icon');
      expect(icon).toHaveClass('h-8', 'w-8'); // lg size

      const text = screen.getByTestId('spinner-overlay-spinner-text');
      expect(text).toHaveTextContent('Loading...');
    });

    it('passes through spinner props', () => {
      render(
        <SpinnerOverlay
          isVisible={true}
          size="xl"
          color="success"
          text="Processing..."
        />
      );

      const icon = screen.getByTestId('spinner-overlay-spinner-icon');
      expect(icon).toHaveClass('h-12', 'w-12', 'text-green-600');

      const text = screen.getByTestId('spinner-overlay-spinner-text');
      expect(text).toHaveTextContent('Processing...');
    });

    it('applies custom spinner className', () => {
      render(
        <SpinnerOverlay isVisible={true} spinnerClassName="custom-spinner" />
      );

      const icon = screen.getByTestId('spinner-overlay-spinner-icon');
      expect(icon).toHaveClass('custom-spinner');
    });

    it('applies custom test ID', () => {
      render(<SpinnerOverlay isVisible={true} data-testid="custom-overlay" />);

      expect(screen.getByTestId('custom-overlay')).toBeInTheDocument();
      expect(screen.getByTestId('custom-overlay-spinner')).toBeInTheDocument();
    });
  });

  describe('Default Configuration', () => {
    it('shows text by default', () => {
      render(<SpinnerOverlay isVisible={true} />);

      expect(
        screen.getByTestId('spinner-overlay-spinner-text')
      ).toBeInTheDocument();
    });

    it('uses large size by default', () => {
      render(<SpinnerOverlay isVisible={true} />);

      const icon = screen.getByTestId('spinner-overlay-spinner-icon');
      expect(icon).toHaveClass('h-8', 'w-8');
    });

    it('can disable text display', () => {
      render(<SpinnerOverlay isVisible={true} showText={false} />);

      expect(
        screen.queryByTestId('spinner-overlay-spinner-text')
      ).not.toBeInTheDocument();
    });
  });
});
