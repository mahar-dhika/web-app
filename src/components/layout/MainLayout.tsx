import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Header, HeaderProps } from './Header';
import { Sidebar, SidebarProps } from './Sidebar';

export interface MainLayoutProps {
  /**
   * Content to render in the main area
   */
  children: React.ReactNode;

  /**
   * Header configuration
   */
  header?: Partial<HeaderProps>;

  /**
   * Sidebar configuration
   */
  sidebar?: Partial<SidebarProps>;

  /**
   * Whether the layout should be fluid (no max width)
   */
  fluid?: boolean;

  /**
   * Additional CSS classes for the main content area
   */
  contentClassName?: string;

  /**
   * Additional CSS classes for the layout container
   */
  className?: string;

  /**
   * Whether to show the sidebar
   */
  showSidebar?: boolean;

  /**
   * Whether to show the header
   */
  showHeader?: boolean;

  /**
   * Initial sidebar collapsed state
   */
  initialSidebarCollapsed?: boolean;

  /**
   * Function called when sidebar state changes
   */
  onSidebarStateChange?: (collapsed: boolean) => void;
}

/**
 * Main layout component that combines Header, Sidebar, and content area
 * Provides responsive behavior and state management for layout elements
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  header = {},
  sidebar = {},
  fluid = false,
  contentClassName,
  className,
  showSidebar = true,
  showHeader = true,
  initialSidebarCollapsed = false,
  onSidebarStateChange,
}) => {
  // Sidebar state management
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    initialSidebarCollapsed
  );
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);

      // Auto-collapse sidebar on mobile
      if (mobile && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [sidebarCollapsed]);

  // Handle sidebar toggle
  const handleToggleSidebar = () => {
    if (isMobile) {
      // On mobile, toggle visibility instead of collapse
      setSidebarVisible(!sidebarVisible);
    } else {
      // On desktop, toggle collapse
      const newCollapsed = !sidebarCollapsed;
      setSidebarCollapsed(newCollapsed);

      // Notify parent of state change
      if (onSidebarStateChange) {
        onSidebarStateChange(newCollapsed);
      }
    }
  };

  // Handle sidebar close (mobile)
  const handleSidebarClose = () => {
    setSidebarVisible(false);
  };

  // Calculate main content margins based on sidebar state
  const getMainContentStyles = () => {
    if (!showSidebar) return 'ml-0';

    if (isMobile) {
      return 'ml-0'; // No margin on mobile
    }

    return sidebarCollapsed ? 'ml-16' : 'ml-64';
  };

  // Prepare header props
  const headerProps: HeaderProps = {
    sidebarCollapsed: isMobile ? false : sidebarCollapsed,
    onToggleSidebar: handleToggleSidebar,
    ...header,
  };

  // Prepare sidebar props
  const sidebarProps: SidebarProps = {
    collapsed: sidebarCollapsed,
    onToggleCollapse: handleToggleSidebar,
    visible: isMobile ? sidebarVisible : true,
    onClose: handleSidebarClose,
    showOverlay: isMobile,
    ...sidebar,
  };

  return (
    <div
      className={clsx(
        'min-h-screen bg-gray-50',
        'transition-all duration-300 ease-in-out',
        className
      )}
    >
      {/* Header */}
      {showHeader && <Header {...headerProps} />}

      {/* Sidebar */}
      {showSidebar && <Sidebar {...sidebarProps} />}

      {/* Main content area */}
      <main
        className={clsx(
          'transition-all duration-300 ease-in-out',
          getMainContentStyles(),
          showHeader && 'pt-16', // Add top padding for fixed header
          contentClassName
        )}
        role="main"
        aria-label="Main content"
      >
        {/* Content container */}
        <div
          className={clsx(
            'min-h-full',
            fluid ? 'w-full' : 'max-w-7xl mx-auto',
            'px-4 py-6 sm:px-6 lg:px-8'
          )}
        >
          {children}
        </div>
      </main>

      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className={clsx(
          'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
          'bg-primary-600 text-white px-4 py-2 rounded-md',
          'focus:z-50 focus:outline-none focus:ring-2 focus:ring-white'
        )}
      >
        Skip to main content
      </a>
    </div>
  );
};

export default MainLayout;
