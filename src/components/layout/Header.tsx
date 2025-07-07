import React from 'react';
import { clsx } from 'clsx';
import { Menu, Bell, User, Search, LogOut, Settings } from 'lucide-react';
import { Button } from '../ui/Button';

export interface HeaderProps {
  /**
   * Whether the sidebar is collapsed
   */
  sidebarCollapsed?: boolean;

  /**
   * Function to toggle sidebar
   */
  onToggleSidebar?: () => void;

  /**
   * Current user information
   */
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };

  /**
   * Number of unread notifications
   */
  notificationCount?: number;

  /**
   * Function called when user clicks search
   */
  onSearchClick?: () => void;

  /**
   * Function called when user clicks notifications
   */
  onNotificationsClick?: () => void;

  /**
   * Function called when user wants to logout
   */
  onLogout?: () => void;

  /**
   * Function called when user wants to access settings
   */
  onSettingsClick?: () => void;

  /**
   * Whether to show the search button
   */
  showSearch?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Application title/logo text
   */
  title?: string;
}

/**
 * Header component for the main application layout
 * Provides navigation, user actions, and responsive behavior
 */
export const Header: React.FC<HeaderProps> = ({
  sidebarCollapsed = false,
  onToggleSidebar,
  user,
  notificationCount = 0,
  onSearchClick,
  onNotificationsClick,
  onLogout,
  onSettingsClick,
  showSearch = true,
  className,
  title = 'TodoList',
}) => {
  const hasNotifications = notificationCount > 0;

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 bg-white border-b border-gray-200',
        'shadow-sm backdrop-blur-sm bg-white/95',
        'transition-all duration-200 ease-in-out',
        className
      )}
      role="banner"
      aria-label="Main header"
    >
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left section - Sidebar toggle and title */}
        <div className="flex items-center space-x-4">
          {/* Sidebar toggle button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden"
            aria-label={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
            aria-expanded={!sidebarCollapsed}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop sidebar toggle */}
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleSidebar}
            className="hidden lg:flex"
            aria-label={
              sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
            }
            aria-expanded={!sidebarCollapsed}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Application title */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
              {title}
            </h1>
            <h1 className="text-lg font-semibold text-gray-900 sm:hidden">
              {title}
            </h1>
          </div>
        </div>

        {/* Right section - Actions and user menu */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search button */}
          {showSearch && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onSearchClick}
              className="hidden md:flex"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              onClick={onNotificationsClick}
              aria-label={
                hasNotifications
                  ? `Notifications (${notificationCount} unread)`
                  : 'Notifications'
              }
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {hasNotifications && (
                <span
                  className={clsx(
                    'absolute -top-1 -right-1 bg-red-500 text-white',
                    'rounded-full text-xs font-medium',
                    'min-w-[1.25rem] h-5 flex items-center justify-center',
                    'border-2 border-white'
                  )}
                  aria-hidden="true"
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </Button>
          </div>

          {/* User menu */}
          {user ? (
            <div className="flex items-center space-x-3">
              {/* User avatar and info */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>

                {/* Avatar */}
                <div className="relative">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.name} avatar`}
                      className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div
                      className={clsx(
                        'h-8 w-8 rounded-full bg-primary-100 border-2 border-gray-200',
                        'flex items-center justify-center'
                      )}
                      aria-label={`${user.name} avatar`}
                    >
                      <User className="h-4 w-4 text-primary-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile user button */}
              <Button
                variant="secondary"
                size="sm"
                className="md:hidden"
                aria-label="User menu"
              >
                <User className="h-5 w-5" />
              </Button>

              {/* Settings */}
              <Button
                variant="secondary"
                size="sm"
                onClick={onSettingsClick}
                aria-label="Settings"
                className="hidden sm:flex"
              >
                <Settings className="h-5 w-5" />
              </Button>

              {/* Logout */}
              <Button
                variant="secondary"
                size="sm"
                onClick={onLogout}
                aria-label="Logout"
                className="hidden sm:flex"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            /* Login button when no user */
            <Button variant="primary" size="sm" aria-label="Login">
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
