import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  createFavoritesSlice,
  createNotesSlice,
  createCitiesSlice,
  createToastSlice,
} from './slices';
import {
  CitiesSlice,
  FavoritesSlice,
  NotesSlice,
  ToastSlice,
} from './types';

type Store = FavoritesSlice &
  NotesSlice &
  CitiesSlice &
  ToastSlice;

export const useStore = create<Store>()(
  persist(
    (...a) => ({
      ...createFavoritesSlice(...a),
      ...createNotesSlice(...a),
      ...createCitiesSlice(...a),
      ...createToastSlice(...a),
    }),
    { name: 'weather-app-storage' }
  )
);
