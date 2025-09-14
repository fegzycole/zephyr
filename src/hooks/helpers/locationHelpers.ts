import { removeUserCityFromSessionStorage } from '@utils/storage';
import { LocationCoords, LocationError } from '../types';
import { mapGeolocationError } from './errorHelpers';

export function requestLocation(
  setCoords: (coords: LocationCoords) => void,
  setError: (error: LocationError) => void
) {
  if (!navigator.geolocation) {
    setError('UNSUPPORTED');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) =>
      setCoords({ latitude: coords.latitude, longitude: coords.longitude }),
    (err) => setError(mapGeolocationError(err))
  );
}

export function watchPermissionChanges(
  requestLocationFn: () => void,
  setError: (e: LocationError) => void
) {
  if (!navigator.permissions) {
    setError('UNSUPPORTED');
    return;
  }

  navigator.permissions
    .query({ name: 'geolocation' })
    .then((status) => {
      status.onchange = () => {
        if (status.state === 'granted') {
          requestLocationFn();
          setError(null);
        }
        if (status.state === 'denied') {
          removeUserCityFromSessionStorage();
          setError('PERMISSION_DENIED');
        }
      };
    })
    .catch(() => setError('UNSUPPORTED'));
}
