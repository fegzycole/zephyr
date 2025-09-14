import { describe, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';
import { deriveWeatherProperties } from './deriveWeatherProperties';
import {
  mapDetailsToText,
  mapDetailsToSuffix,
  mapDetailsToIcon,
} from './weatherDetailsMap';
import type { ITransformedWeatherRealTimeDetails } from '../types';

describe('deriveWeatherProperties', () => {
  it('maps all details with correct label, value, and icon', () => {
    const mockData: ITransformedWeatherRealTimeDetails = {
      name: faker.location.city(),
      region: faker.location.city(),
      time: faker.date.recent().toISOString(),
      temperature: `${faker.number.int({ min: -10, max: 40 })}°C`,
      icon: faker.image.url(),
      uvIndex: faker.number.int({ min: 0, max: 11 }),
      wind: faker.number.int({ min: 0, max: 150 }),
      humidity: faker.number.int({ min: 0, max: 100 }),
      visibility: faker.number.int({ min: 0, max: 20 }),
      feelsLike: faker.number.int({ min: -15, max: 45 }),
      pressure: faker.number.int({ min: 950, max: 1050 }),
      sunset: `${faker.number.int({ min: 1, max: 12 })}:${faker.number
        .int({ min: 0, max: 59 })
        .toString()
        .padStart(2, '0')} PM`,
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
      name: faker.location.city(),
      region: faker.location.city(),
      time: faker.date.recent().toISOString(),
      temperature: `${faker.number.int({ min: -10, max: 40 })}°C`,
      icon: faker.image.url(),
      uvIndex: faker.number.int({ min: 0, max: 11 }),
      wind: faker.number.int({ min: 0, max: 150 }),
      humidity: faker.number.int({ min: 0, max: 100 }),
      visibility: faker.number.int({ min: 0, max: 20 }),
      feelsLike: faker.number.int({ min: -15, max: 45 }),
      pressure: faker.number.int({ min: 950, max: 1050 }),
      sunset: `${faker.number.int({ min: 1, max: 12 })}:${faker.number
        .int({ min: 0, max: 59 })
        .toString()
        .padStart(2, '0')} PM`,
    };

    const mockData2: ITransformedWeatherRealTimeDetails = {
      name: faker.location.city(),
      region: faker.location.city(),
      time: faker.date.recent().toISOString(),
      temperature: `${faker.number.int({ min: -10, max: 40 })}°C`,
      icon: faker.image.url(),
      uvIndex: faker.number.int({ min: 0, max: 11 }),
      wind: faker.number.int({ min: 0, max: 150 }),
      humidity: faker.number.int({ min: 0, max: 100 }),
      visibility: faker.number.int({ min: 0, max: 20 }),
      feelsLike: faker.number.int({ min: -15, max: 45 }),
      pressure: faker.number.int({ min: 950, max: 1050 }),
      sunset: `${faker.number.int({ min: 1, max: 12 })}:${faker.number
        .int({ min: 0, max: 59 })
        .toString()
        .padStart(2, '0')} PM`,
    };

    const result1 = deriveWeatherProperties(mockData1);
    const result2 = deriveWeatherProperties(mockData2);

    expect(result1).not.toEqual(result2);
  });
});
