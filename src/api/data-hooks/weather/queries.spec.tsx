import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';

import {
  useGetWeatherRealTime,
  useGetWeatherRealTimeMultiple,
} from './queries';
import { IGetWeatherRealTimeResponse } from './types';
import { fetchWithCache } from './queryOptions';
import * as storage from '@utils/storage';
import * as toast from './helpers/showWeatherErrorToast';

const mockResponse: IGetWeatherRealTimeResponse = {
  location: { name: 'Lagos', region: 'Lagos', localtime: '2025-09-14 10:00' },
  current: {
    temperature: 30,
    feelslike: 32,
    uv_index: 5,
    humidity: 60,
    wind_speed: 10,
    pressure: 1012,
    visibility: 8,
    weather_descriptions: ['Sunny'],
    weather_code: 113,
    weather_icons: ['http://icon.png'],
    observation_time: '10:00 AM',
    astro: {
      sunrise: '06:30 AM',
      sunset: '06:45 PM',
      moonrise: '07:00 PM',
      moonset: '06:00 AM',
      moon_phase: 'Full Moon',
      moon_illumination: '100',
    },
  },
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('useGetWeatherRealTime', () => {
  it('returns transformed data after fetch', async () => {
    vi.spyOn(axios, 'get').mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(
      () => useGetWeatherRealTime({ access_key: 'test', query: 'lagos' }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.data).toMatchObject({
        name: 'Lagos',
        region: 'Lagos',
        temperature: '30',
      });
    });
  });
});

describe('useGetWeatherRealTimeMultiple', () => {
  it('handles multiple queries', async () => {
    vi.spyOn(axios, 'get')
      .mockResolvedValueOnce({ data: mockResponse }) // for "lagos"
      .mockRejectedValueOnce(new Error('Not found')); // for "unknown"

    const { result } = renderHook(
      () =>
        useGetWeatherRealTimeMultiple({
          access_key: 'test',
          queries: ['lagos', 'unknown'],
        }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.data[0]).toMatchObject({ name: 'Lagos' });
      expect(result.current.data[1]).toBeUndefined();
    });
  });
});

describe('fetchWithCache', () => {
  it('fetches fresh and sets cache', async () => {
    const setCacheSpy = vi.spyOn(storage, 'setCache').mockResolvedValue();
    vi.spyOn(axios, 'get').mockResolvedValueOnce({ data: mockResponse });

    const data = await fetchWithCache('current', {
      access_key: 'test',
      query: 'lagos',
    });

    expect(data?.location.name).toBe('Lagos');
    expect(setCacheSpy).toHaveBeenCalled();
  });

  it('returns cached data when request fails', async () => {
    vi.spyOn(axios, 'get').mockRejectedValueOnce(new Error('Network error'));
    const cached: IGetWeatherRealTimeResponse = {
      ...mockResponse,
      location: { ...mockResponse.location, name: 'Cached' },
    };
    vi.spyOn(storage, 'getCache').mockResolvedValue(cached);

    const data = await fetchWithCache('current', {
      access_key: 'test',
      query: 'lagos',
    });

    expect(data?.location.name).toBe('Cached');
  });

  it('shows error toast when no cache available', async () => {
    vi.spyOn(axios, 'get').mockRejectedValueOnce(new Error('Network error'));
    vi.spyOn(storage, 'getCache').mockResolvedValue(undefined);
    const toastSpy = vi.spyOn(toast, 'showWeatherErrorToast');

    await expect(
      fetchWithCache('current', { access_key: 'test', query: 'lagos' })
    ).rejects.toThrow();

    expect(toastSpy).toHaveBeenCalled();
  });
});
