import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getWeatherRealTimeOptions } from './queryOptions';
import { IGetWeatherRealTimeParams } from './types';
import { transformWeatherRealTimeResponse } from './helpers/transformers';

export function useWeatherRealTime(params: IGetWeatherRealTimeParams) {
  const { query } = params;

  const results = useQueries({
    queries: query.map((city) =>
      getWeatherRealTimeOptions({ ...params, query: city })
    ),
  });

  const data = useMemo(
    () =>
      results.map((r) =>
        r.data ? transformWeatherRealTimeResponse(r.data) : undefined
      ),
    [results]
  );

  const isLoading = results.some((r) => r.isLoading);

  return { isLoading, data };
}
