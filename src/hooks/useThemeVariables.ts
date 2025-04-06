
import { useMemo } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { Theme } from '@/types/theme';

export interface ThemeVariables {
  // Colors
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
  
  // Effects
  effectColor: string;
  effectSecondary: string;
  effectTertiary: string;
  
  // Timing
  transitionFast: string;
  transitionNormal: string;
  transitionSlow: string;
  animationFast: string;
  animationNormal: string;
  animationSlow: string;
  
  // Radius
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusFull: string;
}

// Default theme variables
const defaultVariables: ThemeVariables = {
  // Colors
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
  
  // Effects
  effectColor: '#00F0FF',
  effectSecondary: '#FF2D6E',
  effectTertiary: '#8B5CF6',
  
  // Timing
  transitionFast: '150ms',
  transitionNormal: '300ms',
  transitionSlow: '500ms',
  animationFast: '1s',
  animationNormal: '2s',
  animationSlow: '3s',
  
  // Radius
  radiusSm: '0.25rem',
  radiusMd: '0.5rem',
  radiusLg: '0.75rem',
  radiusFull: '9999px'
};

/**
 * Extract theme variables from the current theme or use defaults
 */
export function useThemeVariables(theme?: Theme | null): ThemeVariables {
  const { currentTheme } = useThemeStore();
  
  const activeTheme = theme || currentTheme;
  
  return useMemo(() => {
    if (!activeTheme || !activeTheme.design_tokens) {
      return defaultVariables;
    }
    
    try {
      const tokens = activeTheme.design_tokens;
      const colors = tokens.colors || {};
      const effects = tokens.effects || {};
      const animation = tokens.animation?.durations || {};
      
      return {
        // Colors
        background: colors.background?.toString() || defaultVariables.background,
        foreground: colors.foreground?.toString() || defaultVariables.foreground,
        card: colors.card?.toString() || defaultVariables.card,
        cardForeground: colors.cardForeground?.toString() || defaultVariables.cardForeground,
        primary: colors.primary?.toString() || defaultVariables.primary,
        primaryForeground: colors.primaryForeground?.toString() || defaultVariables.primaryForeground,
        secondary: colors.secondary?.toString() || defaultVariables.secondary,
        secondaryForeground: colors.secondaryForeground?.toString() || defaultVariables.secondaryForeground,
        muted: colors.muted?.toString() || defaultVariables.muted,
        mutedForeground: colors.mutedForeground?.toString() || defaultVariables.mutedForeground,
        accent: colors.accent?.toString() || defaultVariables.accent,
        accentForeground: colors.accentForeground?.toString() || defaultVariables.accentForeground,
        destructive: colors.destructive?.toString() || defaultVariables.destructive,
        destructiveForeground: colors.destructiveForeground?.toString() || defaultVariables.destructiveForeground,
        border: colors.border?.toString() || defaultVariables.border,
        input: colors.input?.toString() || defaultVariables.input,
        ring: colors.ring?.toString() || defaultVariables.ring,
        
        // Effects
        effectColor: effects.primary?.toString() || defaultVariables.effectColor,
        effectSecondary: effects.secondary?.toString() || defaultVariables.effectSecondary,
        effectTertiary: effects.tertiary?.toString() || defaultVariables.effectTertiary,
        
        // Timing
        transitionFast: animation.fast?.toString() || defaultVariables.transitionFast,
        transitionNormal: animation.normal?.toString() || defaultVariables.transitionNormal,
        transitionSlow: animation.slow?.toString() || defaultVariables.transitionSlow,
        animationFast: animation.animationFast?.toString() || defaultVariables.animationFast,
        animationNormal: animation.animationNormal?.toString() || defaultVariables.animationNormal,
        animationSlow: animation.animationSlow?.toString() || defaultVariables.animationSlow,
        
        // Radius
        radiusSm: '0.25rem',
        radiusMd: '0.5rem',
        radiusLg: '0.75rem',
        radiusFull: '9999px'
      };
    } catch (error) {
      console.error('Error extracting theme variables', error);
      return defaultVariables;
    }
  }, [activeTheme]);
}
