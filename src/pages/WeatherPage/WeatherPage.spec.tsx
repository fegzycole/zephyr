import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { faker } from '@faker-js/faker';
import WeatherPage from './WeatherPage';
import { useWeatherRealTime } from '@api/data-hooks/weather';
import { deriveWeatherProperties } from '@api/data-hooks/weather/helpers/deriveWeatherProperties';
import { ITransformedWeatherRealTimeDetails } from '@/api/data-hooks/weather/types';
import { IWeatherDetailCard } from '@/components/WeatherDetailCard/WeatherDetailCard';
import { INoteSection } from '@/components/NotesSection/NoteSection';

const mockedUseWeatherRealTime = vi.mocked(useWeatherRealTime, true);
const mockedDeriveWeatherProperties = vi.mocked(deriveWeatherProperties, true);

vi.mock('@api/data-hooks/weather', () => ({
  useWeatherRealTime: vi.fn(),
}));

vi.mock('@api/data-hooks/weather/helpers/deriveWeatherProperties', () => ({
  deriveWeatherProperties: vi.fn(),
}));

vi.mock('@components/WeatherHero', () => ({
  default: ({
    temperature,
    icon,
  }: ITransformedWeatherRealTimeDetails) => (
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

const renderWithRouter = (initialRoute = '/?city=' + faker.location.city()) => {
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
    mockedUseWeatherRealTime.mockReturnValue({
      isLoading: false,
      data: [],
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
    mockedUseWeatherRealTime.mockReturnValue({
      isLoading: true,
      data: [],
    });

    renderWithRouter();

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('returns null if no weatherData', () => {
    mockedUseWeatherRealTime.mockReturnValue({
      isLoading: false,
      data: [],
    });

    renderWithRouter();

    expect(screen.getByTestId('no-weather-data')).toBeInTheDocument();
  });

  it('renders hero, details, and comments when data is available', () => {
    const mockCity = faker.location.city();
    const mockTemp = faker.number.int({ min: -10, max: 40 });
    const mockIcon = faker.image.url();

    mockedDeriveWeatherProperties.mockReturnValue([
      { label: 'Humidity', value: '42%', icon: 'icon-eye.svg' },
      { label: 'Wind', value: '10 km/h', icon: 'icon-shower.svg' },
    ]);

    mockedUseWeatherRealTime.mockReturnValue({
      isLoading: false,
      data: [
        {
          name: mockCity,
          region: mockCity,
          temperature: mockTemp.toString(),
          icon: mockIcon,
          uvIndex: faker.number.int({ min: 0, max: 11 }),
          wind: faker.number.int({ min: 0, max: 100 }),
          humidity: faker.number.int({ min: 10, max: 100 }),
          visibility: faker.number.int({ min: 1, max: 20 }),
          feelsLike: faker.number.float({ min: -15, max: 45 }),
          pressure: faker.number.int({ min: 950, max: 1050 }),
          sunset: faker.date.soon().toISOString(),
          time: faker.date.anytime().toDateString(),
        },
      ],
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

    mockedUseWeatherRealTime.mockReturnValue({
      isLoading: false,
      data: [
        {
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
      ],
    });

    const { asFragment } = renderWithRouter(`/?city=${city}`);
    expect(asFragment()).toMatchSnapshot();
  });
});
