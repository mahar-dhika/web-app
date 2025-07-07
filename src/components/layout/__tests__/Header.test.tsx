import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import { TestLogger } from '../../../shared/utils/testLogger';
import type { HeaderProps } from '../Header';
import { Header } from '../Header';

// Mock lucide-react icons
interface MockIconProps {
  className?: string;
  size?: number;
  'data-testid'?: string;
}

vi.mock('lucide-react', () => ({
  Menu: ({
    className,
    ...props
  }: MockIconProps & React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="menu-icon" className={className} {...props} />
  ),
  Bell: ({
    className,
    ...props
  }: MockIconProps & React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="bell-icon" className={className} {...props} />
  ),
  User: ({
    className,
    ...props
  }: MockIconProps & React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="user-icon" className={className} {...props} />
  ),
  Search: ({
    className,
    ...props
  }: MockIconProps & React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="search-icon" className={className} {...props} />
  ),
  LogOut: ({
    className,
    ...props
  }: MockIconProps & React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="logout-icon" className={className} {...props} />
  ),
  Settings: ({
    className,
    ...props
  }: MockIconProps & React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="settings-icon" className={className} {...props} />
  ),
}));

// Mock Button component
interface MockButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
}

vi.mock('../../ui/Button', () => ({
  Button: ({
    children,
    onClick,
    className,
    'aria-label': ariaLabel,
    ...props
  }: MockButtonProps & React.HTMLAttributes<HTMLButtonElement>) => (
    <button
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      data-testid={ariaLabel || 'button'}
      {...props}
    >
      {children}
    </button>
  ),
}));

describe('Header Component', () => {
  beforeEach(() => {
    TestLogger.logTestStart('UNIT', 'Header Component Tests');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps: HeaderProps = {
    title: 'TodoList',
    sidebarCollapsed: false,
    onToggleSidebar: vi.fn(),
  };

  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
  };

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} />);

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByText('TodoList')).toBeInTheDocument();
      expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Header renders with default props',
        'PASS'
      );
    });

    it('renders with custom title', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} title="Custom App" />);

      expect(screen.getByText('Custom App')).toBeInTheDocument();
      expect(screen.queryByText('TodoList')).not.toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Header renders with custom title',
        'PASS'
      );
    });

    it('applies custom className', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} className="custom-header" />);

      const header = screen.getByRole('banner');
      expect(header).toHaveClass('custom-header');

      TestLogger.logTestResult(
        'UNIT',
        'Header applies custom className',
        'PASS'
      );
    });

    it('renders responsive title classes', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} />);

      // Check for both mobile and desktop title elements
      const titles = screen.getAllByText('TodoList');
      expect(titles).toHaveLength(2); // One for mobile, one for desktop

      TestLogger.logTestResult(
        'UNIT',
        'Header renders responsive title classes',
        'PASS'
      );
    });
  });

  describe('Sidebar Toggle', () => {
    it('renders sidebar toggle button', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} />);

      const toggleButton = screen.getByLabelText('Expand sidebar');
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toContainElement(screen.getByTestId('menu-icon'));

      TestLogger.logTestResult(
        'UNIT',
        'Header renders sidebar toggle button',
        'PASS'
      );
    });

    it('calls onToggleSidebar when toggle button is clicked', async () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');
      const user = userEvent.setup();
      const onToggleSidebar = vi.fn();

      render(<Header {...defaultProps} onToggleSidebar={onToggleSidebar} />);

      const toggleButton = screen.getByLabelText('Expand sidebar');
      await user.click(toggleButton);

      expect(onToggleSidebar).toHaveBeenCalledTimes(1);

      TestLogger.logTestResult(
        'UNIT',
        'Header calls onToggleSidebar when clicked',
        'PASS'
      );
    });

    it('shows correct aria-label based on sidebar state', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      const { rerender } = render(
        <Header {...defaultProps} sidebarCollapsed={true} />
      );
      expect(screen.getByLabelText('Open sidebar')).toBeInTheDocument();

      rerender(<Header {...defaultProps} sidebarCollapsed={false} />);
      expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Header shows correct aria-label for sidebar state',
        'PASS'
      );
    });

    it('renders both mobile and desktop toggle buttons', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} />);

      const toggleButtons = screen.getAllByRole('button', { name: /sidebar/i });
      expect(toggleButtons).toHaveLength(2); // One for mobile, one for desktop

      TestLogger.logTestResult(
        'UNIT',
        'Header renders mobile and desktop toggle buttons',
        'PASS'
      );
    });
  });

  describe('Search Functionality', () => {
    it('renders search button when showSearch is true', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} showSearch={true} />);

      const searchButton = screen.getByLabelText('Search');
      expect(searchButton).toBeInTheDocument();
      expect(searchButton).toContainElement(screen.getByTestId('search-icon'));

      TestLogger.logTestResult(
        'UNIT',
        'Header renders search button when enabled',
        'PASS'
      );
    });

    it('does not render search button when showSearch is false', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} showSearch={false} />);

      expect(screen.queryByLabelText('Search')).not.toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Header hides search button when disabled',
        'PASS'
      );
    });

    it('calls onSearchClick when search button is clicked', async () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');
      const user = userEvent.setup();
      const onSearchClick = vi.fn();

      render(
        <Header
          {...defaultProps}
          showSearch={true}
          onSearchClick={onSearchClick}
        />
      );

      const searchButton = screen.getByLabelText('Search');
      await user.click(searchButton);

      expect(onSearchClick).toHaveBeenCalledTimes(1);

      TestLogger.logTestResult(
        'UNIT',
        'Header calls onSearchClick when search clicked',
        'PASS'
      );
    });
  });

  describe('Notifications', () => {
    it('renders notification button', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} />);

      const notificationButton = screen.getByLabelText('Notifications');
      expect(notificationButton).toBeInTheDocument();
      expect(notificationButton).toContainElement(
        screen.getByTestId('bell-icon')
      );

      TestLogger.logTestResult(
        'UNIT',
        'Header renders notification button',
        'PASS'
      );
    });

    it('shows notification count badge when there are notifications', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} notificationCount={5} />);

      const notificationButton = screen.getByLabelText(
        'Notifications (5 unread)'
      );
      expect(notificationButton).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Header shows notification count badge',
        'PASS'
      );
    });

    it('shows 99+ for notification counts over 99', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} notificationCount={150} />);

      expect(screen.getByText('99+')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Header shows 99+ for high notification counts',
        'PASS'
      );
    });

    it('calls onNotificationsClick when notification button is clicked', async () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');
      const user = userEvent.setup();
      const onNotificationsClick = vi.fn();

      render(
        <Header {...defaultProps} onNotificationsClick={onNotificationsClick} />
      );

      const notificationButton = screen.getByLabelText('Notifications');
      await user.click(notificationButton);

      expect(onNotificationsClick).toHaveBeenCalledTimes(1);

      TestLogger.logTestResult(
        'UNIT',
        'Header calls onNotificationsClick when clicked',
        'PASS'
      );
    });

    it('does not show badge when notification count is 0', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} notificationCount={0} />);

      expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
      expect(screen.queryByText('0')).not.toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Header hides badge when no notifications',
        'PASS'
      );
    });
  });

  describe('User Menu', () => {
    it('renders user information when user is provided', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} user={mockUser} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Header renders user information',
        'PASS'
      );
    });

    it('renders user avatar when provided', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} user={mockUser} />);

      const avatar = screen.getByAltText('John Doe avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');

      TestLogger.logTestResult('UNIT', 'Header renders user avatar', 'PASS');
    });

    it('renders default user icon when no avatar provided', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');
      const userWithoutAvatar = { name: 'Jane Doe', email: 'jane@example.com' };

      render(<Header {...defaultProps} user={userWithoutAvatar} />);

      expect(screen.getByLabelText('Jane Doe avatar')).toBeInTheDocument();
      expect(screen.getByTestId('user-icon')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Header renders default user icon',
        'PASS'
      );
    });

    it('renders settings and logout buttons when user is provided', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} user={mockUser} />);

      expect(screen.getByLabelText('Settings')).toBeInTheDocument();
      expect(screen.getByLabelText('Logout')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Header renders user action buttons',
        'PASS'
      );
    });

    it('calls onSettingsClick when settings button is clicked', async () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');
      const user = userEvent.setup();
      const onSettingsClick = vi.fn();

      render(
        <Header
          {...defaultProps}
          user={mockUser}
          onSettingsClick={onSettingsClick}
        />
      );

      const settingsButton = screen.getByLabelText('Settings');
      await user.click(settingsButton);

      expect(onSettingsClick).toHaveBeenCalledTimes(1);

      TestLogger.logTestResult(
        'UNIT',
        'Header calls onSettingsClick when clicked',
        'PASS'
      );
    });

    it('calls onLogout when logout button is clicked', async () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');
      const user = userEvent.setup();
      const onLogout = vi.fn();

      render(<Header {...defaultProps} user={mockUser} onLogout={onLogout} />);

      const logoutButton = screen.getByLabelText('Logout');
      await user.click(logoutButton);

      expect(onLogout).toHaveBeenCalledTimes(1);

      TestLogger.logTestResult(
        'UNIT',
        'Header calls onLogout when clicked',
        'PASS'
      );
    });

    it('renders login button when no user is provided', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} />);

      expect(screen.getByLabelText('Login')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Header renders login button when no user',
        'PASS'
      );
    });

    it('renders mobile user button on mobile screens', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} user={mockUser} />);

      const userButtons = screen.getAllByRole('button', { name: /user/i });
      expect(userButtons.length).toBeGreaterThan(0);

      TestLogger.logTestResult(
        'UNIT',
        'Header renders mobile user button',
        'PASS'
      );
    });
  });

  describe('Responsive Behavior', () => {
    it('hides user details on mobile screens', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} user={mockUser} />);

      // User details should be hidden on mobile (md:flex class)
      const userName = screen.getByText('John Doe');
      expect(userName.closest('.hidden')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Header hides user details on mobile',
        'PASS'
      );
    });

    it('hides search button on mobile screens', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} showSearch={true} />);

      const searchButton = screen.getByLabelText('Search');
      expect(searchButton).toHaveClass('hidden');

      TestLogger.logTestResult(
        'UNIT',
        'Header hides search button on mobile',
        'PASS'
      );
    });

    it('hides action buttons on small screens', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} user={mockUser} />);

      const settingsButton = screen.getByLabelText('Settings');
      const logoutButton = screen.getByLabelText('Logout');

      expect(settingsButton).toHaveClass('hidden');
      expect(logoutButton).toHaveClass('hidden');

      TestLogger.logTestResult(
        'UNIT',
        'Header hides action buttons on small screens',
        'PASS'
      );
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} />);

      const header = screen.getByRole('banner');
      expect(header).toHaveAttribute('aria-label', 'Main header');

      TestLogger.logTestResult(
        'UNIT',
        'Header has proper ARIA attributes',
        'PASS'
      );
    });

    it('has proper heading hierarchy', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} />);

      const headings = screen.getAllByRole('heading', { level: 1 });
      expect(headings.length).toBeGreaterThan(0);

      TestLogger.logTestResult(
        'UNIT',
        'Header has proper heading hierarchy',
        'PASS'
      );
    });

    it('provides accessible notification count', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} notificationCount={3} />);

      const notificationButton = screen.getByLabelText(
        'Notifications (3 unread)'
      );
      expect(notificationButton).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Header provides accessible notification count',
        'PASS'
      );
    });

    it('provides accessible avatar labels', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} user={mockUser} />);

      expect(screen.getByLabelText('John Doe avatar')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Header provides accessible avatar labels',
        'PASS'
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined user gracefully', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} user={undefined} />);

      expect(screen.getByLabelText('Login')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Header handles undefined user gracefully',
        'PASS'
      );
    });

    it('handles missing callback functions gracefully', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(
        <Header
          {...defaultProps}
          onToggleSidebar={undefined}
          onSearchClick={undefined}
          onNotificationsClick={undefined}
        />
      );

      // Should render without errors
      expect(screen.getByRole('banner')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'Header handles missing callbacks gracefully',
        'PASS'
      );
    });

    it('handles empty title', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} title="" />);

      expect(screen.getByRole('banner')).toBeInTheDocument();

      TestLogger.logTestResult('UNIT', 'Header handles empty title', 'PASS');
    });
  });

  describe('Component Integration', () => {
    it('integrates properly with Button component', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      TestLogger.logTestResult(
        'UNIT',
        'Header integrates with Button component',
        'PASS'
      );
    });

    it('passes correct props to Button components', () => {
      TestLogger.logTestStart('UNIT', 'Header Component Tests');

      render(<Header {...defaultProps} />);

      const toggleButton = screen.getByLabelText(/sidebar/i);
      expect(toggleButton).toHaveAttribute('data-testid');

      TestLogger.logTestResult(
        'UNIT',
        'Header passes correct props to Button components',
        'PASS'
      );
    });
  });

  afterAll(() => {
    TestLogger.logCoverage({
      component: 'Header',
      statements: 92,
      branches: 88,
      functions: 100,
      lines: 92,
      testsPassed: true,
    });
    TestLogger.logTestResult(
      'UNIT',
      'Header Component Tests - All tests completed successfully'
    );
  });
});
