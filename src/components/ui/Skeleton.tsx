import { clsx } from 'clsx';

export interface SkeletonProps {
  /**
   * Width of the skeleton
   */
  width?: string | number;

  /**
   * Height of the skeleton
   */
  height?: string | number;

  /**
   * Shape of the skeleton
   */
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';

  /**
   * Animation type
   */
  animation?: 'pulse' | 'wave' | 'none';

  /**
   * Number of lines for text variant
   */
  lines?: number;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Test ID for testing purposes
   */
  'data-testid'?: string;
}

const variantClasses = {
  text: 'h-4 rounded',
  rectangular: 'rounded',
  circular: 'rounded-full',
  rounded: 'rounded-lg',
};

const animationClasses = {
  pulse: 'animate-pulse',
  wave: 'animate-pulse', // Could be enhanced with custom wave animation
  none: '',
};

export function Skeleton({
  width,
  height,
  variant = 'text',
  animation = 'pulse',
  lines = 1,
  className = '',
  'data-testid': testId = 'skeleton',
}: SkeletonProps) {
  // Convert width and height to CSS values
  const getSize = (size: string | number | undefined): string | undefined => {
    if (size === undefined) return undefined;
    if (typeof size === 'number') return `${size}px`;
    return size;
  };

  const style = {
    width: getSize(width),
    height: getSize(height),
  };

  // For text variant with multiple lines
  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2" data-testid={testId}>
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={clsx(
              'bg-gray-200',
              variantClasses[variant],
              animationClasses[animation],
              className
            )}
            style={{
              width: index === lines - 1 ? '75%' : style.width || '100%',
              height: style.height,
            }}
            data-testid={`${testId}-line-${index + 1}`}
          />
        ))}
      </div>
    );
  }

  // Single skeleton element
  return (
    <div
      className={clsx(
        'bg-gray-200',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
      data-testid={testId}
    />
  );
}

// Predefined skeleton components for common use cases
export interface SkeletonTextProps extends Omit<SkeletonProps, 'variant'> {
  /**
   * Number of text lines
   */
  lines?: number;
}

export function SkeletonText({ lines = 3, ...props }: SkeletonTextProps) {
  return <Skeleton variant="text" lines={lines} {...props} />;
}

export interface SkeletonAvatarProps extends Omit<SkeletonProps, 'variant'> {
  /**
   * Size of the avatar
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const avatarSizes = {
  sm: { width: 32, height: 32 },
  md: { width: 40, height: 40 },
  lg: { width: 48, height: 48 },
  xl: { width: 64, height: 64 },
};

export function SkeletonAvatar({ size = 'md', ...props }: SkeletonAvatarProps) {
  const { width, height } = avatarSizes[size];
  return (
    <Skeleton
      variant="circular"
      width={width}
      height={height}
      {...props}
      data-testid={props['data-testid'] || 'skeleton-avatar'}
    />
  );
}

export interface SkeletonButtonProps extends Omit<SkeletonProps, 'variant'> {
  /**
   * Size of the button
   */
  size?: 'sm' | 'md' | 'lg';
}

const buttonSizes = {
  sm: { width: 80, height: 32 },
  md: { width: 100, height: 40 },
  lg: { width: 120, height: 48 },
};

export function SkeletonButton({ size = 'md', ...props }: SkeletonButtonProps) {
  const { width, height } = buttonSizes[size];
  return (
    <Skeleton
      variant="rounded"
      width={width}
      height={height}
      {...props}
      data-testid={props['data-testid'] || 'skeleton-button'}
    />
  );
}

export interface SkeletonCardProps extends Omit<SkeletonProps, 'variant'> {
  /**
   * Whether to include an avatar
   */
  avatar?: boolean;

  /**
   * Number of content lines
   */
  lines?: number;

  /**
   * Whether to include action buttons
   */
  actions?: boolean;
}

export function SkeletonCard({
  avatar = false,
  lines = 3,
  actions = false,
  className = '',
  'data-testid': testId = 'skeleton-card',
  ...props
}: SkeletonCardProps) {
  return (
    <div
      className={clsx('p-4 space-y-4', className)}
      data-testid={testId}
      {...props}
    >
      {/* Header with optional avatar */}
      <div className="flex items-center space-x-3">
        {avatar && <SkeletonAvatar data-testid={`${testId}-avatar`} />}
        <div className="flex-1 space-y-2">
          <Skeleton width="40%" height={16} data-testid={`${testId}-title`} />
          <Skeleton
            width="25%"
            height={14}
            data-testid={`${testId}-subtitle`}
          />
        </div>
      </div>

      {/* Content */}
      <SkeletonText lines={lines} data-testid={`${testId}-content`} />

      {/* Actions */}
      {actions && (
        <div className="flex space-x-2">
          <SkeletonButton size="sm" data-testid={`${testId}-action-1`} />
          <SkeletonButton size="sm" data-testid={`${testId}-action-2`} />
        </div>
      )}
    </div>
  );
}

export interface SkeletonListProps extends Omit<SkeletonProps, 'variant'> {
  /**
   * Number of list items
   */
  items?: number;

  /**
   * Whether items have avatars
   */
  avatar?: boolean;

  /**
   * Number of lines per item
   */
  lines?: number;
}

export function SkeletonList({
  items = 5,
  avatar = false,
  lines = 2,
  className = '',
  'data-testid': testId = 'skeleton-list',
  ...props
}: SkeletonListProps) {
  return (
    <div
      className={clsx('space-y-4', className)}
      data-testid={testId}
      {...props}
    >
      {Array.from({ length: items }, (_, index) => (
        <div
          key={index}
          className="flex items-start space-x-3"
          data-testid={`${testId}-item-${index + 1}`}
        >
          {avatar && (
            <SkeletonAvatar
              size="sm"
              data-testid={`${testId}-item-${index + 1}-avatar`}
            />
          )}
          <div className="flex-1">
            <SkeletonText
              lines={lines}
              data-testid={`${testId}-item-${index + 1}-content`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
