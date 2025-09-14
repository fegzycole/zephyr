import { WeatherEndpointMap } from '../types';

export function buildCacheKey<T extends keyof WeatherEndpointMap>(
  endpoint: T,
  params: WeatherEndpointMap[T]['params']
) {
  return `${endpoint}-${Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join('&')}`;
}
