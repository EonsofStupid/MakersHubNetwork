
import { ImpulseTheme } from "../../types/impulse.types";
import { themeRegistry } from "../ThemeRegistry";
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { getThemeProperty } from "./themeUtils";

const logger = getLogger('ThemeApplicator', { category: LogCategory.THEME });

/**
 * Apply theme to document by setting CSS variables
 */
export function applyThemeToDocument(themeIdOrTheme: string | ImpulseTheme): void {
  try {
    // Get the theme object
    const theme = typeof themeIdOrTheme === 'string'
      ? themeRegistry.getTheme(themeIdOrTheme)
      : themeIdOrTheme;
    
    if (!theme) {
      logger.warn('No theme provided to apply, using default', { 
        details: { theme: typeof themeIdOrTheme === 'string' ? themeIdOrTheme : 'object' } 
      });
      applyThemeToDocument(themeRegistry.getDefaultTheme());
      return;
    }
    
    // Set theme ID data attribute
    const themeId = typeof themeIdOrTheme === 'string' ? themeIdOrTheme : theme.id || 'custom';
    document.documentElement.setAttribute('data-theme', themeId);
    
    // Set basic colors on documentElement directly for immediate styling
    document.documentElement.style.backgroundColor = getThemeProperty(theme, 'colors.background.main', '#000000');
    document.documentElement.style.color = getThemeProperty(theme, 'colors.text.primary', '#ffffff');
    document.body.style.backgroundColor = getThemeProperty(theme, 'colors.background.main', '#000000');
    document.body.style.color = getThemeProperty(theme, 'colors.text.primary', '#ffffff');
    
    // Apply all theme variables as CSS custom properties
    
    // Colors 
    setThemeProperty('--color-bg-main', getThemeProperty(theme, 'colors.background.main', '#000000'));
    setThemeProperty('--color-bg-card', getThemeProperty(theme, 'colors.background.card', 'rgba(17, 17, 17, 0.7)'));
    setThemeProperty('--color-bg-overlay', getThemeProperty(theme, 'colors.background.overlay', 'rgba(0, 0, 0, 0.5)'));
    setThemeProperty('--color-bg-alt', getThemeProperty(theme, 'colors.background.alt', '#0f0f0f'));
    
    // Text colors
    setThemeProperty('--color-text-primary', getThemeProperty(theme, 'colors.text.primary', '#ffffff'));
    setThemeProperty('--color-text-secondary', getThemeProperty(theme, 'colors.text.secondary', 'rgba(255, 255, 255, 0.7)'));
    setThemeProperty('--color-text-accent', getThemeProperty(theme, 'colors.text.accent', '#00F0FF'));
    setThemeProperty('--color-text-muted', getThemeProperty(theme, 'colors.text.muted', 'rgba(255, 255, 255, 0.5)'));
    
    // Border colors
    setThemeProperty('--color-border-normal', getThemeProperty(theme, 'colors.borders.normal', 'rgba(255, 255, 255, 0.1)'));
    setThemeProperty('--color-border-hover', getThemeProperty(theme, 'colors.borders.hover', 'rgba(255, 255, 255, 0.2)'));
    setThemeProperty('--color-border-active', getThemeProperty(theme, 'colors.borders.active', 'rgba(255, 255, 255, 0.3)'));
    setThemeProperty('--color-border-focus', getThemeProperty(theme, 'colors.borders.focus', getThemeProperty(theme, 'colors.borders.hover', 'rgba(255, 255, 255, 0.2)')));
    
    // Status colors
    setThemeProperty('--color-status-success', getThemeProperty(theme, 'colors.status.success', '#10B981'));
    setThemeProperty('--color-status-warning', getThemeProperty(theme, 'colors.status.warning', '#F59E0B'));
    setThemeProperty('--color-status-error', getThemeProperty(theme, 'colors.status.error', '#EF4444'));
    setThemeProperty('--color-status-info', getThemeProperty(theme, 'colors.status.info', '#3B82F6'));
    
    // Brand colors
    setThemeProperty('--color-primary', getThemeProperty(theme, 'colors.primary', '#00F0FF'));
    setThemeProperty('--color-secondary', getThemeProperty(theme, 'colors.secondary', '#FF2D6E'));
    setThemeProperty('--color-accent', getThemeProperty(theme, 'colors.accent', '#8B5CF6'));
    
    // Effect styles
    
    // Glows
    setThemeProperty('--effect-glow-primary', getThemeProperty(theme, 'effects.glow.primary', '0 0 10px rgba(0, 240, 255, 0.7)'));
    setThemeProperty('--effect-glow-secondary', getThemeProperty(theme, 'effects.glow.secondary', '0 0 10px rgba(255, 45, 110, 0.7)'));
    setThemeProperty('--effect-glow-hover', getThemeProperty(theme, 'effects.glow.hover', '0 0 15px rgba(0, 240, 255, 0.9)'));
    
    // Gradients
    setThemeProperty('--effect-gradient-primary', getThemeProperty(theme, 'effects.gradients.primary', 'linear-gradient(90deg, #00F0FF, #00F0FF44)'));
    setThemeProperty('--effect-gradient-secondary', getThemeProperty(theme, 'effects.gradients.secondary', 'linear-gradient(90deg, #FF2D6E, #FF2D6E44)'));
    setThemeProperty('--effect-gradient-accent', getThemeProperty(theme, 'effects.gradients.accent', 'linear-gradient(90deg, #8B5CF6, #8B5CF644)'));
    
    // Shadows
    setThemeProperty('--effect-shadow-small', getThemeProperty(theme, 'effects.shadows.small', '0 2px 4px rgba(0,0,0,0.1)'));
    setThemeProperty('--effect-shadow-medium', getThemeProperty(theme, 'effects.shadows.medium', '0 4px 6px rgba(0,0,0,0.1)'));
    setThemeProperty('--effect-shadow-large', getThemeProperty(theme, 'effects.shadows.large', '0 10px 15px rgba(0,0,0,0.1)'));
    setThemeProperty('--effect-shadow-inner', getThemeProperty(theme, 'effects.shadows.inner', 'inset 0 2px 4px rgba(0,0,0,0.1)'));
    
    // Animation
    
    // Durations
    setThemeProperty('--animation-duration-fast', getThemeProperty(theme, 'animation.duration.fast', '150ms'));
    setThemeProperty('--animation-duration-normal', getThemeProperty(theme, 'animation.duration.normal', '300ms'));
    setThemeProperty('--animation-duration-slow', getThemeProperty(theme, 'animation.duration.slow', '500ms'));
    
    // Curves
    setThemeProperty('--animation-curve-bounce', getThemeProperty(theme, 'animation.curves.bounce', 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'));
    setThemeProperty('--animation-curve-ease', getThemeProperty(theme, 'animation.curves.ease', 'cubic-bezier(0.4, 0, 0.2, 1)'));
    setThemeProperty('--animation-curve-spring', getThemeProperty(theme, 'animation.curves.spring', 'cubic-bezier(0.43, 0.13, 0.23, 0.96)'));
    setThemeProperty('--animation-curve-linear', getThemeProperty(theme, 'animation.curves.linear', 'linear'));
    
    // Keyframes are handled separately in DynamicKeyframes
    
    // Component styles
    
    // Panel
    setThemeProperty('--component-panel-radius', getThemeProperty(theme, 'components.panel.radius', '0.75rem'));
    setThemeProperty('--component-panel-padding', getThemeProperty(theme, 'components.panel.padding', '1.5rem'));
    setThemeProperty('--component-panel-bg', getThemeProperty(theme, 'components.panel.background', getThemeProperty(theme, 'colors.background.card', '#111111')));
    
    // Button
    setThemeProperty('--component-button-radius', getThemeProperty(theme, 'components.button.radius', '0.5rem'));
    setThemeProperty('--component-button-padding', getThemeProperty(theme, 'components.button.padding', '0.5rem 1rem'));
    setThemeProperty('--component-button-transition', getThemeProperty(theme, 'components.button.transition', 'all 300ms ease'));
    
    // Tooltip
    setThemeProperty('--component-tooltip-radius', getThemeProperty(theme, 'components.tooltip.radius', '0.25rem'));
    setThemeProperty('--component-tooltip-padding', getThemeProperty(theme, 'components.tooltip.padding', '0.5rem'));
    setThemeProperty('--component-tooltip-bg', getThemeProperty(theme, 'components.tooltip.background', 'rgba(0, 0, 0, 0.8)'));
    
    // Input
    setThemeProperty('--component-input-radius', getThemeProperty(theme, 'components.input.radius', '0.5rem'));
    setThemeProperty('--component-input-padding', getThemeProperty(theme, 'components.input.padding', '0.5rem 0.75rem'));
    setThemeProperty('--component-input-bg', getThemeProperty(theme, 'components.input.background', 'rgba(0, 0, 0, 0.2)'));
    
    // Apply typography
    if (theme.typography) {
      // Fonts
      setThemeProperty('--font-family-body', getThemeProperty(theme, 'typography.fonts.body', 'system-ui, sans-serif'));
      setThemeProperty('--font-family-heading', getThemeProperty(theme, 'typography.fonts.heading', 'system-ui, sans-serif'));
      setThemeProperty('--font-family-mono', getThemeProperty(theme, 'typography.fonts.monospace', 'monospace'));
      
      // Font sizes
      setThemeProperty('--font-size-xs', getThemeProperty(theme, 'typography.sizes.xs', '0.75rem'));
      setThemeProperty('--font-size-sm', getThemeProperty(theme, 'typography.sizes.sm', '0.875rem'));
      setThemeProperty('--font-size-md', getThemeProperty(theme, 'typography.sizes.md', '1rem'));
      setThemeProperty('--font-size-lg', getThemeProperty(theme, 'typography.sizes.lg', '1.125rem'));
      setThemeProperty('--font-size-xl', getThemeProperty(theme, 'typography.sizes.xl', '1.25rem'));
      setThemeProperty('--font-size-2xl', getThemeProperty(theme, 'typography.sizes.2xl', '1.5rem'));
      setThemeProperty('--font-size-3xl', getThemeProperty(theme, 'typography.sizes.3xl', '1.875rem'));
      
      // Font weights
      setThemeProperty('--font-weight-light', String(getThemeProperty(theme, 'typography.weights.light', 300)));
      setThemeProperty('--font-weight-normal', String(getThemeProperty(theme, 'typography.weights.normal', 400)));
      setThemeProperty('--font-weight-medium', String(getThemeProperty(theme, 'typography.weights.medium', 500)));
      setThemeProperty('--font-weight-bold', String(getThemeProperty(theme, 'typography.weights.bold', 700)));
      
      // Line heights
      setThemeProperty('--line-height-tight', getThemeProperty(theme, 'typography.lineHeights.tight', '1.25'));
      setThemeProperty('--line-height-normal', getThemeProperty(theme, 'typography.lineHeights.normal', '1.5'));
      setThemeProperty('--line-height-loose', getThemeProperty(theme, 'typography.lineHeights.loose', '2'));
    }
    
    // Apply HSL values for colors that support alpha variations
    // Convert HEX to RGB
    const primaryRgb = hexToRgbString(getThemeProperty(theme, 'colors.primary', '#00F0FF'));
    const secondaryRgb = hexToRgbString(getThemeProperty(theme, 'colors.secondary', '#FF2D6E'));
    const textRgb = hexToRgbString(getThemeProperty(theme, 'colors.text.primary', '#ffffff'));
    const bgRgb = hexToRgbString(getThemeProperty(theme, 'colors.background.main', '#000000'));
    
    setThemeProperty('--color-primary-rgb', primaryRgb);
    setThemeProperty('--color-secondary-rgb', secondaryRgb);
    setThemeProperty('--color-text-rgb', textRgb);
    setThemeProperty('--color-bg-rgb', bgRgb);
    
    logger.debug('Theme applied successfully');
  } catch (error) {
    logger.error('Error applying theme', { details: { error } });
  }
}

/**
 * Helper function to set CSS variable
 */
function setThemeProperty(name: string, value: string | number | undefined | null): void {
  if (value === undefined || value === null) return;
  document.documentElement.style.setProperty(name, String(value));
}

/**
 * Convert hex to RGB
 */
export function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  if (!hex) return null;
  
  // Default fallback
  const fallback = { r: 0, g: 0, b: 0 };
  
  // Handle different hex formats
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (result) {
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }
  
  // Handle shorthand hex format (#FFF)
  const shorthandResult = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex.trim());
  if (shorthandResult) {
    return {
      r: parseInt(shorthandResult[1] + shorthandResult[1], 16),
      g: parseInt(shorthandResult[2] + shorthandResult[2], 16),
      b: parseInt(shorthandResult[3] + shorthandResult[3], 16)
    };
  }
  
  return fallback;
}

/**
 * Convert hex to RGB string format (e.g., "255, 255, 255")
 */
export function hexToRgbString(hex: string): string {
  const rgb = hexToRgb(hex);
  return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '0, 0, 0';
}

/**
 * Convert hex to RGBA
 */
export function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` : `rgba(0, 0, 0, ${alpha})`;
}
