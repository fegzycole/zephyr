import { IGetWeatherRealTimeParams } from './types';

export const weatherKeys = {
  detail: (params: IGetWeatherRealTimeParams) =>
    [{ scope: 'weather', entity: 'realtime', ...params }] as const,
};
