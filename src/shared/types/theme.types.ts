
/**
 * Theme-related type definitions
 */

/**
 * Theme definition interface
 */
export interface Theme {
  id: string;
  name: string;
  description?: string;
  author?: string;
  version?: string;
  variables?: Record<string, string>;
  tokens?: ThemeTokens;
  preview?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Theme token structure
 */
export interface ThemeTokens {
  colors?: Record<string, string>;
  fonts?: Record<string, string>;
  spacing?: Record<string, string>;
  borderRadius?: Record<string, string>;
  shadows?: Record<string, string>;
  [key: string]: Record<string, string> | undefined;
}

/**
 * Individual theme token
 */
export interface ThemeToken {
  name: string;
  value: string;
  category: string;
}

/**
 * Theme state in the application
 */
export interface ThemeState {
  currentTheme: Theme | null;
  availableThemes: Theme[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Theme preferences
 */
export interface ThemePreferences {
  themeId: string;
  darkMode: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}
