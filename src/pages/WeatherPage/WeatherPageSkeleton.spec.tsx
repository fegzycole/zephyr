import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WeatherPageSkeleton } from './WeatherPageSkeleton';

vi.mock('../../components/WeatherHero', () => ({
  WeatherHeroSkeleton: () => <div data-testid="weather-hero-skeleton" />,
}));

vi.mock('../../components/WeatherDetailCard', () => ({
  WeatherDetailCardSkeleton: () => (
    <div data-testid="weather-detail-card-skeleton" />
  ),
}));

vi.mock('../../components/NoteSectionSkeleton', () => ({
  NoteSectionSkeleton: () => <div data-testid="notes-section-skeleton" />,
}));

describe('WeatherPageSkeleton', () => {
  it('renders the WeatherHeroSkeleton', () => {
    render(<WeatherPageSkeleton />);
    expect(screen.getByTestId('weather-hero-skeleton')).toBeInTheDocument();
  });

  it('renders exactly 6 WeatherDetailCardSkeleton components', () => {
    render(<WeatherPageSkeleton />);
    const detailCards = screen.getAllByTestId('weather-detail-card-skeleton');
    expect(detailCards).toHaveLength(6);
  });

  it('renders the CommentSectionSkeleton', () => {
    render(<WeatherPageSkeleton />);
    expect(screen.getByTestId('comment-section-skeleton')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<WeatherPageSkeleton />);
    expect(asFragment()).toMatchSnapshot();
  });
});
