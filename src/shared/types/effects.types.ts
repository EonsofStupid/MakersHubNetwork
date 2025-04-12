
import { ReactNode } from 'react';

export type ThemeEffectType = 
  | 'glow'
  | 'flicker'
  | 'pulse'
  | 'shimmer'
  | 'neon'
  | 'cyber'
  | 'noise'
  | 'distortion';

export interface ThemeEffect {
  id: string;
  type: ThemeEffectType;
  intensity: number;
  color?: string;
  duration?: number;
  delay?: number;
  options?: Record<string, any>;
}

export interface ThemeEffectProps {
  effect: ThemeEffect;
  children: ReactNode;
}

export interface ThemeEffectProviderProps {
  children: ReactNode;
}
