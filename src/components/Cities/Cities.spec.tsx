import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

import Cities from './Cities';

import type {
  FavoritesSlice,
  NotesSlice,
  CitiesSlice as CitiesSliceType,
  ToastSlice,
} from '@store/types';
import type { ITransformedWeatherRealTimeDetails } from '@api/data-hooks/weather/types';

type Store = FavoritesSlice &
  NotesSlice &
  CitiesSliceType &
  ToastSlice;

vi.mock('../WeatherCard', () => ({
  WeatherCard: vi.fn(
    ({
      city,
      isFavorite,
      canDelete,
      onFavoriteToggle,
      onRemoveCity,
    }: {
      city: string;
      isFavorite: boolean;
      canDelete: boolean;
      onFavoriteToggle: () => void;
      onRemoveCity: () => void;
    }) => (
      <div data-testid={`weather-card-${city}`}>
        <span>{city}</span>
        <span>{isFavorite ? '★' : '☆'}</span>
        <span>{canDelete ? 'X' : ''}</span>
        <button onClick={onFavoriteToggle}>toggle-fav</button>
        <button onClick={onRemoveCity}>remove</button>
      </div>
    )
  ),
}));

let mockState: Store;
vi.mock('@store', () => ({
  useStore: (selector: (s: Store) => unknown) => selector(mockState),
}));

let cityCounter = 1;
const makeWeatherDetails = (): ITransformedWeatherRealTimeDetails => ({
  name: `TestCity${cityCounter++}`,
  region: `TestRegion${cityCounter - 1}`,
  time: new Date('2023-01-01T16:00:00Z').toISOString(),
  temperature: '24',
  icon: 'https://test.example.com/weather-icon.png',
  uvIndex: 4,
  wind: 10,
  humidity: 55,
  visibility: 8000,
  feelsLike: 26,
  pressure: 1018,
  sunset: new Date('2023-01-01T19:30:00Z').toISOString(),
});

describe('Cities component', () => {
  beforeEach(() => {
    cityCounter = 1;

    cleanup();

    mockState = {
      favorites: [],
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
      loadFavorites: vi.fn(),

      notes: {},
      addNote: vi.fn(),
      updateNote: vi.fn(),
      removeNote: vi.fn(),
      loadNotes: vi.fn(),

      cities: [],
      removeCity: vi.fn(),
      loadCities: vi.fn(),

      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
    };
  });

  it('matches snapshot with multiple cities', () => {
    const data = [
      makeWeatherDetails(),
      makeWeatherDetails(),
      makeWeatherDetails(),
    ];

    const { container } = render(<Cities data={data} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders a WeatherCard for each city', () => {
    const data = [makeWeatherDetails(), makeWeatherDetails()];

    render(<Cities data={data} />);

    data.forEach((c) => {
      expect(screen.getByTestId(`weather-card-${c.name}`)).toBeInTheDocument();
      expect(screen.getByText(c.name)).toBeInTheDocument();
    });
  });

  it('skips rendering if a city is undefined', () => {
    const data: (ITransformedWeatherRealTimeDetails | undefined)[] = [
      undefined,
      makeWeatherDetails(),
    ];

    render(<Cities data={data} />);

    expect(screen.queryAllByTestId(/weather-card-/)).toHaveLength(1);
  });

  it('marks a city as favorite if included in favorites', () => {
    const city = makeWeatherDetails();
    mockState.favorites = [city.name];

    render(<Cities data={[city]} />);

    expect(screen.getByText('★')).toBeInTheDocument();
  });

  it('marks a city as deletable if saved or favorite', () => {
    const city = makeWeatherDetails();
    mockState.cities = [city.name];

    render(<Cities data={[city]} />);

    expect(screen.getByText('X')).toBeInTheDocument();
  });

  it('calls addFavorite + addCity when toggling non-favorite', () => {
    const city = makeWeatherDetails();
    render(<Cities data={[city]} />);

    fireEvent.click(screen.getByText('toggle-fav'));

    expect(mockState.addFavorite).toHaveBeenCalledWith(city.name);
  });

  it('calls removeFavorite when toggling an existing favorite', () => {
    const city = makeWeatherDetails();
    mockState.favorites = [city.name];

    render(<Cities data={[city]} />);

    fireEvent.click(screen.getByText('toggle-fav'));

    expect(mockState.removeFavorite).toHaveBeenCalledWith(city.name);
  });

  it('calls removeCity + removeFavorite when removing a city', () => {
    const city = makeWeatherDetails();
    render(<Cities data={[city]} />);

    fireEvent.click(screen.getByText('remove'));

    expect(mockState.removeCity).toHaveBeenCalledWith(city.name);
  });
});
