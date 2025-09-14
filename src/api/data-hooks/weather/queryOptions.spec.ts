import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { QueryClient, type QueryFunctionContext } from '@tanstack/react-query';
import { getWeatherRealTimeOptions } from './queryOptions';
import { weatherKeys } from './queryKeys';
import type { WeatherEndpointMap, IGetWeatherRealTimeSingle } from './types';
import * as storage from '../../../utils/storage';
import { faker } from '@faker-js/faker';

const addToast = vi.fn();
vi.mock('../../store', () => ({
  useStore: {
    getState: () => ({ addToast }),
  },
}));

describe('getWeatherRealTimeOptions', () => {
  const params: IGetWeatherRealTimeSingle = {
    access_key: faker.string.uuid(),
    query: faker.location.city(),
  };

  const mockResponse: WeatherEndpointMap['current']['response'] = {
    current: {
      temperature: faker.number.int({ min: -10, max: 40 }),
      feelslike: faker.number.int({ min: -10, max: 40 }),
      uv_index: faker.number.int({ min: 0, max: 11 }),
      humidity: faker.number.int({ min: 0, max: 100 }),
      wind_speed: faker.number.int({ min: 0, max: 100 }),
      pressure: faker.number.int({ min: 900, max: 1100 }),
      visibility: faker.number.int({ min: 0, max: 10 }),
      weather_descriptions: ['Sunny'],
      weather_code: faker.number.int({ min: 100, max: 999 }),
      weather_icons: [faker.image.url()],
      observation_time: `${faker.number.int({ min: 0, max: 23 })}:${faker.number.int({ min: 0, max: 59 })} PM`,
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
      name: faker.location.city(),
      localtime: faker.date.recent().toISOString(),
      region: faker.location.state(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function makeContext(): QueryFunctionContext<
    ReturnType<typeof weatherKeys.realTime>
  > {
    return {
      client: new QueryClient(),
      queryKey: weatherKeys.realTime(params),
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
