import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestLogger } from '../../../shared/utils/testLogger';
import { Button } from '../Button';

// Mock TestLogger for testing
vi.mock('../../../shared/utils/testLogger', () => ({
  TestLogger: {
    logTestStart: vi.fn(),
    logTestResult: vi.fn(),
    logCoverage: vi.fn(),
  },
}));

describe('Button Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    TestLogger.logTestStart('UNIT', 'Button Component Tests');
  });

  afterEach(() => {
    TestLogger.logCoverage({
      component: 'Button',
      testsPassed: true,
      timestamp: new Date().toISOString(),
      statements: 95,
      branches: 90,
      functions: 100,
      lines: 95,
    });
  });

  describe('Basic Rendering', () => {
    it('renders with correct text content', () => {
      render(<Button>Click me</Button>);

      const button = screen.getByTestId('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');

      TestLogger.logTestResult('UNIT', 'Button renders with text', 'PASS');
    });

    it('renders as a button element by default', () => {
      render(<Button>Button</Button>);

      const button = screen.getByTestId('button');
      expect(button.tagName).toBe('BUTTON');
      expect(button).toHaveAttribute('type', 'button');

      TestLogger.logTestResult(
        'UNIT',
        'Button renders as button element',
        'PASS'
      );
    });

    it('applies custom className', () => {
      render(<Button className="custom-class">Button</Button>);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('custom-class');

      TestLogger.logTestResult(
        'UNIT',
        'Button applies custom className',
        'PASS'
      );
    });
  });

  describe('Variants', () => {
    it('renders with primary variant by default', () => {
      render(<Button>Primary Button</Button>);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('bg-blue-600', 'text-white');

      TestLogger.logTestResult(
        'UNIT',
        'Button renders primary variant',
        'PASS'
      );
    });

    it('renders with secondary variant', () => {
      render(<Button variant="secondary">Secondary Button</Button>);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('bg-gray-200', 'text-gray-900');

      TestLogger.logTestResult(
        'UNIT',
        'Button renders secondary variant',
        'PASS'
      );
    });

    it('renders with danger variant', () => {
      render(<Button variant="danger">Danger Button</Button>);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('bg-red-600', 'text-white');

      TestLogger.logTestResult('UNIT', 'Button renders danger variant', 'PASS');
    });
  });

  describe('Sizes', () => {
    it('renders with medium size by default', () => {
      render(<Button>Medium Button</Button>);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm');

      TestLogger.logTestResult('UNIT', 'Button renders medium size', 'PASS');
    });

    it('renders with small size', () => {
      render(<Button size="sm">Small Button</Button>);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');

      TestLogger.logTestResult('UNIT', 'Button renders small size', 'PASS');
    });

    it('renders with large size', () => {
      render(<Button size="lg">Large Button</Button>);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-base');

      TestLogger.logTestResult('UNIT', 'Button renders large size', 'PASS');
    });
  });

  describe('Click Events', () => {
    it('handles click events', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Clickable Button</Button>);

      const button = screen.getByTestId('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);

      TestLogger.logTestResult('UNIT', 'Button handles click events', 'PASS');
    });

    it('does not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled Button
        </Button>
      );

      const button = screen.getByTestId('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();

      TestLogger.logTestResult(
        'UNIT',
        'Button does not click when disabled',
        'PASS'
      );
    });

    it('does not call onClick when loading', async () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} loading>
          Loading Button
        </Button>
      );

      const button = screen.getByTestId('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();

      TestLogger.logTestResult(
        'UNIT',
        'Button does not click when loading',
        'PASS'
      );
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when loading', () => {
      render(<Button loading>Loading Button</Button>);

      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toBeInTheDocument();

      TestLogger.logTestResult('UNIT', 'Button shows loading spinner', 'PASS');
    });

    it('sets cursor to wait when loading', () => {
      render(<Button loading>Loading Button</Button>);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('cursor-wait');

      TestLogger.logTestResult(
        'UNIT',
        'Button sets cursor wait when loading',
        'PASS'
      );
    });

    it('makes button content semi-transparent when loading', () => {
      render(<Button loading>Loading Button</Button>);

      const button = screen.getByTestId('button');
      const textSpan = button.querySelector('span');
      expect(textSpan).toHaveClass('opacity-75');

      TestLogger.logTestResult(
        'UNIT',
        'Button content opacity when loading',
        'PASS'
      );
    });

    it('sets aria-label to Loading when loading', () => {
      render(<Button loading>Loading Button</Button>);

      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('aria-label', 'Loading...');

      TestLogger.logTestResult(
        'UNIT',
        'Button aria-label when loading',
        'PASS'
      );
    });

    it('shows correct spinner size for different button sizes', () => {
      const { rerender } = render(
        <Button loading size="sm">
          Small Loading
        </Button>
      );

      let spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveClass('h-3', 'w-3');

      rerender(
        <Button loading size="md">
          Medium Loading
        </Button>
      );

      spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveClass('h-4', 'w-4');

      rerender(
        <Button loading size="lg">
          Large Loading
        </Button>
      );

      spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveClass('h-5', 'w-5');

      TestLogger.logTestResult('UNIT', 'Button spinner sizes', 'PASS');
    });
  });

  describe('Disabled State', () => {
    it('disables button when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>);

      const button = screen.getByTestId('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');

      TestLogger.logTestResult('UNIT', 'Button disabled state', 'PASS');
    });

    it('applies disabled styles', () => {
      render(<Button disabled>Disabled Button</Button>);

      const button = screen.getByTestId('button');
      // Check that the button has disabled attribute
      expect(button).toBeDisabled();

      // Check that the button has the Tailwind disabled classes
      expect(button).toHaveClass(
        'disabled:opacity-50',
        'disabled:cursor-not-allowed',
        'disabled:pointer-events-none'
      );

      TestLogger.logTestResult('UNIT', 'Button disabled styles', 'PASS');
    });

    it('is disabled when loading', () => {
      render(<Button loading>Loading Button</Button>);

      const button = screen.getByTestId('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');

      TestLogger.logTestResult('UNIT', 'Button disabled when loading', 'PASS');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Button>Accessible Button</Button>);

      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('aria-disabled', 'false');

      TestLogger.logTestResult('UNIT', 'Button ARIA attributes', 'PASS');
    });

    it('supports keyboard navigation', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Keyboard Button</Button>);

      const button = screen.getByTestId('button');
      button.focus();

      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);

      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);

      TestLogger.logTestResult('UNIT', 'Button keyboard navigation', 'PASS');
    });

    it('has focus styles', () => {
      render(<Button>Focus Button</Button>);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass(
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-offset-2'
      );

      TestLogger.logTestResult('UNIT', 'Button focus styles', 'PASS');
    });

    it('has correct focus ring color for each variant', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);

      let button = screen.getByTestId('button');
      expect(button).toHaveClass('focus:ring-blue-500');

      rerender(<Button variant="secondary">Secondary</Button>);
      button = screen.getByTestId('button');
      expect(button).toHaveClass('focus:ring-gray-500');

      rerender(<Button variant="danger">Danger</Button>);
      button = screen.getByTestId('button');
      expect(button).toHaveClass('focus:ring-red-500');

      TestLogger.logTestResult('UNIT', 'Button focus ring colors', 'PASS');
    });
  });

  describe('Props and Attributes', () => {
    it('forwards additional props to button element', () => {
      render(
        <Button data-custom="test" id="custom-button">
          Custom Button
        </Button>
      );

      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('data-custom', 'test');
      expect(button).toHaveAttribute('id', 'custom-button');

      TestLogger.logTestResult('UNIT', 'Button forwards props', 'PASS');
    });

    it('supports different button types', () => {
      render(<Button type="submit">Submit Button</Button>);

      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('type', 'submit');

      TestLogger.logTestResult('UNIT', 'Button supports types', 'PASS');
    });

    it('supports ref forwarding', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Ref Button</Button>);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveTextContent('Ref Button');

      TestLogger.logTestResult('UNIT', 'Button ref forwarding', 'PASS');
    });
  });

  describe('Hover and Transition States', () => {
    it('has transition classes for smooth animations', () => {
      render(<Button>Transition Button</Button>);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('transition-colors', 'duration-200');

      TestLogger.logTestResult('UNIT', 'Button transition classes', 'PASS');
    });

    it('has hover classes for each variant', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);

      let button = screen.getByTestId('button');
      expect(button).toHaveClass('hover:bg-blue-700');

      rerender(<Button variant="secondary">Secondary</Button>);
      button = screen.getByTestId('button');
      expect(button).toHaveClass('hover:bg-gray-300');

      rerender(<Button variant="danger">Danger</Button>);
      button = screen.getByTestId('button');
      expect(button).toHaveClass('hover:bg-red-700');

      TestLogger.logTestResult('UNIT', 'Button hover classes', 'PASS');
    });
  });

  describe('Complex Scenarios', () => {
    it('handles rapid click events properly', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Rapid Click Button</Button>);

      const button = screen.getByTestId('button');

      // Simulate rapid clicks
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);

      TestLogger.logTestResult('UNIT', 'Button handles rapid clicks', 'PASS');
    });

    it('maintains state consistency when props change', async () => {
      const handleClick = vi.fn();

      const { rerender } = render(
        <Button onClick={handleClick} disabled>
          Initial Button
        </Button>
      );

      let button = screen.getByTestId('button');
      expect(button).toBeDisabled();

      // Enable the button
      rerender(
        <Button onClick={handleClick} disabled={false}>
          Enabled Button
        </Button>
      );

      button = screen.getByTestId('button');
      expect(button).not.toBeDisabled();

      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);

      TestLogger.logTestResult('UNIT', 'Button state consistency', 'PASS');
    });

    it('works with form submission', () => {
      const handleSubmit = vi.fn(e => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Submit Form</Button>
        </form>
      );

      const button = screen.getByTestId('button');
      fireEvent.click(button);

      expect(handleSubmit).toHaveBeenCalledTimes(1);

      TestLogger.logTestResult('UNIT', 'Button form submission', 'PASS');
    });
  });
});
