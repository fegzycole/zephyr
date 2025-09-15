import { StateCreator } from 'zustand';
import { ToastSlice } from '../types';

export const TOAST_LIFETIME = 3000;

export const createToastSlice: StateCreator<ToastSlice> = (set, get) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    const timestamp = Date.now();

    const toast = { id, message, type, timestamp };
    set((state) => ({ toasts: [...state.toasts, toast] }));

    const timeoutId = setTimeout(() => {
      get().removeToast(id);
    }, TOAST_LIFETIME);

    return () => clearTimeout(timeoutId);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  cleanExpiredToasts: () => {
    const now = Date.now();
    const { toasts } = get();
    set({
      toasts: toasts.filter((t) => now - t.timestamp < TOAST_LIFETIME),
    });
  },
});
