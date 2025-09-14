import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import { useGetWeatherRealTimeMultiple } from '@api/data-hooks/weather';
import { useStore } from '@store';
import { ITransformedWeatherRealTimeDetails } from '@api/data-hooks/weather/types';
import '@testing-library/jest-dom';

import HomePage from './HomePage';

vi.mock('@api/data-hooks/weather', () => ({
  useGetWeatherRealTimeMultiple: vi.fn(),
}));

vi.mock('@store', () => ({
  useStore: vi.fn(),
}));

vi.mock('@components/Cities', () => ({
  default: ({ data }: { data: ITransformedWeatherRealTimeDetails[] }) => (
    <div data-testid="cities">{data.map((d) => d.name).join(',')}</div>
  ),
}));

vi.mock('@components/SearchBar', () => ({
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => <input data-testid="searchbar" value={value} onChange={onChange} />,
}));

vi.mock('@components/LoadMorePagination', () => ({
  default: ({
    totalCount,
    children,
  }: {
    totalCount: number;
    children: (visibleCount: number) => React.ReactNode;
  }) => <div data-testid="pagination">{children(totalCount)}</div>,
}));

vi.mock('./HomePageSkeleton', () => ({
  HomePageSkeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

const mockedUseWeatherRealTime = vi.mocked(useGetWeatherRealTimeMultiple, true);
const mockedUseStore = vi.mocked(useStore);

function makeWeather(city: string): ITransformedWeatherRealTimeDetails {
  return {
    name: city,
    region: city,
    time: faker.date.recent().toISOString(),
    temperature: faker.number.int({ min: -10, max: 40 }).toString(),
    icon: faker.image.url(),
    uvIndex: faker.number.int({ min: 0, max: 11 }),
    wind: faker.number.int({ min: 0, max: 30 }),
    humidity: faker.number.int({ min: 20, max: 100 }),
    visibility: faker.number.int({ min: 1, max: 10 }),
    feelsLike: faker.number.int({ min: -10, max: 40 }),
    pressure: faker.number.int({ min: 950, max: 1050 }),
    sunset: faker.date.soon().toISOString(),
  };
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the search bar', () => {
    mockedUseStore.mockReturnValue({ cities: [], favorites: [] });
    mockedUseWeatherRealTime.mockReturnValue({
      data: [],
      isLoading: false,
      results: [],
    });

    render(<HomePage />);
    expect(screen.getByTestId('searchbar')).toBeInTheDocument();
  });

  it('updates city when typing in the search bar', () => {
    mockedUseStore.mockReturnValue({ cities: ['Paris'], favorites: [] });
    mockedUseWeatherRealTime.mockReturnValue({
      data: [makeWeather('Paris')],
      isLoading: false,
      results: [],
    });

    render(<HomePage />);
    const input = screen.getByTestId('searchbar') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'London' } });
    expect(input.value).toBe('London');

    expect(mockedUseWeatherRealTime).toHaveBeenLastCalledWith(
      expect.objectContaining({ queries: ['London'] })
    );
  });

  it('shows skeleton while loading', () => {
    mockedUseStore.mockReturnValue({ cities: ['Paris'], favorites: [] });
    mockedUseWeatherRealTime.mockReturnValue({
      data: [],
      isLoading: true,
      results: [],
    });

    render(<HomePage />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('renders cities when data is loaded', () => {
    mockedUseStore.mockReturnValue({ cities: ['Paris'], favorites: [] });
    mockedUseWeatherRealTime.mockReturnValue({
      data: [makeWeather('Paris')],
      isLoading: false,
      results: [],
    });

    render(<HomePage />);
    expect(screen.getByTestId('cities')).toHaveTextContent('Paris');
  });

  it('orders favorites before other cities', () => {
    mockedUseStore.mockReturnValue({
      favorites: ['Tokyo'],
      cities: ['London', 'Tokyo'],
    });

    const data = [makeWeather('Tokyo'), makeWeather('London')];
    mockedUseWeatherRealTime.mockReturnValue({
      data,
      isLoading: false,
      results: [],
    });

    render(<HomePage />);
    expect(screen.getByTestId('cities')).toHaveTextContent('Tokyo,London');
  });

  it('matches snapshot', () => {
    mockedUseStore.mockReturnValue({
      favorites: ['Berlin'],
      cities: ['Berlin', 'Paris'],
    });

    const data = [makeWeather('Berlin'), makeWeather('Paris')];
    mockedUseWeatherRealTime.mockReturnValue({
      data,
      isLoading: false,
      results: [],
    });

    const { asFragment } = render(<HomePage />);
    expect(asFragment()).toMatchSnapshot();
  });
});
