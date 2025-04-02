
import { useMemo } from 'react';
import { Theme } from '@/types/theme';
import { getLogger } from '@/logging';

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

// Default fallback values when theme isn't loaded
const defaultThemeVariables: ThemeVariables = {
  background: '#080F1E',
  foreground: '#F9FAFB',
  card: '#0E172A',
  cardForeground: '#F9FAFB',
  primary: '#00F0FF',
  primaryForeground: '#F9FAFB',
  secondary: '#FF2D6E',
  secondaryForeground: '#F9FAFB',
  muted: '#131D35',
  mutedForeground: '#94A3B8',
  accent: '#131D35',
  accentForeground: '#F9FAFB',
  destructive: '#EF4444',
  destructiveForeground: '#F9FAFB',
  border: '#131D35',
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
      
      // Safe access helper function
      const getPath = (obj: any, path: string, defaultValue: any) => {
        const keys = path.split('.');
        let result = obj;
        
        for (const key of keys) {
          if (result && typeof result === 'object' && key in result) {
            result = result[key];
          } else {
            return defaultValue;
          }
        }
        
        return result || defaultValue;
      };
      
      // Extract values with proper fallbacks
      const variables: ThemeVariables = {
        // Base colors
        background: getPath(designTokens, 'colors.background', defaultThemeVariables.background),
        foreground: getPath(designTokens, 'colors.foreground', defaultThemeVariables.foreground),
        card: getPath(designTokens, 'colors.card', defaultThemeVariables.card),
        cardForeground: getPath(designTokens, 'colors.cardForeground', defaultThemeVariables.cardForeground),
        primary: getPath(designTokens, 'colors.primary', defaultThemeVariables.primary),
        primaryForeground: getPath(designTokens, 'colors.primaryForeground', defaultThemeVariables.primaryForeground),
        secondary: getPath(designTokens, 'colors.secondary', defaultThemeVariables.secondary),
        secondaryForeground: getPath(designTokens, 'colors.secondaryForeground', defaultThemeVariables.secondaryForeground),
        muted: getPath(designTokens, 'colors.muted', defaultThemeVariables.muted),
        mutedForeground: getPath(designTokens, 'colors.mutedForeground', defaultThemeVariables.mutedForeground),
        accent: getPath(designTokens, 'colors.accent', defaultThemeVariables.accent),
        accentForeground: getPath(designTokens, 'colors.accentForeground', defaultThemeVariables.accentForeground),
        destructive: getPath(designTokens, 'colors.destructive', defaultThemeVariables.destructive),
        destructiveForeground: getPath(designTokens, 'colors.destructiveForeground', defaultThemeVariables.destructiveForeground),
        border: getPath(designTokens, 'colors.border', defaultThemeVariables.border),
        input: getPath(designTokens, 'colors.input', defaultThemeVariables.input),
        ring: getPath(designTokens, 'colors.ring', defaultThemeVariables.ring),
        
        // Effect colors
        effectColor: getPath(designTokens, 'effects.primary', defaultThemeVariables.effectColor),
        effectSecondary: getPath(designTokens, 'effects.secondary', defaultThemeVariables.effectSecondary),
        effectTertiary: getPath(designTokens, 'effects.tertiary', defaultThemeVariables.effectTertiary),
        
        // Timing values
        transitionFast: getPath(designTokens, 'animation.durations.fast', defaultThemeVariables.transitionFast),
        transitionNormal: getPath(designTokens, 'animation.durations.normal', defaultThemeVariables.transitionNormal),
        transitionSlow: getPath(designTokens, 'animation.durations.slow', defaultThemeVariables.transitionSlow),
        animationFast: getPath(designTokens, 'animation.durations.animationFast', defaultThemeVariables.animationFast),
        animationNormal: getPath(designTokens, 'animation.durations.animationNormal', defaultThemeVariables.animationNormal),
        animationSlow: getPath(designTokens, 'animation.durations.animationSlow', defaultThemeVariables.animationSlow),
        
        // Radius values
        radiusSm: getPath(designTokens, 'spacing.radius.sm', defaultThemeVariables.radiusSm),
        radiusMd: getPath(designTokens, 'spacing.radius.md', defaultThemeVariables.radiusMd),
        radiusLg: getPath(designTokens, 'spacing.radius.lg', defaultThemeVariables.radiusLg),
        radiusFull: getPath(designTokens, 'spacing.radius.full', defaultThemeVariables.radiusFull)
      };
      
      logger.debug('Theme variables extracted successfully', {
        details: {
          themeId: theme.id,
          primaryColor: variables.primary
        }
      });
      
      return variables;
    } catch (error) {
      logger.error('Error extracting theme variables', { details: error });
      return defaultThemeVariables;
    }
  }, [theme, logger]);
}
