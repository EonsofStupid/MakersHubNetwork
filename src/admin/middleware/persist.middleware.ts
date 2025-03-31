import { PersistOptions } from 'zustand/middleware';
import { createZustandStorage } from '@/lib/storage/createZustandStorage';

// Create persist middleware with custom storage and merge function
export const createAdminPersistMiddleware = <T>(name: string): PersistOptions<T, T> => {
  return {
    name,
    // Use the createZustandStorage function which already correctly handles JSON parsing
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
  };
};
