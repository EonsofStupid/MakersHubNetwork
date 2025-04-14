
import { create } from 'zustand';
import { Theme, ThemeState, ComponentTokens, DesignTokens } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';

// Define initial component tokens to avoid type errors
const initialComponentTokens: ComponentTokens = {
  button: {},
  card: {},
  input: {},
  badge: {},
  alert: {}
};

// Initial state
const initialState: ThemeState = {
  themes: [],
  activeThemeId: '',
  isDark: false,
  primaryColor: '#8B5CF6',
  backgroundColor: '#0F1729',
  textColor: '#F8FAFC',
  accentColor: '#F97316',
  borderColor: '#334155',
  fontFamily: 'Inter, sans-serif',
  cornerRadius: 8,
  animations: true,
  componentTokens: initialComponentTokens,
  isLoading: false,
  error: null
};

// Create the store
export const useThemeStore = create<ThemeState & {
  setThemes: (themes: Theme[]) => void;
  setActiveTheme: (themeId: string) => void;
  setDesignTokens: (tokens: DesignTokens) => void;
  setComponentTokens: (tokens: ComponentTokens) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  applyTheme: (themeId: string) => void;
  loadThemes: () => Promise<void>;
  loadTheme: (themeId: string) => Promise<void>;
  resetTheme: () => void;
}>((set, get) => ({
  ...initialState,

  setThemes: (themes) => {
    set({ themes });
  },

  setActiveTheme: (themeId) => {
    set({ activeThemeId: themeId });
  },

  setDesignTokens: (tokens) => {
    set((state) => {
      const activeTheme = state.themes.find(theme => theme.id === state.activeThemeId);
      if (activeTheme) {
        const updatedThemes = state.themes.map(theme => {
          if (theme.id === state.activeThemeId) {
            return { ...theme, designTokens: tokens };
          }
          return theme;
        });
        return { themes: updatedThemes, designTokens: tokens };
      }
      return { themes: state.themes, designTokens: tokens };
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
      const theme = state.themes.find(t => t.id === themeId);
      if (theme) {
        return {
          activeThemeId: themeId,
          designTokens: theme.designTokens,
          componentTokens: theme.componentTokens
        };
      }
      return state;
    });

    logger.log(LogLevel.INFO, LogCategory.SYSTEM, `Theme applied: ${themeId}`);
  },

  loadTheme: async (themeId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock theme loading for a specific theme
      setTimeout(() => {
        const mockTheme: Theme = {
          id: themeId,
          name: 'Impulsivity',
          label: 'Impulsivity',
          description: 'Default theme for the Makers IMPULSE system',
          isDark: true,
          status: 'ACTIVE',
          context: 'SITE',
          version: 1,
          variables: {
            background: '#0F1729',
            foreground: '#F8FAFC',
            card: '#1E293B',
            cardForeground: '#F8FAFC',
            primary: '#8B5CF6',
            primaryForeground: '#FFFFFF',
            secondary: '#EC4899',
            secondaryForeground: '#FFFFFF',
            muted: '#334155',
            mutedForeground: '#94A3B8',
            accent: '#F97316',
            accentForeground: '#FFFFFF',
            destructive: '#EF4444',
            destructiveForeground: '#FFFFFF',
            border: '#334155',
            input: '#334155',
            ring: '#8B5CF6',
            effectColor: '#8B5CF6',
            effectSecondary: '#EC4899',
            effectTertiary: '#F97316',
            transitionFast: '0.15s',
            transitionNormal: '0.3s',
            transitionSlow: '0.5s',
            animationFast: '0.5s',
            animationNormal: '1s',
            animationSlow: '2s',
            radiusSm: '0.25rem',
            radiusMd: '0.5rem',
            radiusLg: '0.75rem',
            radiusFull: '9999px'
          },
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
              none: '0',
              sm: '0.25rem',
              md: '0.5rem',
              lg: '0.75rem',
              xl: '1rem',
              full: '9999px'
            },
            shadows: {
              inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
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
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        set(state => ({
          themes: [...state.themes.filter(t => t.id !== themeId), mockTheme],
          activeThemeId: mockTheme.id,
          isDark: mockTheme.isDark,
          primaryColor: mockTheme.designTokens.colors?.primary || '#8B5CF6',
          backgroundColor: mockTheme.designTokens.colors?.background || '#0F1729',
          textColor: mockTheme.designTokens.colors?.foreground || '#F8FAFC',
          accentColor: mockTheme.designTokens.colors?.accent || '#F97316',
          borderColor: mockTheme.designTokens.colors?.border || '#334155',
          designTokens: mockTheme.designTokens,
          componentTokens: mockTheme.componentTokens,
          theme: mockTheme,
          isLoading: false,
          isLoaded: true,
        }));
        
        logger.log(LogLevel.INFO, LogCategory.SYSTEM, `Theme loaded: ${themeId}`);
      }, 100);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load theme';
      logger.log(LogLevel.ERROR, LogCategory.SYSTEM, 'Failed to load theme', { error: errorMessage });
      set({ 
        isLoading: false,
        error: errorMessage
      });
    }
  },

  loadThemes: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock theme loading for now
      setTimeout(() => {
        const mockTheme: Theme = {
          id: 'impulsivity',
          name: 'Impulsivity',
          label: 'Impulsivity',
          description: 'Default theme for the Makers IMPULSE system',
          isDark: true,
          status: 'ACTIVE',
          context: 'SITE',
          version: 1,
          variables: {
            background: '#0F1729',
            foreground: '#F8FAFC',
            card: '#1E293B',
            cardForeground: '#F8FAFC',
            primary: '#8B5CF6',
            primaryForeground: '#FFFFFF',
            secondary: '#EC4899',
            secondaryForeground: '#FFFFFF',
            muted: '#334155',
            mutedForeground: '#94A3B8',
            accent: '#F97316',
            accentForeground: '#FFFFFF',
            destructive: '#EF4444',
            destructiveForeground: '#FFFFFF',
            border: '#334155',
            input: '#334155',
            ring: '#8B5CF6',
            effectColor: '#8B5CF6',
            effectSecondary: '#EC4899',
            effectTertiary: '#F97316',
            transitionFast: '0.15s',
            transitionNormal: '0.3s',
            transitionSlow: '0.5s',
            animationFast: '0.5s',
            animationNormal: '1s',
            animationSlow: '2s',
            radiusSm: '0.25rem',
            radiusMd: '0.5rem',
            radiusLg: '0.75rem',
            radiusFull: '9999px'
          },
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
              none: '0',
              sm: '0.25rem',
              md: '0.5rem',
              lg: '0.75rem',
              xl: '1rem',
              full: '9999px'
            },
            shadows: {
              inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
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
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        set({
          themes: [mockTheme],
          activeThemeId: mockTheme.id,
          isDark: mockTheme.isDark,
          primaryColor: mockTheme.designTokens.colors?.primary || '#8B5CF6',
          backgroundColor: mockTheme.designTokens.colors?.background || '#0F1729',
          textColor: mockTheme.designTokens.colors?.foreground || '#F8FAFC',
          accentColor: mockTheme.designTokens.colors?.accent || '#F97316',
          borderColor: mockTheme.designTokens.colors?.border || '#334155',
          designTokens: mockTheme.designTokens,
          componentTokens: mockTheme.componentTokens,
          theme: mockTheme,
          isLoading: false,
          isLoaded: true
        });
        
        logger.log(LogLevel.INFO, LogCategory.SYSTEM, 'Themes loaded', { count: 1 });
      }, 100);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load themes';
      logger.log(LogLevel.ERROR, LogCategory.SYSTEM, 'Failed to load themes', { error: errorMessage });
      set({ 
        isLoading: false,
        error: errorMessage
      });
    }
  },

  resetTheme: () => {
    set(initialState);
    logger.log(LogLevel.INFO, LogCategory.SYSTEM, 'Theme state reset');
  }
}));
