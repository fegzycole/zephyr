import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requestLocation, watchPermissionChanges } from './locationHelpers';
import { mapGeolocationError } from './errorHelpers';
import { LocationCoords, LocationError } from '../types';

vi.mock('./errorHelpers', () => ({
  mapGeolocationError: vi
    .fn<(err: GeolocationPositionError) => LocationError>()
    .mockReturnValue('UNAVAILABLE'),
}));

type TestNavigator = Omit<Navigator, 'geolocation' | 'permissions'> & {
  geolocation?: {
    getCurrentPosition: (
      success: (pos: { coords: LocationCoords }) => void,
      error?: (err: GeolocationPositionError) => void
    ) => void;
  };
  permissions?: {
    query: (desc: { name: string }) => Promise<PermissionStatus>;
  };
};

const flushPromises = () =>
  new Promise<void>((resolve) => queueMicrotask(resolve));

describe('requestLocation', () => {
  let setCoords: (coords: LocationCoords) => void;
  let setError: (error: LocationError) => void;

  beforeEach(() => {
    setCoords = vi.fn();
    setError = vi.fn();
    vi.clearAllMocks();
  });

  it('sets UNSUPPORTED error if geolocation is missing', () => {
    (navigator as unknown as TestNavigator).geolocation = undefined;

    requestLocation(setCoords, setError);

    expect(setError).toHaveBeenCalledWith('UNSUPPORTED');
  });

  it('calls setCoords on success', () => {
    (navigator as unknown as TestNavigator).geolocation = {
      getCurrentPosition: (success) =>
        success({ coords: { latitude: 10, longitude: 20 } }),
    };

    requestLocation(setCoords, setError);

    expect(setCoords).toHaveBeenCalledWith({ latitude: 10, longitude: 20 });
    expect(setError).not.toHaveBeenCalled();
  });

  it('calls setError on failure', () => {
    const mockError = { code: 2 } as GeolocationPositionError;

    (navigator as unknown as TestNavigator).geolocation = {
      getCurrentPosition: (_success, failure) => failure?.(mockError),
    };

    requestLocation(setCoords, setError);

    expect(mapGeolocationError).toHaveBeenCalledWith(mockError);
    expect(setError).toHaveBeenCalledWith('UNAVAILABLE');
  });
});

describe('watchPermissionChanges', () => {
  let requestLocationFn: () => void;
  let setError: (error: LocationError) => void;

  beforeEach(() => {
    requestLocationFn = vi.fn();
    setError = vi.fn();
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('sets UNSUPPORTED if permissions API is missing', () => {
    (navigator as unknown as TestNavigator).permissions = undefined;

    watchPermissionChanges(requestLocationFn, setError);

    expect(setError).toHaveBeenCalledWith('UNSUPPORTED');
  });

  it('calls requestLocationFn when state changes to granted', async () => {
    const mockStatus: PermissionStatus = {
      state: 'granted',
      onchange: null,
    } as PermissionStatus;

    (navigator as unknown as TestNavigator).permissions = {
      query: vi.fn().mockResolvedValue(mockStatus),
    };

    watchPermissionChanges(requestLocationFn, setError);

    await flushPromises();
    mockStatus.onchange?.(new Event('change'));

    expect(sessionStorage.getItem('geoRedirected')).toBeNull();
    expect(requestLocationFn).toHaveBeenCalled();
  });

  it('calls setError when state changes to denied', async () => {
    const mockStatus: PermissionStatus = {
      state: 'denied',
      onchange: null,
    } as PermissionStatus;

    (navigator as unknown as TestNavigator).permissions = {
      query: vi.fn().mockResolvedValue(mockStatus),
    };

    watchPermissionChanges(requestLocationFn, setError);

    await flushPromises();
    mockStatus.onchange?.(new Event('change'));

    expect(setError).toHaveBeenCalledWith('PERMISSION_DENIED');
  });

  it('sets UNSUPPORTED on query rejection', async () => {
    (navigator as unknown as TestNavigator).permissions = {
      query: vi.fn().mockRejectedValue(new Error('fail')),
    };

    watchPermissionChanges(requestLocationFn, setError);

    await flushPromises();

    expect(setError).toHaveBeenCalledWith('UNSUPPORTED');
  });
});
