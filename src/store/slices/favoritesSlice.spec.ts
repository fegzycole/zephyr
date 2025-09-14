import { describe, it, expect, vi, beforeEach } from 'vitest';
import { create } from 'zustand';
import { faker } from '@faker-js/faker';
import { createFavoritesSlice } from './favoritesSlice';
import { FavoritesSlice } from '../types';
import { FAVORITES_KEY } from '../keys';
import { getCache, setCache } from '@utils/storage';

vi.mock('@utils/storage', () => ({
  getCache: vi.fn(),
  setCache: vi.fn(),
}));

const mockedGetCache = vi.mocked(getCache);
const mockedSetCache = vi.mocked(setCache);

type Store = FavoritesSlice;

const setupStore = () =>
  create<Store>()((...a) => ({
    ...createFavoritesSlice(...a),
  }));

describe('createFavoritesSlice', () => {
  let store: ReturnType<typeof setupStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = setupStore();
  });

  it('has default state', () => {
    expect(store.getState().favorites).toEqual([]);
  });

  it('loads favorites from cache', async () => {
    const cachedFavorites = faker.helpers.multiple(
      () => faker.location.city(),
      {
        count: 4,
      }
    );

    mockedGetCache.mockResolvedValue(cachedFavorites);

    await store.getState().loadFavorites();

    expect(mockedGetCache).toHaveBeenCalledWith(FAVORITES_KEY);
    expect(store.getState().favorites).toEqual(cachedFavorites);
  });

  it('falls back to empty list if cache is empty', async () => {
    mockedGetCache.mockResolvedValue(undefined);

    await store.getState().loadFavorites();

    expect(store.getState().favorites).toEqual([]);
    expect(mockedSetCache).not.toHaveBeenCalled();
  });

  it('adds a new favorite and updates cache', async () => {
    const newCity = faker.location.city();

    await store.getState().addFavorite(newCity);

    expect(store.getState().favorites).toContain(newCity);
    expect(mockedSetCache).toHaveBeenCalledWith(
      FAVORITES_KEY,
      expect.arrayContaining([newCity])
    );
  });

  it('does not add duplicate favorites', async () => {
    const city = faker.location.city();
    store.setState({ favorites: [city] });

    await store.getState().addFavorite(city);

    expect(store.getState().favorites).toEqual([city]);
    expect(mockedSetCache).toHaveBeenCalledWith(FAVORITES_KEY, [city]);
  });

  it('removes a favorite and updates cache', async () => {
    const city1 = faker.location.city();
    const city2 = faker.location.city();
    store.setState({ favorites: [city1, city2] });

    await store.getState().removeFavorite(city1);

    expect(store.getState().favorites).toEqual([city2]);
    expect(mockedSetCache).toHaveBeenCalledWith(FAVORITES_KEY, [city2]);
  });
});
