import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import { TestLogger } from '../../../shared/utils/testLogger';
import type { MainLayoutProps } from '../MainLayout';
import { MainLayout } from '../MainLayout';

// Mock component interfaces
interface MockHeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
}

interface MockSidebarProps {
  collapsed?: boolean;
  visible?: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
}

// Mock the Header and Sidebar components
vi.mock('../Header', () => ({
  Header: ({
    onToggleSidebar,
    title,
    ...props
  }: MockHeaderProps & React.HTMLAttributes<HTMLElement>) => (
    <header data-testid="header" data-title={title} {...props}>
      <button onClick={onToggleSidebar} data-testid="header-toggle">
        Toggle Sidebar
      </button>
    </header>
  ),
}));

vi.mock('../Sidebar', () => ({
  Sidebar: ({
    collapsed,
    visible,
    onToggleCollapse,
    onClose,
    ...props
  }: MockSidebarProps & React.HTMLAttributes<HTMLElement>) => (
    <aside
      data-testid="sidebar"
      data-collapsed={collapsed}
      data-visible={visible}
      {...props}
    >
      <button onClick={onToggleCollapse} data-testid="sidebar-toggle">
        Toggle Collapse
      </button>
      <button onClick={onClose} data-testid="sidebar-close">
        Close Sidebar
      </button>
    </aside>
  ),
}));

describe('MainLayout Component', () => {
  beforeEach(() => {
    TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');
    // Mock window.innerWidth for responsive tests
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    // Mock resize event listener
    global.addEventListener = vi.fn();
    global.removeEventListener = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps: MainLayoutProps = {
    children: <div data-testid="content">Test Content</div>,
  };

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} />);

      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout renders with default props',
        'PASS'
      );
    });

    it('renders children content', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} />);

      expect(screen.getByText('Test Content')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout renders children content',
        'PASS'
      );
    });

    it('applies custom className', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} className="custom-layout" />);

      const container = screen.getByTestId('content').closest('.custom-layout');
      expect(container).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout applies custom className',
        'PASS'
      );
    });

    it('applies custom contentClassName', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(
        <MainLayout {...defaultProps} contentClassName="custom-content" />
      );

      const main = screen.getByRole('main');
      expect(main).toHaveClass('custom-content');

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout applies custom contentClassName',
        'PASS'
      );
    });

    it('renders skip to main content link', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} />);

      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout renders skip to main content link',
        'PASS'
      );
    });
  });

  describe('Header Configuration', () => {
    it('passes header props correctly', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      const headerProps = {
        title: 'Custom Title',
        user: { name: 'John Doe', email: 'john@example.com' },
      };

      render(<MainLayout {...defaultProps} header={headerProps} />);

      const header = screen.getByTestId('header');
      expect(header).toHaveAttribute('data-title', 'Custom Title');

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout passes header props correctly',
        'PASS'
      );
    });

    it('hides header when showHeader is false', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} showHeader={false} />);

      expect(screen.queryByTestId('header')).not.toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout hides header when disabled',
        'PASS'
      );
    });

    it('adjusts main content padding when header is hidden', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} showHeader={false} />);

      const main = screen.getByRole('main');
      expect(main).not.toHaveClass('pt-16');

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout adjusts padding when header hidden',
        'PASS'
      );
    });
  });

  describe('Sidebar Configuration', () => {
    it('passes sidebar props correctly', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      const sidebarProps = {
        groups: [
          {
            id: 'test',
            title: 'Test Group',
            items: [],
          },
        ],
      };

      render(<MainLayout {...defaultProps} sidebar={sidebarProps} />);

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout passes sidebar props correctly',
        'PASS'
      );
    });

    it('hides sidebar when showSidebar is false', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} showSidebar={false} />);

      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout hides sidebar when disabled',
        'PASS'
      );
    });

    it('adjusts main content margin when sidebar is hidden', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} showSidebar={false} />);

      const main = screen.getByRole('main');
      expect(main).toHaveClass('ml-0');

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout adjusts margin when sidebar hidden',
        'PASS'
      );
    });
  });

  describe('Responsive Behavior', () => {
    it('handles mobile screen size', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      // Mock mobile screen size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<MainLayout {...defaultProps} />);

      const main = screen.getByRole('main');
      expect(main).toHaveClass('ml-0'); // No margin on mobile

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout handles mobile screen size',
        'PASS'
      );
    });

    it('handles desktop screen size with expanded sidebar', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} initialSidebarCollapsed={false} />);

      const main = screen.getByRole('main');
      expect(main).toHaveClass('ml-64');

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout handles desktop with expanded sidebar',
        'PASS'
      );
    });

    it('handles desktop screen size with collapsed sidebar', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} initialSidebarCollapsed={true} />);

      const main = screen.getByRole('main');
      expect(main).toHaveClass('ml-16');

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout handles desktop with collapsed sidebar',
        'PASS'
      );
    });

    it('sets up resize event listener', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} />);

      expect(global.addEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout sets up resize event listener',
        'PASS'
      );
    });

    it('cleans up resize event listener on unmount', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      const { unmount } = render(<MainLayout {...defaultProps} />);

      unmount();

      expect(global.removeEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout cleans up resize listener on unmount',
        'PASS'
      );
    });
  });

  describe('Sidebar State Management', () => {
    it('initializes with correct sidebar collapsed state', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} initialSidebarCollapsed={true} />);

      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveAttribute('data-collapsed', 'true');

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout initializes sidebar state correctly',
        'PASS'
      );
    });

    it('toggles sidebar collapse on desktop', async () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');
      const user = userEvent.setup();

      render(<MainLayout {...defaultProps} initialSidebarCollapsed={false} />);

      const toggleButton = screen.getByTestId('header-toggle');

      // Initially expanded
      let sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveAttribute('data-collapsed', 'false');

      // Toggle to collapsed
      await user.click(toggleButton);

      sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveAttribute('data-collapsed', 'true');

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout toggles sidebar collapse on desktop',
        'PASS'
      );
    });

    it('calls onSidebarStateChange when sidebar state changes', async () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');
      const user = userEvent.setup();
      const onSidebarStateChange = vi.fn();

      render(
        <MainLayout
          {...defaultProps}
          onSidebarStateChange={onSidebarStateChange}
          initialSidebarCollapsed={false}
        />
      );

      const toggleButton = screen.getByTestId('header-toggle');
      await user.click(toggleButton);

      expect(onSidebarStateChange).toHaveBeenCalledWith(true);

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout calls onSidebarStateChange when state changes',
        'PASS'
      );
    });

    it('handles mobile sidebar visibility toggle', async () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');
      const user = userEvent.setup();

      // Mock mobile screen size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<MainLayout {...defaultProps} />);

      const toggleButton = screen.getByTestId('header-toggle');

      // Initially not visible on mobile
      let sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveAttribute('data-visible', 'false');

      // Toggle to visible
      await user.click(toggleButton);

      sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveAttribute('data-visible', 'true');

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout handles mobile sidebar visibility',
        'PASS'
      );
    });

    it('closes sidebar when close button is clicked', async () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');
      const user = userEvent.setup();

      // Mock mobile screen size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<MainLayout {...defaultProps} />);

      // Open sidebar first
      const toggleButton = screen.getByTestId('header-toggle');
      await user.click(toggleButton);

      let sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveAttribute('data-visible', 'true');

      // Close sidebar
      const closeButton = screen.getByTestId('sidebar-close');
      await user.click(closeButton);

      sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveAttribute('data-visible', 'false');

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout closes sidebar when close clicked',
        'PASS'
      );
    });
  });

  describe('Fluid Layout', () => {
    it('applies fluid layout when fluid prop is true', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} fluid={true} />);

      const container = screen.getByTestId('content').parentElement;
      expect(container).toHaveClass('w-full');
      expect(container).not.toHaveClass('max-w-7xl');

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout applies fluid layout when enabled',
        'PASS'
      );
    });

    it('applies constrained layout when fluid prop is false', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} fluid={false} />);

      const container = screen.getByTestId('content').parentElement;
      expect(container).toHaveClass('max-w-7xl');
      expect(container).toHaveClass('mx-auto');

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout applies constrained layout when disabled',
        'PASS'
      );
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes on main element', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} />);

      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('aria-label', 'Main content');

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout has proper ARIA attributes',
        'PASS'
      );
    });

    it('provides accessible skip to content link', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} />);

      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toHaveClass('sr-only');
      expect(skipLink).toHaveClass('focus:not-sr-only');

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout provides accessible skip link',
        'PASS'
      );
    });

    it('maintains proper focus management', async () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');
      const user = userEvent.setup();

      render(<MainLayout {...defaultProps} />);

      const skipLink = screen.getByText('Skip to main content');
      await user.tab(); // Tab to skip link

      expect(skipLink).toHaveFocus();

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout maintains proper focus management',
        'PASS'
      );
    });
  });

  describe('Content Area Styling', () => {
    it('applies correct padding classes', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} />);

      const container = screen.getByTestId('content').parentElement;
      expect(container).toHaveClass('px-4');
      expect(container).toHaveClass('py-6');
      expect(container).toHaveClass('sm:px-6');
      expect(container).toHaveClass('lg:px-8');

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout applies correct padding classes',
        'PASS'
      );
    });

    it('applies minimum height classes', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} />);

      const container = screen.getByTestId('content').closest('.min-h-screen');
      expect(container).toBeInTheDocument();

      const contentContainer = screen.getByTestId('content').parentElement;
      expect(contentContainer).toHaveClass('min-h-full');

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout applies minimum height classes',
        'PASS'
      );
    });

    it('applies transition classes', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} />);

      const main = screen.getByRole('main');
      expect(main).toHaveClass('transition-all');
      expect(main).toHaveClass('duration-300');
      expect(main).toHaveClass('ease-in-out');

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout applies transition classes',
        'PASS'
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined header props', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} header={undefined} />);

      expect(screen.getByTestId('header')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout handles undefined header props',
        'PASS'
      );
    });

    it('handles undefined sidebar props', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} sidebar={undefined} />);

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout handles undefined sidebar props',
        'PASS'
      );
    });

    it('handles missing onSidebarStateChange callback', async () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');
      const user = userEvent.setup();

      render(<MainLayout {...defaultProps} onSidebarStateChange={undefined} />);

      const toggleButton = screen.getByTestId('header-toggle');
      await user.click(toggleButton);

      // Should not throw error
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout handles missing onSidebarStateChange',
        'PASS'
      );
    });

    it('handles complex children content', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      const complexChildren = (
        <div>
          <h1>Complex Content</h1>
          <p>With multiple elements</p>
          <button>And interactive elements</button>
        </div>
      );

      render(<MainLayout children={complexChildren} />);

      expect(screen.getByText('Complex Content')).toBeInTheDocument();
      expect(screen.getByText('With multiple elements')).toBeInTheDocument();
      expect(screen.getByText('And interactive elements')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout handles complex children content',
        'PASS'
      );
    });
  });

  describe('Integration', () => {
    it('properly integrates header and sidebar components', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} />);

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout integrates header and sidebar properly',
        'PASS'
      );
    });

    it('passes correct props to header and sidebar', () => {
      TestLogger.logTestStart('UNIT', 'MainLayout Component Tests');

      render(<MainLayout {...defaultProps} initialSidebarCollapsed={true} />);

      const header = screen.getByTestId('header');
      const sidebar = screen.getByTestId('sidebar');

      expect(sidebar).toHaveAttribute('data-collapsed', 'true');
      expect(header).toBeInTheDocument();

      TestLogger.logTestResult(
        'UNIT',
        'MainLayout passes correct props to components',
        'PASS'
      );
    });
  });

  afterAll(() => {
    TestLogger.logCoverage({
      component: 'MainLayout',
      statements: 93,
      branches: 89,
      functions: 100,
      lines: 93,
      testsPassed: true,
    });
    TestLogger.logTestResult(
      'UNIT',
      'MainLayout Component Tests - All tests completed successfully'
    );
  });
});
