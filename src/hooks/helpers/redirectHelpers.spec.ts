import { describe, it, expect, vi, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';
import { redirectIfNeeded } from './redirectHelpers';
import { ITransformedWeatherRealTimeDetails } from '@api/data-hooks/weather/types';

function makeWeatherDetails(
  overrides?: Partial<ITransformedWeatherRealTimeDetails>
): ITransformedWeatherRealTimeDetails {
  return {
    name: faker.location.city(),
    region: faker.location.city(),
    time: faker.date.recent().toISOString(),
    temperature: faker.number.int({ min: -10, max: 40 }).toString(),
    icon: faker.string.alpha(5),
    uvIndex: faker.number.int({ min: 0, max: 11 }),
    wind: faker.number.int({ min: 0, max: 100 }),
    humidity: faker.number.int({ min: 0, max: 100 }),
    visibility: faker.number.int({ min: 0, max: 10 }),
    feelsLike: faker.number.int({ min: -10, max: 40 }),
    pressure: faker.number.int({ min: 950, max: 1050 }),
    sunset: faker.date.soon().toISOString(),
    ...overrides,
  };
}

describe('redirectIfNeeded', () => {
  let navigate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    navigate = vi.fn();
    sessionStorage.clear();
  });

  it('does nothing if data is empty', () => {
    redirectIfNeeded([], navigate);

    expect(navigate).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('geoRedirected')).toBeNull();
  });

  it('does nothing if first element has no name', () => {
    const data = [makeWeatherDetails({ name: '' })];

    redirectIfNeeded(data, navigate);

    expect(navigate).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('geoRedirected')).toBeNull();
  });

  it('navigates and sets geoRedirected when first element has a name', () => {
    const cityName = faker.location.city();
    const data = [makeWeatherDetails({ name: cityName })];

    redirectIfNeeded(data, navigate);

    expect(sessionStorage.getItem('geoRedirected')).toBe('true');
    expect(navigate).toHaveBeenCalledWith(
      `/weather?city=${encodeURIComponent(cityName)}`
    );
  });

  it('does not navigate again if geoRedirected is already set', () => {
    sessionStorage.setItem('geoRedirected', 'true');
    const data = [makeWeatherDetails()];

    redirectIfNeeded(data, navigate);

    expect(navigate).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('geoRedirected')).toBe('true');
  });

  it('encodes city names with spaces', () => {
    const cityName = 'New York';
    const data = [makeWeatherDetails({ name: cityName })];

    redirectIfNeeded(data, navigate);

    expect(navigate).toHaveBeenCalledWith('/weather?city=New%20York');
  });
});
