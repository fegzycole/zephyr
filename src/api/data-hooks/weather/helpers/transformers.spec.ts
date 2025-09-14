import { describe, it, expect, vi } from 'vitest';

import { transformWeatherRealTimeResponse } from './transformers';

import type { IGetWeatherRealTimeResponse } from '../types';

vi.mock('./dateUtils', () => ({
  getLocalHHMM: vi.fn().mockReturnValue('03:45 PM'),
}));

vi.mock('./weatherIconMap', () => ({
  getWeatherIcon: vi.fn().mockReturnValue('icon-sunny.svg'),
}));

describe('transformWeatherRealTimeResponse', () => {
  it('transforms IGetWeatherRealTimeResponse into ITransformedWeatherRealTimeDetails', () => {
    const mockResponse: IGetWeatherRealTimeResponse = {
      location: {
        name: 'San Diego',
        localtime: '2025-09-09 15:45',
        region: 'California',
      },
      current: {
        temperature: 28,
        feelslike: 32,
        uv_index: 7,
        humidity: 55,
        wind_speed: 18,
        pressure: 1015,
        visibility: 12,
        weather_descriptions: ['Partly Cloudy'],
        weather_code: 1500,
        weather_icons: ['https://test.example.com/weather-icon.png'],
        observation_time: new Date('2023-01-01T15:45:00Z').toISOString(),
        astro: {
          sunrise: '06:12 AM',
          sunset: '07:45 PM',
          moonrise: '09:15 PM',
          moonset: '05:30 AM',
          moon_phase: 'Waning Gibbous',
          moon_illumination: '72',
        },
      },
    };

    const result = transformWeatherRealTimeResponse(mockResponse);

    expect(result).toEqual({
      name: mockResponse.location.name,
      region: mockResponse.location.region,
      time: '03:45 PM',
      temperature: mockResponse.current.temperature.toString(),
      icon: 'icon-sunny.svg',
      uvIndex: mockResponse.current.uv_index,
      wind: mockResponse.current.wind_speed,
      humidity: mockResponse.current.humidity,
      visibility: mockResponse.current.visibility,
      feelsLike: mockResponse.current.feelslike,
      pressure: mockResponse.current.pressure,
      sunset: mockResponse.current.astro.sunset,
    });
  });
});
