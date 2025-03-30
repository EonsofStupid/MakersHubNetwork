import { StateStorage } from 'zustand/middleware';

export const localStorageWithParse: StateStorage = {
  getItem: (name) => {
    const stored = localStorage.getItem(name);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored JSON:', e);
      return null;
    }
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};
