import { useNavigate } from 'react-router-dom';
import { ITransformedWeatherRealTimeDetails } from '@api/data-hooks/weather/types';

export function redirectIfNeeded(
  data: ITransformedWeatherRealTimeDetails | undefined,
  navigate: ReturnType<typeof useNavigate>
) {
  if (!data) return;

  if (!sessionStorage.getItem('geoRedirected')) {
    sessionStorage.setItem('geoRedirected', 'true');
    navigate(`/weather?city=${encodeURIComponent(data.name)}`);
  }
}
