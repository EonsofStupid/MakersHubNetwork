import { useMemo } from 'react';
import { Theme } from '@/types/theme';
import { z } from 'zod';

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

// Zod schema for hex color validation
const hexColorSchema = z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/);

/**
 * Convert hex color to HSL string (h s% l%) with type validation
 */
export function hexToHSL(input: unknown): string {
  // Default HSL value for black
  const defaultHSL = '0 0% 0%';
  
  try {
    // Validate input is a valid hex color
    const validationResult = hexColorSchema.safeParse(input);
    
    if (!validationResult.success) {
      console.warn('[Theme] Invalid hex color input:', input);
      return defaultHSL;
    }
    
    const hex = validationResult.data.replace('#', '');
    
    // Parse the hex code based on its length
    let r: number, g: number, b: number;
    
    if (hex.length === 3) {
      // For 3-character hex codes (e.g. #ABC), duplicate each character (to #AABBCC)
      r = parseInt(hex[0] + hex[0], 16) / 255;
      g = parseInt(hex[1] + hex[1], 16) / 255;
      b = parseInt(hex[2] + hex[2], 16) / 255;
    } else if (hex.length === 6) {
      // For 6-character hex codes
      r = parseInt(hex.substring(0, 2), 16) / 255;
      g = parseInt(hex.substring(2, 4), 16) / 255;
      b = parseInt(hex.substring(4, 6), 16) / 255;
    } else {
      // Invalid length (should never happen due to regex validation)
      return defaultHSL;
    }
    
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
  } catch (error) {
    console.error('[Theme] Error in hexToHSL:', error);
    return defaultHSL;
  }
}

/**
 * Type-safe nested property access with a fallback value
 */
function safelyGetNestedValue<T>(
  obj: unknown, 
  path: string[], 
  fallback: T
): T {
  // Guard against non-objects
  if (!obj || typeof obj !== 'object') {
    return fallback;
  }
  
  try {
    // Start with the object
    let current: unknown = obj;
    
    // Traverse the path
    for (const key of path) {
      // If current is not an object or null/undefined, return fallback
      if (!current || typeof current !== 'object') {
        return fallback;
      }
      
      // Access the next level using type safety
      current = (current as Record<string, unknown>)[key];
      
      // If the path leads to undefined or null, return fallback
      if (current === undefined || current === null) {
        return fallback;
      }
    }
    
    // If we've reached the end of the path and the value is of the expected type, return it
    // Otherwise, return the fallback
    return (current as T) ?? fallback;
  } catch (error) {
    console.error('[Theme] Error in safelyGetNestedValue:', error);
    return fallback;
  }
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
      // Extract colors with type safety
      if (theme.design_tokens.colors && typeof theme.design_tokens.colors === 'object') {
        const colors = theme.design_tokens.colors;
        
        // Safe getters for color values
        const getColorValue = (key: string): string | undefined => {
          const value = safelyGetNestedValue<unknown>(colors, [key], undefined);
          return typeof value === 'string' ? value : undefined;
        };
        
        // Apply theme colors using our safe getters
        if (getColorValue('background')) {
          defaults.background = hexToHSL(getColorValue('background'));
        }
        if (getColorValue('foreground')) {
          defaults.foreground = hexToHSL(getColorValue('foreground'));
        }
        if (getColorValue('card')) {
          defaults.card = hexToHSL(getColorValue('card'));
        }
        if (getColorValue('cardForeground')) {
          defaults.cardForeground = hexToHSL(getColorValue('cardForeground'));
        }
        if (getColorValue('primary')) {
          defaults.primary = hexToHSL(getColorValue('primary'));
        }
        if (getColorValue('primaryForeground')) {
          defaults.primaryForeground = hexToHSL(getColorValue('primaryForeground'));
        }
        if (getColorValue('secondary')) {
          defaults.secondary = hexToHSL(getColorValue('secondary'));
        }
        if (getColorValue('secondaryForeground')) {
          defaults.secondaryForeground = hexToHSL(getColorValue('secondaryForeground'));
        }
        if (getColorValue('muted')) {
          defaults.muted = hexToHSL(getColorValue('muted'));
        }
        if (getColorValue('mutedForeground')) {
          defaults.mutedForeground = hexToHSL(getColorValue('mutedForeground'));
        }
        if (getColorValue('accent')) {
          defaults.accent = hexToHSL(getColorValue('accent'));
        }
        if (getColorValue('accentForeground')) {
          defaults.accentForeground = hexToHSL(getColorValue('accentForeground'));
        }
        if (getColorValue('destructive')) {
          defaults.destructive = hexToHSL(getColorValue('destructive'));
        }
        if (getColorValue('destructiveForeground')) {
          defaults.destructiveForeground = hexToHSL(getColorValue('destructiveForeground'));
        }
        if (getColorValue('border')) {
          defaults.border = hexToHSL(getColorValue('border'));
        }
        if (getColorValue('input')) {
          defaults.input = hexToHSL(getColorValue('input'));
        }
        if (getColorValue('ring')) {
          defaults.ring = hexToHSL(getColorValue('ring'));
        }
      }
      
      // Extract effect colors
      if (theme.design_tokens.effects && typeof theme.design_tokens.effects === 'object') {
        const effects = theme.design_tokens.effects;
        
        // Safe getters for effect values
        const getEffectValue = (key: string): string | undefined => {
          const value = safelyGetNestedValue<unknown>(effects, [key], undefined);
          return typeof value === 'string' ? value : undefined;
        };
        
        if (getEffectValue('primary')) {
          defaults.effectColor = getEffectValue('primary') as string;
        }
        if (getEffectValue('secondary')) {
          defaults.effectSecondary = getEffectValue('secondary') as string;
        }
        if (getEffectValue('tertiary')) {
          defaults.effectTertiary = getEffectValue('tertiary') as string;
        }
      }
      
      // Extract animation durations
      if (theme.design_tokens.animation?.durations && typeof theme.design_tokens.animation.durations === 'object') {
        const durations = theme.design_tokens.animation.durations;
        
        // Safe getter for duration values
        const getDurationValue = (key: string): string | undefined => {
          const value = safelyGetNestedValue<unknown>(durations, [key], undefined);
          return typeof value === 'string' ? value : undefined;
        };
        
        if (getDurationValue('fast')) {
          defaults.transitionFast = getDurationValue('fast') as string;
        }
        if (getDurationValue('normal')) {
          defaults.transitionNormal = getDurationValue('normal') as string;
        }
        if (getDurationValue('slow')) {
          defaults.transitionSlow = getDurationValue('slow') as string;
        }
        if (getDurationValue('animationFast')) {
          defaults.animationFast = getDurationValue('animationFast') as string;
        }
        if (getDurationValue('animationNormal')) {
          defaults.animationNormal = getDurationValue('animationNormal') as string;
        }
        if (getDurationValue('animationSlow')) {
          defaults.animationSlow = getDurationValue('animationSlow') as string;
        }
      }
      
      // Extract radius values
      if (theme.design_tokens.spacing?.radius && typeof theme.design_tokens.spacing.radius === 'object') {
        const radius = theme.design_tokens.spacing.radius;
        
        // Safe getter for radius values
        const getRadiusValue = (key: string): string | undefined => {
          const value = safelyGetNestedValue<unknown>(radius, [key], undefined);
          return typeof value === 'string' ? value : undefined;
        };
        
        if (getRadiusValue('sm')) {
          defaults.radiusSm = getRadiusValue('sm') as string;
        }
        if (getRadiusValue('md')) {
          defaults.radiusMd = getRadiusValue('md') as string;
        }
        if (getRadiusValue('lg')) {
          defaults.radiusLg = getRadiusValue('lg') as string;
        }
        if (getRadiusValue('full')) {
          defaults.radiusFull = getRadiusValue('full') as string;
        }
      }
    } catch (error) {
      console.error('[Theme] Error processing theme tokens:', error);
    }
    
    return defaults;
  }, [theme]);
}
