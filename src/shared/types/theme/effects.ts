
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
 * Theme effect type
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
 * Specific effect interfaces
 */
export interface GlitchEffectProps {
  type: 'glitch';
  color?: string;
  frequency?: string;
  amplitude?: string;
  enabled?: boolean;
}

export interface GradientEffectProps {
  type: 'gradient';
  colors?: string[];
  speed?: number;
  enabled?: boolean;
}

export interface CyberEffectProps {
  type: 'cyber';
  glowColor?: string;
  scanLines?: boolean;
  enabled?: boolean;
}

export interface PulseEffectProps {
  type: 'pulse';
  color?: string;
  minOpacity?: number;
  maxOpacity?: number;
  enabled?: boolean;
}

export interface ParticleEffectProps {
  type: 'particle';
  color?: string;
  count?: number;
  enabled?: boolean;
}

export interface MorphEffectProps {
  type: 'morph';
  intensity?: number;
  speed?: number;
  enabled?: boolean;
}

export type ThemeEffectConfig = 
  | GlitchEffectProps
  | GradientEffectProps
  | CyberEffectProps
  | PulseEffectProps
  | ParticleEffectProps
  | MorphEffectProps;
