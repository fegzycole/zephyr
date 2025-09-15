import { describe, it, expect, vi, beforeEach } from 'vitest';
import { create } from 'zustand';
import { createCitiesSlice } from './citiesSlice';
import { CitiesSlice } from '../types';
import { CITIES_KEY } from '../keys';
import { getCache, setCache } from '@utils/storage';

vi.mock('@utils/storage', () => ({
  getCache: vi.fn(),
  setCache: vi.fn(),
}));

const mockedGetCache = vi.mocked(getCache);
const mockedSetCache = vi.mocked(setCache);

type Store = CitiesSlice;

const setupStore = () =>
  create<Store>()((...a) => ({
    ...createCitiesSlice(...a),
  }));

describe('createCitiesSlice', () => {
  let store: ReturnType<typeof setupStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = setupStore();
  });

  it('has default state', () => {
    expect(store.getState().cities).toEqual([]);
  });

  it('loads cities from cache', async () => {
    const cachedCities = ['Madrid', 'Amsterdam', 'Vienna', 'Stockholm', 'Copenhagen'];

    mockedGetCache.mockResolvedValue(cachedCities);

    await store.getState().loadCities();

    expect(mockedGetCache).toHaveBeenCalledWith(CITIES_KEY);
    expect(store.getState().cities).toEqual(cachedCities);
  });

  it('falls back to DEFAULT_CITIES if cache is empty', async () => {
    mockedGetCache.mockResolvedValue(undefined);

    await store.getState().loadCities();

    expect(store.getState().cities.length).toBeGreaterThan(0);
    expect(mockedSetCache).not.toHaveBeenCalled();
  });

  it('adds a new city and updates cache', async () => {
    const existingCity = 'Dublin';
    const newCity = 'Prague';
    store.setState({ cities: [existingCity] });

    store.getState().addCity(newCity);

    expect(store.getState().cities).toEqual([existingCity, newCity].sort());
    expect(mockedSetCache).toHaveBeenCalledWith(CITIES_KEY, [existingCity, newCity].sort());
  });

  it('does not add duplicate cities', async () => {
    const city = 'Dublin';
    store.setState({ cities: [city] });

    store.getState().addCity(city);

    expect(store.getState().cities).toEqual([city]);
    expect(mockedSetCache).toHaveBeenCalledWith(CITIES_KEY, [city]);
  });

  it('removes a city and updates cache', async () => {
    const city1 = 'Dublin';
    const city2 = 'Prague';
    store.setState({ cities: [city1, city2] });

    store.getState().removeCity(city1);

    expect(store.getState().cities).toEqual([city2]);
    expect(mockedSetCache).toHaveBeenCalledWith(CITIES_KEY, [city2]);
  });
});
