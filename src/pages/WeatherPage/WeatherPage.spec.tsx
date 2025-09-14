import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import { useGetWeatherRealTime } from '@api/data-hooks/weather';
import { deriveWeatherProperties } from '@api/data-hooks/weather/helpers/deriveWeatherProperties';
import WeatherPage from './WeatherPage';

import type { ITransformedWeatherRealTimeDetails } from '@/api/data-hooks/weather/types';
import type { IWeatherDetailCard } from '@/components/WeatherDetailCard/WeatherDetailCard';
import type { INoteSection } from '@/components/NotesSection/NoteSection';

const mockedUseGetWeatherRealTime = vi.mocked(useGetWeatherRealTime, true);
const mockedDeriveWeatherProperties = vi.mocked(deriveWeatherProperties, true);

vi.mock('@api/data-hooks/weather', () => ({
  useGetWeatherRealTime: vi.fn(),
}));

vi.mock('@api/data-hooks/weather/helpers/deriveWeatherProperties', () => ({
  deriveWeatherProperties: vi.fn(),
}));

vi.mock('@components/WeatherHero', () => ({
  default: ({ temperature, icon }: ITransformedWeatherRealTimeDetails) => (
    <div data-testid="weather-hero">
      {temperature} - {icon}
    </div>
  ),
}));

vi.mock('@components/WeatherDetailCard', () => ({
  default: ({ label, value, icon }: IWeatherDetailCard) => (
    <div data-testid="weather-detail">
      {label}: {value} - {icon}
    </div>
  ),
}));

vi.mock('@components/NotesSection', () => ({
  default: ({ city }: INoteSection) => (
    <div data-testid="notes-section">{city}</div>
  ),
}));

vi.mock('@components/NoWeatherData', () => ({
  default: () => <div data-testid="no-weather-data">No Weather Data</div>,
}));

vi.mock('./WeatherPageSkeleton', () => ({
  WeatherPageSkeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

const renderWithRouter = (initialRoute = '/?city=New York') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/" element={<WeatherPage />} />
      </Routes>
    </MemoryRouter>
  );
};

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location-display">{location.search}</div>;
}

describe('WeatherPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to userCity if no city param', async () => {
    mockedUseGetWeatherRealTime.mockReturnValue({
      isLoading: false,
      data: undefined,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <WeatherPage />
                <LocationDisplay />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('location-display').textContent).toMatch(
        /city=/
      );
    });
  });

  it('renders skeleton while loading', () => {
    mockedUseGetWeatherRealTime.mockReturnValue({
      isLoading: true,
      data: undefined,
    });

    renderWithRouter();

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('returns null if no weatherData', () => {
    mockedUseGetWeatherRealTime.mockReturnValue({
      isLoading: false,
      data: undefined,
    });

    renderWithRouter();

    expect(screen.getByTestId('no-weather-data')).toBeInTheDocument();
  });

  it('renders hero, details, and comments when data is available', () => {
    const mockCity = 'Los Angeles';
    const mockTemp = 25;
    const mockIcon = 'https://test.example.com/weather-icon.png';

    mockedDeriveWeatherProperties.mockReturnValue([
      { label: 'Humidity', value: '42%', icon: 'icon-eye.svg' },
      { label: 'Wind', value: '10 km/h', icon: 'icon-shower.svg' },
    ]);

    mockedUseGetWeatherRealTime.mockReturnValue({
      isLoading: false,
      data: {
        name: mockCity,
        region: mockCity,
        temperature: mockTemp.toString(),
        icon: mockIcon,
        uvIndex: 6,
        wind: 15,
        humidity: 65,
        visibility: 10,
        feelsLike: 28.5,
        pressure: 1013,
        sunset: new Date('2023-01-02T18:00:00Z').toISOString(),
        time: new Date('2023-01-01T12:00:00Z').toDateString(),
      },
    });

    renderWithRouter(`/?city=${mockCity}`);

    expect(screen.getByTestId('weather-hero')).toHaveTextContent(
      `${mockTemp} - ${mockIcon}`
    );
    expect(screen.getAllByTestId('weather-detail').length).toBeGreaterThan(0);
    expect(screen.getByTestId('notes-section')).toHaveTextContent(mockCity);
  });

  it('matches snapshot when loaded with data', () => {
    const city = 'SnapshotCity';
    const temp = 25;

    vi.mocked(deriveWeatherProperties).mockReturnValue([
      { label: 'Humidity', value: '42%', icon: 'icon-eye.svg' },
      { label: 'Wind', value: '10 km/h', icon: 'icon-shower.svg' },
    ]);

    mockedUseGetWeatherRealTime.mockReturnValue({
      isLoading: false,
      data: {
        name: city,
        region: city,
        temperature: temp.toString(),
        icon: 'icon.png',
        uvIndex: 5,
        wind: 10,
        humidity: 42,
        visibility: 10,
        feelsLike: 27,
        pressure: 1000,
        sunset: '2025-09-09T18:30:00Z',
        time: 'Tue Sep 09 2025',
      },
    });

    const { asFragment } = renderWithRouter(`/?city=${city}`);
    expect(asFragment()).toMatchSnapshot();
  });
});
