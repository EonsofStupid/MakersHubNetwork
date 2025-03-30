
import { StateStorage, PersistOptions, StorageValue } from 'zustand/middleware';

/**
 * Creates a persist middleware for admin stores with a common pattern
 * @param storeName Name of the store for localStorage key
 */
export function createAdminPersistMiddleware<T>(storeName: string): PersistOptions<T, T> {
  // Create a custom storage that syncs with localStorage
  const adminStorage: StateStorage = {
    getItem: (name: string): string | null => {
      try {
        const data = localStorage.getItem(name);
        return data;
      } catch (e) {
        console.warn('Error loading admin state from localStorage:', e);
        return null;
      }
    },
    setItem: (name: string, value: string): void => {
      try {
        localStorage.setItem(name, value);
      } catch (e) {
        console.warn('Error saving admin state to localStorage:', e);
      }
    },
    removeItem: (name: string): void => {
      try {
        localStorage.removeItem(name);
      } catch (e) {
        console.warn('Error removing admin state from localStorage:', e);
      }
    },
  };

  // Return configured persist options
  return {
    name: storeName,
    storage: adminStorage,
    // Only persist what we need - using type assertion to make TypeScript happy
    partialize: (state: T) => {
      // Filter out any functions, actions, or computed properties
      const persistedState = Object.entries(state as Record<string, any>)
        .filter(([_, value]) => typeof value !== 'function')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      
      return persistedState as T;
    },
  };
}
