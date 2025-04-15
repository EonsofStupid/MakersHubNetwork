
import { ThemeEffectType } from '../features/theme.types';

/**
 * Base theme effect interface
 */
export interface ThemeEffect {
  type: ThemeEffectType;
  intensity: number;
  enabled: boolean;
  color?: string;
  [key: string]: any;
}

/**
 * Specialized effect types
 */
export interface GlowEffect extends ThemeEffect {
  type: ThemeEffectType.GLOW;
  color: string;
  radius?: number;
}

export interface BlurEffect extends ThemeEffect {
  type: ThemeEffectType.BLUR;
  blurAmount?: number;
}

export interface GrainEffect extends ThemeEffect {
  type: ThemeEffectType.GRAIN;
  opacity?: number;
  scale?: number;
}

export interface CyberEffect extends ThemeEffect {
  type: ThemeEffectType.CYBER;
  glowColor?: string;
  scanLines?: boolean;
}
