import { WeatherEndpointMap } from '../types';

export function buildQueryParams<T extends keyof WeatherEndpointMap>(
  params: WeatherEndpointMap[T]['params']
) {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) queryParams.append(key, String(value));
  });
  return queryParams.toString();
}
