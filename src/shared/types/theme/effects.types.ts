
import { ThemeEffectType } from '../features/theme.types';
import type { ThemeEffect } from '../features/theme.types';

export interface GlitchEffect extends ThemeEffect {
  type: ThemeEffectType.GLITCH;
  color?: string;
  frequency?: string;
  amplitude?: string;
  enabled: boolean;
}

export interface GradientEffect extends ThemeEffect {
  type: ThemeEffectType.GRADIENT;
  colors?: string[];
  speed?: number; 
  enabled: boolean;
}

export interface CyberEffect extends ThemeEffect {
  type: ThemeEffectType.CYBER;
  glowColor?: string;
  scanLines?: boolean;
  enabled: boolean;
}

export interface PulseEffect extends ThemeEffect {
  type: ThemeEffectType.PULSE;
  color?: string;
  minOpacity?: number;
  maxOpacity?: number;
  enabled: boolean;
}

export interface ParticleEffect extends ThemeEffect {
  type: ThemeEffectType.PARTICLE;
  color?: string;
  count?: number;
  enabled: boolean;
}

export interface MorphEffect extends ThemeEffect {
  type: ThemeEffectType.MORPH;
  intensity?: number;
  speed?: number;
  enabled: boolean;
}
