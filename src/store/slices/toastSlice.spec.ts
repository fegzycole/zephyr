import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { create } from 'zustand';
import { faker } from '@faker-js/faker';
import { createToastSlice } from './toastSlice';
import { ToastSlice } from '../types';

type Store = ToastSlice;

const setupStore = () =>
  create<Store>()((...a) => ({
    ...createToastSlice(...a),
  }));

describe('createToastSlice', () => {
  let store: ReturnType<typeof setupStore>;

  beforeEach(() => {
    store = setupStore();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('has default state', () => {
    expect(store.getState().toasts).toEqual([]);
  });

  it('adds a toast with default type "info"', () => {
    const message = faker.lorem.sentence();

    store.getState().addToast(message);

    const toasts = store.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe(message);
    expect(toasts[0].type).toBe('info');
  });

  it('adds a toast with explicit type', () => {
    const message = faker.lorem.sentence();
    const type = 'error';

    store.getState().addToast(message, type);

    const toasts = store.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe(message);
    expect(toasts[0].type).toBe(type);
  });

  it('removes a toast by id', () => {
    const message = faker.lorem.words(3);
    store.getState().addToast(message);

    const [toast] = store.getState().toasts;
    store.getState().removeToast(toast.id);

    expect(store.getState().toasts).toEqual([]);
  });

  it('automatically removes a toast after 3 seconds', () => {
    const message = faker.lorem.words(2);
    store.getState().addToast(message);

    expect(store.getState().toasts).toHaveLength(1);

    vi.advanceTimersByTime(3000);

    expect(store.getState().toasts).toEqual([]);
  });

  it('only removes the correct toast after timeout', () => {
    const msg1 = faker.lorem.word();
    const msg2 = faker.lorem.word();

    store.getState().addToast(msg1);
    store.getState().addToast(msg2);

    expect(store.getState().toasts).toHaveLength(2);

    vi.advanceTimersByTime(3000);

    expect(store.getState().toasts).toEqual([]);
  });

  it('creates unique ids for each toast', () => {
    const msg1 = faker.lorem.sentence();
    const msg2 = faker.lorem.sentence();

    let counter = 1000;
    vi.spyOn(Date, 'now').mockImplementation(() => counter++);

    store.getState().addToast(msg1);
    store.getState().addToast(msg2);

    const [toast1, toast2] = store.getState().toasts;
    expect(toast1.id).not.toBe(toast2.id);
  });
});
