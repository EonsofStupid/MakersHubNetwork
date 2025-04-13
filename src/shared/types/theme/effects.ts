
import { ReactNode, CSSProperties } from 'react';

/**
 * Theme effect enum
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
  effect: ThemeEffect;
  intensity?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Theme effect provider props interface
 */
export interface ThemeEffectProviderProps {
  children: ReactNode;
  className?: string;
  effect?: ThemeEffect;
}

/**
 * Effect renderer props
 */
export interface EffectRendererProps {
  effect: ThemeEffect;
  intensity?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Base theme effect interface
 */
export interface ThemeEffect {
  type: ThemeEffectType | string;
  enabled: boolean;
  id?: string;
  duration?: number;
  [key: string]: any;
}

/**
 * Specific effect interfaces
 */
export interface GlitchEffect extends ThemeEffect {
  type: 'glitch';
  color?: string;
  frequency?: number;
  amplitude?: number;
}

export interface GradientEffect extends ThemeEffect {
  type: 'gradient';
  colors?: string[];
  speed?: number;
}

export interface CyberEffect extends ThemeEffect {
  type: 'cyber';
  glowColor?: string;
  scanLines?: boolean;
  textShadow?: boolean;
}

export interface PulseEffect extends ThemeEffect {
  type: 'pulse';
  color?: string;
  minOpacity?: number;
  maxOpacity?: number;
}

export interface ParticleEffect extends ThemeEffect {
  type: 'particle';
  color?: string;
  count?: number;
}

export interface MorphEffect extends ThemeEffect {
  type: 'morph';
  intensity?: number;
  speed?: number;
}

export type ThemeEffectConfig = 
  | GlitchEffect
  | GradientEffect
  | CyberEffect
  | PulseEffect
  | ParticleEffect
  | MorphEffect;
