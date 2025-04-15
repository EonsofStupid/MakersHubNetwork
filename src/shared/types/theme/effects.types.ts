
import { ThemeEffectType } from '@/shared/types/features/theme.types';

export interface ThemeEffect {
  type: ThemeEffectType;
  intensity: number;
  color?: string;
  enabled?: boolean;
  [key: string]: any;
}

export interface GlowEffect extends ThemeEffect {
  type: ThemeEffectType.GLOW;
  radius?: string;
  spread?: string;
  color: string;
}

export interface GradientEffect extends ThemeEffect {
  type: ThemeEffectType.GRADIENT;
  colors: string[];
  direction?: string;
  stops?: number[];
}

export interface ParticleEffect extends ThemeEffect {
  type: ThemeEffectType.PARTICLE;
  count: number;
  size: number;
  color: string;
  speed: number;
}

export interface BlurEffect extends ThemeEffect {
  type: ThemeEffectType.BLUR;
  amount: string;
  background?: string;
}

export interface MorphEffect extends ThemeEffect {
  type: ThemeEffectType.MORPH;
  intensity: number; // Make sure this is required and not optional
  duration?: string;
  easing?: string;
}

export interface PulseEffect extends ThemeEffect {
  type: ThemeEffectType.PULSE;
  duration: string;
  scale?: number;
  opacity?: number;
}
