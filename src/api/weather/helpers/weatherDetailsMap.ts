export const mapDetailsToText = {
  time: 'Time',
  uvIndex: 'UV Index',
  wind: 'Wind',
  humidity: 'Humidity',
  visibility: 'Visibility',
  feelsLike: 'Feels Like',
  pressure: 'Pressure',
  sunset: 'Sunset',
} as const;

export const mapDetailsToIcon = {
  time: 'icon-cloud-sun.svg',
  uvIndex: 'icon-sun.svg',
  wind: 'icon-wind.svg',
  humidity: 'icon-shower.svg',
  visibility: 'icon-eye.svg',
  feelsLike: 'icon-thermometer-half.svg',
  pressure: 'icon-tachometer-alt.svg',
  sunset: 'icon-cloud-sun.svg',
} as const;

export const mapDetailsToSuffix = {
  time: '',
  uvIndex: '',
  wind: ' km/h',
  humidity: '%',
  visibility: ' km',
  feelsLike: '°C',
  pressure: ' hPa',
  sunset: '',
} as const;
