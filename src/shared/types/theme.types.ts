
import { ThemeStatus, ThemeContext } from './shared.types';

export interface Theme {
  id: string;
  name: string;
  description?: string;
  status: ThemeStatus;
  context: ThemeContext;
  parentThemeId?: string | null;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens[];
  isSystem?: boolean;
  isDefault?: boolean;
  version?: number;
  cacheKey?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ThemeToken {
  id: string;
  token_name: string;
  token_value: string;
  category: string;
  theme_id: string;
  description?: string;
  fallback_value?: string;
}

export interface ThemeVariables {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  muted: string;
  mutedForeground: string;
  warning: string;
  warningForeground: string;
  success: string;
  successForeground: string;
  info: string;
  infoForeground: string;
  border: string;
  input: string;
  ring: string;
  radius: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
  radiusFull: string;
}

export interface DesignTokens {
  colors?: Record<string, string>;
  typography?: {
    fontSizes?: Record<string, string>;
    fontFamilies?: Record<string, string>;
    lineHeights?: Record<string, string>;
    letterSpacing?: Record<string, string>;
  };
  spacing?: Record<string, string>;
  effects?: {
    shadows?: Record<string, string>;
    blurs?: Record<string, string>;
    gradients?: Record<string, string>;
  };
  animations?: {
    keyframes?: Record<string, string>;
    transitions?: Record<string, string>;
    durations?: Record<string, string>;
  };
}

export interface ComponentTokens {
  [key: string]: Record<string, string>;
}

export interface ThemeLogDetails {
  themeName?: string;
  themeId?: string;
  action?: string;
  tokenName?: string;
  tokenValue?: string;
  errorMessage?: string;
  duration?: number;
  success?: boolean;
  error?: boolean;
  theme?: string;
  details?: Record<string, unknown>;
}

export interface ThemeEffect {
  name: string;
  type: string;
  properties: Record<string, any>;
}

export interface ThemeComponentConfig {
  tokens: Record<string, string>;
  variants?: Record<string, Record<string, string>>;
  states?: Record<string, Record<string, string>>;
  sizes?: Record<string, Record<string, string>>;
}
