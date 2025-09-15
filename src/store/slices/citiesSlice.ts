import { StateCreator } from 'zustand';
import { CitiesSlice } from '../types';
import { setCache, getCache } from '@utils/storage';
import { CITIES_KEY } from '../keys';

const DEFAULT_CITIES = [
  'Tokyo',
  'Delhi',
  'Shanghai',
  'Dhaka',
  'Cairo',
  'Sao Paulo',
  'Mexico City',
  'Beijing',
  'Mumbai',
  'Osaka-Shi',
  'Chongqing',
  'Karachi',
  'Kinshasa',
  'Lagos',
  'Istanbul',
].sort();

export const createCitiesSlice: StateCreator<CitiesSlice> = (set) => ({
  cities: [],
  loadCities: async () => {
    const stored = (await getCache<string[]>(CITIES_KEY)) ?? DEFAULT_CITIES;
    set({ cities: stored });
  },
  addCity: async (city) =>
    set((s) => {
      const updated = Array.from(new Set([...s.cities, city])).sort();
      setCache(CITIES_KEY, updated);
      return { cities: updated };
    }),
  removeCity: async (city) =>
    set((s) => {
      const updated = s.cities.filter((c) => c !== city).sort();
      setCache(CITIES_KEY, updated);
      return { cities: updated };
    }),
});
