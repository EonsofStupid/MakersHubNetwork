
export interface ThemeEffect {
  type: 'glitch' | 'gradient' | 'cyber' | 'pulse' | 'particle' | 'morph';
  enabled: boolean;
  [key: string]: any;
}

export interface GlitchEffect extends ThemeEffect {
  type: 'glitch';
  color?: string;
  frequency?: string;
  amplitude?: string;
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
