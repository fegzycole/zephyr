import { describe, it, expect } from 'vitest';
import { buildQueryParams } from './buildQueryParams';
import { faker } from '@faker-js/faker';

function parseQuery(query: string) {
  const params = new URLSearchParams(query);
  const obj: Record<string, string> = {};
  params.forEach((v, k) => (obj[k] = decodeURIComponent(v)));
  return obj;
}

describe('buildQueryParams', () => {
  it('should handle array values correctly', () => {
    const accessKey = faker.string.alphanumeric(8);
    const cities = [faker.location.city(), faker.location.city()];
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
    const accessKey = faker.string.alphanumeric(20);
    const query = faker.lorem.words(5);

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
