import { create } from 'zustand';

export const useUiStore = create((set) => ({
  isOffline: false,
  setOffline: (isOffline) => set({ isOffline }),
}));
