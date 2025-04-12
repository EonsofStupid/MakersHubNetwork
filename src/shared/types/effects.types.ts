
// Common effect properties
export interface BaseEffectProps {
  id?: string;
  name: string;
  type: string;
  opacity?: number;
  intensity?: number;
  duration?: number;
  delay?: number;
  easing?: string;
}

// Data stream effect
export interface DataStreamEffect extends BaseEffectProps {
  type: 'data-stream';
  color?: string;
  direction?: 'down' | 'up' | 'left' | 'right';
  speed?: number;
  density?: number;
  size?: number;
}

// Glitch effect
export interface GlitchEffect extends BaseEffectProps {
  type: 'glitch';
  frequency?: number;
  strength?: number;
  color1?: string;
  color2?: string;
}

// Electric effect
export interface ElectricEffect extends BaseEffectProps {
  type: 'electric';
  color?: string;
  width?: number;
  branches?: number;
}

// Pulse effect
export interface PulseEffect extends BaseEffectProps {
  type: 'pulse';
  color?: string;
  scale?: number;
  frequency?: number;
}

// Cyberpunk effect
export interface CyberpunkEffect extends BaseEffectProps {
  type: 'cyberpunk';
  primaryColor?: string;
  secondaryColor?: string;
  variant?: 'outline' | 'solid' | 'glow';
}

// Matrix rain effect
export interface MatrixRainEffect extends BaseEffectProps {
  type: 'matrix-rain';
  color?: string;
  speed?: number;
  density?: number;
  fontSize?: number;
}

// Hologram effect
export interface HologramEffect extends BaseEffectProps {
  type: 'hologram';
  color?: string;
  scanlineSpacing?: number;
  scanlineOpacity?: number;
}

// Union of all effect types
export type ThemeEffect = 
  | DataStreamEffect 
  | GlitchEffect 
  | ElectricEffect 
  | PulseEffect 
  | CyberpunkEffect 
  | MatrixRainEffect 
  | HologramEffect;

// Effect renderer props
export interface EffectRendererProps {
  effect: ThemeEffect;
  children: React.ReactNode;
  className?: string;
}

// Theme effect provider props
export interface ThemeEffectProviderProps {
  children: React.ReactNode;
  className?: string;
}
