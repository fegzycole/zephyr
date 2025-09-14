import { IGetWeatherRealTimeSingle } from './types';

export const weatherKeys = {
  realTime: (
    params: Omit<IGetWeatherRealTimeSingle, 'query'> & { query: string }
  ) => [{ scope: 'weather', entity: 'realtime', ...params }] as const,
};
