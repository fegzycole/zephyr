import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStore } from './store';

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});
  vi.spyOn(Storage.prototype, 'clear').mockImplementation(() => {});
});

describe('useStore (root store)', () => {
  it('has the correct default state', () => {
    const state = useStore.getState();

    expect(state.favorites).toEqual([]);
    expect(state.notes).toEqual({});
    expect(state.cities).toEqual([]);
    expect(state.toasts).toEqual([]);
  });

  it('can add and remove favorites', () => {
    const city = 'Paris';
    const store = useStore.getState();

    store.addFavorite(city);
    expect(useStore.getState().favorites).toContain(city);

    store.removeFavorite(city);
    expect(useStore.getState().favorites).not.toContain(city);
  });

  it('can add, update, and remove notes', () => {
    const city = 'London';
    const content = 'Original note content';
    const newContent = 'Updated note content';

    const store = useStore.getState();

    store.addNote(city, content);
    const note = useStore.getState().notes[city][0];
    expect(note.content).toBe(content);

    store.updateNote(city, note.id, newContent);
    expect(useStore.getState().notes[city][0].content).toBe(newContent);

    store.removeNote(city, note.id);
    expect(useStore.getState().notes[city]).toEqual([]);
  });

  it('can add and remove cities', () => {
    const city = 'Tokyo';
    const store = useStore.getState();

    store.addCity(city);
    expect(useStore.getState().cities).toContain(city);

    store.removeCity(city);
    expect(useStore.getState().cities).not.toContain(city);
  });

  it('can add and remove toasts', () => {
    const message = 'test toast message';
    const store = useStore.getState();

    store.addToast(message, 'info');
    const toast = useStore.getState().toasts[0];

    expect(toast.message).toBe(message);
    expect(['info', 'error']).toContain(toast.type);

    store.removeToast(toast.id);
    expect(useStore.getState().toasts).toEqual([]);
  });

  it('supports cross-slice operations', () => {
    const city = 'Berlin';
    const store = useStore.getState();

    store.addCity(city);
    store.addFavorite(city);

    const content = 'Cross-slice test note';
    store.addNote(city, content);

    store.addToast(`Added ${city} successfully`, 'info');

    const state = useStore.getState();

    expect(state.cities).toContain(city);
    expect(state.favorites).toContain(city);
    expect(state.notes[city][0].content).toBe(content);
    expect(state.toasts.some((t) => t.message.includes(city))).toBe(true);
  });
});
