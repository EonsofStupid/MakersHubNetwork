
import { ReactNode } from 'react';

export type ThemeEffect = {
  id: string;  
  type: 'none' | 'blur' | 'grain' | 'noise' | 'glow';
  enabled: boolean;
  [key: string]: any;
};

export interface BlurEffect extends ThemeEffect {
  type: 'blur';
  intensity: number;
  color?: string;
}

export interface GrainEffect extends ThemeEffect {
  type: 'grain';
  opacity: number;
  scale?: number;
}

export interface NoiseEffect extends ThemeEffect {
  type: 'noise';
  opacity: number;
  scale?: number;
  colorize?: boolean;
}

export interface GlowEffect extends ThemeEffect {
  type: 'glow';
  color: string;
  intensity: number;
  size?: number;
}

export type ThemeEffectType = 'none' | 'blur' | 'grain' | 'noise' | 'glow';

export interface ThemeEffectProviderProps {
  children: ReactNode;
  className?: string;
  effectId?: string;
}

export interface EffectRendererProps {
  effect: ThemeEffect;
  className?: string;
}

export interface ThemeEffectsState {
  effects: ThemeEffect[];
  activeEffects: { [id: string]: ThemeEffect };
  setEffect: (id: string, effect: ThemeEffect) => void;
  enableEffect: (id: string) => void;
  disableEffect: (id: string) => void;
  toggleEffect: (id: string) => void;
  removeEffect: (id: string) => void;
}
