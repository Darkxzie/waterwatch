import { create } from 'zustand';

export const useFiltersStore = create((set) => ({
  severity: 'ALL',
  issueType: 'ALL',
  status: 'ALL',
  setFilter: (key, value) => set({ [key]: value }),
}));
