
import { Theme, DesignTokens, ComponentTokens, ThemeVariables } from './theme.types';

export interface ThemeState {
  themes: Theme[];
  activeThemeId: string | null;
  isDark: boolean;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  isLoading: boolean;
  error: string | null;
  variables: ThemeVariables;
  theme: Theme | null;
  isLoaded: boolean;
  animations?: Record<string, string>;
}

export interface ThemeStoreActions {
  setThemes: (themes: Theme[]) => void;
  setActiveTheme: (themeId: string) => void;
  setDesignTokens: (tokens: DesignTokens) => void;
  setComponentTokens: (tokens: ComponentTokens) => void;
  fetchThemes: () => Promise<void>;
  createTheme: (theme: Theme) => Promise<void>;
  updateTheme: (theme: Theme) => Promise<void>;
  deleteTheme: (themeId: string) => Promise<void>;
  resetTheme: () => void;
}

