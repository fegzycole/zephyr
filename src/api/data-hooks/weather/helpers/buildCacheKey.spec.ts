import { describe, it, expect } from 'vitest';

import { buildCacheKey } from './buildCacheKey';

import type { WeatherEndpointMap } from '../types';

describe('buildCacheKey', () => {
  it('should generate a consistent cache key for given endpoint and params', () => {
    type Endpoint = keyof WeatherEndpointMap;

    const endpoint: Endpoint = 'current';
    const params: WeatherEndpointMap[typeof endpoint]['params'] = {
      query: 'Lagos',
      access_key: 'cache-key-uuid-test',
    };

    const key = buildCacheKey(endpoint, params);

    const expected = `current-query=${params.query}&access_key=${params.access_key}`;

    expect(key).toBe(expected);
  });
});
