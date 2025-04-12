
export interface ThemeEffect {
  id: string;
  type: string;
  enabled: boolean;
  [key: string]: any;
}

export interface GlitchEffect extends ThemeEffect {
  type: 'glitch';
  color?: string;
  frequency?: number;
  amplitude?: number;
}

export interface GradientEffect extends ThemeEffect {
  type: 'gradient';
  colors?: string[];
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
}
