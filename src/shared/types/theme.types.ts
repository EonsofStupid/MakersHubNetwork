
import { ThemeContext, ThemeStatus } from './shared.types';

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
export enum ThemeEffect {
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
  type: ThemeEffect;
  intensity?: number;
  color?: string;
  secondaryColor?: string;
  speed?: number;
  className?: string;
  children?: React.ReactNode;
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
  type?: ThemeEffect;
}
