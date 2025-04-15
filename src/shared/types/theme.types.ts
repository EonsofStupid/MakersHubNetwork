
import { ThemeToken, ThemeComponent } from './shared.types';

export interface ThemeStoreState {
  theme: string;
  variables: Record<string, string>;
  componentTokens: Record<string, Record<string, string>>;
  isDark: boolean;
  isLoading: boolean;
  effects: string[];
  error: string | null;
  
  // Actions
  setTheme: (theme: string) => Promise<void>;
  setVariables: (variables: Record<string, string>) => void;
  setComponentTokens: (tokens: Record<string, Record<string, string>>) => void;
  setDarkMode: (isDark: boolean) => void;
  setEffects: (effects: string[]) => void;
  setError: (error: string | null) => void;
}

export interface ThemeServiceResponse {
  success: boolean;
  theme?: {
    id: string;
    name: string;
    label?: string;
    description?: string;
    tokens?: ThemeToken[];
    components?: ThemeComponent[];
    isDark?: boolean;
  };
  error?: string;
}

export interface TokenMap {
  [key: string]: string;
}

export interface ComponentTokenMap {
  [component: string]: TokenMap;
}
