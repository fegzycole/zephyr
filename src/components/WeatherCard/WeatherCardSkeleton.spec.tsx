import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeatherCardSkeleton } from './WeatherCardSkeleton';

describe('WeatherCardSkeleton Component (unit/integration)', () => {
  const renderSkeleton = () => render(<WeatherCardSkeleton />);

  it('renders the skeleton avatar', () => {
    renderSkeleton();
    expect(screen.getByTestId('skeleton-avatar')).toBeInTheDocument();
  });

  it('renders the skeleton for city name', () => {
    renderSkeleton();
    expect(screen.getByTestId('skeleton-city')).toBeInTheDocument();
  });

  it('renders the skeleton for time', () => {
    renderSkeleton();
    expect(screen.getByTestId('skeleton-time')).toBeInTheDocument();
  });

  it('renders the skeleton for temperature', () => {
    renderSkeleton();
    expect(screen.getByTestId('skeleton-temp')).toBeInTheDocument();
  });

  it('applies correct classes to avatar Skeleton', () => {
    renderSkeleton();
    expect(screen.getByTestId('skeleton-avatar')).toHaveClass(
      'size-12',
      'rounded-full'
    );
  });

  it('applies correct classes to city name Skeleton', () => {
    renderSkeleton();
    expect(screen.getByTestId('skeleton-city')).toHaveClass(
      'h-6',
      'w-24',
      'mb-2'
    );
  });

  it('applies correct classes to time Skeleton', () => {
    renderSkeleton();
    expect(screen.getByTestId('skeleton-time')).toHaveClass('h-3', 'w-16');
  });

  it('applies correct classes to temperature Skeleton', () => {
    renderSkeleton();
    expect(screen.getByTestId('skeleton-temp')).toHaveClass('size-10');
  });

  it('matches snapshot', () => {
    const { container } = renderSkeleton();
    expect(container.firstChild).toMatchSnapshot();
  });
});
