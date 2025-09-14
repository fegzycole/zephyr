import { describe, it, expect, vi, beforeEach } from 'vitest';
import { create } from 'zustand';
import { faker } from '@faker-js/faker';
import { createNotesSlice } from './notesSlice';
import { NotesSlice, Note, NotesByCity } from '../types';
import { NOTES_KEY } from '../keys';
import { getCache, setCache } from '../../utils/storage';

vi.mock('../../utils/storage', () => ({
  getCache: vi.fn(),
  setCache: vi.fn(),
}));

const mockedGetCache = vi.mocked(getCache);
const mockedSetCache = vi.mocked(setCache);

const mockUUID = vi.fn();
vi.stubGlobal('crypto', { randomUUID: mockUUID });

type Store = NotesSlice;

const setupStore = () =>
  create<Store>()((...a) => ({
    ...createNotesSlice(...a),
  }));

describe('createNotesSlice', () => {
  let store: ReturnType<typeof setupStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = setupStore();
    mockUUID.mockImplementation(() => faker.string.uuid());
  });

  it('has default state', () => {
    expect(store.getState().notes).toEqual({});
  });

  it('loads notes from cache', async () => {
    const city = faker.location.city();
    const fakeNote: Note = {
      id: faker.string.uuid(),
      city,
      content: faker.lorem.sentence(),
      createdAt: faker.date.past().toISOString(),
    };

    const cachedNotes: NotesByCity = { [city]: [fakeNote] };
    mockedGetCache.mockResolvedValue(cachedNotes);

    await store.getState().loadNotes();

    expect(mockedGetCache).toHaveBeenCalledWith(NOTES_KEY);
    expect(store.getState().notes).toEqual(cachedNotes);
  });

  it('falls back to empty object if cache is empty', async () => {
    mockedGetCache.mockResolvedValue(undefined);

    await store.getState().loadNotes();

    expect(store.getState().notes).toEqual({});
    expect(mockedSetCache).not.toHaveBeenCalled();
  });

  it('adds a note and updates cache', async () => {
    const city = faker.location.city();
    const content = faker.lorem.sentence();
    const fakeId = faker.string.uuid();
    mockUUID.mockReturnValueOnce(fakeId);

    await store.getState().addNote(city, content);

    const notesForCity = store.getState().notes[city];
    expect(notesForCity).toHaveLength(1);
    expect(notesForCity?.[0]).toMatchObject({ id: fakeId, city, content });

    expect(mockedSetCache).toHaveBeenCalledWith(
      NOTES_KEY,
      expect.objectContaining({
        [city]: expect.arrayContaining([
          expect.objectContaining({ id: fakeId, content }),
        ]),
      })
    );
  });

  it('updates a note and calls setCache', async () => {
    const city = faker.location.city();
    const id = faker.string.uuid();
    const original: Note = {
      id,
      city,
      content: faker.lorem.sentence(),
      createdAt: new Date().toISOString(),
    };
    store.setState({ notes: { [city]: [original] } });

    const newContent = faker.lorem.paragraph();
    await store.getState().updateNote(city, id, newContent);

    const updatedNote = store.getState().notes[city][0];
    expect(updatedNote.content).toBe(newContent);
    expect(mockedSetCache).toHaveBeenCalled();
  });

  it('removes a note and calls setCache', async () => {
    const city = faker.location.city();
    const note1: Note = {
      id: faker.string.uuid(),
      city,
      content: faker.lorem.sentence(),
      createdAt: new Date().toISOString(),
    };
    const note2: Note = {
      id: faker.string.uuid(),
      city,
      content: faker.lorem.sentence(),
      createdAt: new Date().toISOString(),
    };
    store.setState({ notes: { [city]: [note1, note2] } });

    await store.getState().removeNote(city, note1.id);

    expect(store.getState().notes[city]).toEqual([note2]);
    expect(mockedSetCache).toHaveBeenCalledWith(
      NOTES_KEY,
      expect.objectContaining({ [city]: [note2] })
    );
  });
});
