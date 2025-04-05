
import { ThemeComponent } from './component';

export interface Theme {
  id: string;
  name: string;
  description?: string;
  author?: string;
  version?: string;
  tags?: string[];
  created_at?: string; 
  updated_at?: string;
  base_theme?: string;
  is_active: boolean;
  design_tokens?: DesignTokensStructure;
}

export interface ThemeContext {
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
  isLoading: boolean;
  error: Error | null;
}

export interface DesignTokensStructure {
  colors?: Record<string, string>;
  typography?: TypographyTokens;
  spacing?: Record<string, string>;
  breakpoints?: Record<string, string>;
  effects?: EffectsTokens;
  radii?: Record<string, string>;
  transitions?: Record<string, string>;
  zIndices?: Record<string, string>;
  components?: Record<string, any>;
  [key: string]: any;
}

export interface TypographyTokens {
  fontFamilies?: Record<string, string>;
  fontSizes?: Record<string, string>;
  fontWeights?: Record<string, string | number>;
  lineHeights?: Record<string, string | number>;
  letterSpacings?: Record<string, string>;
}

export interface EffectsTokens {
  shadows?: Record<string, string>;
  blurs?: Record<string, string>;
  gradients?: Record<string, string>;
  [key: string]: any;
}

export interface ThemeLogDetails {
  success?: boolean;
  error?: boolean;
  warning?: boolean;
  errorMessage?: string;
  details?: Record<string, any>;
  theme?: string;
  originalTheme?: string;
  mainSite?: boolean;
  admin?: boolean;
  database?: boolean;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: Theme;
  defaultThemeId?: string;
}

export interface ThemeContextValue {
  theme: Theme | null;
  setTheme: (themeId: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  components: ThemeComponent[];
}
