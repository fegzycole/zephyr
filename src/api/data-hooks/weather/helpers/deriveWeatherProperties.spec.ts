import { describe, it, expect, beforeEach } from 'vitest';
import { deriveWeatherProperties } from './deriveWeatherProperties';
import {
  mapDetailsToText,
  mapDetailsToSuffix,
  mapDetailsToIcon,
} from './weatherDetailsMap';
import type { ITransformedWeatherRealTimeDetails } from '../types';

describe('deriveWeatherProperties', () => {
  beforeEach(() => {
    // Test setup
  });

  it('maps all details with correct label, value, and icon', () => {
    const mockData: ITransformedWeatherRealTimeDetails = {
      name: 'Phoenix',
      region: 'Arizona',
      time: new Date('2023-01-01T16:30:00Z').toISOString(),
      temperature: '30°C',
      icon: 'https://test.example.com/weather-icon.png',
      uvIndex: 8,
      wind: 22,
      humidity: 45,
      visibility: 15,
      feelsLike: 35,
      pressure: 1008,
      sunset: '7:45 PM',
    };

    const result = deriveWeatherProperties(mockData);

    expect(result).toHaveLength(Object.keys(mapDetailsToText).length);

    result.forEach((item, index) => {
      const key = Object.keys(mapDetailsToText)[
        index
      ] as keyof typeof mapDetailsToText;

      expect(item.label).toBe(mapDetailsToText[key].toUpperCase());
      expect(item.value).toBe(
        `${mockData[key].toString()}${mapDetailsToSuffix[key]}`
      );
      expect(item.icon).toBe(mapDetailsToIcon[key]);
    });
  });

  it('produces different values for different input objects', () => {
    const mockData1: ITransformedWeatherRealTimeDetails = {
      name: 'Denver',
      region: 'Colorado',
      time: new Date('2023-01-02T14:15:00Z').toISOString(),
      temperature: '18°C',
      icon: 'https://test.example.com/weather-icon2.png',
      uvIndex: 5,
      wind: 12,
      humidity: 70,
      visibility: 10,
      feelsLike: 20,
      pressure: 1020,
      sunset: '6:30 PM',
    };

    const mockData2: ITransformedWeatherRealTimeDetails = {
      name: 'Austin',
      region: 'Texas',
      time: new Date('2023-01-03T12:00:00Z').toISOString(),
      temperature: '25°C',
      icon: 'https://test.example.com/weather-icon3.png',
      uvIndex: 6,
      wind: 8,
      humidity: 80,
      visibility: 5,
      feelsLike: 28,
      pressure: 1025,
      sunset: '8:15 PM',
    };

    const result1 = deriveWeatherProperties(mockData1);
    const result2 = deriveWeatherProperties(mockData2);

    expect(result1).not.toEqual(result2);
  });
});
