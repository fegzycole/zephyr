import { StateCreator } from 'zustand';
import { FavoritesSlice } from '../types';
import { setCache, getCache } from '@utils/storage';
import { FAVORITES_KEY } from '../keys';

export const createFavoritesSlice: StateCreator<FavoritesSlice> = (set) => ({
  favorites: [],
  loadFavorites: async () => {
    const stored = (await getCache<string[]>(FAVORITES_KEY)) ?? [];
    set({ favorites: stored });
  },
  addFavorite: async (city) =>
    set((s) => {
      const updated = Array.from(new Set([...s.favorites, city])).sort();
      setCache(FAVORITES_KEY, updated);
      return { favorites: updated };
    }),
  removeFavorite: async (city) =>
    set((s) => {
      const updated = s.favorites.filter((c) => c !== city);
      setCache(FAVORITES_KEY, updated);
      return { favorites: updated };
    }),
});
