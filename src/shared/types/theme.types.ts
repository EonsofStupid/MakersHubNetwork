
import { ThemeStatus, ThemeContext } from './shared.types';

export interface ThemeState {
  activeTheme: Theme | null;
  themes: Theme[];
  componentTokens: ComponentTokens;
  isReady: boolean;
  error: string | null;
  showDebug: boolean;
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  context: ThemeContext;
  status: ThemeStatus;
  version: number;
  design_tokens: DesignTokens;
  component_tokens: ComponentTokens;
  is_default: boolean;
  is_system: boolean;
  cached_styles?: Record<string, string>;
  parent_theme_id?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  cache_key?: string;
}

export interface DesignTokens {
  colors?: Record<string, string>;
  typography?: Record<string, string | Record<string, string>>;
  spacing?: Record<string, string>;
  borders?: Record<string, string>;
  shadows?: Record<string, string>;
  animation?: Record<string, string>;
  [key: string]: Record<string, any> | undefined;
}

export interface ComponentTokens {
  [key: string]: Record<string, string> | undefined;
}

export interface ThemeToken {
  id: string;
  token_name: string;
  token_value: string;
  category: string;
  theme_id?: string;
  description?: string;
  fallback_value?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ThemeVariables {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
  spacing: string;
  // Add effectColor variable
  effectColor: string;
}
