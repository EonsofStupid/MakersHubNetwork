
import { useMemo } from 'react';
import { Theme } from '@/types/theme';
import { getLogger } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';

export interface ThemeVariables {
  // Base colors
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

// Default fallback values when theme isn't loaded - match Impulsivity theme
const defaultThemeVariables: ThemeVariables = {
  background: '#12121A',
  foreground: '#F6F6F7',
  card: 'rgba(28, 32, 42, 0.7)',
  cardForeground: '#F6F6F7',
  primary: '#00F0FF',
  primaryForeground: '#F6F6F7',
  secondary: '#FF2D6E',
  secondaryForeground: '#F6F6F7',
  muted: 'rgba(255, 255, 255, 0.7)', 
  mutedForeground: 'rgba(255, 255, 255, 0.5)',
  accent: '#131D35',
  accentForeground: '#F6F6F7',
  destructive: '#EF4444',
  destructiveForeground: '#F6F6F7',
  border: 'rgba(0, 240, 255, 0.2)',
  input: '#131D35',
  ring: '#1E293B',
  
  // Effect colors
  effectColor: '#00F0FF',
  effectSecondary: '#FF2D6E',
  effectTertiary: '#8B5CF6',
  
  // Timing values
  transitionFast: '150ms',
  transitionNormal: '300ms',
  transitionSlow: '500ms',
  animationFast: '1s',
  animationNormal: '2s',
  animationSlow: '3s',
  
  // Radius values
  radiusSm: '0.25rem',
  radiusMd: '0.5rem',
  radiusLg: '0.75rem',
  radiusFull: '9999px'
};

export function useThemeVariables(theme: Theme | null): ThemeVariables {
  const logger = getLogger('useThemeVariables');
  
  return useMemo(() => {
    if (!theme) {
      logger.warn('No theme provided, using default variables');
      return defaultThemeVariables;
    }
    
    try {
      const designTokens = theme.design_tokens as Record<string, any>;
      
      // Get the values or use defaults
      return {
        background: designTokens?.colors?.background || defaultThemeVariables.background,
        foreground: designTokens?.colors?.foreground || defaultThemeVariables.foreground,
        card: designTokens?.colors?.card || defaultThemeVariables.card,
        cardForeground: designTokens?.colors?.cardForeground || defaultThemeVariables.cardForeground,
        primary: designTokens?.colors?.primary || defaultThemeVariables.primary,
        primaryForeground: designTokens?.colors?.primaryForeground || defaultThemeVariables.primaryForeground,
        secondary: designTokens?.colors?.secondary || defaultThemeVariables.secondary,
        secondaryForeground: designTokens?.colors?.secondaryForeground || defaultThemeVariables.secondaryForeground,
        muted: designTokens?.colors?.muted || defaultThemeVariables.muted,
        mutedForeground: designTokens?.colors?.mutedForeground || defaultThemeVariables.mutedForeground,
        accent: designTokens?.colors?.accent || defaultThemeVariables.accent,
        accentForeground: designTokens?.colors?.accentForeground || defaultThemeVariables.accentForeground,
        destructive: designTokens?.colors?.destructive || defaultThemeVariables.destructive,
        destructiveForeground: designTokens?.colors?.destructiveForeground || defaultThemeVariables.destructiveForeground,
        border: designTokens?.colors?.border || defaultThemeVariables.border,
        input: designTokens?.colors?.input || defaultThemeVariables.input,
        ring: designTokens?.colors?.ring || defaultThemeVariables.ring,
        
        // Effect colors
        effectColor: designTokens?.effects?.primary || defaultThemeVariables.effectColor,
        effectSecondary: designTokens?.effects?.secondary || defaultThemeVariables.effectSecondary,
        effectTertiary: designTokens?.effects?.tertiary || defaultThemeVariables.effectTertiary,
        
        // Timing values
        transitionFast: designTokens?.animation?.durations?.fast || defaultThemeVariables.transitionFast,
        transitionNormal: designTokens?.animation?.durations?.normal || defaultThemeVariables.transitionNormal,
        transitionSlow: designTokens?.animation?.durations?.slow || defaultThemeVariables.transitionSlow,
        animationFast: designTokens?.animation?.durations?.animationFast || defaultThemeVariables.animationFast,
        animationNormal: designTokens?.animation?.durations?.animationNormal || defaultThemeVariables.animationNormal,
        animationSlow: designTokens?.animation?.durations?.animationSlow || defaultThemeVariables.animationSlow,
        
        // Radius values
        radiusSm: designTokens?.spacing?.radius?.sm || defaultThemeVariables.radiusSm,
        radiusMd: designTokens?.spacing?.radius?.md || defaultThemeVariables.radiusMd,
        radiusLg: designTokens?.spacing?.radius?.lg || defaultThemeVariables.radiusLg,
        radiusFull: designTokens?.spacing?.radius?.full || defaultThemeVariables.radiusFull
      };
    } catch (error) {
      logger.error('Error extracting theme variables', { details: safeDetails(error) });
      return defaultThemeVariables;
    }
  }, [theme, logger]);
}
