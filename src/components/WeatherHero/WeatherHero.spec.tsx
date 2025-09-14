import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { useStore } from '@store';
import WeatherHero from './WeatherHero';

describe('WeatherHero', () => {
  let addFavorite: ReturnType<typeof vi.fn>;
  let removeFavorite: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    addFavorite = vi.fn();
    removeFavorite = vi.fn();

    useStore.setState({
      favorites: [],
      addFavorite,
      removeFavorite,
    });
  });

  it('renders city, temperature and icon', () => {
    render(<WeatherHero city="Paris" temperature="22" icon="/paris.png" />);

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('22°C')).toBeInTheDocument();
    expect(screen.getByAltText('Paris-weather-icon')).toHaveAttribute(
      'src',
      '/paris.png'
    );
  });

  it('adds city to favorites when not already favorite', () => {
    render(<WeatherHero city="Paris" temperature="22" icon="/paris.png" />);
    fireEvent.click(screen.getByRole('button'));

    expect(addFavorite).toHaveBeenCalledWith('Paris');
    expect(removeFavorite).not.toHaveBeenCalled();
  });

  it('removes city from favorites when already favorite', () => {
    useStore.setState({ favorites: ['Paris'] });

    render(<WeatherHero city="Paris" temperature="22" icon="/paris.png" />);
    fireEvent.click(screen.getByRole('button'));

    expect(removeFavorite).toHaveBeenCalledWith('Paris');
    expect(addFavorite).not.toHaveBeenCalled();
  });

  it('applies yellow styles when city is favorite', () => {
    useStore.setState({ favorites: ['Paris'] });

    render(<WeatherHero city="Paris" temperature="22" icon="/paris.png" />);
    const button = screen.getByRole('button');

    expect(button.querySelector('svg')).toHaveClass(
      'text-yellow-400 fill-yellow-400'
    );
  });

  it('matches snapshot', () => {
    const { container } = render(
      <WeatherHero city="Paris" temperature="22" icon="/paris.png" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
