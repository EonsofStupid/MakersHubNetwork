
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';

interface DebugStoreState {
  enabled: boolean;
  consoleEnabled: boolean;
  uiEnabled: boolean;
  minLevel: LogLevel;
  enabledCategories: LogCategory[];
  
  // Actions
  setEnabled: (enabled: boolean) => void;
  setConsoleEnabled: (enabled: boolean) => void;
  setUiEnabled: (enabled: boolean) => void;
  setMinLevel: (level: LogLevel) => void;
  toggleCategory: (category: LogCategory) => void;
  enableAllCategories: () => void;
  disableAllCategories: () => void;
}

const allCategories = Object.values(LogCategory);

export const useDebugStore = create<DebugStoreState>()(
  persist(
    (set) => ({
      enabled: true,
      consoleEnabled: true,
      uiEnabled: false,
      minLevel: LogLevel.INFO,
      enabledCategories: allCategories,
      
      setEnabled: (enabled) => set({ enabled }),
      setConsoleEnabled: (enabled) => set({ consoleEnabled: enabled }),
      setUiEnabled: (enabled) => set({ uiEnabled: enabled }),
      setMinLevel: (level) => set({ minLevel: level }),
      
      toggleCategory: (category) => {
        set((state) => {
          const isEnabled = state.enabledCategories.includes(category);
          
          if (isEnabled) {
            return {
              enabledCategories: state.enabledCategories.filter(c => c !== category)
            };
          } else {
            return {
              enabledCategories: [...state.enabledCategories, category]
            };
          }
        });
      },
      
      enableAllCategories: () => set({ enabledCategories: [...allCategories] }),
      disableAllCategories: () => set({ enabledCategories: [] })
    }),
    {
      name: 'debug-store'
    }
  )
);

export default useDebugStore;
