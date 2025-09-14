import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { IGetWeatherRealTimeSingle, WeatherEndpointMap } from './types';
import { weatherKeys } from './queryKeys';
import { setCache, getCache } from '../../utils/storage';
import { buildCacheKey } from './helpers/buildCacheKey';
import { buildQueryParams } from './helpers/buildQueryParams';
import { showWeatherErrorToast } from './helpers/showWeatherErrorToast';

const API_BASE_URL = import.meta.env.VITE_WEATHER_API_URL;

export async function fetchWithCache<T extends keyof WeatherEndpointMap>(
  endpoint: T,
  params: WeatherEndpointMap[T]['params']
): Promise<WeatherEndpointMap[T]['response']> {
  const cacheKey = buildCacheKey(endpoint, params);
  const queryString = buildQueryParams(params);

  try {
    const { data } = await axios.get<WeatherEndpointMap[T]['response']>(
      `${API_BASE_URL}/${endpoint}?${queryString}`
    );

    await setCache(cacheKey, data);
    return data;
  } catch (error) {
    const cached = await getCache<WeatherEndpointMap[T]['response']>(cacheKey);
    if (cached) return cached;

    if (axios.isAxiosError(error)) {
      showWeatherErrorToast(error.response?.data?.error?.code);
    } else {
      showWeatherErrorToast();
    }

    throw error;
  }
}

export function getWeatherRealTimeOptions(params: IGetWeatherRealTimeSingle) {
  return queryOptions({
    queryKey: weatherKeys.realTime(params),
    queryFn: () => fetchWithCache('current', params),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    staleTime: Infinity,
  });
}
