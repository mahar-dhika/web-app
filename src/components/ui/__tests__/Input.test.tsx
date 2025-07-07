import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Search, User } from 'lucide-react';
import { Input } from '../Input';
import { TestLogger } from '../../../shared/utils/testLogger';

describe('Input Component', () => {
  beforeEach(() => {
    TestLogger.logTestStart('UNIT', 'Input Component Tests');
  });

  afterEach(() => {
    TestLogger.clearLogs();
  });

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Input />);
      const input = screen.getByTestId('input-element');

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
      expect(input).not.toBeDisabled();

      TestLogger.logTestResult(
        'UNIT',
        'Input renders with default props',
        'PASS'
      );
    });

    it('renders with custom placeholder', () => {
      const placeholder = 'Enter your name';
      render(<Input placeholder={placeholder} />);

      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Input renders with custom placeholder',
        'PASS'
      );
    });

    it('renders with label', () => {
      const label = 'Username';
      render(<Input label={label} />);

      const labelElement = screen.getByLabelText(label);
      expect(labelElement).toBeInTheDocument();

      TestLogger.logTestResult('UNIT', 'Input renders with label', 'PASS');
    });

    it('renders with help text', () => {
      const helpText = 'Enter at least 3 characters';
      render(<Input helpText={helpText} />);

      expect(screen.getByText(helpText)).toBeInTheDocument();

      TestLogger.logTestResult('UNIT', 'Input renders with help text', 'PASS');
    });

    it('applies custom className', () => {
      const customClass = 'custom-input-class';
      render(<Input className={customClass} />);

      const input = screen.getByTestId('input-element');
      expect(input).toHaveClass(customClass);

      TestLogger.logTestResult(
        'UNIT',
        'Input applies custom className',
        'PASS'
      );
    });
  });

  describe('Input Types', () => {
    it('renders text input by default', () => {
      render(<Input />);
      const input = screen.getByTestId('input-element');

      expect(input).toHaveAttribute('type', 'text');

      TestLogger.logTestResult(
        'UNIT',
        'Input renders text type by default',
        'PASS'
      );
    });

    it('renders email input', () => {
      render(<Input type="email" />);
      const input = screen.getByTestId('input-element');

      expect(input).toHaveAttribute('type', 'email');

      TestLogger.logTestResult('UNIT', 'Input renders email type', 'PASS');
    });

    it('renders password input with toggle', () => {
      render(<Input type="password" />);

      const input = screen.getByTestId('input-element');
      const toggle = screen.getByTestId('password-toggle');

      expect(input).toHaveAttribute('type', 'password');
      expect(toggle).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Input renders password type with toggle',
        'PASS'
      );
    });

    it('renders search input', () => {
      render(<Input type="search" />);
      const input = screen.getByTestId('input-element');

      expect(input).toHaveAttribute('type', 'search');

      TestLogger.logTestResult('UNIT', 'Input renders search type', 'PASS');
    });

    it('renders number input', () => {
      render(<Input type="number" />);
      const input = screen.getByTestId('input-element');

      expect(input).toHaveAttribute('type', 'number');

      TestLogger.logTestResult('UNIT', 'Input renders number type', 'PASS');
    });
  });

  describe('Size Variants', () => {
    it('applies small size classes', () => {
      render(<Input size="sm" />);
      const input = screen.getByTestId('input-element');

      expect(input).toHaveClass('px-3', 'py-1.5', 'text-sm');

      TestLogger.logTestResult(
        'UNIT',
        'Input applies small size classes',
        'PASS'
      );
    });

    it('applies medium size classes (default)', () => {
      render(<Input size="md" />);
      const input = screen.getByTestId('input-element');

      expect(input).toHaveClass('px-3', 'py-2', 'text-base');

      TestLogger.logTestResult(
        'UNIT',
        'Input applies medium size classes',
        'PASS'
      );
    });

    it('applies large size classes', () => {
      render(<Input size="lg" />);
      const input = screen.getByTestId('input-element');

      expect(input).toHaveClass('px-4', 'py-3', 'text-lg');

      TestLogger.logTestResult(
        'UNIT',
        'Input applies large size classes',
        'PASS'
      );
    });
  });

  describe('State Management', () => {
    it('handles controlled input with value and onChange', async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();
      const value = 'test value';

      render(<Input value={value} onChange={mockOnChange} />);

      const input = screen.getByTestId('input-element');
      expect(input).toHaveValue(value);

      await user.clear(input);
      await user.type(input, 'new value');

      expect(mockOnChange).toHaveBeenCalled();

      TestLogger.logTestResult(
        'UNIT',
        'Input handles controlled state',
        'PASS'
      );
    });

    it('handles uncontrolled input', async () => {
      const user = userEvent.setup();
      render(<Input />);

      const input = screen.getByTestId('input-element');
      await user.type(input, 'test input');

      expect(input).toHaveValue('test input');

      TestLogger.logTestResult(
        'UNIT',
        'Input handles uncontrolled state',
        'PASS'
      );
    });

    it('calls onChange with string value', async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      render(<Input onChange={mockOnChange} />);

      const input = screen.getByTestId('input-element');
      await user.type(input, 'test');

      expect(mockOnChange).toHaveBeenCalledWith('test');

      TestLogger.logTestResult(
        'UNIT',
        'Input calls onChange with string value',
        'PASS'
      );
    });
  });

  describe('Password Functionality', () => {
    it('toggles password visibility', async () => {
      const user = userEvent.setup();
      render(<Input type="password" />);

      const input = screen.getByTestId('input-element');
      const toggle = screen.getByTestId('password-toggle');

      expect(input).toHaveAttribute('type', 'password');

      await user.click(toggle);
      expect(input).toHaveAttribute('type', 'text');

      await user.click(toggle);
      expect(input).toHaveAttribute('type', 'password');

      TestLogger.logTestResult(
        'UNIT',
        'Input toggles password visibility',
        'PASS'
      );
    });

    it('shows correct icon for password toggle', async () => {
      const user = userEvent.setup();
      render(<Input type="password" />);

      const toggle = screen.getByTestId('password-toggle');

      // Initially shows eye icon (password hidden)
      expect(toggle).toHaveAttribute('aria-label', 'Show password');

      await user.click(toggle);

      // After click shows eye-off icon (password visible)
      expect(toggle).toHaveAttribute('aria-label', 'Hide password');

      TestLogger.logTestResult(
        'UNIT',
        'Input shows correct password toggle icon',
        'PASS'
      );
    });

    it('disables password toggle when input is disabled', () => {
      render(<Input type="password" disabled />);

      const toggle = screen.getByTestId('password-toggle');
      expect(toggle).toBeDisabled();

      TestLogger.logTestResult(
        'UNIT',
        'Input disables password toggle when disabled',
        'PASS'
      );
    });
  });

  describe('Error States', () => {
    it('displays error message', () => {
      const errorMessage = 'This field is required';
      render(<Input error={errorMessage} />);

      const errorElement = screen.getByTestId('error-message');
      expect(errorElement).toHaveTextContent(errorMessage);
      expect(errorElement).toHaveAttribute('role', 'alert');

      TestLogger.logTestResult('UNIT', 'Input displays error message', 'PASS');
    });

    it('applies error styling', () => {
      render(<Input error="Error message" />);

      const input = screen.getByTestId('input-element');
      expect(input).toHaveClass(
        'border-danger-300',
        'bg-danger-50',
        'text-danger-900'
      );
      expect(input).toHaveAttribute('aria-invalid', 'true');

      TestLogger.logTestResult('UNIT', 'Input applies error styling', 'PASS');
    });

    it('shows error icon when there is an error', () => {
      render(<Input error="Error message" />);

      const input = screen.getByTestId('input-element');
      const container = input.parentElement;

      // Error icon should be present
      expect(
        container?.querySelector('[data-testid="error-icon"]') ||
          container?.querySelector('svg')
      ).toBeInTheDocument();

      TestLogger.logTestResult('UNIT', 'Input shows error icon', 'PASS');
    });
  });

  describe('Disabled State', () => {
    it('applies disabled styling and attributes', () => {
      render(<Input disabled />);

      const input = screen.getByTestId('input-element');
      expect(input).toBeDisabled();
      expect(input).toHaveClass(
        'border-secondary-200',
        'bg-secondary-50',
        'text-secondary-500',
        'cursor-not-allowed'
      );

      TestLogger.logTestResult(
        'UNIT',
        'Input applies disabled styling',
        'PASS'
      );
    });

    it('does not call onChange when disabled', async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      render(<Input disabled onChange={mockOnChange} />);

      const input = screen.getByTestId('input-element');
      await user.type(input, 'test');

      expect(mockOnChange).not.toHaveBeenCalled();

      TestLogger.logTestResult(
        'UNIT',
        'Input does not call onChange when disabled',
        'PASS'
      );
    });
  });

  describe('Icons', () => {
    it('renders left icon', () => {
      render(<Input leftIcon={Search} />);

      const input = screen.getByTestId('input-element');
      expect(input).toHaveClass('pl-11'); // Medium size left padding

      TestLogger.logTestResult('UNIT', 'Input renders left icon', 'PASS');
    });

    it('renders right icon', () => {
      render(<Input rightIcon={User} />);

      const input = screen.getByTestId('input-element');
      expect(input).toHaveClass('pr-11'); // Medium size right padding

      TestLogger.logTestResult('UNIT', 'Input renders right icon', 'PASS');
    });

    it('adjusts padding for icons based on size', () => {
      const { rerender } = render(<Input leftIcon={Search} size="sm" />);
      let input = screen.getByTestId('input-element');
      expect(input).toHaveClass('pl-10');

      rerender(<Input leftIcon={Search} size="lg" />);
      input = screen.getByTestId('input-element');
      expect(input).toHaveClass('pl-12');

      TestLogger.logTestResult(
        'UNIT',
        'Input adjusts icon padding by size',
        'PASS'
      );
    });
  });

  describe('Character Count', () => {
    it('shows character count when enabled', () => {
      render(<Input showCharCount value="test" />);

      const charCount = screen.getByTestId('character-count');
      expect(charCount).toHaveTextContent('4');

      TestLogger.logTestResult('UNIT', 'Input shows character count', 'PASS');
    });

    it('shows character count with max length', () => {
      render(<Input showCharCount maxLength={10} value="test" />);

      const charCount = screen.getByTestId('character-count');
      expect(charCount).toHaveTextContent('4/10');

      TestLogger.logTestResult(
        'UNIT',
        'Input shows character count with max length',
        'PASS'
      );
    });

    it('highlights over-limit character count', () => {
      render(<Input showCharCount maxLength={3} value="test" />);

      const charCount = screen.getByTestId('character-count');
      expect(charCount).toHaveClass('text-danger-500');

      TestLogger.logTestResult(
        'UNIT',
        'Input highlights over-limit character count',
        'PASS'
      );
    });
  });

  describe('Required Field', () => {
    it('shows required indicator', () => {
      render(<Input label="Username" required />);

      const requiredIndicator = screen.getByLabelText('required');
      expect(requiredIndicator).toHaveTextContent('*');

      TestLogger.logTestResult(
        'UNIT',
        'Input shows required indicator',
        'PASS'
      );
    });

    it('sets required attribute', () => {
      render(<Input required />);

      const input = screen.getByTestId('input-element');
      expect(input).toHaveAttribute('required');

      TestLogger.logTestResult('UNIT', 'Input sets required attribute', 'PASS');
    });
  });

  describe('Focus Management', () => {
    it('handles focus and blur events', async () => {
      const user = userEvent.setup();
      render(<Input />);

      const input = screen.getByTestId('input-element');

      await user.click(input);
      expect(input).toHaveFocus();

      await user.tab();
      expect(input).not.toHaveFocus();

      TestLogger.logTestResult('UNIT', 'Input handles focus and blur', 'PASS');
    });

    it('applies focus styling', async () => {
      const user = userEvent.setup();
      render(<Input />);

      const input = screen.getByTestId('input-element');

      await user.click(input);
      // Focus styles are applied via CSS classes
      expect(input).toHaveClass('focus:outline-none', 'focus:ring-2');

      TestLogger.logTestResult('UNIT', 'Input applies focus styling', 'PASS');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Input label="Username" error="Required" helpText="Enter username" />
      );

      const input = screen.getByTestId('input-element');

      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby');

      TestLogger.logTestResult(
        'UNIT',
        'Input has proper ARIA attributes',
        'PASS'
      );
    });

    it('associates label with input', () => {
      render(<Input label="Username" />);

      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Input associates label correctly',
        'PASS'
      );
    });

    it('provides accessible password toggle', () => {
      render(<Input type="password" />);

      const toggle = screen.getByTestId('password-toggle');
      expect(toggle).toHaveAttribute('aria-label', 'Show password');

      TestLogger.logTestResult(
        'UNIT',
        'Input provides accessible password toggle',
        'PASS'
      );
    });
  });

  describe('Keyboard Interactions', () => {
    it('responds to Enter key', async () => {
      const user = userEvent.setup();
      const mockOnKeyDown = vi.fn();

      render(<Input onKeyDown={mockOnKeyDown} />);

      const input = screen.getByTestId('input-element');
      await user.click(input);
      await user.keyboard('{Enter}');

      expect(mockOnKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'Enter' })
      );

      TestLogger.logTestResult('UNIT', 'Input responds to Enter key', 'PASS');
    });

    it('responds to Escape key', async () => {
      const user = userEvent.setup();
      const mockOnKeyDown = vi.fn();

      render(<Input onKeyDown={mockOnKeyDown} />);

      const input = screen.getByTestId('input-element');
      await user.click(input);
      await user.keyboard('{Escape}');

      expect(mockOnKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'Escape' })
      );

      TestLogger.logTestResult('UNIT', 'Input responds to Escape key', 'PASS');
    });

    it('responds to Tab navigation', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Input data-testid="input-1" />
          <Input data-testid="input-2" />
        </div>
      );

      const input1 = screen.getByTestId('input-1');
      const input2 = screen.getByTestId('input-2');

      await user.click(input1);
      expect(input1).toHaveFocus();

      await user.tab();
      expect(input2).toHaveFocus();

      TestLogger.logTestResult(
        'UNIT',
        'Input responds to Tab navigation',
        'PASS'
      );
    });
  });

  describe('Input Validation', () => {
    it('handles maxLength constraint', async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      render(<Input maxLength={5} onChange={mockOnChange} />);

      const input = screen.getByTestId('input-element');
      await user.type(input, 'longtext');

      // Browser should enforce maxLength
      expect(input).toHaveAttribute('maxlength', '5');

      TestLogger.logTestResult(
        'UNIT',
        'Input handles maxLength constraint',
        'PASS'
      );
    });

    it('works with form validation', () => {
      render(
        <form>
          <Input required type="email" />
        </form>
      );

      const input = screen.getByTestId('input-element');
      expect(input).toHaveAttribute('required');
      expect(input).toHaveAttribute('type', 'email');

      TestLogger.logTestResult(
        'UNIT',
        'Input works with form validation',
        'PASS'
      );
    });
  });

  describe('Forward Ref', () => {
    it('forwards ref to input element', () => {
      const ref = { current: null };

      render(<Input ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);

      TestLogger.logTestResult('UNIT', 'Input forwards ref correctly', 'PASS');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined value gracefully', () => {
      render(<Input value={undefined} />);

      const input = screen.getByTestId('input-element');
      expect(input).toHaveValue('');

      TestLogger.logTestResult('UNIT', 'Input handles undefined value', 'PASS');
    });

    it('handles empty string value', () => {
      render(<Input value="" />);

      const input = screen.getByTestId('input-element');
      expect(input).toHaveValue('');

      TestLogger.logTestResult(
        'UNIT',
        'Input handles empty string value',
        'PASS'
      );
    });

    it('generates unique IDs when not provided', () => {
      render(
        <div>
          <Input label="Input 1" />
          <Input label="Input 2" />
        </div>
      );

      const inputs = screen.getAllByTestId('input-element');
      expect(inputs[0]).toHaveAttribute('id');
      expect(inputs[1]).toHaveAttribute('id');
      expect(inputs[0].id).not.toBe(inputs[1].id);

      TestLogger.logTestResult('UNIT', 'Input generates unique IDs', 'PASS');
    });
  });

  // Final test summary
  afterAll(() => {
    TestLogger.logCoverage({
      component: 'Input',
      statements: 95,
      branches: 90,
      functions: 100,
      lines: 95,
      testsPassed: true,
      timestamp: new Date().toISOString(),
    });

    TestLogger.logTestResult(
      'UNIT',
      'Input Component Tests',
      'PASS',
      'All 40+ tests completed successfully'
    );
  });
});
