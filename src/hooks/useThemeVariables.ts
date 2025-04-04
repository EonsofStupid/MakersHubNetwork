
import { useMemo } from 'react';
import { Theme } from '@/types/theme';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';
import { getThemeProperty, ensureStringValue } from '@/admin/theme/utils/themeUtils';

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
  const logger = getLogger('useThemeVariables', { category: LogCategory.THEME });
  
  return useMemo(() => {
    if (!theme) {
      logger.warn('No theme provided, using default variables', {
        category: LogCategory.THEME
      });
      return defaultThemeVariables;
    }
    
    try {
      // Use the safe getThemeProperty utility for all theme access with fallback
      return {
        background: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.background.main', defaultThemeVariables.background), defaultThemeVariables.background),
        foreground: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.text.primary', defaultThemeVariables.foreground), defaultThemeVariables.foreground),
        card: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.background.card', defaultThemeVariables.card), defaultThemeVariables.card),
        cardForeground: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.text.primary', defaultThemeVariables.cardForeground), defaultThemeVariables.cardForeground),
        primary: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.primary', defaultThemeVariables.primary), defaultThemeVariables.primary),
        primaryForeground: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.text.primary', defaultThemeVariables.primaryForeground), defaultThemeVariables.primaryForeground),
        secondary: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.secondary', defaultThemeVariables.secondary), defaultThemeVariables.secondary),
        secondaryForeground: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.text.primary', defaultThemeVariables.secondaryForeground), defaultThemeVariables.secondaryForeground),
        muted: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.text.secondary', defaultThemeVariables.muted), defaultThemeVariables.muted),
        mutedForeground: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.text.muted', defaultThemeVariables.mutedForeground), defaultThemeVariables.mutedForeground),
        accent: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.accent', defaultThemeVariables.accent), defaultThemeVariables.accent),
        accentForeground: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.text.primary', defaultThemeVariables.accentForeground), defaultThemeVariables.accentForeground),
        destructive: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.status.error', defaultThemeVariables.destructive), defaultThemeVariables.destructive),
        destructiveForeground: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.text.primary', defaultThemeVariables.destructiveForeground), defaultThemeVariables.destructiveForeground),
        border: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.borders.normal', defaultThemeVariables.border), defaultThemeVariables.border),
        input: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.input', defaultThemeVariables.input), defaultThemeVariables.input),
        ring: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.ring', defaultThemeVariables.ring), defaultThemeVariables.ring),
        
        // Effect colors
        effectColor: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.primary', defaultThemeVariables.effectColor), defaultThemeVariables.effectColor),
        effectSecondary: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.secondary', defaultThemeVariables.effectSecondary), defaultThemeVariables.effectSecondary),
        effectTertiary: ensureStringValue(getThemeProperty(theme, 'design_tokens.colors.accent', defaultThemeVariables.effectTertiary), defaultThemeVariables.effectTertiary),
        
        // Timing values
        transitionFast: ensureStringValue(getThemeProperty(theme, 'design_tokens.animation.durations.fast', defaultThemeVariables.transitionFast), defaultThemeVariables.transitionFast),
        transitionNormal: ensureStringValue(getThemeProperty(theme, 'design_tokens.animation.durations.normal', defaultThemeVariables.transitionNormal), defaultThemeVariables.transitionNormal),
        transitionSlow: ensureStringValue(getThemeProperty(theme, 'design_tokens.animation.durations.slow', defaultThemeVariables.transitionSlow), defaultThemeVariables.transitionSlow),
        animationFast: ensureStringValue(getThemeProperty(theme, 'design_tokens.animation.durations.animationFast', defaultThemeVariables.animationFast), defaultThemeVariables.animationFast),
        animationNormal: ensureStringValue(getThemeProperty(theme, 'design_tokens.animation.durations.animationNormal', defaultThemeVariables.animationNormal), defaultThemeVariables.animationNormal),
        animationSlow: ensureStringValue(getThemeProperty(theme, 'design_tokens.animation.durations.animationSlow', defaultThemeVariables.animationSlow), defaultThemeVariables.animationSlow),
        
        // Radius values
        radiusSm: ensureStringValue(getThemeProperty(theme, 'design_tokens.spacing.radius.sm', defaultThemeVariables.radiusSm), defaultThemeVariables.radiusSm),
        radiusMd: ensureStringValue(getThemeProperty(theme, 'design_tokens.spacing.radius.md', defaultThemeVariables.radiusMd), defaultThemeVariables.radiusMd),
        radiusLg: ensureStringValue(getThemeProperty(theme, 'design_tokens.spacing.radius.lg', defaultThemeVariables.radiusLg), defaultThemeVariables.radiusLg),
        radiusFull: ensureStringValue(getThemeProperty(theme, 'design_tokens.spacing.radius.full', defaultThemeVariables.radiusFull), defaultThemeVariables.radiusFull)
      };
    } catch (error) {
      logger.error('Error extracting theme variables', { 
        category: LogCategory.THEME,
        details: safeDetails(error) 
      });
      return defaultThemeVariables;
    }
  }, [theme, logger]);
}
