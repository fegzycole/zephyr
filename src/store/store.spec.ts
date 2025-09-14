import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStore } from './store';
import { faker } from '@faker-js/faker';

beforeEach(() => {
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
    const city = faker.location.city();
    const store = useStore.getState();

    store.addFavorite(city);
    expect(useStore.getState().favorites).toContain(city);

    store.removeFavorite(city);
    expect(useStore.getState().favorites).not.toContain(city);
  });

  it('can add, update, and remove notes', () => {
    const city = faker.location.city();
    const content = faker.lorem.sentence();
    const newContent = faker.lorem.sentence();

    const store = useStore.getState();

    store.addNote(city, content);
    const note = useStore.getState().notes[city][0];
    expect(note.content).toBe(content);

    store.updateNote(city, note.id, newContent);
    expect(useStore.getState().notes[city][0].content).toBe(newContent);

    store.removeNote(city, note.id);
    expect(useStore.getState().notes[city]).toEqual([]);
  });

  it('can remove cities', () => {
    const city = 'Tokyo'
    const store = useStore.getState();;

    store.removeCity(city);
    expect(useStore.getState().cities).not.toContain(city);
  });

  it('can add and remove toasts', () => {
    const message = faker.lorem.words(3);
    const store = useStore.getState();

    store.addToast(message, 'info');
    const toast = useStore.getState().toasts[0];

    expect(toast.message).toBe(message);
    expect(['info', 'error']).toContain(toast.type);

    store.removeToast(toast.id);
    expect(useStore.getState().toasts).toEqual([]);
  });

  it('supports cross-slice operations', () => {
    const city = faker.location.city();
    const store = useStore.getState();

    store.addFavorite(city);

    const content = faker.lorem.sentence();
    store.addNote(city, content);

    store.addToast(`Added ${city} successfully`, 'info');

    const state = useStore.getState();

    expect(state.favorites).toContain(city);
    expect(state.notes[city][0].content).toBe(content);
    expect(state.toasts.some((t) => t.message.includes(city))).toBe(true);
  });
});
