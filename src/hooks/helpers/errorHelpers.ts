import { getCache, setCache } from '../../utils/storage';
import { LocationError } from '../types';

export function mapGeolocationError(
  err: GeolocationPositionError
): LocationError {
  if (err.code === 1) return 'PERMISSION_DENIED';
  return 'UNAVAILABLE';
}

export async function showErrorToast(
  error: LocationError,
  addToast: (msg: string, type: 'error' | 'info') => void
) {
  switch (error) {
    case 'UNSUPPORTED': {
      addToast('Geolocation not supported in this browser.', 'error');
      break;
    }
    case 'PERMISSION_DENIED': {
      const cache: string | null = await getCache<string>('geoErrorShown');

      if (!cache) {
        addToast('Location permission denied.', 'info');
        await setCache('geoErrorShown', 'true');
      }
      break;
    }
    case 'UNAVAILABLE': {
      addToast('Unable to determine location. Try again later.', 'error');
      break;
    }
  }
}
