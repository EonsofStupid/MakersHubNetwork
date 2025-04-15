
import { ThemeEffect, ThemeEffectType } from '@/shared/types/shared.types';

export interface GlitchEffect {
  type: "GLITCH" | "NOISE"; // Support both new and old naming
  color?: string;
  frequency?: string;
  amplitude?: string;
  enabled: boolean;
}

export interface GradientEffect {
  type: "GRADIENT";
  colors?: string[];
  speed?: number; 
  enabled: boolean;
}

export interface CyberEffect {
  type: "CYBER" | "NEON"; // Support both new and old naming
  glowColor?: string;
  scanLines?: boolean;
  enabled: boolean;
}

export interface PulseEffect {
  type: "PULSE";
  color?: string;
  minOpacity?: number;
  maxOpacity?: number;
  enabled: boolean;
}

export interface ParticleEffect {
  type: "PARTICLE";
  color?: string;
  count?: number;
  enabled: boolean;
}

export interface MorphEffect {
  type: "MORPH" | "BLUR"; // Support both new and old naming
  intensity?: number;
  speed?: number;
  enabled: boolean;
}

export interface ThemeEffectProviderProps {
  children: React.ReactNode;
  className?: string;
  effect?: string;
}
