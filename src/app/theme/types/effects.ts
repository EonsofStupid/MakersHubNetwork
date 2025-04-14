
import { ThemeEffectType } from '@/shared/types/shared.types';

export interface ThemeEffect {
  type: ThemeEffectType;
  enabled: boolean;
  [key: string]: any;
}

export interface GlitchEffect extends ThemeEffect {
  type: ThemeEffectType.NOISE;
  color?: string;
  frequency?: string;
  amplitude?: string;
}

export interface GradientEffect extends ThemeEffect {
  type: ThemeEffectType.GRADIENT;
  colors?: string[];
  speed?: number; 
}

export interface CyberEffect extends ThemeEffect {
  type: ThemeEffectType.NEON;
  glowColor?: string;
  scanLines?: boolean;
}

export interface PulseEffect extends ThemeEffect {
  type: ThemeEffectType.PULSE;
  color?: string;
  minOpacity?: number;
  maxOpacity?: number;
}

export interface ParticleEffect extends ThemeEffect {
  type: ThemeEffectType.PARTICLE;
  color?: string;
  count?: number;
}

export interface MorphEffect extends ThemeEffect {
  type: ThemeEffectType.BLUR;
  intensity?: number;
  speed?: number;
}
