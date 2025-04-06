
import { PersistStorage } from 'zustand/middleware';
import { AuthState } from '@/types/auth';

// Custom storage implementation for auth state
export const authStorage: PersistStorage<AuthState> = {
  getItem: (name: string): Promise<AuthState | null> => {
    try {
      // Use sessionStorage for auth state (more secure)
      const value = sessionStorage.getItem(name);
      return Promise.resolve(value ? JSON.parse(value) : null);
    } catch (error) {
      console.error('Error getting item from authStorage', error);
      return Promise.resolve(null);
    }
  },
  setItem: (name: string, value: AuthState): Promise<void> => {
    try {
      sessionStorage.setItem(name, JSON.stringify(value));
      return Promise.resolve();
    } catch (error) {
      console.error('Error setting item in authStorage', error);
      return Promise.resolve();
    }
  },
  removeItem: (name: string): Promise<void> => {
    try {
      sessionStorage.removeItem(name);
      return Promise.resolve();
    } catch (error) {
      console.error('Error removing item from authStorage', error);
      return Promise.resolve();
    }
  }
};
