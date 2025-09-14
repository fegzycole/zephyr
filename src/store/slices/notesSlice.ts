import { StateCreator } from 'zustand';
import { NotesSlice, Note, NotesByCity } from '../types';
import { getCache, setCache } from '@utils/storage';
import { NOTES_KEY } from '../keys';

export const createNotesSlice: StateCreator<NotesSlice> = (set) => ({
  notes: {},
  loadNotes: async () => {
    const stored = (await getCache<NotesByCity>(NOTES_KEY)) ?? {};
    set({ notes: stored });
  },
  addNote: async (city, content) => {
    const id = crypto.randomUUID();
    const note: Note = {
      id,
      city,
      content,
      createdAt: new Date().toISOString(),
    };
    set((s) => {
      const updated = { ...s.notes, [city]: [...(s.notes[city] || []), note] };
      setCache(NOTES_KEY, updated);
      return { notes: updated };
    });
  },
  updateNote: async (city, noteId, content) =>
    set((s) => {
      const updated = {
        ...s.notes,
        [city]: (s.notes[city] || []).map((n) =>
          n.id === noteId ? { ...n, content } : n
        ),
      };
      setCache(NOTES_KEY, updated);
      return { notes: updated };
    }),
  removeNote: async (city, noteId) =>
    set((s) => {
      const updated = {
        ...s.notes,
        [city]: (s.notes[city] || []).filter((n) => n.id !== noteId),
      };
      setCache(NOTES_KEY, updated);
      return { notes: updated };
    }),
});
