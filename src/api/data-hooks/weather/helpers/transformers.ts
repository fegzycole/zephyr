import {
  IGetWeatherRealTimeResponse,
  ITransformedWeatherRealTimeDetails,
} from '../types';
import { getLocalHHMM } from './dateUtils';
import { getWeatherIcon } from './weatherIconMap';

export function transformWeatherRealTimeResponse(
  data: IGetWeatherRealTimeResponse
): ITransformedWeatherRealTimeDetails {
  return {
    name: data.location.name,
    region: data.location.region,
    time: getLocalHHMM(data.location.localtime),
    temperature: data.current.temperature.toString(),
    icon: getWeatherIcon(data),
    uvIndex: data.current.uv_index,
    wind: data.current.wind_speed,
    humidity: data.current.humidity,
    visibility: data.current.visibility,
    feelsLike: data.current.feelslike,
    pressure: data.current.pressure,
    sunset: data.current.astro.sunset,
  };
}
