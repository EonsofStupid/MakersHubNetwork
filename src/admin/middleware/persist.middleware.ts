import { StateStorage, PersistOptions } from 'zustand/middleware';

// Custom storage adapter for admin store
const createAdminStorage = (): StateStorage => {
  const adminStoragePrefix = 'makers-impulse-admin-';

  return {
    getItem: (name: string): string | null => {
      const value = localStorage.getItem(`${adminStoragePrefix}${name}`);
      return value;
    },
    setItem: (name: string, value: string): void => {
      localStorage.setItem(`${adminStoragePrefix}${name}`, value);
    },
    removeItem: (name: string): void => {
      localStorage.removeItem(`${adminStoragePrefix}${name}`);
    },
  };
};

// Create persist middleware with custom storage and merge function
export const createAdminPersistMiddleware = <T>(name: string): PersistOptions<T, T> => {
  return {
    name,
    storage: createAdminStorage(),
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
