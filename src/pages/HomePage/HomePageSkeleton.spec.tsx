import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HomePageSkeleton } from './HomePageSkeleton';

vi.mock('../../components/WeatherCard', () => ({
  WeatherCardSkeleton: vi.fn(() => <div data-testid="WeatherCardSkeleton" />),
}));

describe('HomePageSkeleton (unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders wrapper with expected classes', () => {
    const { container } = render(<HomePageSkeleton />);
    expect(container.firstChild).toHaveClass('min-h-screen', 'bg-gray-100');
  });

  it('renders grid layout', () => {
    const { container } = render(<HomePageSkeleton />);
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-1', 'lg:grid-cols-2', 'gap-6');
  });

  it('renders exactly 6 WeatherCardSkeleton placeholders', () => {
    render(<HomePageSkeleton />);
    expect(screen.getAllByTestId('WeatherCardSkeleton')).toHaveLength(6);
  });

  it('matches snapshot', () => {
    const { container } = render(<HomePageSkeleton />);
    expect(container).toMatchSnapshot();
  });
});
