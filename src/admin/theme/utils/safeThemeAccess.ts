
import { ImpulseTheme } from '../types/impulse.types';

/**
 * Safely get a property from a theme object, with a fallback value
 */
export function getThemeProperty<T>(
  theme: Partial<ImpulseTheme> | null | undefined,
  path: string,
  fallback: T
): T {
  if (!theme) return fallback;
  
  const parts = path.split('.');
  let current: any = theme;
  
  for (const part of parts) {
    if (current === undefined || current === null) {
      return fallback;
    }
    current = current[part];
  }
  
  return current !== undefined && current !== null ? current : fallback;
}

/**
 * Convert a theme object to CSS variables
 */
export function themeToVariables(theme: Partial<ImpulseTheme>): Record<string, string> {
  const variables: Record<string, string> = {};
  
  // Handle colors
  if (theme.colors) {
    variables['--impulse-primary'] = theme.colors.primary || '#00F0FF';
    variables['--impulse-secondary'] = theme.colors.secondary || '#FF2D6E';
    variables['--impulse-accent'] = theme.colors.accent || theme.colors.secondary || '#FF2D6E';
    
    if (theme.colors.background) {
      variables['--impulse-bg-main'] = theme.colors.background.main || '#12121A';
      variables['--impulse-bg-overlay'] = theme.colors.background.overlay || 'rgba(22, 22, 26, 0.5)';
      variables['--impulse-bg-card'] = theme.colors.background.card || 'rgba(28, 32, 42, 0.7)';
      variables['--impulse-bg-alt'] = theme.colors.background.alt || '#17181F';
    }
    
    if (theme.colors.text) {
      variables['--impulse-text-primary'] = theme.colors.text.primary || '#F6F6F7';
      variables['--impulse-text-secondary'] = theme.colors.text.secondary || 'rgba(255, 255, 255, 0.7)';
      variables['--impulse-text-accent'] = theme.colors.text.accent || theme.colors.primary || '#00F0FF';
      variables['--impulse-text-muted'] = theme.colors.text.muted || 'rgba(255, 255, 255, 0.5)';
    }
    
    if (theme.colors.borders) {
      variables['--impulse-border-normal'] = theme.colors.borders.normal || 'rgba(0, 240, 255, 0.2)';
      variables['--impulse-border-hover'] = theme.colors.borders.hover || 'rgba(0, 240, 255, 0.4)';
      variables['--impulse-border-active'] = theme.colors.borders.active || theme.colors.primary || '#00F0FF';
      variables['--impulse-border-focus'] = theme.colors.borders.focus || 'rgba(0, 240, 255, 0.6)';
    }
  }
  
  // Handle effects
  if (theme.effects) {
    if (theme.effects.glow) {
      variables['--impulse-glow-primary'] = theme.effects.glow.primary || '0 0 15px var(--impulse-primary)';
      variables['--impulse-glow-secondary'] = theme.effects.glow.secondary || '0 0 15px var(--impulse-secondary)';
      variables['--impulse-glow-hover'] = theme.effects.glow.hover || '0 0 20px var(--impulse-primary)';
    }
  }
  
  // Handle animations
  if (theme.animation) {
    if (theme.animation.duration) {
      variables['--impulse-duration-fast'] = theme.animation.duration.fast || '150ms';
      variables['--impulse-duration-normal'] = theme.animation.duration.normal || '300ms';
      variables['--impulse-duration-slow'] = theme.animation.duration.slow || '500ms';
    }
  }
  
  return variables;
}
