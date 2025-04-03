
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { ImpulseTheme } from '../../types/impulse.types';
import { themeRegistry } from '../ThemeRegistry';
import { safeGet } from './safeThemeAccess';

// Initialize logger
const logger = getLogger('ThemeApplicator', { category: LogCategory.THEME });

/**
 * Apply a theme to the document by setting CSS variables
 */
export function applyThemeToDocument(themeOrId: ImpulseTheme | string): void {
  try {
    // Get the theme from the registry if an ID was provided
    const theme = typeof themeOrId === 'string' 
      ? themeRegistry.getTheme(themeOrId)
      : themeOrId;
    
    if (!theme) {
      logger.warn('Theme not found, using default', { 
        details: { themeOrId: typeof themeOrId === 'string' ? themeOrId : 'object' } 
      });
      return;
    }
    
    logger.info(`Applying theme: ${theme.name || 'unnamed'}`);
    
    const root = document.documentElement;
    
    // Clear existing theme classes
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    
    // Add impulse theme class
    document.documentElement.classList.add('impulse-theme-active');
    
    // Set theme ID data attribute
    document.documentElement.setAttribute('data-theme-id', theme.id || 'impulse');
    
    // Apply color variables
    if (theme.colors) {
      // Main colors
      setCssVar(root, '--impulse-primary', safeGet(theme, 'colors.primary', '#00F0FF'));
      setCssVar(root, '--impulse-secondary', safeGet(theme, 'colors.secondary', '#FF2D6E'));
      setCssVar(root, '--impulse-accent', safeGet(theme, 'colors.accent', '#F97316'));
      
      // Background colors
      setCssVar(root, '--impulse-bg-main', safeGet(theme, 'colors.background.main', '#12121A'));
      setCssVar(root, '--impulse-bg-overlay', safeGet(theme, 'colors.background.overlay', 'rgba(22, 24, 29, 0.85)'));
      setCssVar(root, '--impulse-bg-card', safeGet(theme, 'colors.background.card', 'rgba(28, 32, 42, 0.7)'));
      setCssVar(root, '--impulse-bg-alt', safeGet(theme, 'colors.background.alt', '#1A1E24'));
      
      // Text colors
      setCssVar(root, '--impulse-text-primary', safeGet(theme, 'colors.text.primary', '#F6F6F7'));
      setCssVar(root, '--impulse-text-secondary', safeGet(theme, 'colors.text.secondary', 'rgba(255, 255, 255, 0.7)'));
      setCssVar(root, '--impulse-text-accent', safeGet(theme, 'colors.text.accent', '#00F0FF'));
      setCssVar(root, '--impulse-text-muted', safeGet(theme, 'colors.text.muted', 'rgba(255, 255, 255, 0.5)'));
      
      // Border colors
      setCssVar(root, '--impulse-border-normal', safeGet(theme, 'colors.borders.normal', 'rgba(0, 240, 255, 0.2)'));
      setCssVar(root, '--impulse-border-hover', safeGet(theme, 'colors.borders.hover', 'rgba(0, 240, 255, 0.4)'));
      setCssVar(root, '--impulse-border-active', safeGet(theme, 'colors.borders.active', 'rgba(0, 240, 255, 0.6)'));
      setCssVar(root, '--impulse-border-focus', safeGet(theme, 'colors.borders.focus', 'rgba(0, 240, 255, 0.5)'));
      
      // Status colors
      setCssVar(root, '--impulse-success', safeGet(theme, 'colors.status.success', '#10B981'));
      setCssVar(root, '--impulse-warning', safeGet(theme, 'colors.status.warning', '#F59E0B'));
      setCssVar(root, '--impulse-error', safeGet(theme, 'colors.status.error', '#EF4444'));
      setCssVar(root, '--impulse-info', safeGet(theme, 'colors.status.info', '#3B82F6'));
    }
    
    // Add RGB variables for utilities
    const primaryHex = safeGet(theme, 'colors.primary', '#00F0FF');
    const secondaryHex = safeGet(theme, 'colors.secondary', '#FF2D6E');
    const accentHex = safeGet(theme, 'colors.accent', '#F97316');
    const successHex = safeGet(theme, 'colors.status.success', '#10B981');
    const warningHex = safeGet(theme, 'colors.status.warning', '#F59E0B');
    const errorHex = safeGet(theme, 'colors.status.error', '#EF4444');
    
    setCssVar(root, '--color-primary', hexToRgbString(primaryHex));
    setCssVar(root, '--color-secondary', hexToRgbString(secondaryHex));
    setCssVar(root, '--color-accent', hexToRgbString(accentHex));
    setCssVar(root, '--color-success', hexToRgbString(successHex));
    setCssVar(root, '--color-warning', hexToRgbString(warningHex));
    setCssVar(root, '--color-error', hexToRgbString(errorHex));
    
    // Set standard Tailwind theme variables for compatibility
    setCssVar(root, '--background', safeGet(theme, 'colors.background.main', '#12121A'));
    setCssVar(root, '--foreground', safeGet(theme, 'colors.text.primary', '#F6F6F7'));
    setCssVar(root, '--primary', safeGet(theme, 'colors.primary', '#00F0FF'));
    setCssVar(root, '--secondary', safeGet(theme, 'colors.secondary', '#FF2D6E'));
    setCssVar(root, '--accent', safeGet(theme, 'colors.accent', '#F97316'));
    setCssVar(root, '--muted', safeGet(theme, 'colors.text.muted', 'rgba(255, 255, 255, 0.5)'));
    setCssVar(root, '--card', safeGet(theme, 'colors.background.card', 'rgba(28, 32, 42, 0.7)'));
    setCssVar(root, '--destructive', safeGet(theme, 'colors.status.error', '#EF4444'));
    
    // Apply effect variables
    if (theme.effects) {
      setCssVar(root, '--impulse-glow-primary', safeGet(theme, 'effects.glow.primary', '0 0 15px rgba(0, 240, 255, 0.7)'));
      setCssVar(root, '--impulse-glow-secondary', safeGet(theme, 'effects.glow.secondary', '0 0 15px rgba(255, 45, 110, 0.7)'));
      setCssVar(root, '--impulse-glow-hover', safeGet(theme, 'effects.glow.hover', '0 0 20px rgba(0, 240, 255, 0.9)'));
      
      setCssVar(root, '--impulse-gradient-primary', safeGet(theme, 'effects.gradients.primary', 'linear-gradient(90deg, #00F0FF, #00B8D4)'));
      setCssVar(root, '--impulse-gradient-secondary', safeGet(theme, 'effects.gradients.secondary', 'linear-gradient(90deg, #FF2D6E, #FF5252)'));
      setCssVar(root, '--impulse-gradient-accent', safeGet(theme, 'effects.gradients.accent', 'linear-gradient(90deg, #F97316, #FB923C)'));
      
      setCssVar(root, '--impulse-shadow-small', safeGet(theme, 'effects.shadows.small', '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)'));
      setCssVar(root, '--impulse-shadow-medium', safeGet(theme, 'effects.shadows.medium', '0 4px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3)'));
      setCssVar(root, '--impulse-shadow-large', safeGet(theme, 'effects.shadows.large', '0 10px 25px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.22)'));
      setCssVar(root, '--impulse-shadow-inner', safeGet(theme, 'effects.shadows.inner', 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.15)'));
      
      // Set critical site effect colors for legacy compatibility
      setCssVar(root, '--site-effect-color', safeGet(theme, 'colors.primary', '#00F0FF'));
      setCssVar(root, '--site-effect-secondary', safeGet(theme, 'colors.secondary', '#FF2D6E'));
      setCssVar(root, '--site-effect-tertiary', safeGet(theme, 'colors.accent', '#F97316'));
    }
    
    // Apply animation variables
    if (theme.animation) {
      setCssVar(root, '--impulse-duration-fast', safeGet(theme, 'animation.duration.fast', '150ms'));
      setCssVar(root, '--impulse-duration-normal', safeGet(theme, 'animation.duration.normal', '300ms'));
      setCssVar(root, '--impulse-duration-slow', safeGet(theme, 'animation.duration.slow', '500ms'));
      
      setCssVar(root, '--impulse-curve-bounce', safeGet(theme, 'animation.curves.bounce', 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'));
      setCssVar(root, '--impulse-curve-ease', safeGet(theme, 'animation.curves.ease', 'cubic-bezier(0.4, 0, 0.2, 1)'));
      setCssVar(root, '--impulse-curve-spring', safeGet(theme, 'animation.curves.spring', 'cubic-bezier(0.43, 0.13, 0.23, 0.96)'));
      setCssVar(root, '--impulse-curve-linear', safeGet(theme, 'animation.curves.linear', 'linear'));
    }
    
    // Apply typography variables
    if (theme.typography) {
      // Font families
      setCssVar(root, '--impulse-font-body', safeGet(theme, 'typography.fonts.body', 'Inter, system-ui, sans-serif'));
      setCssVar(root, '--impulse-font-heading', safeGet(theme, 'typography.fonts.heading', 'Inter, system-ui, sans-serif'));
      setCssVar(root, '--impulse-font-mono', safeGet(theme, 'typography.fonts.monospace', 'Consolas, monospace'));
      
      // Font sizes
      setCssVar(root, '--impulse-text-xs', safeGet(theme, 'typography.sizes.xs', '0.75rem'));
      setCssVar(root, '--impulse-text-sm', safeGet(theme, 'typography.sizes.sm', '0.875rem'));
      setCssVar(root, '--impulse-text-base', safeGet(theme, 'typography.sizes.base', '1rem'));
      setCssVar(root, '--impulse-text-md', safeGet(theme, 'typography.sizes.md', '1rem'));
      setCssVar(root, '--impulse-text-lg', safeGet(theme, 'typography.sizes.lg', '1.125rem'));
      setCssVar(root, '--impulse-text-xl', safeGet(theme, 'typography.sizes.xl', '1.25rem'));
      setCssVar(root, '--impulse-text-2xl', safeGet(theme, 'typography.sizes.2xl', '1.5rem'));
      setCssVar(root, '--impulse-text-3xl', safeGet(theme, 'typography.sizes.3xl', '1.875rem'));
      
      // Line heights
      setCssVar(root, '--impulse-leading-tight', safeGet(theme, 'typography.lineHeights.tight', '1.25'));
      setCssVar(root, '--impulse-leading-normal', safeGet(theme, 'typography.lineHeights.normal', '1.5'));
      setCssVar(root, '--impulse-leading-loose', safeGet(theme, 'typography.lineHeights.loose', '1.75'));
    }
    
    // Apply component variables
    if (theme.components) {
      setCssVar(root, '--impulse-panel-radius', safeGet(theme, 'components.panel.radius', '0.75rem'));
      setCssVar(root, '--impulse-panel-padding', safeGet(theme, 'components.panel.padding', '1.5rem'));
      setCssVar(root, '--impulse-panel-background', safeGet(theme, 'components.panel.background', 'rgba(28, 32, 42, 0.7)'));
      
      setCssVar(root, '--impulse-button-radius', safeGet(theme, 'components.button.radius', '0.5rem'));
      setCssVar(root, '--impulse-button-padding', safeGet(theme, 'components.button.padding', '0.5rem 1rem'));
      setCssVar(root, '--impulse-button-transition', safeGet(theme, 'components.button.transition', 'all 0.2s ease'));
      
      setCssVar(root, '--impulse-tooltip-radius', safeGet(theme, 'components.tooltip.radius', '0.25rem'));
      setCssVar(root, '--impulse-tooltip-padding', safeGet(theme, 'components.tooltip.padding', '0.5rem'));
      setCssVar(root, '--impulse-tooltip-background', safeGet(theme, 'components.tooltip.background', 'rgba(0, 0, 0, 0.8)'));
      
      setCssVar(root, '--impulse-input-radius', safeGet(theme, 'components.input.radius', '0.375rem'));
      setCssVar(root, '--impulse-input-padding', safeGet(theme, 'components.input.padding', '0.5rem 0.75rem'));
      setCssVar(root, '--impulse-input-background', safeGet(theme, 'components.input.background', 'rgba(0, 0, 0, 0.15)'));
    }
    
    // Set theme application status for monitoring
    document.documentElement.setAttribute('data-theme-status', 'applied');
    
    logger.debug(`Theme "${theme.name}" applied to document`);
  } catch (error) {
    logger.error('Failed to apply theme', { 
      details: { error, themeId: typeof themeOrId === 'string' ? themeOrId : 'object' } 
    });
    
    // Try to apply essential fallbacks
    try {
      const root = document.documentElement;
      setCssVar(root, '--background', '#12121A');
      setCssVar(root, '--foreground', '#F6F6F7');
      setCssVar(root, '--primary', '#00F0FF');
      setCssVar(root, '--secondary', '#FF2D6E');
      setCssVar(root, '--card', 'rgba(28, 32, 42, 0.7)');
      setCssVar(root, '--card-foreground', '#F6F6F7');
      
      document.documentElement.setAttribute('data-theme-status', 'fallback');
    } catch (fallbackError) {
      logger.error('Even fallback theme application failed', { details: { fallbackError } });
    }
  }
}

/**
 * Set a CSS variable on the given element
 */
function setCssVar(element: HTMLElement, name: string, value: string): void {
  element.style.setProperty(name, value);
}

/**
 * Helper function to convert hex color to RGB components string
 */
export function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  if (!hex) return { r: 0, g: 0, b: 0 };
  
  // Remove the hash if it exists
  hex = hex.replace(/^#/, '');
  
  // Handle rgba format (common in our theme)
  if (hex.startsWith('rgba')) {
    const rgba = hex.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)/);
    if (rgba) {
      return {
        r: parseInt(rgba[1], 10),
        g: parseInt(rgba[2], 10),
        b: parseInt(rgba[3], 10)
      };
    }
    return { r: 0, g: 0, b: 0 };
  }
  
  // Handle rgb format
  if (hex.startsWith('rgb')) {
    const rgb = hex.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (rgb) {
      return {
        r: parseInt(rgb[1], 10),
        g: parseInt(rgb[2], 10),
        b: parseInt(rgb[3], 10)
      };
    }
    return { r: 0, g: 0, b: 0 };
  }

  // Parse standard hex
  const expandedHex = hex.length === 3
    ? hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    : hex;
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expandedHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Convert hex to RGB string (format: "r, g, b")
 */
export function hexToRgbString(hex: string): string {
  const rgb = hexToRgb(hex);
  return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '0, 0, 0';
}

/**
 * Create a utility function to create a safe theme access function
 */
export function safeThemeAccess<T>(theme: any, path: string, defaultValue: T): T {
  try {
    if (!theme) return defaultValue;
    
    const keys = path.split('.');
    let value: any = theme;
    
    for (const key of keys) {
      if (value === undefined || value === null) return defaultValue;
      value = value[key];
    }
    
    return (value !== undefined && value !== null) ? value : defaultValue;
  } catch (error) {
    logger.error('Error accessing theme property', { details: { path, error } });
    return defaultValue;
  }
}
