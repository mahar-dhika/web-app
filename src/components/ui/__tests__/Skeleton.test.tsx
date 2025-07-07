import { render, screen } from '@testing-library/react';
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonList,
  SkeletonText,
  type SkeletonProps,
} from '../Skeleton';

const defaultProps: SkeletonProps = {};

describe('Skeleton Component', () => {
  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      render(<Skeleton {...defaultProps} />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass(
        'bg-gray-200',
        'h-4',
        'rounded',
        'animate-pulse'
      );
    });

    it('renders with custom test ID', () => {
      render(<Skeleton data-testid="custom-skeleton" />);

      expect(screen.getByTestId('custom-skeleton')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Skeleton className="custom-class" />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('custom-class');
    });
  });

  describe('Variants', () => {
    const variants = ['text', 'rectangular', 'circular', 'rounded'] as const;

    variants.forEach(variant => {
      it(`renders with ${variant} variant`, () => {
        render(<Skeleton variant={variant} />);

        const skeleton = screen.getByTestId('skeleton');
        const variantClasses = {
          text: 'h-4 rounded',
          rectangular: 'rounded',
          circular: 'rounded-full',
          rounded: 'rounded-lg',
        };

        if (variant === 'text') {
          expect(skeleton).toHaveClass('h-4', 'rounded');
        } else if (variant === 'circular') {
          expect(skeleton).toHaveClass('rounded-full');
        } else if (variant === 'rounded') {
          expect(skeleton).toHaveClass('rounded-lg');
        } else {
          expect(skeleton).toHaveClass('rounded');
        }
      });
    });
  });

  describe('Animations', () => {
    const animations = ['pulse', 'wave', 'none'] as const;

    animations.forEach(animation => {
      it(`renders with ${animation} animation`, () => {
        render(<Skeleton animation={animation} />);

        const skeleton = screen.getByTestId('skeleton');

        if (animation === 'none') {
          expect(skeleton).not.toHaveClass('animate-pulse');
        } else {
          expect(skeleton).toHaveClass('animate-pulse');
        }
      });
    });
  });

  describe('Sizing', () => {
    it('applies width as string', () => {
      render(<Skeleton width="200px" />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ width: '200px' });
    });

    it('applies width as number', () => {
      render(<Skeleton width={150} />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ width: '150px' });
    });

    it('applies height as string', () => {
      render(<Skeleton height="50px" />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ height: '50px' });
    });

    it('applies height as number', () => {
      render(<Skeleton height={60} />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ height: '60px' });
    });

    it('applies both width and height', () => {
      render(<Skeleton width={100} height={40} />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ width: '100px', height: '40px' });
    });
  });

  describe('Multiple Lines', () => {
    it('renders single line by default', () => {
      render(<Skeleton variant="text" />);

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('skeleton-line-1')).not.toBeInTheDocument();
    });

    it('renders multiple lines when specified', () => {
      render(<Skeleton variant="text" lines={3} />);

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-line-1')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-line-2')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-line-3')).toBeInTheDocument();
    });

    it('makes last line shorter than others', () => {
      render(<Skeleton variant="text" lines={2} />);

      const line1 = screen.getByTestId('skeleton-line-1');
      const line2 = screen.getByTestId('skeleton-line-2');

      expect(line1).toHaveStyle({ width: '100%' });
      expect(line2).toHaveStyle({ width: '75%' });
    });

    it('applies spacing between lines', () => {
      render(<Skeleton variant="text" lines={2} />);

      const container = screen.getByTestId('skeleton');
      expect(container).toHaveClass('space-y-2');
    });
  });
});

describe('SkeletonText Component', () => {
  it('renders with default 3 lines', () => {
    render(<SkeletonText />);

    expect(screen.getByTestId('skeleton-line-1')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-line-2')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-line-3')).toBeInTheDocument();
  });

  it('renders with custom number of lines', () => {
    render(<SkeletonText lines={5} />);

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`skeleton-line-${i}`)).toBeInTheDocument();
    }
  });

  it('passes through other props', () => {
    render(<SkeletonText animation="none" className="custom-text" />);

    const line1 = screen.getByTestId('skeleton-line-1');
    expect(line1).toHaveClass('custom-text');
    expect(line1).not.toHaveClass('animate-pulse');
  });
});

describe('SkeletonAvatar Component', () => {
  describe('Sizes', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;
    const expectedSizes = {
      sm: { width: '32px', height: '32px' },
      md: { width: '40px', height: '40px' },
      lg: { width: '48px', height: '48px' },
      xl: { width: '64px', height: '64px' },
    };

    sizes.forEach(size => {
      it(`renders with ${size} size`, () => {
        render(<SkeletonAvatar size={size} />);

        const avatar = screen.getByTestId('skeleton-avatar');
        expect(avatar).toHaveClass('rounded-full');
        expect(avatar).toHaveStyle(expectedSizes[size]);
      });
    });
  });

  it('renders with default medium size', () => {
    render(<SkeletonAvatar />);

    const avatar = screen.getByTestId('skeleton-avatar');
    expect(avatar).toHaveStyle({ width: '40px', height: '40px' });
  });

  it('applies circular variant', () => {
    render(<SkeletonAvatar />);

    const avatar = screen.getByTestId('skeleton-avatar');
    expect(avatar).toHaveClass('rounded-full');
  });
});

describe('SkeletonButton Component', () => {
  describe('Sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    const expectedSizes = {
      sm: { width: '80px', height: '32px' },
      md: { width: '100px', height: '40px' },
      lg: { width: '120px', height: '48px' },
    };

    sizes.forEach(size => {
      it(`renders with ${size} size`, () => {
        render(<SkeletonButton size={size} />);

        const button = screen.getByTestId('skeleton-button');
        expect(button).toHaveClass('rounded-lg');
        expect(button).toHaveStyle(expectedSizes[size]);
      });
    });
  });

  it('renders with default medium size', () => {
    render(<SkeletonButton />);

    const button = screen.getByTestId('skeleton-button');
    expect(button).toHaveStyle({ width: '100px', height: '40px' });
  });

  it('applies rounded variant', () => {
    render(<SkeletonButton />);

    const button = screen.getByTestId('skeleton-button');
    expect(button).toHaveClass('rounded-lg');
  });
});

describe('SkeletonCard Component', () => {
  it('renders basic card structure', () => {
    render(<SkeletonCard />);

    expect(screen.getByTestId('skeleton-card')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-card-title')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-card-subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-card-content')).toBeInTheDocument();
  });

  it('includes avatar when specified', () => {
    render(<SkeletonCard avatar />);

    expect(screen.getByTestId('skeleton-card-avatar')).toBeInTheDocument();
  });

  it('does not include avatar by default', () => {
    render(<SkeletonCard />);

    expect(
      screen.queryByTestId('skeleton-card-avatar')
    ).not.toBeInTheDocument();
  });

  it('includes actions when specified', () => {
    render(<SkeletonCard actions />);

    expect(screen.getByTestId('skeleton-card-action-1')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-card-action-2')).toBeInTheDocument();
  });

  it('does not include actions by default', () => {
    render(<SkeletonCard />);

    expect(
      screen.queryByTestId('skeleton-card-action-1')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('skeleton-card-action-2')
    ).not.toBeInTheDocument();
  });

  it('renders custom number of content lines', () => {
    render(<SkeletonCard lines={5} />);

    // Check that content skeleton has the correct number of lines
    const content = screen.getByTestId('skeleton-card-content');
    expect(content).toBeInTheDocument();

    // The SkeletonText component should have 5 lines
    for (let i = 1; i <= 5; i++) {
      expect(
        screen.getByTestId(`skeleton-card-content-line-${i}`)
      ).toBeInTheDocument();
    }
  });

  it('applies custom className', () => {
    render(<SkeletonCard className="custom-card" />);

    const card = screen.getByTestId('skeleton-card');
    expect(card).toHaveClass('custom-card');
  });

  it('has proper spacing classes', () => {
    render(<SkeletonCard />);

    const card = screen.getByTestId('skeleton-card');
    expect(card).toHaveClass('p-4', 'space-y-4');
  });
});

describe('SkeletonList Component', () => {
  it('renders default 5 items', () => {
    render(<SkeletonList />);

    expect(screen.getByTestId('skeleton-list')).toBeInTheDocument();

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`skeleton-list-item-${i}`)).toBeInTheDocument();
      expect(
        screen.getByTestId(`skeleton-list-item-${i}-content`)
      ).toBeInTheDocument();
    }
  });

  it('renders custom number of items', () => {
    render(<SkeletonList items={3} />);

    for (let i = 1; i <= 3; i++) {
      expect(screen.getByTestId(`skeleton-list-item-${i}`)).toBeInTheDocument();
    }

    expect(
      screen.queryByTestId('skeleton-list-item-4')
    ).not.toBeInTheDocument();
  });

  it('includes avatars when specified', () => {
    render(<SkeletonList items={2} avatar />);

    expect(
      screen.getByTestId('skeleton-list-item-1-avatar')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('skeleton-list-item-2-avatar')
    ).toBeInTheDocument();
  });

  it('does not include avatars by default', () => {
    render(<SkeletonList items={1} />);

    expect(
      screen.queryByTestId('skeleton-list-item-1-avatar')
    ).not.toBeInTheDocument();
  });

  it('renders custom number of lines per item', () => {
    render(<SkeletonList items={1} lines={4} />);

    const content = screen.getByTestId('skeleton-list-item-1-content');
    expect(content).toBeInTheDocument();

    // Check that the content has the correct number of lines
    for (let i = 1; i <= 4; i++) {
      expect(
        screen.getByTestId(`skeleton-list-item-1-content-line-${i}`)
      ).toBeInTheDocument();
    }
  });

  it('applies custom className', () => {
    render(<SkeletonList className="custom-list" />);

    const list = screen.getByTestId('skeleton-list');
    expect(list).toHaveClass('custom-list');
  });

  it('has proper spacing classes', () => {
    render(<SkeletonList />);

    const list = screen.getByTestId('skeleton-list');
    expect(list).toHaveClass('space-y-4');
  });

  it('has proper item layout', () => {
    render(<SkeletonList items={1} avatar />);

    const item = screen.getByTestId('skeleton-list-item-1');
    expect(item).toHaveClass('flex', 'items-start', 'space-x-3');
  });
});
