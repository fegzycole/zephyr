import { useNavigate } from 'react-router-dom';
import { ITransformedWeatherRealTimeDetails } from '@api/data-hooks/weather/types';
import { addUserCityToSessionStorage } from '@/utils/storage';

export function redirectIfNeeded(
  data: ITransformedWeatherRealTimeDetails | undefined,
  navigate: ReturnType<typeof useNavigate>
) {
  if (!data) return;

  if (!sessionStorage.getItem('userCity')) {
    addUserCityToSessionStorage(data.name);
    navigate(`/weather?city=${encodeURIComponent(data.name)}`);
  }
}
