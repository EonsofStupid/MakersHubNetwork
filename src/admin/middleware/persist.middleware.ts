import { StateStorage, PersistOptions } from 'zustand/middleware';
import { createZustandStorage } from '@/lib/storage/createZustandStorage';

// Create persist middleware with custom storage and merge function
export const createAdminPersistMiddleware = <T>(name: string): PersistOptions<T, T> => {
  return {
    name,
    storage: createZustandStorage('makers-impulse-admin'),
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
    // Add deserialize option to parse JSON
    deserialize: (str) => {
      if (!str) return undefined;
      try {
        return JSON.parse(str);
      } catch (e) {
        return undefined;
      }
    },
    // Add serialize option to stringify JSON
    serialize: (state) => {
      return JSON.stringify(state);
    },
  };
};
