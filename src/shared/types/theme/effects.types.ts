
import { ThemeEffectType } from '../shared.types';
import type { ThemeEffect } from '../shared.types';

// Re-export ThemeEffect from shared types
export type { ThemeEffect };

export interface GlitchEffect extends ThemeEffect {
  type: "GLITCH" | "NOISE"; // Support both new and old naming
  color?: string;
  frequency?: string;
  amplitude?: string;
  enabled: boolean;
}

export interface GradientEffect extends ThemeEffect {
  type: "GRADIENT";
  colors?: string[];
  speed?: number; 
  enabled: boolean;
}

export interface CyberEffect extends ThemeEffect {
  type: "CYBER" | "NEON"; // Support both new and old naming
  glowColor?: string;
  scanLines?: boolean;
  enabled: boolean;
}

export interface PulseEffect extends ThemeEffect {
  type: "PULSE";
  color?: string;
  minOpacity?: number;
  maxOpacity?: number;
  enabled: boolean;
}

export interface ParticleEffect extends ThemeEffect {
  type: "PARTICLE";
  color?: string;
  count?: number;
  enabled: boolean;
}

export interface MorphEffect extends ThemeEffect {
  type: "MORPH" | "BLUR"; // Support both new and old naming
  intensity?: number;
  speed?: number;
  enabled: boolean;
}

export interface ThemeEffectProviderProps {
  children: React.ReactNode;
  className?: string;
  effect?: ThemeEffect;
}
