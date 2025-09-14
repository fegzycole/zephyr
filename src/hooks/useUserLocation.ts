import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeatherRealTime } from '../api/data-hooks/weather';
import { showErrorToast } from './helpers/errorHelpers';
import {
  requestLocation,
  watchPermissionChanges,
} from './helpers/locationHelpers';
import { redirectIfNeeded } from './helpers/redirectHelpers';
import { LocationCoords, LocationError } from './types';
import { useStore } from '../store';

export function useUserLocation() {
  const [coords, setCoords] = useState<LocationCoords | null>(null);
  const [error, setError] = useState<LocationError>(null);

  const addToast = useStore((s) => s.addToast);
  const navigate = useNavigate();

  const { data } = useWeatherRealTime(
    coords
      ? {
          access_key: import.meta.env.VITE_WEATHER_API_KEY,
          query: [`${coords.latitude},${coords.longitude}`],
        }
      : {
          access_key: import.meta.env.VITE_WEATHER_API_KEY,
          query: [],
        }
  );

  useEffect(() => {
    const request = () => requestLocation(setCoords, setError);
    request();
    watchPermissionChanges(request, setError);
  }, []);

  useEffect(() => {
    if (coords && data) {
      redirectIfNeeded(data, navigate);
    }
  }, [coords, data, navigate]);

  useEffect(() => {
    if (error) {
      showErrorToast(error, addToast);
    }
  }, [error, addToast]);

  return { coords, error };
}
