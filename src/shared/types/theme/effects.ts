
/**
 * Theme effect props interface
 */
export interface ThemeEffectProps {
  effect: ThemeEffect;
  intensity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Theme effect provider props interface
 */
export interface ThemeEffectProviderProps {
  children: React.ReactNode;
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
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * Theme effect enum
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
 * Theme effect interface
 */
export interface ThemeEffect {
  id?: string;
  type: string;
  enabled: boolean;
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
