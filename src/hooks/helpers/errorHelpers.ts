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
    case 'UNAVAILABLE': {
      addToast('Unable to determine location. Try again later.', 'error');
      break;
    }
  }
}
