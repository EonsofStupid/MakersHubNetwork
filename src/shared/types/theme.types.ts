
import { ThemeContext, ThemeStatus } from './shared.types';

export interface ThemeToken {
  id: string;
  theme_id: string;
  token_name: string;
  token_value: string;
  category: string;
  description?: string;
  fallback_value?: string;
}

export interface ComponentTokens {
  [key: string]: Record<string, string>;
}

export interface DesignTokens {
  colors?: Record<string, string>;
  typography?: Record<string, string>;
  spacing?: Record<string, string>;
  radii?: Record<string, string>;
  shadows?: Record<string, string>;
  [key: string]: Record<string, string> | undefined;
}

export interface ThemeState {
  themes: Theme[];
  activeTheme: string;
  componentTokens: ComponentTokens;
  isLoading: boolean;
  error: string | null;
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  status: ThemeStatus;
  context: ThemeContext;
  design_tokens: DesignTokens;
  component_tokens: ComponentTokens;
  is_default: boolean;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  version: number;
  parent_theme_id?: string;
}

export type ThemeEffectType = 
  | 'glow'
  | 'flicker'
  | 'pulse'
  | 'shimmer'
  | 'neon'
  | 'cyber'
  | 'noise'
  | 'distortion'
  | 'glitch'
  | 'gradient'
  | 'particle'
  | 'morph';

export interface ThemeEffect {
  type: ThemeEffectType;
  enabled: boolean;
  intensity?: number;
  color?: string;
  duration?: number;
  delay?: number;
  options?: Record<string, any>;
}

export interface ThemeEffectProps {
  effect: ThemeEffect;
  children: React.ReactNode;
}

export interface ThemeEffectProviderProps {
  children: React.ReactNode;
  className?: string;
  effect?: ThemeEffect;
}
