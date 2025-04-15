
import { ThemeEffectType } from '@/shared/types/shared.types';

export interface ThemeEffect {
  type: string;
  enabled: boolean;
  [key: string]: any;
}

export interface GlitchEffect extends ThemeEffect {
  type: string;
  color?: string;
  frequency?: string;
  amplitude?: string;
}

export interface GradientEffect extends ThemeEffect {
  type: string;
  colors?: string[];
  speed?: number; 
}

export interface CyberEffect extends ThemeEffect {
  type: string;
  glowColor?: string;
  scanLines?: boolean;
}

export interface PulseEffect extends ThemeEffect {
  type: string;
  color?: string;
  minOpacity?: number;
  maxOpacity?: number;
}

export interface ParticleEffect extends ThemeEffect {
  type: string;
  color?: string;
  count?: number;
}

export interface MorphEffect extends ThemeEffect {
  type: string;
  intensity?: number;
  speed?: number;
}

// Export these types to shared.types.ts as well
