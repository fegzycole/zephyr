export interface IGetWeatherRealTimeBase {
  access_key: string;
}

export interface IGetWeatherRealTimeParams extends IGetWeatherRealTimeBase {
  query: string[];
}

export type IGetWeatherRealTimeSingle = IGetWeatherRealTimeBase & {
  query: string;
};

export interface IWeatherLocation {
  name: string;
  localtime: string;
  region: string;
}

export interface IWeatherIcons {
  weather_icons: string[];
}

export interface IWeatherConditions extends IWeatherIcons {
  temperature: number;
  feelslike: number;
  uv_index: number;
  humidity: number;
  wind_speed: number;
  pressure: number;
  visibility: number;
  weather_descriptions: string[];
  weather_code: number;
}

export interface IWeatherRealTimeValues extends IWeatherConditions {
  observation_time: string;
  astro: IWeatherAstro;
}

export interface IWeatherAstro {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: string;
}

export interface IGetWeatherRealTimeData {
  current: IWeatherRealTimeValues;
  location: IWeatherLocation;
}

export interface IGetWeatherRealTimeResponse {
  current: IWeatherRealTimeValues;
  location: IWeatherLocation;
}

export interface ITransformedWeatherRealTimeDetails {
  name: string;
  region: string;
  time: string;
  temperature: string;
  icon: string;
  uvIndex: number;
  wind: number;
  humidity: number;
  visibility: number;
  feelsLike: number;
  pressure: number;
  sunset: string;
}

export type WeatherEndpointMap = {
  current: {
    params: IGetWeatherRealTimeSingle;
    response: IGetWeatherRealTimeResponse | undefined;
  };
};
