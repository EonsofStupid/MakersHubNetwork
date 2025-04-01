
import { PerformanceStore } from '../types';
import { PersistOptions, StateStorage, createJSONStorage } from 'zustand/middleware';

export const createPersistMiddleware = (): PersistOptions<PerformanceStore, PerformanceStore> => {
  // Create properly typed storage implementation
  const storage: StateStorage = {
    getItem: (name) => {
      try {
        const value = localStorage.getItem(name);
        return value || null;
      } catch (error) {
        console.error('Error retrieving from localStorage:', error);
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        localStorage.setItem(name, value);
      } catch (error) {
        console.error('Error storing to localStorage:', error);
      }
    },
    removeItem: (name) => {
      try {
        localStorage.removeItem(name);
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    }
  };

  return {
    name: 'performance-store',
    storage: createJSONStorage(() => storage),
    partialize: (state) => state,
  };
};
