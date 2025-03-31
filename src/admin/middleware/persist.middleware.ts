import { PersistOptions, PersistStorage } from 'zustand/middleware';

// Create persist middleware with custom storage and merge function
export const createAdminPersistMiddleware = <T>(name: string): PersistOptions<T, T> => {
  // Create a properly typed storage implementation
  const storage: PersistStorage<T> = {
    getItem: (name) => {
      try {
        const value = localStorage.getItem(`makers-impulse-admin-${name}`);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error(`Error retrieving state from localStorage: ${error}`);
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        localStorage.setItem(`makers-impulse-admin-${name}`, JSON.stringify(value));
      } catch (error) {
        console.error(`Error storing state to localStorage: ${error}`);
      }
    },
    removeItem: (name) => {
      try {
        localStorage.removeItem(`makers-impulse-admin-${name}`);
      } catch (error) {
        console.error(`Error removing state from localStorage: ${error}`);
      }
    },
  };

  return {
    name,
    storage,
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
