
import { ThemeEffect } from '../theme.types';

/**
 * Theme effect props interface
 */
export interface ThemeEffectProps {
  effect: ThemeEffect;
  intensity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Theme effect provider props interface
 */
export interface ThemeEffectProviderProps {
  children: React.ReactNode;
  className?: string;
  effect?: ThemeEffect;
}
