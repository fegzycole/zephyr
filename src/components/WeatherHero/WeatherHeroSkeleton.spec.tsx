import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WeatherHeroSkeleton } from './WeatherHeroSkeleton';

describe('WeatherHeroSkeleton (unit)', () => {
  it('renders the title skeleton with correct classes', () => {
    render(<WeatherHeroSkeleton />);
    const titleSkeleton = screen.getByTestId('skeleton-title');
    expect(titleSkeleton).toHaveClass('h-8', 'w-48');
  });

  it('renders the temperature skeleton with correct classes', () => {
    render(<WeatherHeroSkeleton />);
    const tempSkeleton = screen.getByTestId('skeleton-temperature');
    expect(tempSkeleton).toHaveClass('h-10', 'w-20');
  });

  it('renders the icon skeleton with correct classes', () => {
    render(<WeatherHeroSkeleton />);
    const iconSkeleton = screen.getByTestId('skeleton-icon');
    expect(iconSkeleton).toHaveClass('size-28');
  });
});

describe('WeatherHeroSkeleton (integration)', () => {
  it('renders all skeletons inside a container', () => {
    render(
      <div data-testid="wrapper">
        <WeatherHeroSkeleton />
      </div>
    );

    const wrapper = screen.getByTestId('wrapper');
    expect(
      wrapper.querySelector('[data-testid="skeleton-title"]')
    ).toBeInTheDocument();
    expect(
      wrapper.querySelector('[data-testid="skeleton-temperature"]')
    ).toBeInTheDocument();
    expect(
      wrapper.querySelector('[data-testid="skeleton-icon"]')
    ).toBeInTheDocument();
  });

  it('matches snapshot for layout consistency', () => {
    const { container } = render(<WeatherHeroSkeleton />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
