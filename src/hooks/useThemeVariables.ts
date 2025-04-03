
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
      // Safely get design tokens or use empty object if not found
      const designTokens = theme.design_tokens || {};
      
      // Helper to safely get a property with a fallback
      const getTokenValue = (path: string, fallback: string): string => {
        try {
          const parts = path.split('.');
          let value: any = designTokens;
          
          for (const part of parts) {
            if (value === undefined || value === null) return fallback;
            value = value[part];
          }
          
          // Return fallback for non-string values to prevent startsWith errors
          return typeof value === 'string' ? value : fallback;
        } catch {
          return fallback;
        }
      };
      
      // Get the values or use defaults
      return {
        background: getTokenValue('colors.background.main', defaultThemeVariables.background),
        foreground: getTokenValue('colors.text.primary', defaultThemeVariables.foreground),
        card: getTokenValue('colors.background.card', defaultThemeVariables.card),
        cardForeground: getTokenValue('colors.text.primary', defaultThemeVariables.cardForeground),
        primary: getTokenValue('colors.primary', defaultThemeVariables.primary),
        primaryForeground: getTokenValue('colors.text.primary', defaultThemeVariables.primaryForeground),
        secondary: getTokenValue('colors.secondary', defaultThemeVariables.secondary),
        secondaryForeground: getTokenValue('colors.text.primary', defaultThemeVariables.secondaryForeground),
        muted: getTokenValue('colors.text.secondary', defaultThemeVariables.muted),
        mutedForeground: getTokenValue('colors.text.muted', defaultThemeVariables.mutedForeground),
        accent: getTokenValue('colors.accent', defaultThemeVariables.accent),
        accentForeground: getTokenValue('colors.text.primary', defaultThemeVariables.accentForeground),
        destructive: getTokenValue('colors.status.error', defaultThemeVariables.destructive),
        destructiveForeground: getTokenValue('colors.text.primary', defaultThemeVariables.destructiveForeground),
        border: getTokenValue('colors.borders.normal', defaultThemeVariables.border),
        input: getTokenValue('colors.input', defaultThemeVariables.input),
        ring: getTokenValue('colors.ring', defaultThemeVariables.ring),
        
        // Effect colors
        effectColor: getTokenValue('colors.primary', defaultThemeVariables.effectColor),
        effectSecondary: getTokenValue('colors.secondary', defaultThemeVariables.effectSecondary),
        effectTertiary: getTokenValue('colors.accent', defaultThemeVariables.effectTertiary),
        
        // Timing values
        transitionFast: getTokenValue('animation.durations.fast', defaultThemeVariables.transitionFast),
        transitionNormal: getTokenValue('animation.durations.normal', defaultThemeVariables.transitionNormal),
        transitionSlow: getTokenValue('animation.durations.slow', defaultThemeVariables.transitionSlow),
        animationFast: getTokenValue('animation.durations.animationFast', defaultThemeVariables.animationFast),
        animationNormal: getTokenValue('animation.durations.animationNormal', defaultThemeVariables.animationNormal),
        animationSlow: getTokenValue('animation.durations.animationSlow', defaultThemeVariables.animationSlow),
        
        // Radius values
        radiusSm: getTokenValue('spacing.radius.sm', defaultThemeVariables.radiusSm),
        radiusMd: getTokenValue('spacing.radius.md', defaultThemeVariables.radiusMd),
        radiusLg: getTokenValue('spacing.radius.lg', defaultThemeVariables.radiusLg),
        radiusFull: getTokenValue('spacing.radius.full', defaultThemeVariables.radiusFull)
      };
    } catch (error) {
      logger.error('Error extracting theme variables', { details: safeDetails(error) });
      return defaultThemeVariables;
    }
  }, [theme, logger]);
}
