
import { ThemeEffectType } from '../shared.types';

/**
 * Base theme effect interface
 */
export interface ThemeEffect {
  type: ThemeEffectType;
  enabled: boolean;
  intensity?: number;
  color?: string;
  duration?: number;
  delay?: number;
  selector?: string;
  config?: Record<string, unknown>;
}

/**
 * Morph effect interface
 * Requires specific intensity value
 */
export interface MorphEffect extends Omit<ThemeEffect, 'intensity'> {
  type: ThemeEffectType.MORPH;
  intensity: number; // Required for morph effect
}

/**
 * Blur effect interface
 */
export interface BlurEffect extends ThemeEffect {
  type: ThemeEffectType.BLUR;
  radius?: number;
}

/**
 * Glow effect interface
 */
export interface GlowEffect extends ThemeEffect {
  type: ThemeEffectType.GLOW;
  radius?: number;
  color: string; // Required for glow
}

/**
 * All possible effect types
 */
export type ThemeEffectInstance = 
  | ThemeEffect
  | MorphEffect
  | BlurEffect
  | GlowEffect;
