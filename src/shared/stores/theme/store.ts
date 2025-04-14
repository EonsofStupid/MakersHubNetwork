
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  ThemeState, 
  Theme, 
  ComponentTokens, 
  DesignTokens
} from '@/shared/types/theme.types';
import { logger } from '@/logging/logger.service';
import { LogLevel, LogCategory, LogDetails } from '@/shared/types/shared.types';

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
  themes: [],
  activeThemeId: '',
  componentTokens: {
    button: {},
    card: {},
    input: {},
    badge: {},
    alert: {}
  },
  isLoading: false,
  error: null
};

export const useThemeStore = create<ThemeState & {
  setThemes: (themes: Theme[]) => void;
  setActiveTheme: (themeId: string) => void;
  setDesignTokens: (tokens: DesignTokens) => void;
  setComponentTokens: (tokens: ComponentTokens) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  applyTheme: (themeId: string) => void;
  loadThemes: () => Promise<void>;
  resetTheme: () => void;
}>()(
  persist(
    (set, get) => ({
      ...defaultTheme,

      setThemes: (themes) => {
        set({ themes });
      },

      setActiveTheme: (themeId) => {
        set({ activeThemeId: themeId });
      },

      setDesignTokens: (tokens) => {
        set((state) => {
          if (state.themes && state.activeThemeId) {
            const activeTheme = state.themes.find(theme => theme.id === state.activeThemeId);
            if (activeTheme) {
              const updatedThemes = state.themes.map(theme => {
                if (theme.id === state.activeThemeId) {
                  return { ...theme, designTokens: tokens };
                }
                return theme;
              });
              return { ...state, themes: updatedThemes, designTokens: tokens };
            }
          }
          return { ...state, designTokens: tokens };
        });
      },

      setComponentTokens: (tokens) => {
        set({ componentTokens: tokens });
      },

      setIsLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error });
      },

      applyTheme: (themeId) => {
        set((state) => {
          if (state.themes) {
            const theme = state.themes.find(t => t.id === themeId);
            if (theme) {
              return {
                ...state,
                activeThemeId: themeId,
                designTokens: theme.designTokens,
                componentTokens: theme.componentTokens
              };
            }
          }
          return state;
        });

        logger.log(LogLevel.INFO, LogCategory.SYSTEM, `Theme applied: ${themeId}`);
      },

      loadThemes: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Mock theme loading for now
          // In a real app this would fetch from an API
          setTimeout(() => {
            const mockTheme: Theme = {
              id: 'impulsivity',
              name: 'Impulsivity',
              description: 'Default theme for the Makers IMPULSE system',
              version: 1,
              designTokens: {
                colors: {
                  primary: '#8B5CF6',
                  secondary: '#EC4899',
                  accent: '#F97316',
                  background: '#0F1729',
                  foreground: '#F8FAFC',
                  muted: '#334155',
                  'muted-foreground': '#94A3B8',
                  popover: '#1E293B',
                  'popover-foreground': '#F8FAFC',
                  card: '#1E293B',
                  'card-foreground': '#F8FAFC', 
                  border: '#334155',
                  input: '#334155',
                  ring: '#8B5CF6'
                },
                spacing: {
                  sm: '0.5rem',
                  md: '1rem',
                  lg: '1.5rem',
                  xl: '2rem',
                  xxl: '4rem'
                },
                typography: {
                  fontFamily: "'Inter', sans-serif",
                  fontSize: {
                    xs: '0.75rem',
                    sm: '0.875rem',
                    base: '1rem',
                    lg: '1.125rem',
                    xl: '1.25rem',
                    '2xl': '1.5rem',
                    '3xl': '1.875rem',
                    '4xl': '2.25rem',
                    '5xl': '3rem',
                  },
                  fontWeight: {
                    light: '300',
                    normal: '400',
                    medium: '500',
                    semibold: '600',
                    bold: '700',
                  },
                  lineHeight: {
                    none: '1',
                    tight: '1.25',
                    snug: '1.375',
                    normal: '1.5',
                    relaxed: '1.625',
                    loose: '2',
                  }
                },
                effects: {
                  blur: {
                    sm: '4px',
                    md: '8px',
                    lg: '12px'
                  },
                  glow: {
                    sm: '0 0 4px',
                    md: '0 0 8px',
                    lg: '0 0 16px'
                  }
                },
                radius: {
                  sm: '0.25rem',
                  md: '0.5rem',
                  lg: '0.75rem',
                  xl: '1rem',
                  full: '9999px'
                },
                shadows: {
                  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }
              },
              componentTokens: {
                button: {
                  backgroundColor: 'var(--primary)',
                  textColor: 'var(--foreground)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem'
                },
                card: {
                  backgroundColor: 'var(--card)',
                  textColor: 'var(--card-foreground)',
                  borderRadius: '0.5rem',
                  padding: '1rem'
                },
                input: {
                  backgroundColor: 'var(--background)',
                  textColor: 'var(--foreground)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem'
                },
                badge: {
                  backgroundColor: 'var(--primary)',
                  textColor: 'var(--primary-foreground)',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.5rem'
                },
                alert: {
                  backgroundColor: 'var(--muted)',
                  textColor: 'var(--foreground)',
                  borderRadius: '0.5rem',
                  padding: '1rem'
                }
              },
            };
            
            set({
              ...get(),
              themes: [mockTheme],
              activeThemeId: mockTheme.id,
              designTokens: mockTheme.designTokens,
              componentTokens: mockTheme.componentTokens,
              isLoading: false
            });
            
            const logDetails: LogDetails = { count: 1 };
            logger.log(LogLevel.INFO, LogCategory.SYSTEM, 'Themes loaded', logDetails);
          }, 100);
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load themes';
          const logDetails: LogDetails = { error: errorMessage };
          logger.log(LogLevel.ERROR, LogCategory.SYSTEM, 'Failed to load themes', logDetails);
          set({ 
            ...get(),
            isLoading: false,
            error: errorMessage
          });
        }
      },

      resetTheme: () => {
        set(defaultTheme);
        logger.log(LogLevel.INFO, LogCategory.SYSTEM, 'Theme state reset');
      }
    }),
    {
      name: 'theme-store',
    }
  )
);

// Re-export the useThemeStore hook with a more specific name for external use
export const useAppThemeStore = useThemeStore;
