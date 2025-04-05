
import { useMemo } from 'react';
import { Theme } from '@/types/theme';

export interface ThemeVariables {
  // CSS HSL values (formatted as "H S% L%")
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  
  // Effect colors (hex or rgb)
  effectColor: string;
  effectSecondary: string;
  effectTertiary: string;

  // Timing values
  transitionFast: string;
  transitionNormal: string;
  transitionSlow: string;
  animationFast: string;
  animationNormal: string;
  animationSlow: string;
  
  // Radius values
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusFull: string;
}

/**
 * Convert hex color to HSL string (h s% l%)
 * With strict type checking and fallback to black if invalid
 */
export function hexToHSL(input: unknown): string {
  // Guard: ensure input is a string and valid hex color
  if (typeof input !== 'string' || !/^#([0-9a-fA-F]{3}){1,2}$/.test(input)) {
    console.warn('[Theme] Invalid hex color passed to hexToHSL:', input);
    return '0 0% 0%'; // safe fallback: black
  }
  
  // Remove the hash if it exists
  const hex = input.replace('#', '');
  
  // Convert hex to RGB
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Find the min and max values to determine lightness
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  // Calculate lightness
  let l = (max + min) / 2;
  
  let h = 0;
  let s = 0;
  
  if (max !== min) {
    // Calculate saturation
    s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
    
    // Calculate hue
    if (max === r) {
      h = (g - b) / (max - min) + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / (max - min) + 2;
    } else {
      h = (r - g) / (max - min) + 4;
    }
    
    h *= 60;
  }
  
  // Round values
  h = Math.round(h);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  
  return `${h} ${s}% ${l}%`;
}

/**
 * Safely access a nested property from an object with a fallback value
 */
function safelyGetNestedValue<T>(obj: Record<string, any> | undefined | null, path: string[], fallback: T): T {
  if (!obj) return fallback;
  
  let current = obj;
  
  for (const key of path) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return fallback;
    }
    current = current[key];
  }
  
  return (current === undefined || current === null) ? fallback : current as T;
}

/**
 * Extract theme variables from a theme object with strict type safety
 */
export function useThemeVariables(theme: Theme | null): ThemeVariables {
  return useMemo(() => {
    // Default variables
    const defaults: ThemeVariables = {
      background: '228 47% 8%',
      foreground: '210 40% 98%',
      card: '228 47% 11%',
      cardForeground: '210 40% 98%',
      primary: '186 100% 50%',
      primaryForeground: '210 40% 98%',
      secondary: '334 100% 59%',
      secondaryForeground: '210 40% 98%',
      muted: '228 47% 15%',
      mutedForeground: '215 20.2% 65.1%',
      accent: '228 47% 15%',
      accentForeground: '210 40% 98%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '210 40% 98%',
      border: '228 47% 15%',
      input: '228 47% 15%',
      ring: '228 47% 20%',
      effectColor: '#00F0FF',
      effectSecondary: '#FF2D6E',
      effectTertiary: '#8B5CF6',
      transitionFast: '150ms',
      transitionNormal: '300ms',
      transitionSlow: '500ms',
      animationFast: '1s',
      animationNormal: '2s',
      animationSlow: '3s',
      radiusSm: '0.25rem',
      radiusMd: '0.5rem',
      radiusLg: '0.75rem',
      radiusFull: '9999px',
    };
    
    if (!theme || !theme.design_tokens) {
      return defaults;
    }
    
    try {
      const { colors, effects, animation, spacing } = theme.design_tokens;
      
      // Extract colors with strict type checking
      if (colors && typeof colors === 'object') {
        // Use type safe getter for all values
        const getColor = (key: string): string | undefined => {
          const value = safelyGetNestedValue(colors, [key], undefined);
          return typeof value === 'string' ? value : undefined;
        };
        
        if (getColor('background')) defaults.background = hexToHSL(getColor('background'));
        if (getColor('foreground')) defaults.foreground = hexToHSL(getColor('foreground'));
        if (getColor('card')) defaults.card = hexToHSL(getColor('card'));
        if (getColor('cardForeground')) defaults.cardForeground = hexToHSL(getColor('cardForeground'));
        if (getColor('primary')) defaults.primary = hexToHSL(getColor('primary'));
        if (getColor('primaryForeground')) defaults.primaryForeground = hexToHSL(getColor('primaryForeground'));
        if (getColor('secondary')) defaults.secondary = hexToHSL(getColor('secondary'));
        if (getColor('secondaryForeground')) defaults.secondaryForeground = hexToHSL(getColor('secondaryForeground'));
        if (getColor('muted')) defaults.muted = hexToHSL(getColor('muted'));
        if (getColor('mutedForeground')) defaults.mutedForeground = hexToHSL(getColor('mutedForeground'));
        if (getColor('accent')) defaults.accent = hexToHSL(getColor('accent'));
        if (getColor('accentForeground')) defaults.accentForeground = hexToHSL(getColor('accentForeground'));
        if (getColor('destructive')) defaults.destructive = hexToHSL(getColor('destructive'));
        if (getColor('destructiveForeground')) defaults.destructiveForeground = hexToHSL(getColor('destructiveForeground'));
        if (getColor('border')) defaults.border = hexToHSL(getColor('border'));
        if (getColor('input')) defaults.input = hexToHSL(getColor('input'));
        if (getColor('ring')) defaults.ring = hexToHSL(getColor('ring'));
      }
      
      // Extract effect colors
      if (effects && typeof effects === 'object') {
        const getEffect = (key: string): string | undefined => {
          const value = safelyGetNestedValue(effects, [key], undefined);
          return typeof value === 'string' ? value : undefined;
        };
        
        if (getEffect('primary')) defaults.effectColor = getEffect('primary') as string;
        if (getEffect('secondary')) defaults.effectSecondary = getEffect('secondary') as string;
        if (getEffect('tertiary')) defaults.effectTertiary = getEffect('tertiary') as string;
      }
      
      // Extract animation times
      if (animation && typeof animation === 'object' && animation.durations && typeof animation.durations === 'object') {
        const durations = animation.durations as Record<string, unknown>;
        
        const getDuration = (key: string): string | undefined => {
          const value = safelyGetNestedValue(durations, [key], undefined);
          return typeof value === 'string' ? value : undefined;
        };
        
        if (getDuration('fast')) defaults.transitionFast = getDuration('fast') as string;
        if (getDuration('normal')) defaults.transitionNormal = getDuration('normal') as string;
        if (getDuration('slow')) defaults.transitionSlow = getDuration('slow') as string;
        
        if (getDuration('animationFast')) defaults.animationFast = getDuration('animationFast') as string;
        if (getDuration('animationNormal')) defaults.animationNormal = getDuration('animationNormal') as string;
        if (getDuration('animationSlow')) defaults.animationSlow = getDuration('animationSlow') as string;
      }
      
      // Extract radius
      if (spacing && typeof spacing === 'object' && spacing.radius && typeof spacing.radius === 'object') {
        const radius = spacing.radius as Record<string, unknown>;
        
        const getRadius = (key: string): string | undefined => {
          const value = safelyGetNestedValue(radius, [key], undefined);
          return typeof value === 'string' ? value : undefined;
        };
        
        if (getRadius('sm')) defaults.radiusSm = getRadius('sm') as string;
        if (getRadius('md')) defaults.radiusMd = getRadius('md') as string;
        if (getRadius('lg')) defaults.radiusLg = getRadius('lg') as string;
        if (getRadius('full')) defaults.radiusFull = getRadius('full') as string;
      }
    } catch (error) {
      console.error('Error parsing theme tokens:', error);
    }
    
    return defaults;
  }, [theme]);
}
