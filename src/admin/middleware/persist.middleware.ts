
import { PersistOptions, StateStorage, createJSONStorage } from 'zustand/middleware';

// Create persist middleware for admin stores
export const createAdminPersistMiddleware = <T>(name: string): PersistOptions<T, T> => {
  // Create a properly typed storage implementation
  const storage: StateStorage = {
    getItem: (name: string): string | null => {
      try {
        const value = localStorage.getItem(`makers-impulse-admin-${name}`);
        return value || null;
      } catch (error) {
        console.error(`Error retrieving state from localStorage: ${error}`);
        return null;
      }
    },
    setItem: (name: string, value: string): void => {
      try {
        localStorage.setItem(`makers-impulse-admin-${name}`, value);
      } catch (error) {
        console.error(`Error storing state to localStorage: ${error}`);
      }
    },
    removeItem: (name: string): void => {
      try {
        localStorage.removeItem(`makers-impulse-admin-${name}`);
      } catch (error) {
        console.error(`Error removing from localStorage: ${error}`);
      }
    },
  };

  return {
    name,
    storage: createJSONStorage(() => storage),
    // Custom merge strategy
    merge: (persistedState: any, currentState: T) => {
      // If this is the first time the app loads, use the default state
      if (!persistedState) return currentState;
      
      // Otherwise merge persisted state with current state
      return {
        ...currentState,
        ...persistedState,
      };
    },
    // Don't persist certain state
    partialize: (state) => {
      const { isEditMode, dragSource, dragTarget, isLoadingPermissions, ...rest } = state as any;
      return rest;
    },
  };
};

// Export the persist function for backward compatibility
export const persist = createAdminPersistMiddleware;
