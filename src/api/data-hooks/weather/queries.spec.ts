import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import { useWeatherRealTime } from './queries';
import type {
  IGetWeatherRealTimeResponse,
  IGetWeatherRealTimeParams,
  ITransformedWeatherRealTimeDetails,
} from './types';
import { useQueries } from '@tanstack/react-query';
import { transformWeatherRealTimeResponse } from './helpers/transformers';

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useQueries: vi.fn(),
  };
});

const mockedUseQueries = vi.mocked(useQueries, true);

vi.mock('./helpers/transformers', () => ({
  transformWeatherRealTimeResponse: vi.fn(),
}));
const mockedTransform = vi.mocked(transformWeatherRealTimeResponse, true);

function makeMockApiResponse(city: string): IGetWeatherRealTimeResponse {
  return {
    current: {
      temperature: 25,
      feelslike: 27,
      uv_index: 5,
      humidity: 60,
      wind_speed: 10,
      pressure: 1000,
      visibility: 8,
      weather_descriptions: ['Sunny'],
      weather_code: 113,
      weather_icons: ['icon.png'],
      observation_time: '10:00 AM',
      astro: {
        sunrise: '6:00 AM',
        sunset: '6:00 PM',
        moonrise: '8:00 PM',
        moonset: '6:00 AM',
        moon_phase: 'Full Moon',
        moon_illumination: '75',
      },
    },
    location: {
      name: city,
      region: city,
      localtime: '2025-09-09 10:00',
    },
  };
}

describe('useWeatherRealTime', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reports loading when queries are loading', () => {
    mockedUseQueries.mockReturnValue([
      { isLoading: true, data: undefined },
    ]);

    const params: IGetWeatherRealTimeParams = {
      access_key: 'k',
      query: ['AnyCity'],
    };
    const { result } = renderHook(() => useWeatherRealTime(params));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([undefined]);
  });

  it('returns transformed data when queries resolve', async () => {
    const city = faker.location.city();
    const apiResponse = makeMockApiResponse(city);

    mockedUseQueries.mockReturnValue([
      { isLoading: false, data: apiResponse },
    ]);

    const transformed: ITransformedWeatherRealTimeDetails = {
      name: city,
      region: city,
      time: apiResponse.location.localtime,
      temperature: String(apiResponse.current.temperature),
      icon: apiResponse.current.weather_icons[0],
      uvIndex: apiResponse.current.uv_index,
      wind: apiResponse.current.wind_speed,
      humidity: apiResponse.current.humidity,
      visibility: apiResponse.current.visibility,
      feelsLike: apiResponse.current.feelslike,
      pressure: apiResponse.current.pressure,
      sunset: apiResponse.current.astro.sunset,
    };
    mockedTransform.mockReturnValue(transformed);

    const params: IGetWeatherRealTimeParams = { access_key: 'k', query: [city] };
    const { result } = renderHook(() => useWeatherRealTime(params));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockedTransform).toHaveBeenCalledWith(apiResponse);
    expect(result.current.data).toEqual([transformed]);
  });

  it('handles multiple cities correctly', async () => {
    const cities = faker.helpers.multiple(() => faker.location.city(), { count: 2 });
    const responses = cities.map((c) => makeMockApiResponse(c));

    mockedUseQueries.mockReturnValue(
      responses.map((r) => ({ isLoading: false, data: r }))
    );

    mockedTransform.mockImplementation(
      (data: IGetWeatherRealTimeResponse): ITransformedWeatherRealTimeDetails => ({
        name: data.location.name,
        region: data.location.region,
        time: data.location.localtime,
        temperature: String(data.current.temperature),
        icon: data.current.weather_icons[0],
        uvIndex: data.current.uv_index,
        wind: data.current.wind_speed,
        humidity: data.current.humidity,
        visibility: data.current.visibility,
        feelsLike: data.current.feelslike,
        pressure: data.current.pressure,
        sunset: data.current.astro.sunset,
      })
    );

    const params: IGetWeatherRealTimeParams = { access_key: 'k', query: [...cities] };
    const { result } = renderHook(() => useWeatherRealTime(params));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const names = result.current.data?.map((d) => d?.name);
    expect(names).toEqual(cities);
  });

  it('returns undefined in data if a query has no result', async () => {
    mockedUseQueries.mockReturnValue([
      { isLoading: false, data: undefined },
    ]);

    const params: IGetWeatherRealTimeParams = { access_key: 'k', query: ['Nope'] };
    const { result } = renderHook(() => useWeatherRealTime(params));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual([undefined]);
    expect(mockedTransform).not.toHaveBeenCalled();
  });

  it('handles errored queries by returning undefined and not calling transformer', async () => {
    mockedUseQueries.mockReturnValue([
      { isLoading: false, data: undefined, error: new Error('boom') },
    ]);

    const params: IGetWeatherRealTimeParams = { access_key: 'k', query: ['ErrCity'] };
    const { result } = renderHook(() => useWeatherRealTime(params));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual([undefined]);
    expect(mockedTransform).not.toHaveBeenCalled();
  });
});
