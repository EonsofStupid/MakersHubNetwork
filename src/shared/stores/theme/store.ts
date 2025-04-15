import { create } from 'zustand';
import { Theme } from '@/shared/types/theme/theme.types';
import { ThemeState, ThemeStoreActions } from '@/shared/types/theme/state.types';
import { devtools, persist } from 'zustand/middleware';
import { logger } from '@/logging/logger.service';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';

// Default theme to use when no theme is loaded
const defaultTheme: Theme = {
  id: 'default',
  name: 'Default Theme',
  label: 'Default',
  description: 'Default theme',
  isDark: false,
  status: 'active',
  context: 'site',
  variables: {
    background: '#ffffff',
    foreground: '#000000',
    card: '#f7f7f7',
    cardForeground: '#000000',
    primary: '#3b82f6',
    primaryForeground: '#ffffff',
    secondary: '#f3f4f6',
    secondaryForeground: '#000000',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    accent: '#f59e0b',
    accentForeground: '#000000',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#3b82f6',
    effectColor: '#3b82f6',
    effectSecondary: '#f59e0b',
    effectTertiary: '#10b981',
    transitionFast: '150ms',
    transitionNormal: '300ms',
    transitionSlow: '500ms',
    animationFast: '300ms',
    animationNormal: '500ms',
    animationSlow: '1000ms',
    radiusSm: '0.125rem',
    radiusMd: '0.25rem',
    radiusLg: '0.5rem',
    radiusFull: '9999px'
  },
  designTokens: {
    colors: {
      primary: '#3b82f6',
      secondary: '#f3f4f6',
      background: '#ffffff',
      foreground: '#000000',
    },
    typography: {
      fontFamily: 'system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
      }
    }
  },
  componentTokens: {
    button: {
      padding: '0.5rem 1rem',
      borderRadius: '0.25rem',
      fontWeight: '500',
    },
    card: {
      padding: '1rem',
      borderRadius: '0.5rem',
      shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }
  }
};

// Default component tokens
const defaultComponentTokens: ComponentTokens = {
  button: {
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    fontWeight: '500',
  },
  card: {
    padding: '1rem',
    borderRadius: '0.5rem',
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  },
  input: {
    height: '2.5rem',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.25rem',
  },
  badge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
  },
  alert: {
    padding: '1rem',
    borderRadius: '0.5rem',
    fontWeight: '500',
  },
};

// Initial state
const initialState: ThemeState = {
  themes: [defaultTheme],
  activeThemeId: defaultTheme.id,
  isDark: defaultTheme.isDark || false,
  primaryColor: defaultTheme.variables.primary,
  backgroundColor: defaultTheme.variables.background,
  textColor: defaultTheme.variables.foreground,
  designTokens: defaultTheme.designTokens,
  componentTokens: defaultComponentTokens,
  isLoading: false,
  error: null,
  variables: defaultTheme.variables,
  theme: defaultTheme,
  isLoaded: true
};

// Create the theme store
export const useThemeStore = create<ThemeState & ThemeStoreActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Set all themes
        setThemes: (themes) => {
          set({ themes });
          logger.log(LogLevel.INFO, LogCategory.THEME, 'Themes updated', { 
            details: { themesCount: themes.length } 
          });
        },
        
        // Set active theme by ID
        setActiveTheme: (themeId) => {
          const { themes } = get();
          const theme = themes.find((t) => t.id === themeId);
          
          if (!theme) {
            logger.log(LogLevel.ERROR, LogCategory.THEME, 'Theme not found', {
              details: { themeId }
            });
            return;
          }
          
          set({
            activeThemeId: themeId,
            isDark: theme.isDark || false,
            primaryColor: theme.variables.primary,
            backgroundColor: theme.variables.background,
            textColor: theme.variables.foreground,
            designTokens: theme.designTokens,
            componentTokens: theme.componentTokens || defaultComponentTokens,
            theme,
            variables: theme.variables,
            isLoaded: true
          });
          
          logger.log(LogLevel.INFO, LogCategory.THEME, 'Active theme changed', {
            details: { themeId, themeName: theme.name }
          });
        },
        
        // Set design tokens
        setDesignTokens: (tokens) => {
          set({ designTokens: tokens });
        },
        
        // Set component tokens
        setComponentTokens: (tokens) => {
          set({ componentTokens: tokens });
        },
        
        // Fetch themes from API
        fetchThemes: async () => {
          try {
            set({ isLoading: true });
            
            // TODO: Replace with API call when backend is available
            // For now we'll just use a mock
            const mockThemes: Theme[] = [defaultTheme];
            
            set({ themes: mockThemes, isLoading: false });
            logger.log(LogLevel.INFO, LogCategory.THEME, 'Themes fetched', {
              details: { themesCount: mockThemes.length }
            });
          } catch (error) {
            set({ isLoading: false, error: (error as Error).message });
            logger.log(LogLevel.ERROR, LogCategory.THEME, 'Error fetching themes', {
              details: { error }
            });
          }
        },

        // Load themes (alias for fetchThemes for compatibility)
        loadThemes: async () => {
          return get().fetchThemes();
        },
        
        // Create a new theme
        createTheme: async (theme) => {
          try {
            set({ isLoading: true });
            
            // TODO: Replace with API call
            const newTheme = { ...theme, id: Date.now().toString() };
            const { themes } = get();
            
            set({ themes: [...themes, newTheme], isLoading: false });
            logger.log(LogLevel.INFO, LogCategory.THEME, 'Theme created', {
              details: { themeId: newTheme.id, themeName: newTheme.name }
            });
          } catch (error) {
            set({ isLoading: false, error: (error as Error).message });
            logger.log(LogLevel.ERROR, LogCategory.THEME, 'Error creating theme', {
              details: { error }
            });
          }
        },
        
        // Update an existing theme
        updateTheme: async (theme) => {
          try {
            set({ isLoading: true });
            
            // TODO: Replace with API call
            const { themes } = get();
            const updatedThemes = themes.map((t) => (t.id === theme.id ? theme : t));
            
            set({ themes: updatedThemes, isLoading: false });
            logger.log(LogLevel.INFO, LogCategory.THEME, 'Theme updated', {
              details: { themeId: theme.id, themeName: theme.name }
            });
          } catch (error) {
            set({ isLoading: false, error: (error as Error).message });
            logger.log(LogLevel.ERROR, LogCategory.THEME, 'Error updating theme', {
              details: { error }
            });
          }
        },
        
        // Delete a theme
        deleteTheme: async (themeId) => {
          try {
            set({ isLoading: true });
            
            // TODO: Replace with API call
            const { themes, activeThemeId } = get();
            const updatedThemes = themes.filter((t) => t.id !== themeId);
            
            // If the active theme is being deleted, switch to default
            const newActiveId = activeThemeId === themeId 
              ? defaultTheme.id 
              : activeThemeId;
            
            set({ 
              themes: updatedThemes, 
              activeThemeId: newActiveId,
              isLoading: false 
            });
            
            logger.log(LogLevel.INFO, LogCategory.THEME, 'Theme deleted', {
              details: { themeId }
            });
          } catch (error) {
            set({ isLoading: false, error: (error as Error).message });
            logger.log(LogLevel.ERROR, LogCategory.THEME, 'Error deleting theme', {
              details: { error }
            });
          }
        },
        
        // Reset to default theme
        resetTheme: () => {
          set({
            activeThemeId: defaultTheme.id,
            isDark: defaultTheme.isDark || false,
            primaryColor: defaultTheme.variables.primary,
            backgroundColor: defaultTheme.variables.background,
            textColor: defaultTheme.variables.foreground,
            designTokens: defaultTheme.designTokens,
            componentTokens: defaultComponentTokens,
            theme: defaultTheme,
            variables: defaultTheme.variables,
          });
          
          logger.log(LogLevel.INFO, LogCategory.THEME, 'Theme reset to default');
        },
      }),
      {
        name: 'theme-store',
        partialize: (state) => ({
          activeThemeId: state.activeThemeId,
          isDark: state.isDark,
        }),
      }
    )
  )
);

export default useThemeStore;
