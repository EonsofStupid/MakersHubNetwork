
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeState } from '@/shared/types/shared.types';

interface ThemeStore extends ThemeState {
  setTheme: (theme: Partial<ThemeState>) => void;
  toggleDarkMode: () => void;
}

const defaultTheme: ThemeState = {
  isDark: true,
  primaryColor: '#3b82f6',
  backgroundColor: '#121212',
  textColor: '#ffffff',
  accentColor: '#10b981',
  borderColor: '#333333',
  fontFamily: 'Inter, system-ui, sans-serif',
  cornerRadius: 8,
  animations: true,
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      ...defaultTheme,
      setTheme: (theme: Partial<ThemeState>) => set((state) => ({ ...state, ...theme })),
      toggleDarkMode: () => set((state) => ({ ...state, isDark: !state.isDark })),
    }),
    {
      name: 'theme-store',
    }
  )
);

// Re-export the useThemeStore hook with a more specific name for external use
export const useAppThemeStore = useThemeStore;
