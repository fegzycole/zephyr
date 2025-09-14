import {
  mapDetailsToText,
  mapDetailsToSuffix,
  mapDetailsToIcon,
} from './weatherDetailsMap';
import { ITransformedWeatherRealTimeDetails } from '../types';

export const deriveWeatherProperties = (data: ITransformedWeatherRealTimeDetails) => {
  const array = [];

  for (const [key, label] of Object.entries(mapDetailsToText)) {
    const typedKey = key as keyof typeof mapDetailsToText;
    const suffix = mapDetailsToSuffix[typedKey];

    array.push({
      label: label.toUpperCase(),
      value: `${data[typedKey].toString()}${suffix}`,
      icon: mapDetailsToIcon[typedKey],
    });
  }

  return array;
};
