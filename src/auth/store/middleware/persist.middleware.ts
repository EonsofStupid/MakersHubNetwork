
import { StateStorage } from 'zustand/middleware';

// Custom storage implementation for auth state
export const authStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      // Use sessionStorage for auth state (more secure)
      const value = sessionStorage.getItem(name);
      return value;
    } catch (error) {
      console.error('Error getting item from authStorage', error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      sessionStorage.setItem(name, value);
    } catch (error) {
      console.error('Error setting item in authStorage', error);
    }
  },
  removeItem: (name: string): void => {
    try {
      sessionStorage.removeItem(name);
    } catch (error) {
      console.error('Error removing item from authStorage', error);
    }
  }
};
