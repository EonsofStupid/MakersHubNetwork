
import type { StateStorage } from 'zustand/middleware';

export const createZustandStorage = (prefix = 'app'): StateStorage => {
  return {
    getItem: (name: string) => {
      const value = localStorage.getItem(`${prefix}-${name}`);
      if (!value) return null;
      try {
        return JSON.parse(value);
      } catch (e) {
        console.warn(`Failed to parse Zustand value for key: ${prefix}-${name}`);
        return null;
      }
    },
    setItem: (name: string, value) => {
      localStorage.setItem(`${prefix}-${name}`, JSON.stringify(value));
    },
    removeItem: (name: string) => {
      localStorage.removeItem(`${prefix}-${name}`);
    },
  };
};
