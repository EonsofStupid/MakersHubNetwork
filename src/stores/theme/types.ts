
import { Theme, ThemeContext, ComponentTokens } from "@/types/theme";

export type ThemeLoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

// Define the theme tokens type
export interface ThemeTokens {
  // Colors
  primary: string;
  secondary: string;
  accent?: string;
  background?: string;
  foreground?: string;
  card?: string;
  cardForeground?: string;
  muted?: string;
  mutedForeground?: string;
  border?: string;
  input?: string;
  ring?: string;
  
  // Effects
  effectPrimary: string;
  effectSecondary: string;
  effectTertiary: string;
  
  // Animation timings
  transitionFast?: string;
  transitionNormal?: string;
  transitionSlow?: string;
  
  // Radius values
  radiusSm?: string;
  radiusMd?: string;
  radiusLg?: string;
  radiusFull?: string;
}

// Define the theme state interface
export interface ThemeState {
  currentTheme: Theme | null;
  themeTokens: ThemeTokens[];
  themeComponents: ComponentTokens[];
  adminComponents: ComponentTokens[];
  isLoading: boolean;
  error: Error | null;
  loadStatus: ThemeLoadStatus;
  context: ThemeContext;
  tokens: ThemeTokens;
  
  // Actions
  setTheme: (themeIdOrName: string) => Promise<void>;
  loadTheme?: (context?: ThemeContext) => Promise<void>;
  loadAdminComponents: () => Promise<void>;
}

// Define theme validation error type
export interface ThemeValidationError {
  path: string[];
  message: string;
}

// Define theme log details type
export interface ThemeLogDetails {
  themeId?: string;
  success?: boolean;
  error?: Error | string;
  errorDetails?: any;
  details?: Record<string, any>;
}
