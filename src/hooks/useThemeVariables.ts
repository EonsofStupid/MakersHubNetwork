
import { useMemo } from 'react';
import { Theme } from '@/types/theme';
import defaultTheme from '@/theme/defaultTheme';

export interface ThemeVariables {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  card: string;
  cardForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;
  effectColor: string;
  effectSecondary: string;
  effectTertiary: string;
  transitionFast: string;
  transitionNormal: string;
  transitionSlow: string;
  animationFast: string;
  animationNormal: string;
  animationSlow: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusFull: string;
}

export function useThemeVariables(theme: Theme | null): ThemeVariables {
  return useMemo(() => {
    // Start with default theme as fallback
    const defaults = { ...defaultTheme };
    
    if (!theme || !theme.design_tokens?.colors) {
      return {
        primary: defaults.primary,
        primaryForeground: defaults.foreground,
        secondary: defaults.secondary, 
        secondaryForeground: defaults.foreground,
        background: defaults.background,
        foreground: defaults.foreground,
        muted: defaults.muted,
        mutedForeground: defaults.mutedForeground,
        accent: defaults.accent,
        accentForeground: defaults.foreground,
        card: defaults.card,
        cardForeground: defaults.cardForeground,
        border: defaults.border,
        input: defaults.input,
        ring: defaults.ring,
        destructive: "0 84.2% 60.2%",
        destructiveForeground: defaults.foreground,
        effectColor: defaults.effectPrimary,
        effectSecondary: defaults.effectSecondary,
        effectTertiary: defaults.effectTertiary,
        transitionFast: defaults.transitionFast,
        transitionNormal: defaults.transitionNormal,
        transitionSlow: defaults.transitionSlow,
        animationFast: "1s",
        animationNormal: "2s",
        animationSlow: "3s",
        radiusSm: defaults.radiusSm,
        radiusMd: defaults.radiusMd,
        radiusLg: defaults.radiusLg,
        radiusFull: defaults.radiusFull,
      };
    }
    
    // Get colors from theme tokens or use defaults
    const colors = theme.design_tokens?.colors || {};
    const effects = theme.design_tokens?.effects || {};
    
    return {
      primary: colors.primary || defaults.primary,
      primaryForeground: colors.primaryForeground || defaults.foreground,
      secondary: colors.secondary || defaults.secondary,
      secondaryForeground: colors.secondaryForeground || defaults.foreground,
      background: colors.background || defaults.background,
      foreground: colors.foreground || defaults.foreground,
      muted: colors.muted || defaults.muted,
      mutedForeground: colors.mutedForeground || defaults.mutedForeground,
      accent: colors.accent || defaults.accent,
      accentForeground: colors.accentForeground || defaults.foreground,
      card: colors.card || defaults.card,
      cardForeground: colors.cardForeground || defaults.cardForeground,
      border: colors.border || defaults.border,
      input: colors.input || defaults.input,
      ring: colors.ring || defaults.ring,
      destructive: colors.destructive || "0 84.2% 60.2%",
      destructiveForeground: colors.destructiveForeground || defaults.foreground,
      effectColor: effects.primary || defaults.effectPrimary,
      effectSecondary: effects.secondary || defaults.effectSecondary,
      effectTertiary: effects.tertiary || defaults.effectTertiary,
      transitionFast: defaults.transitionFast,
      transitionNormal: defaults.transitionNormal,
      transitionSlow: defaults.transitionSlow,
      animationFast: "1s",
      animationNormal: "2s",
      animationSlow: "3s",
      radiusSm: defaults.radiusSm,
      radiusMd: defaults.radiusMd,
      radiusLg: defaults.radiusLg,
      radiusFull: defaults.radiusFull,
    };
  }, [theme]);
}
