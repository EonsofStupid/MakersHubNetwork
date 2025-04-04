
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
