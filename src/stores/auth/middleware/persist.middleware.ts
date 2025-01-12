import { StateStorage, createJSONStorage } from "zustand/middleware";

const storage: StateStorage = {
  getItem: (name: string): string | null => {
    return sessionStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    sessionStorage.setItem(name, value);
  },
  removeItem: (name: string): void => {
    sessionStorage.removeItem(name);
  },
};

export const authStorage = createJSONStorage(() => storage);