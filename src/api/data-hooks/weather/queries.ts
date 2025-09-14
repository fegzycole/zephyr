import { useQueries, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getWeatherRealTimeOptions } from './queryOptions';
import {
  IGetWeatherRealTimeParams,
  IUseGetWeatherRealTimeMultipleParams,
} from './types';
import { transformWeatherRealTimeResponse } from './helpers/transformers';

export function useGetWeatherRealTime(params: IGetWeatherRealTimeParams) {
  const queryOptions = getWeatherRealTimeOptions(params);

  const { data: weatherResonseData, isLoading } = useQuery(queryOptions);

  const data = useMemo(() => {
    if (weatherResonseData) {
      return transformWeatherRealTimeResponse(weatherResonseData);
    }

    return undefined;
  }, [weatherResonseData]);

  return {
    data,
    isLoading,
  };
}

export function useGetWeatherRealTimeMultiple({
  access_key,
  queries,
}: IUseGetWeatherRealTimeMultipleParams) {
  const queryConfigs = useMemo(
    () =>
      queries.map((query) => getWeatherRealTimeOptions({ access_key, query })),
    [access_key, queries]
  );

  const results = useQueries({ queries: queryConfigs });

  const data = useMemo(
    () =>
      results.map((r) =>
        r.data ? transformWeatherRealTimeResponse(r.data) : undefined
      ),
    [results]
  );

  const isLoading = results.some((r) => r.isLoading);

  return {
    data,
    isLoading,
    results,
  };
}
