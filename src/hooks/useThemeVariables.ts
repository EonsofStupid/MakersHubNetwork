
import { useMemo } from 'react';
import { Theme } from '@/types/theme';
import { getLogger } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';
import { getThemeProperty } from '@/admin/theme/utils/themeUtils';

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
      // Use the safe getThemeProperty utility for all theme access
      return {
        background: getThemeProperty(theme, 'design_tokens.colors.background.main', defaultThemeVariables.background),
        foreground: getThemeProperty(theme, 'design_tokens.colors.text.primary', defaultThemeVariables.foreground),
        card: getThemeProperty(theme, 'design_tokens.colors.background.card', defaultThemeVariables.card),
        cardForeground: getThemeProperty(theme, 'design_tokens.colors.text.primary', defaultThemeVariables.cardForeground),
        primary: getThemeProperty(theme, 'design_tokens.colors.primary', defaultThemeVariables.primary),
        primaryForeground: getThemeProperty(theme, 'design_tokens.colors.text.primary', defaultThemeVariables.primaryForeground),
        secondary: getThemeProperty(theme, 'design_tokens.colors.secondary', defaultThemeVariables.secondary),
        secondaryForeground: getThemeProperty(theme, 'design_tokens.colors.text.primary', defaultThemeVariables.secondaryForeground),
        muted: getThemeProperty(theme, 'design_tokens.colors.text.secondary', defaultThemeVariables.muted),
        mutedForeground: getThemeProperty(theme, 'design_tokens.colors.text.muted', defaultThemeVariables.mutedForeground),
        accent: getThemeProperty(theme, 'design_tokens.colors.accent', defaultThemeVariables.accent),
        accentForeground: getThemeProperty(theme, 'design_tokens.colors.text.primary', defaultThemeVariables.accentForeground),
        destructive: getThemeProperty(theme, 'design_tokens.colors.status.error', defaultThemeVariables.destructive),
        destructiveForeground: getThemeProperty(theme, 'design_tokens.colors.text.primary', defaultThemeVariables.destructiveForeground),
        border: getThemeProperty(theme, 'design_tokens.colors.borders.normal', defaultThemeVariables.border),
        input: getThemeProperty(theme, 'design_tokens.colors.input', defaultThemeVariables.input),
        ring: getThemeProperty(theme, 'design_tokens.colors.ring', defaultThemeVariables.ring),
        
        // Effect colors
        effectColor: getThemeProperty(theme, 'design_tokens.colors.primary', defaultThemeVariables.effectColor),
        effectSecondary: getThemeProperty(theme, 'design_tokens.colors.secondary', defaultThemeVariables.effectSecondary),
        effectTertiary: getThemeProperty(theme, 'design_tokens.colors.accent', defaultThemeVariables.effectTertiary),
        
        // Timing values
        transitionFast: getThemeProperty(theme, 'design_tokens.animation.durations.fast', defaultThemeVariables.transitionFast),
        transitionNormal: getThemeProperty(theme, 'design_tokens.animation.durations.normal', defaultThemeVariables.transitionNormal),
        transitionSlow: getThemeProperty(theme, 'design_tokens.animation.durations.slow', defaultThemeVariables.transitionSlow),
        animationFast: getThemeProperty(theme, 'design_tokens.animation.durations.animationFast', defaultThemeVariables.animationFast),
        animationNormal: getThemeProperty(theme, 'design_tokens.animation.durations.animationNormal', defaultThemeVariables.animationNormal),
        animationSlow: getThemeProperty(theme, 'design_tokens.animation.durations.animationSlow', defaultThemeVariables.animationSlow),
        
        // Radius values
        radiusSm: getThemeProperty(theme, 'design_tokens.spacing.radius.sm', defaultThemeVariables.radiusSm),
        radiusMd: getThemeProperty(theme, 'design_tokens.spacing.radius.md', defaultThemeVariables.radiusMd),
        radiusLg: getThemeProperty(theme, 'design_tokens.spacing.radius.lg', defaultThemeVariables.radiusLg),
        radiusFull: getThemeProperty(theme, 'design_tokens.spacing.radius.full', defaultThemeVariables.radiusFull)
      };
    } catch (error) {
      logger.error('Error extracting theme variables', { details: safeDetails(error) });
      return defaultThemeVariables;
    }
  }, [theme, logger]);
}
