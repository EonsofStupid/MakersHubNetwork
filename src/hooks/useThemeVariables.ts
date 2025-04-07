
import { useMemo } from 'react';
import { Theme } from '@/types/theme';

export interface ThemeVariables {
  // Color variables
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
  
  // Effect colors
  effectColor: string;
  effectSecondary: string;
  effectTertiary: string;
  
  // Timing variables
  transitionFast: string;
  transitionNormal: string;
  transitionSlow: string;
  animationFast: string;
  animationNormal: string;
  animationSlow: string;
  
  // Border radius variables
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusFull: string;
}

// Helper function to safely access potentially undefined nested properties
function safeGet<T>(obj: any, path: string, defaultValue: T): T {
  try {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === undefined || current === null) {
        return defaultValue;
      }
      current = current[key];
    }
    
    return current !== undefined && current !== null ? current : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

/**
 * Hook to extract theme variables from the current theme
 */
export function useThemeVariables(theme: Theme | null): ThemeVariables {
  // Default variables as a fallback
  const defaultVariables: ThemeVariables = {
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
    
    // Effect colors
    effectColor: '#00F0FF',
    effectSecondary: '#FF2D6E',
    effectTertiary: '#8B5CF6',
    
    // Timing variables
    transitionFast: '150ms',
    transitionNormal: '300ms',
    transitionSlow: '500ms',
    animationFast: '1s',
    animationNormal: '2s',
    animationSlow: '3s',
    
    // Border radius variables
    radiusSm: '0.25rem',
    radiusMd: '0.5rem',
    radiusLg: '0.75rem',
    radiusFull: '9999px'
  };
  
  // Extract variables from the theme
  return useMemo(() => {
    if (!theme) {
      return defaultVariables;
    }
    
    try {
      return {
        // Colors
        background: safeGet(theme, 'design_tokens.colors.background', defaultVariables.background),
        foreground: safeGet(theme, 'design_tokens.colors.foreground', defaultVariables.foreground),
        card: safeGet(theme, 'design_tokens.colors.card', defaultVariables.card),
        cardForeground: safeGet(theme, 'design_tokens.colors.cardForeground', defaultVariables.cardForeground),
        primary: safeGet(theme, 'design_tokens.colors.primary', defaultVariables.primary),
        primaryForeground: safeGet(theme, 'design_tokens.colors.primaryForeground', defaultVariables.primaryForeground),
        secondary: safeGet(theme, 'design_tokens.colors.secondary', defaultVariables.secondary),
        secondaryForeground: safeGet(theme, 'design_tokens.colors.secondaryForeground', defaultVariables.secondaryForeground),
        muted: safeGet(theme, 'design_tokens.colors.muted', defaultVariables.muted),
        mutedForeground: safeGet(theme, 'design_tokens.colors.mutedForeground', defaultVariables.mutedForeground),
        accent: safeGet(theme, 'design_tokens.colors.accent', defaultVariables.accent),
        accentForeground: safeGet(theme, 'design_tokens.colors.accentForeground', defaultVariables.accentForeground),
        destructive: safeGet(theme, 'design_tokens.colors.destructive', defaultVariables.destructive),
        destructiveForeground: safeGet(theme, 'design_tokens.colors.destructiveForeground', defaultVariables.destructiveForeground),
        border: safeGet(theme, 'design_tokens.colors.border', defaultVariables.border),
        input: safeGet(theme, 'design_tokens.colors.input', defaultVariables.input),
        ring: safeGet(theme, 'design_tokens.colors.ring', defaultVariables.ring),
        
        // Effect colors
        effectColor: safeGet(theme, 'design_tokens.effects.primary', defaultVariables.effectColor),
        effectSecondary: safeGet(theme, 'design_tokens.effects.secondary', defaultVariables.effectSecondary),
        effectTertiary: safeGet(theme, 'design_tokens.effects.tertiary', defaultVariables.effectTertiary),
        
        // Timing variables
        transitionFast: safeGet(theme, 'design_tokens.animation.durations.fast', defaultVariables.transitionFast),
        transitionNormal: safeGet(theme, 'design_tokens.animation.durations.normal', defaultVariables.transitionNormal),
        transitionSlow: safeGet(theme, 'design_tokens.animation.durations.slow', defaultVariables.transitionSlow),
        animationFast: safeGet(theme, 'design_tokens.animation.durations.animationFast', defaultVariables.animationFast),
        animationNormal: safeGet(theme, 'design_tokens.animation.durations.animationNormal', defaultVariables.animationNormal),
        animationSlow: safeGet(theme, 'design_tokens.animation.durations.animationSlow', defaultVariables.animationSlow),
        
        // Border radius variables
        radiusSm: defaultVariables.radiusSm,
        radiusMd: defaultVariables.radiusMd,
        radiusLg: defaultVariables.radiusLg,
        radiusFull: defaultVariables.radiusFull
      };
    } catch (error) {
      console.error('Error extracting theme variables:', error);
      return defaultVariables;
    }
  }, [theme]);
}
