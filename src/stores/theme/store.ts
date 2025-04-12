
import { create } from 'zustand';
import { getLogger } from '@/logging';
import { LogCategory } from '@/shared/types/shared.types';
import { Theme } from '@/types/theme';

// Logger
const logger = getLogger('ThemeStore', LogCategory.THEME);

// Default theme values for fallback
const defaultTheme: Theme = {
  id: 'default',
  name: 'Default Theme',
  version: '1.0.0',
  status: 'active',
  description: 'Default fallback theme',
  is_default: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  design_tokens: {},
  component_tokens: {}
};

// Theme store state interface
interface ThemeState {
  // State
  currentTheme: Theme | null;
  isLoading: boolean;
  error: Error | null;
  isInitialized: boolean;

  // Actions
  setCurrentTheme: (theme: Theme) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  initialize: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  // Initial state
  currentTheme: null,
  isLoading: false,
  error: null,
  isInitialized: false,

  // Actions
  setCurrentTheme: (theme) => {
    logger.info('Setting current theme', { details: { themeId: theme.id, themeName: theme.name } });
    set({ currentTheme: theme });
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  initialize: async () => {
    const { isInitialized, setLoading, setCurrentTheme, setError } = get();

    if (isInitialized) {
      logger.info('Theme store already initialized');
      return;
    }

    try {
      setLoading(true);
      logger.info('Initializing theme');
      
      // For now, just use the default theme
      setCurrentTheme(defaultTheme);
      
      set({ isInitialized: true });
      logger.info('Theme initialized successfully');
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to initialize theme');
      logger.error('Failed to initialize theme', { details: { error: err.message } });
      setError(err);
    } finally {
      setLoading(false);
    }
  }
}));
