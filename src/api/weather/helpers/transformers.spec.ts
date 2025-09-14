import { describe, it, expect, vi } from 'vitest';
import { faker } from '@faker-js/faker';
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
        name: faker.location.city(),
        localtime: '2025-09-09 15:45',
        region: faker.location.city(),
      },
      current: {
        temperature: faker.number.int({ min: -10, max: 40 }),
        feelslike: faker.number.int({ min: -15, max: 45 }),
        uv_index: faker.number.int({ min: 0, max: 11 }),
        humidity: faker.number.int({ min: 0, max: 100 }),
        wind_speed: faker.number.int({ min: 0, max: 150 }),
        pressure: faker.number.int({ min: 950, max: 1050 }),
        visibility: faker.number.int({ min: 0, max: 20 }),
        weather_descriptions: [faker.word.words(2)],
        weather_code: faker.number.int({ min: 1000, max: 2000 }),
        weather_icons: [faker.image.url()],
        observation_time: faker.date.recent().toISOString(),
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
