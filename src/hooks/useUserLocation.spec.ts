import { renderHook } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useUserLocation } from './useUserLocation';
import { useWeatherRealTime } from '../api/weather';
import { showErrorToast } from './helpers/errorHelpers';
import {
  requestLocation,
  watchPermissionChanges,
} from './helpers/locationHelpers';
import { redirectIfNeeded } from './helpers/redirectHelpers';
import { useStore } from '../store';

vi.mock('../api/weather', () => ({
  useWeatherRealTime: vi.fn(),
}));

vi.mock('./helpers/errorHelpers', () => ({
  showErrorToast: vi.fn(),
}));

vi.mock('./helpers/locationHelpers', () => ({
  requestLocation: vi.fn(),
  watchPermissionChanges: vi.fn(),
}));

vi.mock('./helpers/redirectHelpers', () => ({
  redirectIfNeeded: vi.fn(),
}));

vi.mock('../store', () => ({
  useStore: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('useUserLocation', () => {
  const addToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(addToast);
    (useWeatherRealTime as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      { data: undefined }
    );
  });

  it('calls requestLocation and watchPermissionChanges on mount', () => {
    renderHook(() => useUserLocation());

    expect(requestLocation).toHaveBeenCalled();
    expect(watchPermissionChanges).toHaveBeenCalled();
  });

  it('calls redirectIfNeeded when coords and data are set', () => {
    (useWeatherRealTime as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      {
        data: [
          {
            name: 'Berlin',
            time: '',
            temperature: '',
            icon: '',
            uvIndex: 0,
            wind: 0,
            humidity: 0,
            visibility: 0,
            feelsLike: 0,
            pressure: 0,
            sunset: '',
          },
        ],
      }
    );

    (requestLocation as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (setCoords) => {
        setCoords({ latitude: 1, longitude: 2 });
      }
    );

    renderHook(() => useUserLocation());

    expect(redirectIfNeeded).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Function)
    );
  });

  it('calls showErrorToast when error is set', () => {
    (requestLocation as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (_setCoords, setError) => {
        setError('PERMISSION_DENIED');
      }
    );

    renderHook(() => useUserLocation());

    expect(showErrorToast).toHaveBeenCalledWith('PERMISSION_DENIED', addToast);
  });
});
