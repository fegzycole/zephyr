import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { create } from 'zustand';
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
    vi.clearAllMocks();
  });

  it('has default state', () => {
    expect(store.getState().toasts).toEqual([]);
  });

  it('adds a toast with default type "info"', () => {
    const message = 'Test notification message';

    store.getState().addToast(message);

    const toasts = store.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe(message);
    expect(toasts[0].type).toBe('info');
  });

  it('adds a toast with explicit type', () => {
    const message = 'Error notification message';
    const type = 'error';

    store.getState().addToast(message, type);

    const toasts = store.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe(message);
    expect(toasts[0].type).toBe(type);
  });

  it('removes a toast by id', () => {
    const message = 'test remove message';
    store.getState().addToast(message);

    const [toast] = store.getState().toasts;
    store.getState().removeToast(toast.id);

    expect(store.getState().toasts).toEqual([]);
  });

  it('automatically removes a toast after 3 seconds', () => {
    const message = 'timeout test';
    store.getState().addToast(message);

    expect(store.getState().toasts).toHaveLength(1);

    vi.advanceTimersByTime(3000);

    expect(store.getState().toasts).toEqual([]);
  });

  it('only removes the correct toast after timeout', () => {
    const msg1 = 'message1';
    const msg2 = 'message2';

    store.getState().addToast(msg1);
    store.getState().addToast(msg2);

    expect(store.getState().toasts).toHaveLength(2);

    vi.advanceTimersByTime(3000);

    expect(store.getState().toasts).toEqual([]);
  });

  it('creates unique ids for each toast', () => {
    const msg1 = 'First unique message';
    const msg2 = 'Second unique message';

    let counter = 1000;
    vi.spyOn(Date, 'now').mockImplementation(() => counter++);

    store.getState().addToast(msg1);
    store.getState().addToast(msg2);

    const [toast1, toast2] = store.getState().toasts;
    expect(toast1.id).not.toBe(toast2.id);
  });

  it('cleans expired toasts', () => {
    const msg1 = 'Old toast';
    const msg2 = 'Recent toast';

    vi.setSystemTime(new Date('2023-01-01T10:00:00Z'));
    store.getState().addToast(msg1);

    vi.setSystemTime(new Date('2023-01-01T10:05:00Z'));
    store.getState().addToast(msg2);

    expect(store.getState().toasts).toHaveLength(2);

    store.getState().cleanExpiredToasts();

    const remainingToasts = store.getState().toasts;
    expect(remainingToasts).toHaveLength(1);
    expect(remainingToasts[0].message).toBe(msg2);
  });

  it('keeps all toasts when none are expired', () => {
    const msg1 = 'Fresh toast 1';
    const msg2 = 'Fresh toast 2';

    vi.setSystemTime(new Date('2023-01-01T10:00:00Z'));
    store.getState().addToast(msg1);
    store.getState().addToast(msg2);

    expect(store.getState().toasts).toHaveLength(2);

    store.getState().cleanExpiredToasts();

    expect(store.getState().toasts).toHaveLength(2);
  });

  it('removes all toasts when all are expired', () => {
    const msg1 = 'Old toast 1';
    const msg2 = 'Old toast 2';

    vi.setSystemTime(new Date('2023-01-01T10:00:00Z'));
    store.getState().addToast(msg1);
    store.getState().addToast(msg2);

    vi.setSystemTime(new Date('2023-01-01T10:10:00Z'));

    expect(store.getState().toasts).toHaveLength(2);

    store.getState().cleanExpiredToasts();

    expect(store.getState().toasts).toHaveLength(0);
  });
});
