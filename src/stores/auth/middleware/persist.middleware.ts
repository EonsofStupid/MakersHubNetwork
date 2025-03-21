
import { StateStorage, createJSONStorage } from "zustand/middleware";

const storage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      return sessionStorage.getItem(name);
    } catch (error) {
      console.error('Error accessing sessionStorage:', error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      sessionStorage.setItem(name, value);
    } catch (error) {
      console.error('Error setting sessionStorage:', error);
    }
  },
  removeItem: (name: string): void => {
    try {
      sessionStorage.removeItem(name);
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
    }
  },
};

export const authStorage = createJSONStorage(() => storage);
