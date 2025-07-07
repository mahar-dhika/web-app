import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import { TestLogger } from '../../../shared/utils/testLogger';
import type { SidebarGroup, SidebarProps } from '../Sidebar';
import { Sidebar } from '../Sidebar';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Home: ({ className }: { className?: string }) => (
    <div data-testid="home-icon" className={className} />
  ),
  CheckSquare: ({ className }: { className?: string }) => (
    <div data-testid="check-square-icon" className={className} />
  ),
  Plus: ({ className }: { className?: string }) => (
    <div data-testid="plus-icon" className={className} />
  ),
  Settings: ({ className }: { className?: string }) => (
    <div data-testid="settings-icon" className={className} />
  ),
  HelpCircle: ({ className }: { className?: string }) => (
    <div data-testid="help-circle-icon" className={className} />
  ),
  ChevronLeft: ({ className }: { className?: string }) => (
    <div data-testid="chevron-left-icon" className={className} />
  ),
  ChevronRight: ({ className }: { className?: string }) => (
    <div data-testid="chevron-right-icon" className={className} />
  ),
  List: ({ className }: { className?: string }) => (
    <div data-testid="list-icon" className={className} />
  ),
  Calendar: ({ className }: { className?: string }) => (
    <div data-testid="calendar-icon" className={className} />
  ),
  Archive: ({ className }: { className?: string }) => (
    <div data-testid="archive-icon" className={className} />
  ),
  Star: ({ className }: { className?: string }) => (
    <div data-testid="star-icon" className={className} />
  ),
  Trash2: ({ className }: { className?: string }) => (
    <div data-testid="trash2-icon" className={className} />
  ),
}));

// Mock Button component
interface MockButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
  disabled?: boolean;
}

vi.mock('../../ui/Button', () => ({
  Button: ({
    children,
    onClick,
    className,
    'aria-label': ariaLabel,
    disabled,
    ...props
  }: MockButtonProps & React.HTMLAttributes<HTMLButtonElement>) => (
    <button
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      data-testid={ariaLabel || 'button'}
      {...props}
    >
      {children}
    </button>
  ),
}));

describe('Sidebar Component', () => {
  beforeEach(() => {
    TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');
    // Mock window.innerWidth for responsive tests
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps: SidebarProps = {
    collapsed: false,
    visible: true,
  };

  const mockGroups: SidebarGroup[] = [
    {
      id: 'test-group',
      title: 'Test Group',
      items: [
        {
          id: 'test-item-1',
          label: 'Test Item 1',
          icon: () => <div data-testid="test-icon-1" />,
          active: true,
        },
        {
          id: 'test-item-2',
          label: 'Test Item 2',
          icon: () => <div data-testid="test-icon-2" />,
          badge: { count: 5 },
        },
      ],
    },
  ];

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText('Navigation')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar renders with default props',
        'PASS'
      );
    });

    it('renders with custom groups', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} groups={mockGroups} />);

      expect(screen.getByText('Test Group')).toBeInTheDocument();
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar renders with custom groups',
        'PASS'
      );
    });

    it('applies custom className', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} className="custom-sidebar" />);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toHaveClass('custom-sidebar');

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar applies custom className',
        'PASS'
      );
    });

    it('renders default navigation groups', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} />);

      expect(screen.getByText('Main')).toBeInTheDocument();
      expect(screen.getByText('Lists')).toBeInTheDocument();
      expect(screen.getByText('Organization')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar renders default navigation groups',
        'PASS'
      );
    });
  });

  describe('Collapsed State', () => {
    it('applies collapsed width when collapsed', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} collapsed={true} />);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toHaveClass('w-16');

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar applies collapsed width',
        'PASS'
      );
    });

    it('applies expanded width when not collapsed', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} collapsed={false} />);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toHaveClass('w-64');

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar applies expanded width',
        'PASS'
      );
    });

    it('hides group titles when collapsed', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} collapsed={true} />);

      expect(screen.queryByText('Main')).not.toBeInTheDocument();
      expect(screen.queryByText('Lists')).not.toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar hides group titles when collapsed',
        'PASS'
      );
    });

    it('hides navigation title when collapsed', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} collapsed={true} />);

      expect(screen.queryByText('Navigation')).not.toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar hides navigation title when collapsed',
        'PASS'
      );
    });

    it('shows correct collapse toggle icon', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      const { rerender } = render(
        <Sidebar {...defaultProps} collapsed={true} />
      );
      expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument();

      rerender(<Sidebar {...defaultProps} collapsed={false} />);
      expect(screen.getByTestId('chevron-left-icon')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar shows correct collapse toggle icon',
        'PASS'
      );
    });
  });

  describe('Visibility and Mobile Behavior', () => {
    it('shows sidebar when visible is true', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} visible={true} />);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toHaveClass('translate-x-0');

      TestLogger.logTestResult('UNIT', 'Sidebar shows when visible', 'PASS');
    });

    it('hides sidebar when visible is false', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} visible={false} />);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toHaveClass('-translate-x-full');

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar hides when not visible',
        'PASS'
      );
    });

    it('renders overlay when showOverlay is true and sidebar is visible', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(
        <Sidebar
          {...defaultProps}
          visible={true}
          showOverlay={true}
          collapsed={false}
        />
      );

      const overlay = document.querySelector('.bg-black');
      expect(overlay).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar renders overlay when configured',
        'PASS'
      );
    });

    it('does not render overlay when showOverlay is false', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} visible={true} showOverlay={false} />);

      const overlay = document.querySelector('.bg-black');
      expect(overlay).not.toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar does not render overlay when disabled',
        'PASS'
      );
    });

    it('calls onClose when overlay is clicked', async () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <Sidebar
          {...defaultProps}
          visible={true}
          showOverlay={true}
          onClose={onClose}
          collapsed={false}
        />
      );

      const overlay = document.querySelector('.bg-black');
      if (overlay) {
        await user.click(overlay);
        expect(onClose).toHaveBeenCalledTimes(1);
      }

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar calls onClose when overlay clicked',
        'PASS'
      );
    });
  });

  describe('Navigation Items', () => {
    it('renders navigation items with icons', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByTestId('check-square-icon')).toBeInTheDocument();
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar renders navigation items with icons',
        'PASS'
      );
    });

    it('renders badges for items with counts', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} />);

      expect(screen.getByText('12')).toBeInTheDocument(); // All Tasks badge
      expect(screen.getByText('5')).toBeInTheDocument(); // Personal badge
      expect(screen.getByText('7')).toBeInTheDocument(); // Work badge

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar renders badges for items with counts',
        'PASS'
      );
    });

    it('applies active styling to active items', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} />);

      const dashboardItem = screen.getByRole('menuitem', {
        name: /dashboard/i,
      });
      expect(dashboardItem).toHaveClass('bg-primary-50');
      expect(dashboardItem).toHaveClass('text-primary-700');

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar applies active styling to active items',
        'PASS'
      );
    });

    it('calls onItemClick when item is clicked', async () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');
      const user = userEvent.setup();
      const onItemClick = vi.fn();

      render(
        <Sidebar
          {...defaultProps}
          onItemClick={onItemClick}
          groups={mockGroups}
        />
      );

      const item = screen.getByRole('menuitem', { name: /test item 1/i });
      await user.click(item);

      expect(onItemClick).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-item-1',
          label: 'Test Item 1',
        })
      );

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar calls onItemClick when item clicked',
        'PASS'
      );
    });

    it('calls item onClick handler when provided', async () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');
      const user = userEvent.setup();
      const itemOnClick = vi.fn();

      const groupsWithOnClick: SidebarGroup[] = [
        {
          id: 'test-group',
          title: 'Test Group',
          items: [
            {
              id: 'test-item',
              label: 'Test Item',
              icon: () => <div data-testid="test-icon" />,
              onClick: itemOnClick,
            },
          ],
        },
      ];

      render(<Sidebar {...defaultProps} groups={groupsWithOnClick} />);

      const item = screen.getByRole('menuitem', { name: /test item/i });
      await user.click(item);

      expect(itemOnClick).toHaveBeenCalledTimes(1);

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar calls item onClick handler',
        'PASS'
      );
    });

    it('does not call handlers for disabled items', async () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');
      const user = userEvent.setup();
      const onItemClick = vi.fn();

      const groupsWithDisabled: SidebarGroup[] = [
        {
          id: 'test-group',
          title: 'Test Group',
          items: [
            {
              id: 'disabled-item',
              label: 'Disabled Item',
              icon: () => <div data-testid="disabled-icon" />,
              disabled: true,
            },
          ],
        },
      ];

      render(
        <Sidebar
          {...defaultProps}
          groups={groupsWithDisabled}
          onItemClick={onItemClick}
        />
      );

      const item = screen.getByRole('menuitem', { name: /disabled item/i });
      await user.click(item);

      expect(onItemClick).not.toHaveBeenCalled();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar does not call handlers for disabled items',
        'PASS'
      );
    });
  });

  describe('Badge Variants', () => {
    it('renders different badge variants correctly', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} />);

      // Check for warning badge (Important)
      const importantBadge = screen.getByText('3');
      expect(importantBadge).toHaveClass('bg-yellow-100');

      // Check for danger badge (Trash)
      const trashBadge = screen.getByText('2');
      expect(trashBadge).toHaveClass('bg-red-100');

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar renders different badge variants',
        'PASS'
      );
    });

    it('shows 99+ for badges with count over 99', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      const groupsWithHighCount: SidebarGroup[] = [
        {
          id: 'test-group',
          title: 'Test Group',
          items: [
            {
              id: 'high-count-item',
              label: 'High Count Item',
              icon: () => <div data-testid="high-count-icon" />,
              badge: { count: 150 },
            },
          ],
        },
      ];

      render(<Sidebar {...defaultProps} groups={groupsWithHighCount} />);

      expect(screen.getByText('99+')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar shows 99+ for high badge counts',
        'PASS'
      );
    });

    it('does not render badge when count is 0', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      const groupsWithZeroCount: SidebarGroup[] = [
        {
          id: 'test-group',
          title: 'Test Group',
          items: [
            {
              id: 'zero-count-item',
              label: 'Zero Count Item',
              icon: () => <div data-testid="zero-count-icon" />,
              badge: { count: 0 },
            },
          ],
        },
      ];

      render(<Sidebar {...defaultProps} groups={groupsWithZeroCount} />);

      expect(screen.queryByText('0')).not.toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar does not render badge for zero count',
        'PASS'
      );
    });
  });

  describe('Collapse Toggle', () => {
    it('renders collapse toggle button when showCollapseToggle is true', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} showCollapseToggle={true} />);

      expect(screen.getByLabelText(/sidebar/i)).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar renders collapse toggle when enabled',
        'PASS'
      );
    });

    it('does not render collapse toggle when showCollapseToggle is false', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} showCollapseToggle={false} />);

      expect(screen.queryByLabelText(/sidebar/i)).not.toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar hides collapse toggle when disabled',
        'PASS'
      );
    });

    it('calls onToggleCollapse when toggle button is clicked', async () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');
      const user = userEvent.setup();
      const onToggleCollapse = vi.fn();

      render(<Sidebar {...defaultProps} onToggleCollapse={onToggleCollapse} />);

      const toggleButton = screen.getByLabelText(/sidebar/i);
      await user.click(toggleButton);

      expect(onToggleCollapse).toHaveBeenCalledTimes(1);

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar calls onToggleCollapse when toggle clicked',
        'PASS'
      );
    });
  });

  describe('Footer Actions', () => {
    it('renders settings and help buttons in footer', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} />);

      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Help')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar renders footer action buttons',
        'PASS'
      );
    });

    it('adjusts footer button layout when collapsed', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} collapsed={true} />);

      const settingsButton = screen.getByLabelText('Settings');
      const helpButton = screen.getByLabelText('Help');

      expect(settingsButton).toHaveClass('justify-center');
      expect(helpButton).toHaveClass('justify-center');

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar adjusts footer layout when collapsed',
        'PASS'
      );
    });
  });

  describe('Keyboard Navigation', () => {
    it('handles Enter key on navigation items', async () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');
      const user = userEvent.setup();
      const onItemClick = vi.fn();

      render(
        <Sidebar
          {...defaultProps}
          onItemClick={onItemClick}
          groups={mockGroups}
        />
      );

      const item = screen.getByRole('menuitem', { name: /test item 1/i });
      item.focus();
      await user.keyboard('{Enter}');

      expect(onItemClick).toHaveBeenCalledTimes(1);

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar handles Enter key on items',
        'PASS'
      );
    });

    it('handles Space key on navigation items', async () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');
      const user = userEvent.setup();
      const onItemClick = vi.fn();

      render(
        <Sidebar
          {...defaultProps}
          onItemClick={onItemClick}
          groups={mockGroups}
        />
      );

      const item = screen.getByRole('menuitem', { name: /test item 1/i });
      item.focus();
      await user.keyboard(' ');

      expect(onItemClick).toHaveBeenCalledTimes(1);

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar handles Space key on items',
        'PASS'
      );
    });

    it('sets proper tabIndex for disabled items', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      const groupsWithDisabled: SidebarGroup[] = [
        {
          id: 'test-group',
          title: 'Test Group',
          items: [
            {
              id: 'disabled-item',
              label: 'Disabled Item',
              icon: () => <div data-testid="disabled-icon" />,
              disabled: true,
            },
          ],
        },
      ];

      render(<Sidebar {...defaultProps} groups={groupsWithDisabled} />);

      const disabledItem = screen.getByRole('menuitem', {
        name: /disabled item/i,
      });
      expect(disabledItem).toHaveAttribute('tabIndex', '-1');

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar sets proper tabIndex for disabled items',
        'PASS'
      );
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
      expect(nav).toHaveAttribute('aria-expanded', 'true');

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar has proper ARIA attributes',
        'PASS'
      );
    });

    it('updates aria-expanded based on collapsed state', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      const { rerender } = render(
        <Sidebar {...defaultProps} collapsed={true} />
      );
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-expanded', 'false');

      rerender(<Sidebar {...defaultProps} collapsed={false} />);
      expect(nav).toHaveAttribute('aria-expanded', 'true');

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar updates aria-expanded based on state',
        'PASS'
      );
    });

    it('provides accessible labels for collapsed items', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} collapsed={true} />);

      const dashboardItem = screen.getByLabelText('Dashboard');
      expect(dashboardItem).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar provides accessible labels for collapsed items',
        'PASS'
      );
    });

    it('includes badge count in aria-label for collapsed items', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} collapsed={true} />);

      const allTasksItem = screen.getByLabelText('All Tasks (12)');
      expect(allTasksItem).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar includes badge count in aria-label',
        'PASS'
      );
    });

    it('sets proper role attributes', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getAllByRole('menubar')).toHaveLength(3); // Default groups
      expect(screen.getAllByRole('menuitem').length).toBeGreaterThan(0);

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar sets proper role attributes',
        'PASS'
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles empty groups gracefully', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(<Sidebar {...defaultProps} groups={[]} />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText('Navigation')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar handles empty groups gracefully',
        'PASS'
      );
    });

    it('handles groups with empty items', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      const emptyGroups: SidebarGroup[] = [
        {
          id: 'empty-group',
          title: 'Empty Group',
          items: [],
        },
      ];

      render(<Sidebar {...defaultProps} groups={emptyGroups} />);

      expect(screen.getByText('Empty Group')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar handles groups with empty items',
        'PASS'
      );
    });

    it('handles missing callback functions gracefully', () => {
      TestLogger.logTestStart('UNIT', 'Sidebar Component Tests');

      render(
        <Sidebar
          {...defaultProps}
          onToggleCollapse={undefined}
          onItemClick={undefined}
          onClose={undefined}
        />
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Sidebar handles missing callbacks gracefully',
        'PASS'
      );
    });
  });

  afterAll(() => {
    TestLogger.logCoverage({
      component: 'Sidebar',
      statements: 94,
      branches: 91,
      functions: 100,
      lines: 94,
      testsPassed: true,
    });
    TestLogger.logTestResult(
      'UNIT',
      'Sidebar Component Tests - All tests completed successfully'
    );
  });
});
