
import { ImpulseTheme } from '../types/impulse.types';

export interface ThemeLoaderProps {
  children: React.ReactNode;
  defaultTheme?: string;
}

export interface ThemeLoaderOptions {
  defaultTheme: string;
  loadFromStorage: boolean;
  fallbackTheme: ImpulseTheme;
}

export interface ThemeProviderContext {
  theme: ImpulseTheme;
  setTheme: (theme: ImpulseTheme) => void;
  themes: ImpulseTheme[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * ThemeRegistry interface
 */
export interface ThemeRegistry {
  registerTheme: (id: string, theme: ImpulseTheme) => void;
  getTheme: (id: string) => ImpulseTheme | null;
  setActiveTheme: (id: string) => boolean;
  getActiveTheme: () => ImpulseTheme | null;
  getDefaultTheme: () => ImpulseTheme | null;
  getAllThemes: () => ImpulseTheme[];
  hasTheme: (id: string) => boolean;
  unregisterTheme: (id: string) => boolean;
  clearAll: () => void;
}

/**
 * Theme record format with theme_data field for database records
 */
export interface ThemeRecord {
  id?: string;
  name?: string;
  theme_data?: {
    colors?: Partial<ImpulseTheme['colors']>;
    typography?: Partial<ImpulseTheme['typography']>;
    effects?: Partial<ImpulseTheme['effects']>;
    animation?: Partial<ImpulseTheme['animation']>;
    components?: Partial<ImpulseTheme['components']>;
  };
  version?: number;
  metadata?: Record<string, any>;
}
