
import { ThemeContext, ThemeStatus, ThemeLogDetails } from './shared.types';

/**
 * Theme token type definitions
 */
export interface ThemeToken {
  type: 'color' | 'spacing' | 'shadow' | 'gradient' | 'animation' | 'typography';
  value: string;
  description?: string;
  keyframes?: string;
}

/**
 * Component token interface
 */
export interface ComponentToken {
  styles: Record<string, string>;
  variants?: Record<string, Record<string, string>>;
}

/**
 * Theme interface
 */
export interface Theme {
  id: string;
  name: string;
  description?: string;
  tokens: Record<string, ThemeToken>;
  components?: Record<string, ComponentTokens>;
  version: number;
  context: ThemeContext;
  status: ThemeStatus;
  component_tokens?: Record<string, any>;
  is_system?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Component tokens interface
 */
export interface ComponentTokens {
  styles: Record<string, string>;
  variants?: Record<string, Record<string, string>>;
}

/**
 * Theme effect types
 */
export enum ThemeEffectType {
  NONE = 'none',
  BLUR = 'blur',
  GRAIN = 'grain',
  NOISE = 'noise',
  GLOW = 'glow',
  GLITCH = 'glitch',
  GRADIENT = 'gradient',
  CYBER = 'cyber',
  PULSE = 'pulse',
  PARTICLE = 'particle',
}

/**
 * Theme effect props interface
 */
export interface ThemeEffectProps {
  type?: ThemeEffectType;
  intensity?: number;
  color?: string;
  secondaryColor?: string;
  speed?: number;
  className?: string;
  children?: React.ReactNode;
  effect?: ThemeEffect;
}

/**
 * Theme effect provider props
 */
export interface ThemeEffectProviderProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  color?: string;
  secondaryColor?: string;
  speed?: number;
  type?: ThemeEffectType;
  effect?: ThemeEffect;
}

/**
 * Theme effect interface
 */
export interface ThemeEffect {
  id: string;
  type: ThemeEffectType;
  intensity: number;
  color?: string;
  speed?: number;
  enabled?: boolean;
  [key: string]: any;
}

/**
 * Theme state interface
 */
export interface ThemeState {
  themes: Theme[];
  activeThemeId: string | null;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  isLoading: boolean;
  error: string | null;
}

/**
 * Design tokens interface
 */
export interface DesignTokens {
  colors?: Record<string, string>;
  typography?: Record<string, any>;
  spacing?: Record<string, string>;
  borders?: Record<string, string>;
  shadows?: Record<string, string>;
  radii?: Record<string, string>;
  zIndices?: Record<string, string>;
  breakpoints?: Record<string, string>;
  transitions?: Record<string, string>;
  animations?: Record<string, any>;
  [key: string]: any;
}
