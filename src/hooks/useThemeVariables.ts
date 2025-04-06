
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
      // Extract colors from the theme
      const colors = theme.design_tokens?.colors || {};
      
      // Extract effects from the theme
      const effects = theme.design_tokens?.effects || { shadows: {}, blurs: {}, gradients: {} };
      
      // Extract animations from the theme with safer typing
      const animation = theme.design_tokens?.animation || { keyframes: {}, transitions: {}, durations: {} };
      
      // Ensure durations is initialized even if empty
      const durations = animation?.durations || {};
      
      return {
        // Colors
        background: colors.background || defaultVariables.background,
        foreground: colors.foreground || defaultVariables.foreground,
        card: colors.card || defaultVariables.card,
        cardForeground: colors.cardForeground || defaultVariables.cardForeground,
        primary: colors.primary || defaultVariables.primary,
        primaryForeground: colors.primaryForeground || defaultVariables.primaryForeground,
        secondary: colors.secondary || defaultVariables.secondary,
        secondaryForeground: colors.secondaryForeground || defaultVariables.secondaryForeground,
        muted: colors.muted || defaultVariables.muted,
        mutedForeground: colors.mutedForeground || defaultVariables.mutedForeground,
        accent: colors.accent || defaultVariables.accent,
        accentForeground: colors.accentForeground || defaultVariables.accentForeground,
        destructive: colors.destructive || defaultVariables.destructive,
        destructiveForeground: colors.destructiveForeground || defaultVariables.destructiveForeground,
        border: colors.border || defaultVariables.border,
        input: colors.input || defaultVariables.input,
        ring: colors.ring || defaultVariables.ring,
        
        // Effect colors
        effectColor: effects.primary || defaultVariables.effectColor,
        effectSecondary: effects.secondary || defaultVariables.effectSecondary,
        effectTertiary: effects.tertiary || defaultVariables.effectTertiary,
        
        // Timing variables - type safe access with fallbacks
        transitionFast: typeof durations.fast === 'string' ? durations.fast : defaultVariables.transitionFast,
        transitionNormal: typeof durations.normal === 'string' ? durations.normal : defaultVariables.transitionNormal,
        transitionSlow: typeof durations.slow === 'string' ? durations.slow : defaultVariables.transitionSlow,
        animationFast: typeof durations.animationFast === 'string' ? durations.animationFast : defaultVariables.animationFast,
        animationNormal: typeof durations.animationNormal === 'string' ? durations.animationNormal : defaultVariables.animationNormal,
        animationSlow: typeof durations.animationSlow === 'string' ? durations.animationSlow : defaultVariables.animationSlow,
        
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
