
// Theme type definitions

export interface Theme {
  id: string;
  name: string;
  version: string;
  status: string;
  description?: string;
  is_default: boolean;
  cache_key?: string;
  parent_theme_id?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  design_tokens: Record<string, ThemeToken>;
  component_tokens: Record<string, ComponentTokens>;
}

export interface ThemeToken {
  value: string;
  type: string;
  description?: string;
}

export interface ComponentTokens {
  name: string;
  description?: string;
  tokens: Record<string, string>;
}

// Theme effect types
export type ThemeEffectType = 'glitch' | 'gradient' | 'cyber' | 'pulse' | 'particle' | 'morph';

export interface ThemeEffect {
  id: string;
  type: ThemeEffectType;
  enabled: boolean;
  duration?: number;
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

export interface MorphEffect extends ThemeEffect {
  type: 'morph';
  intensity?: number;
  speed?: number;
}
