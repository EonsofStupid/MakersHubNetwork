
import { ReactNode } from 'react';
import type { ThemeEffectType } from './shared.types';

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
  className?: string; 
  effect?: ThemeEffect;
}
