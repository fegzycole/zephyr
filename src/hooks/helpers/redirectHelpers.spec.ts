import { describe, it, expect, vi, beforeEach } from 'vitest';

import { redirectIfNeeded } from './redirectHelpers';

import type { ITransformedWeatherRealTimeDetails } from '@api/data-hooks/weather/types';

function makeWeatherDetails(
  overrides?: Partial<ITransformedWeatherRealTimeDetails>
): ITransformedWeatherRealTimeDetails {
  return {
    name: 'Default City',
    region: 'Default Region',
    time: new Date('2023-01-01T10:00:00Z').toISOString(),
    temperature: '20',
    icon: 'sunny',
    uvIndex: 5,
    wind: 15,
    humidity: 60,
    visibility: 8,
    feelsLike: 22,
    pressure: 1013,
    sunset: new Date('2023-01-02T18:00:00Z').toISOString(),
    ...overrides,
  };
}

describe('redirectIfNeeded', () => {
  let navigate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    navigate = vi.fn();
    sessionStorage.clear();
  });

  it('does nothing if data is undefined', () => {
    redirectIfNeeded(undefined, navigate);

    expect(navigate).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('geoRedirected')).toBeNull();
  });

  it('navigates and sets geoRedirected when first element has a name', () => {
    const cityName = 'Los Angeles';
    const data = makeWeatherDetails({ name: cityName });

    redirectIfNeeded(data, navigate);

    expect(sessionStorage.getItem('userCity')).toBeDefined();
    expect(navigate).toHaveBeenCalledWith(
      `/weather?city=${encodeURIComponent(cityName)}`
    );
  });

  it('does not navigate again if userCity is already set', () => {
    sessionStorage.setItem('userCity', 'Kinshasha');
    const data = makeWeatherDetails();

    redirectIfNeeded(data, navigate);

    expect(navigate).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('userCity')).toBeDefined();
  });

  it('encodes city names with spaces', () => {
    const cityName = 'New York';
    const data = makeWeatherDetails({ name: cityName });

    redirectIfNeeded(data, navigate);

    expect(navigate).toHaveBeenCalledWith('/weather?city=New%20York');
  });
});
