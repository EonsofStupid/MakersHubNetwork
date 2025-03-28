
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
 */
export function hexToHSL(hex: string): string {
  // Remove the hash if it exists
  hex = hex.replace('#', '');
  
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
 * Extract theme variables from a theme object
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
      
      // Extract colors
      if (colors) {
        if (colors.background) defaults.background = hexToHSL(colors.background as string);
        if (colors.foreground) defaults.foreground = hexToHSL(colors.foreground as string);
        if (colors.card) defaults.card = hexToHSL(colors.card as string);
        if (colors.cardForeground) defaults.cardForeground = hexToHSL(colors.cardForeground as string);
        if (colors.primary) defaults.primary = hexToHSL(colors.primary as string);
        if (colors.primaryForeground) defaults.primaryForeground = hexToHSL(colors.primaryForeground as string);
        if (colors.secondary) defaults.secondary = hexToHSL(colors.secondary as string);
        if (colors.secondaryForeground) defaults.secondaryForeground = hexToHSL(colors.secondaryForeground as string);
        if (colors.muted) defaults.muted = hexToHSL(colors.muted as string);
        if (colors.mutedForeground) defaults.mutedForeground = hexToHSL(colors.mutedForeground as string);
        if (colors.accent) defaults.accent = hexToHSL(colors.accent as string);
        if (colors.accentForeground) defaults.accentForeground = hexToHSL(colors.accentForeground as string);
        if (colors.destructive) defaults.destructive = hexToHSL(colors.destructive as string);
        if (colors.destructiveForeground) defaults.destructiveForeground = hexToHSL(colors.destructiveForeground as string);
        if (colors.border) defaults.border = hexToHSL(colors.border as string);
        if (colors.input) defaults.input = hexToHSL(colors.input as string);
        if (colors.ring) defaults.ring = hexToHSL(colors.ring as string);
      }
      
      // Extract effect colors
      if (effects) {
        if (effects.primary) defaults.effectColor = effects.primary as string;
        if (effects.secondary) defaults.effectSecondary = effects.secondary as string;
        if (effects.tertiary) defaults.effectTertiary = effects.tertiary as string;
      }
      
      // Extract animation times
      if (animation) {
        if (animation.durations) {
          const durations = animation.durations as Record<string, any>;
          if (durations.fast) defaults.transitionFast = durations.fast as string;
          if (durations.normal) defaults.transitionNormal = durations.normal as string;
          if (durations.slow) defaults.transitionSlow = durations.slow as string;
          
          if (durations.animationFast) defaults.animationFast = durations.animationFast as string;
          if (durations.animationNormal) defaults.animationNormal = durations.animationNormal as string;
          if (durations.animationSlow) defaults.animationSlow = durations.animationSlow as string;
        }
      }
      
      // Extract radius
      if (spacing) {
        if (spacing.radius) {
          const radius = spacing.radius as Record<string, any>;
          if (radius.sm) defaults.radiusSm = radius.sm as string;
          if (radius.md) defaults.radiusMd = radius.md as string;
          if (radius.lg) defaults.radiusLg = radius.lg as string;
          if (radius.full) defaults.radiusFull = radius.full as string;
        }
      }
    } catch (error) {
      console.error('Error parsing theme tokens:', error);
    }
    
    return defaults;
  }, [theme]);
}
