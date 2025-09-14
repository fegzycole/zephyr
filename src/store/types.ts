export interface FavoritesSlice {
  favorites: string[];
  addFavorite: (city: string) => void;
  removeFavorite: (city: string) => void;
  loadFavorites: () => Promise<void>;
}

export interface Note {
  id: string;
  city: string;
  content: string;
  createdAt: string;
}

export type NotesByCity = Record<string, Note[]>;

export interface NotesSlice {
  notes: Record<string, Note[]>;
  addNote: (city: string, content: string) => void;
  updateNote: (city: string, noteId: string, content: string) => void;
  removeNote: (city: string, noteId: string) => void;
  loadNotes: () => Promise<void>;
}

export interface CitiesSlice {
  cities: string[];
  removeCity: (city: string) => void;
  loadCities: () => Promise<void>;
}

export interface Toast {
  id: string;
  message: string;
  type?: 'error' | 'info' | 'warn';
}

export interface ToastSlice {
  toasts: Toast[];
  addToast: (message: string, type?: 'error' | 'info' | 'warn') => void;
  removeToast: (id: string) => void;
}
