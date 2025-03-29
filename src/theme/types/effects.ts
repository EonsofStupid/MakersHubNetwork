
export type EffectType = 'glitch' | 'gradient' | 'cyber' | 'pulse' | 'particle' | 'morph';

export interface ThemeEffect {
  id: string;
  type: EffectType;
  enabled: boolean;
  duration?: number;
}

export interface GlitchEffect extends ThemeEffect {
  type: 'glitch';
  frequency?: number;
  amplitude?: number;
  color?: string;
}

export interface GradientEffect extends ThemeEffect {
  type: 'gradient';
  colors?: string[];
  direction?: 'to-right' | 'to-left' | 'to-top' | 'to-bottom' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl';
  speed?: number;
}

export interface CyberEffect extends ThemeEffect {
  type: 'cyber';
  glowColor?: string;
  textShadow?: boolean;
  scanLines?: boolean;
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
  speed?: number;
}

export interface MorphEffect extends ThemeEffect {
  type: 'morph';
  intensity?: number;
  speed?: number;
}
