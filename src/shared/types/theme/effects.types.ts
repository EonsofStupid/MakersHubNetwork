
import { ThemeEffectType } from '../shared.types';

export interface ThemeEffect {
  type: ThemeEffectType;
  enabled: boolean;
  intensity: number;
  color?: string;
  selector?: string;
  config?: Record<string, any>;
  id?: string;
  [key: string]: any;
}

export interface GlitchEffect extends ThemeEffect {
  type: ThemeEffectType.GLITCH | ThemeEffectType.NOISE; // Support both new and old naming
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
  type: ThemeEffectType.CYBER | ThemeEffectType.NEON; // Support both new and old naming
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
  type: ThemeEffectType.MORPH | ThemeEffectType.BLUR; // Support both new and old naming
  intensity?: number; // Make optional to match base interface
  speed?: number;
}

export interface ThemeEffectProviderProps {
  children: React.ReactNode;
  className?: string;
  effect?: ThemeEffect;
}

// Helper function to convert legacy effect types
export const normalizeEffectType = (type: string): ThemeEffectType => {
  const mappings: Record<string, ThemeEffectType> = {
    'glitch': ThemeEffectType.NOISE,
    'cyber': ThemeEffectType.NEON,
    'morph': ThemeEffectType.BLUR
  };
  
  return mappings[type] || (type as ThemeEffectType);
};
