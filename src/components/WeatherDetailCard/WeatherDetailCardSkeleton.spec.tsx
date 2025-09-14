import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeatherDetailCardSkeleton } from './WeatherDetailCardSkeleton';

describe('WeatherDetailCardSkeleton Component (unit/integration)', () => {
  const renderSkeleton = () => render(<WeatherDetailCardSkeleton />);

  it('renders skeleton for icon, label and value', () => {
    renderSkeleton();
    expect(screen.getByTestId('skeleton-icon')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-label')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-value')).toBeInTheDocument();
  });

  it('applies correct classes to skeleton icon', () => {
    renderSkeleton();
    expect(screen.getByTestId('skeleton-icon')).toHaveClass('size-6');
  });

  it('applies correct classes to skeleton label', () => {
    renderSkeleton();
    expect(screen.getByTestId('skeleton-label')).toHaveClass(
      'h-6',
      'w-18',
      'mb-2'
    );
  });

  it('applies correct classes to skeleton value', () => {
    renderSkeleton();
    expect(screen.getByTestId('skeleton-value')).toHaveClass('h-8', 'w-36');
  });

  it('matches snapshot', () => {
    const { container } = renderSkeleton();
    expect(container.firstChild).toMatchSnapshot();
  });
});
