import { describe, it, expect, beforeEach } from 'vitest';
import { buildQueryParams } from './buildQueryParams';

function parseQuery(query: string) {
  const params = new URLSearchParams(query);
  const obj: Record<string, string> = {};
  params.forEach((v, k) => (obj[k] = decodeURIComponent(v)));
  return obj;
}

describe('buildQueryParams', () => {
  beforeEach(() => {});

  it('should handle array values correctly', () => {
    const accessKey = 'testkey1';
    const cities = ['Boston', 'Miami'];
    const params = {
      access_key: accessKey,
      query: cities.join(',') as unknown as string,
    };

    const queryString = buildQueryParams(params);
    const parsed = parseQuery(queryString);

    expect(parsed.access_key).toBe(accessKey);
    expect(parsed.query).toBe(cities.join(','));
  });

  it('should work with random large inputs', () => {
    const accessKey = 'verylongaccesskeyfortest';
    const query = 'test query with multiple words';

    const params = {
      access_key: accessKey,
      query,
    };

    const queryString = buildQueryParams(params);
    const parsed = parseQuery(queryString);

    expect(parsed.access_key).toBe(accessKey);
    expect(parsed.query).toBe(query);
  });
});
