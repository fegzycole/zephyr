import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, type QueryFunctionContext } from '@tanstack/react-query';
import axios from 'axios';

import { getWeatherRealTimeOptions } from './queryOptions';
import { weatherKeys } from './queryKeys';
import * as storage from '@utils/storage';

import type { WeatherEndpointMap, IGetWeatherRealTimeParams } from './types';

const addToast = vi.fn();
vi.mock('@store', () => ({
  useStore: {
    getState: () => ({ addToast }),
  },
}));

describe('getWeatherRealTimeOptions', () => {
  const params: IGetWeatherRealTimeParams = {
    access_key: '12345678-abcd-efgh-ijkl-123456789012',
    query: 'San Francisco',
  };

  const mockResponse: WeatherEndpointMap['current']['response'] = {
    current: {
      temperature: 22,
      feelslike: 25,
      uv_index: 6,
      humidity: 65,
      wind_speed: 12,
      pressure: 1013,
      visibility: 8,
      weather_descriptions: ['Sunny'],
      weather_code: 200,
      weather_icons: ['https://test.example.com/weather-icon.png'],
      observation_time: '14:30 PM',
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
      name: 'Test City',
      localtime: new Date('2023-01-01T14:30:00Z').toISOString(),
      region: 'Test Region',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function makeContext(): QueryFunctionContext<
    ReturnType<typeof weatherKeys.detail>
  > {
    return {
      client: new QueryClient(),
      queryKey: weatherKeys.detail(params),
      signal: new AbortController().signal,
      meta: undefined,
      pageParam: undefined,
    };
  }

  it('queryFn calls API and returns response', async () => {
    vi.spyOn(axios, 'get').mockResolvedValueOnce({ data: mockResponse });
    vi.spyOn(storage, 'getCache');
    vi.spyOn(storage, 'setCache');

    const { queryFn } = getWeatherRealTimeOptions(params);
    const data = await queryFn!(makeContext());

    expect(data).toEqual(mockResponse);
    expect(addToast).not.toHaveBeenCalled();
  });

  it('uses cached data when API fails', async () => {
    vi.spyOn(axios, 'get').mockRejectedValueOnce(new Error('Network error'));
    vi.spyOn(storage, 'getCache').mockResolvedValueOnce(mockResponse);
    vi.spyOn(storage, 'setCache');

    const { queryFn } = getWeatherRealTimeOptions(params);
    const data = await queryFn!(makeContext());

    expect(data).toEqual(mockResponse);
    expect(addToast).not.toHaveBeenCalled();
  });

  it('throws error and shows toast when no cache is available', async () => {
    vi.spyOn(axios, 'get').mockRejectedValueOnce(new Error('Network error'));
    vi.spyOn(storage, 'getCache').mockResolvedValueOnce(null);
    vi.spyOn(storage, 'setCache');

    const { queryFn } = getWeatherRealTimeOptions(params);

    await expect(queryFn!(makeContext())).rejects.toThrow('Network error');
    expect(addToast).toHaveBeenCalledWith(
      'Unable to load weather data. Check your internet connection and try again later.',
      'error'
    );
  });
});
