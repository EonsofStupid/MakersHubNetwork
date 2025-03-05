
/**
 * Theme Effect System Types
 */

export type EffectType = 'glitch' | 'gradient' | 'particle' | 'morph' | 'cyber' | 'pulse';

export interface ThemeEffectBase {
  id: string;
  type: EffectType;
  duration?: number;
  delay?: number;
  intensity?: number;
  enabled: boolean;
}

export interface GlitchEffect extends ThemeEffectBase {
  type: 'glitch';
  frequency?: number;
  amplitude?: number;
  color?: string;
}

export interface GradientEffect extends ThemeEffectBase {
  type: 'gradient';
  colors: string[];
  direction?: 'to-right' | 'to-left' | 'to-top' | 'to-bottom' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl';
  speed?: number;
}

export interface ParticleEffect extends ThemeEffectBase {
  type: 'particle';
  count?: number;
  size?: number;
  color?: string;
  speed?: number;
}

export interface MorphEffect extends ThemeEffectBase {
  type: 'morph';
  shapes?: string[];
  speed?: number;
  distortion?: number;
}

export interface CyberEffect extends ThemeEffectBase {
  type: 'cyber';
  glowColor?: string;
  textShadow?: boolean;
  scanLines?: boolean;
}

export interface PulseEffect extends ThemeEffectBase {
  type: 'pulse';
  minOpacity?: number;
  maxOpacity?: number;
  color?: string;
}

export type ThemeEffect = 
  | GlitchEffect 
  | GradientEffect 
  | ParticleEffect 
  | MorphEffect 
  | CyberEffect 
  | PulseEffect;

export interface EffectTarget {
  elementId: string;
  effect: ThemeEffect;
}
