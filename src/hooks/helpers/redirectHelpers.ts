import { useNavigate } from 'react-router-dom';
import { ITransformedWeatherRealTimeDetails } from '../../api/weather/types';

export function redirectIfNeeded(
  data: (ITransformedWeatherRealTimeDetails | undefined)[],
  navigate: ReturnType<typeof useNavigate>
) {
  if (!data?.length) return;

  const first = data[0];
  if (!first?.name) return;

  if (!sessionStorage.getItem('geoRedirected')) {
    sessionStorage.setItem('geoRedirected', 'true');
    navigate(`/weather?city=${encodeURIComponent(first.name)}`);
  }
}
