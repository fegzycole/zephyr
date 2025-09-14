import { IGetWeatherRealTimeData } from '../types';

export const weatherIconMap: Record<number, string> = {
  113: 'day_clear.svg',
  116: 'day_partial_cloud.svg',
  119: 'cloudy.svg',
  122: 'overcast.svg',
  143: 'mist.svg',
  248: 'fog.svg',
  260: 'fog.svg',
  176: 'rain.svg',
  263: 'rain.svg',
  266: 'rain.svg',
  293: 'rain.svg',
  296: 'day_rain.svg',
  299: 'rain.svg',
  302: 'rain.svg',
  305: 'rain.svg',
  308: 'rain.svg',
  353: 'day_rain.svg',
  356: 'rain.svg',
  359: 'rain.svg',
  179: 'sleet.svg',
  182: 'sleet.svg',
  185: 'sleet.svg',
  281: 'sleet.svg',
  284: 'sleet.svg',
  314: 'sleet.svg',
  317: 'day_sleet.svg',
  320: 'day_sleet.svg',
  323: 'day_snow.svg',
  326: 'day_snow.svg',
  329: 'snow.svg',
  332: 'snow.svg',
  335: 'snow.svg',
  338: 'snow.svg',
  371: 'day_snow.svg',
  374: 'day_sleet.svg',
  365: 'day_sleet.svg',
  377: 'sleet.svg',
  350: 'sleet.svg',
  230: 'snow.svg',
  227: 'snow.svg',
  200: 'thunder.svg',
  386: 'rain_thunder.svg',
  389: 'day_rain_thunder.svg',
  392: 'snow_thunder.svg',
  395: 'snow_thunder.svg',
  9991: 'tornado.svg',
  9992: 'wind.svg',
  9993: 'angry_clouds.svg',
};

const nightIcons: Record<number, string> = {
  113: 'night_full_moon_clear.svg',
  116: 'night_full_moon_partial_cloud.svg',
  296: 'night_full_moon_rain.svg',
  389: 'night_full_moon_rain_thunder.svg',
  317: 'night_full_moon_sleet.svg',
  323: 'night_full_moon_snow.svg',
  395: 'night_full_moon_snow_thunder.svg',
};

function isDay(payload: IGetWeatherRealTimeData) {
  const localtime = payload.location.localtime;
  const currentAstro = payload.current.astro;

  if (!localtime || !currentAstro) return true;

  const time24ToMinutes = (t24: string) => {
    const [h, m] = t24.split(':').map(Number);
    return h * 60 + m;
  };

  const time12ToMinutes = (t12: string) => {
    const [time, meridiem] = t12.split(' ');
    const [rawH, m] = time.split(':').map(Number);
    let h = rawH;
    h = h % 12;
    if (meridiem.toUpperCase() === 'PM') h += 12;
    return h * 60 + m;
  };

  const [, timePart] = localtime.split(' ');
  const currentMinutes = time24ToMinutes(timePart);
  const sunriseMinutes = time12ToMinutes(currentAstro.sunrise);
  const sunsetMinutes = time12ToMinutes(currentAstro.sunset);

  return currentMinutes >= sunriseMinutes && currentMinutes < sunsetMinutes
    ? true
    : false;
}

export function getWeatherIcon(payload: IGetWeatherRealTimeData): string {
  const day = isDay(payload);
  const code = payload.current.weather_code;

  if (!day && nightIcons[code]) {
    return `/weather/${nightIcons[code]}`;
  }
  return `/weather/${weatherIconMap[code] || 'cloudy.svg'}`;
}
