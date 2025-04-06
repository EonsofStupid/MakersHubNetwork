
import { Theme, ThemeToken, ComponentTokens, ThemeContext } from "@/types/theme";

// Theme tokens interface for typed theme values
export interface ThemeTokens {
  primary: string;
  secondary: string;
  accent?: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string; 
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  effectPrimary: string;
  effectSecondary: string;
  effectTertiary: string;
  transitionFast: string;
  transitionNormal: string;
  transitionSlow: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusFull: string;
  [key: string]: string | undefined;
}

export type ThemeLoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface ThemeState {
  // Core theme data
  currentTheme: Theme | null;
  themeTokens: ThemeToken[];
  themeComponents: ComponentTokens[];
  adminComponents: ComponentTokens[];
  
  // Status indicators
  isLoading: boolean;
  error: Error | null;
  loadStatus: ThemeLoadStatus;
  context?: ThemeContext;
  
  // Theme tokens for direct application
  tokens: ThemeTokens;
  
  // Actions
  setTheme: (themeId: string) => Promise<void>;
  loadAdminComponents: () => Promise<void>;
  loadTheme: (context?: ThemeContext) => Promise<void>;
  applyTokens: (tokenUpdates: Partial<ThemeTokens>) => void;
}

