import { StateCreator } from 'zustand';
import { ToastSlice } from '../types';

export const createToastSlice: StateCreator<ToastSlice> = (set, get) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = crypto.randomUUID();
    const toast = { id, message, type };

    set((state) => ({ toasts: [...state.toasts, toast] }));

    const timeoutId = setTimeout(() => {
      const { toasts } = get();
      set({ toasts: toasts.filter((t) => t.id !== id) });
    }, 3000);

    return () => clearTimeout(timeoutId);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
});
