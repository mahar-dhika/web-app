import React from 'react';
import { clsx } from 'clsx';
import {
  Home,
  CheckSquare,
  Plus,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  List,
  Calendar,
  Archive,
  Star,
  Trash2,
} from 'lucide-react';
import { Button } from '../ui/Button';

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  badge?: {
    count: number;
    variant?: 'default' | 'success' | 'warning' | 'danger';
  };
  disabled?: boolean;
}

export interface SidebarGroup {
  id: string;
  title: string;
  items: SidebarItem[];
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}

export interface SidebarProps {
  /**
   * Whether the sidebar is collapsed (narrow mode)
   */
  collapsed?: boolean;

  /**
   * Function to toggle sidebar collapse state
   */
  onToggleCollapse?: () => void;

  /**
   * Sidebar navigation groups
   */
  groups?: SidebarGroup[];

  /**
   * Function called when a navigation item is clicked
   */
  onItemClick?: (item: SidebarItem) => void;

  /**
   * Whether to show the collapse toggle button
   */
  showCollapseToggle?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Whether the sidebar is visible (for mobile)
   */
  visible?: boolean;

  /**
   * Function to close the sidebar (for mobile)
   */
  onClose?: () => void;

  /**
   * Whether to show overlay on mobile
   */
  showOverlay?: boolean;
}

const defaultGroups: SidebarGroup[] = [
  {
    id: 'main',
    title: 'Main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: Home,
        active: true,
      },
      {
        id: 'all-tasks',
        label: 'All Tasks',
        icon: CheckSquare,
        badge: { count: 12 },
      },
      {
        id: 'create-task',
        label: 'Create Task',
        icon: Plus,
      },
    ],
  },
  {
    id: 'lists',
    title: 'Lists',
    items: [
      {
        id: 'personal',
        label: 'Personal',
        icon: List,
        badge: { count: 5 },
      },
      {
        id: 'work',
        label: 'Work',
        icon: List,
        badge: { count: 7 },
      },
      {
        id: 'important',
        label: 'Important',
        icon: Star,
        badge: { count: 3, variant: 'warning' },
      },
    ],
  },
  {
    id: 'organization',
    title: 'Organization',
    items: [
      {
        id: 'calendar',
        label: 'Calendar',
        icon: Calendar,
      },
      {
        id: 'archived',
        label: 'Archived',
        icon: Archive,
        badge: { count: 15 },
      },
      {
        id: 'trash',
        label: 'Trash',
        icon: Trash2,
        badge: { count: 2, variant: 'danger' },
      },
    ],
  },
];

const getBadgeVariantStyles = (variant: string = 'default') => {
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    danger: 'bg-red-100 text-red-600',
  };
  return variants[variant as keyof typeof variants] || variants.default;
};

/**
 * Sidebar component for navigation
 * Supports responsive behavior, collapsible groups, and badges
 */
export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
  groups = defaultGroups,
  onItemClick,
  showCollapseToggle = true,
  className,
  visible = true,
  onClose,
  showOverlay = true,
}) => {
  const handleItemClick = (item: SidebarItem) => {
    if (item.disabled) return;

    // Call the item's onClick handler if it exists
    if (item.onClick) {
      item.onClick();
    }

    // Call the global onItemClick handler
    if (onItemClick) {
      onItemClick(item);
    }

    // Close sidebar on mobile after item click
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, item: SidebarItem) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleItemClick(item);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {showOverlay && visible && !collapsed && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-0 z-40 h-full bg-white border-r border-gray-200',
          'transition-all duration-300 ease-in-out',
          'flex flex-col',
          // Width states
          collapsed ? 'w-16' : 'w-64',
          // Mobile visibility
          visible ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
        role="navigation"
        aria-label="Main navigation"
        aria-expanded={!collapsed}
      >
        {/* Header */}
        <div
          className={clsx(
            'flex items-center justify-between p-4 border-b border-gray-200',
            'h-16' // Match header height
          )}
        >
          {!collapsed && (
            <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
          )}

          {/* Collapse toggle */}
          {showCollapseToggle && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className={clsx(collapsed && 'mx-auto')}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {/* Navigation content */}
        <nav className="flex-1 overflow-y-auto py-4" role="menu">
          {groups.map(group => (
            <div key={group.id} className="mb-6 last:mb-4">
              {/* Group title */}
              {!collapsed && (
                <div className="px-4 mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {group.title}
                  </h3>
                </div>
              )}

              {/* Group items */}
              <ul role="menubar" className="space-y-1 px-2">
                {group.items.map(item => {
                  const IconComponent = item.icon;
                  return (
                    <li key={item.id} role="none">
                      <button
                        type="button"
                        role="menuitem"
                        tabIndex={item.disabled ? -1 : 0}
                        onClick={() => handleItemClick(item)}
                        onKeyDown={e => handleKeyDown(e, item)}
                        disabled={item.disabled}
                        aria-label={
                          collapsed
                            ? `${item.label}${
                                item.badge ? ` (${item.badge.count})` : ''
                              }`
                            : undefined
                        }
                        className={clsx(
                          'w-full flex items-center px-3 py-2 rounded-lg',
                          'text-sm font-medium transition-colors duration-200',
                          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                          // Active state
                          item.active
                            ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                          // Disabled state
                          item.disabled &&
                            'opacity-50 cursor-not-allowed hover:bg-transparent',
                          // Collapsed state adjustments
                          collapsed && 'justify-center'
                        )}
                      >
                        {/* Icon */}
                        <IconComponent
                          className={clsx(
                            'flex-shrink-0',
                            collapsed ? 'h-5 w-5' : 'h-5 w-5 mr-3',
                            item.active ? 'text-primary-700' : 'text-gray-500'
                          )}
                        />

                        {/* Label and badge (hidden when collapsed) */}
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left">
                              {item.label}
                            </span>
                            {item.badge && item.badge.count > 0 && (
                              <span
                                className={clsx(
                                  'inline-flex items-center justify-center',
                                  'px-2 py-1 text-xs font-medium rounded-full',
                                  'min-w-[1.5rem] h-6',
                                  getBadgeVariantStyles(item.badge.variant)
                                )}
                                aria-label={`${item.badge.count} items`}
                              >
                                {item.badge.count > 99
                                  ? '99+'
                                  : item.badge.count}
                              </span>
                            )}
                          </>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="space-y-2">
            {/* Settings */}
            <Button
              variant="secondary"
              size="sm"
              className={clsx(
                'w-full justify-start',
                collapsed && 'justify-center px-0'
              )}
              aria-label={collapsed ? 'Settings' : undefined}
            >
              <Settings className={clsx('h-4 w-4', !collapsed && 'mr-2')} />
              {!collapsed && 'Settings'}
            </Button>

            {/* Help */}
            <Button
              variant="secondary"
              size="sm"
              className={clsx(
                'w-full justify-start',
                collapsed && 'justify-center px-0'
              )}
              aria-label={collapsed ? 'Help' : undefined}
            >
              <HelpCircle className={clsx('h-4 w-4', !collapsed && 'mr-2')} />
              {!collapsed && 'Help'}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
