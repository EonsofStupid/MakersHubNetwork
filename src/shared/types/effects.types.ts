
import { ReactNode } from 'react';

export interface ThemeEffect {
  id?: string;
  name: string;
  type: ThemeEffectType;
  settings: ThemeEffectSettings;
  animation?: ThemeEffectAnimation;
}

export type ThemeEffectType = 
  | 'glow' 
  | 'noise' 
  | 'shimmer' 
  | 'pulse' 
  | 'wave' 
  | 'matrix' 
  | 'scan' 
  | 'glitch';

export interface ThemeEffectSettings {
  color?: string;
  intensity?: number;
  speed?: number;
  opacity?: number;
  size?: number;
  blur?: number;
  [key: string]: any;
}

export interface ThemeEffectAnimation {
  duration: number;
  delay?: number;
  easing?: string;
  iteration?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

export interface ThemeEffectProviderProps {
  children: ReactNode;
  effect?: ThemeEffect;
  className?: string;
}
