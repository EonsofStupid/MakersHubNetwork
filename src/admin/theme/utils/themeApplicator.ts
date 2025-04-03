
import { ImpulseTheme } from '../../types/impulse.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { themeRegistry } from '../ThemeRegistry';

const logger = getLogger('themeApplicator', LogCategory.THEME);

/**
 * Apply theme to document - single source of truth for theme application
 * This utility properly handles all CSS variable applications for site and admin
 */
export function applyThemeToDocument(theme: ImpulseTheme | string): void {
  try {
    // Resolve theme if string ID was provided
    const themeToApply = typeof theme === 'string' 
      ? themeRegistry.getTheme(theme)
      : theme;
    
    if (!themeToApply) {
      logger.error('Invalid theme provided to applyThemeToDocument');
      return;
    }

    logger.debug('Applying theme to document', { themeName: themeToApply.name || 'unnamed' });
    const root = document.documentElement;
    
    // Apply colors
    applyColorVariables(themeToApply, root);
    
    // Apply effects
    applyEffectVariables(themeToApply, root);
    
    // Apply animation variables
    applyAnimationVariables(themeToApply, root);
    
    // Apply component specific variables
    applyComponentVariables(themeToApply, root);
    
    // Apply typography variables
    applyTypographyVariables(themeToApply, root);
    
    // Standard shadow-ui compatibility variables
    applyStandardVariables(themeToApply, root);
    
    // Apply glass effect variables
    applyGlassEffectVariables(themeToApply, root);
    
    logger.debug('Theme successfully applied to document');
  } catch (error) {
    logger.error('Error applying theme to document', { 
      details: { error: error instanceof Error ? error.message : String(error) }
    });
  }
}

/**
 * Apply color variables to the document
 */
function applyColorVariables(theme: ImpulseTheme, root: HTMLElement): void {
  // Primary colors
  root.style.setProperty('--impulse-primary', theme.colors.primary);
  root.style.setProperty('--impulse-secondary', theme.colors.secondary);
  root.style.setProperty('--impulse-accent', theme.colors.accent || '#F97316');
  
  // Background colors
  root.style.setProperty('--impulse-bg-main', theme.colors.background.main);
  root.style.setProperty('--impulse-bg-overlay', theme.colors.background.overlay);
  root.style.setProperty('--impulse-bg-card', theme.colors.background.card);
  root.style.setProperty('--impulse-bg-alt', theme.colors.background.alt || theme.colors.background.card);
  
  // Text colors
  root.style.setProperty('--impulse-text-primary', theme.colors.text.primary);
  root.style.setProperty('--impulse-text-secondary', theme.colors.text.secondary);
  root.style.setProperty('--impulse-text-accent', theme.colors.text.accent);
  root.style.setProperty('--impulse-text-muted', theme.colors.text.muted || 'rgba(255, 255, 255, 0.6)');
  
  // Border colors
  root.style.setProperty('--impulse-border-normal', theme.colors.borders.normal);
  root.style.setProperty('--impulse-border-hover', theme.colors.borders.hover);
  root.style.setProperty('--impulse-border-active', theme.colors.borders.active);
  root.style.setProperty('--impulse-border-focus', theme.colors.borders.focus || theme.colors.borders.hover);
  
  // Status colors
  root.style.setProperty('--impulse-status-success', theme.colors.status.success);
  root.style.setProperty('--impulse-status-warning', theme.colors.status.warning);
  root.style.setProperty('--impulse-status-error', theme.colors.status.error);
  root.style.setProperty('--impulse-status-info', theme.colors.status.info);
}

/**
 * Apply effect variables to the document
 */
function applyEffectVariables(theme: ImpulseTheme, root: HTMLElement): void {
  // Glow effects
  root.style.setProperty('--impulse-glow-primary', theme.effects.glow.primary);
  root.style.setProperty('--impulse-glow-secondary', theme.effects.glow.secondary);
  root.style.setProperty('--impulse-glow-hover', theme.effects.glow.hover);
  
  // Gradient effects
  root.style.setProperty('--impulse-gradient-primary', theme.effects.gradients.primary);
  root.style.setProperty('--impulse-gradient-secondary', theme.effects.gradients.secondary);
  root.style.setProperty('--impulse-gradient-accent', theme.effects.gradients.accent || theme.effects.gradients.primary);
  
  // Shadow effects
  root.style.setProperty('--impulse-shadow-sm', theme.effects.shadows.small);
  root.style.setProperty('--impulse-shadow-md', theme.effects.shadows.medium);
  root.style.setProperty('--impulse-shadow-lg', theme.effects.shadows.large);
  root.style.setProperty('--impulse-shadow-inner', theme.effects.shadows.inner || 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)');
}

/**
 * Apply animation variables to the document
 */
function applyAnimationVariables(theme: ImpulseTheme, root: HTMLElement): void {
  // Duration values
  root.style.setProperty('--impulse-duration-fast', theme.animation.duration.fast);
  root.style.setProperty('--impulse-duration-normal', theme.animation.duration.normal);
  root.style.setProperty('--impulse-duration-slow', theme.animation.duration.slow);
  
  // Animation curves
  root.style.setProperty('--impulse-curve-bounce', theme.animation.curves.bounce);
  root.style.setProperty('--impulse-curve-ease', theme.animation.curves.ease);
  root.style.setProperty('--impulse-curve-spring', theme.animation.curves.spring);
  root.style.setProperty('--impulse-curve-linear', theme.animation.curves.linear || 'linear');
  
  // Keyframe animations
  root.style.setProperty('--impulse-keyframes-fade', theme.animation.keyframes.fade);
  root.style.setProperty('--impulse-keyframes-pulse', theme.animation.keyframes.pulse);
  root.style.setProperty('--impulse-keyframes-glow', theme.animation.keyframes.glow);
  root.style.setProperty('--impulse-keyframes-slide', theme.animation.keyframes.slide || theme.animation.keyframes.fade);
}

/**
 * Apply component variables to the document
 */
function applyComponentVariables(theme: ImpulseTheme, root: HTMLElement): void {
  // Panel component
  root.style.setProperty('--impulse-panel-radius', theme.components.panel.radius);
  root.style.setProperty('--impulse-panel-padding', theme.components.panel.padding);
  root.style.setProperty('--impulse-panel-bg', theme.components.panel.background || theme.colors.background.card);
  
  // Button component
  root.style.setProperty('--impulse-button-radius', theme.components.button.radius);
  root.style.setProperty('--impulse-button-padding', theme.components.button.padding);
  root.style.setProperty('--impulse-button-transition', theme.components.button.transition || 'all 0.2s ease');
  
  // Tooltip component
  root.style.setProperty('--impulse-tooltip-radius', theme.components.tooltip.radius);
  root.style.setProperty('--impulse-tooltip-padding', theme.components.tooltip.padding);
  root.style.setProperty('--impulse-tooltip-bg', theme.components.tooltip.background || 'rgba(0, 0, 0, 0.8)');
  
  // Input component
  root.style.setProperty('--impulse-input-radius', theme.components.input.radius);
  root.style.setProperty('--impulse-input-padding', theme.components.input.padding);
  root.style.setProperty('--impulse-input-bg', theme.components.input.background || 'rgba(0, 0, 0, 0.1)');
}

/**
 * Apply typography variables to the document
 */
function applyTypographyVariables(theme: ImpulseTheme, root: HTMLElement): void {
  if (!theme.typography) return;
  
  // Font families
  root.style.setProperty('--impulse-font-body', theme.typography.fonts.body);
  root.style.setProperty('--impulse-font-heading', theme.typography.fonts.heading);
  root.style.setProperty('--impulse-font-mono', theme.typography.fonts.monospace);
  
  // Font sizes
  root.style.setProperty('--impulse-font-xs', theme.typography.sizes.xs);
  root.style.setProperty('--impulse-font-sm', theme.typography.sizes.sm);
  root.style.setProperty('--impulse-font-md', theme.typography.sizes.md);
  root.style.setProperty('--impulse-font-lg', theme.typography.sizes.lg);
  root.style.setProperty('--impulse-font-xl', theme.typography.sizes.xl);
  root.style.setProperty('--impulse-font-2xl', theme.typography.sizes['2xl']);
  root.style.setProperty('--impulse-font-3xl', theme.typography.sizes['3xl']);
  
  // Font weights
  root.style.setProperty('--impulse-font-light', theme.typography.weights.light.toString());
  root.style.setProperty('--impulse-font-normal', theme.typography.weights.normal.toString());
  root.style.setProperty('--impulse-font-medium', theme.typography.weights.medium.toString());
  root.style.setProperty('--impulse-font-bold', theme.typography.weights.bold.toString());
  
  // Line heights
  root.style.setProperty('--impulse-line-tight', theme.typography.lineHeights.tight);
  root.style.setProperty('--impulse-line-normal', theme.typography.lineHeights.normal);
  root.style.setProperty('--impulse-line-loose', theme.typography.lineHeights.loose);
}

/**
 * Apply standard shadow-ui compatible variables
 */
function applyStandardVariables(theme: ImpulseTheme, root: HTMLElement): void {
  // Apply to standard theme variables as well for compatibility
  root.style.setProperty('--background', theme.colors.background.main);
  root.style.setProperty('--foreground', theme.colors.text.primary);
  root.style.setProperty('--card', theme.colors.background.card);
  root.style.setProperty('--card-foreground', theme.colors.text.primary);
  root.style.setProperty('--popover', theme.colors.background.card);
  root.style.setProperty('--popover-foreground', theme.colors.text.primary);
  root.style.setProperty('--primary', theme.colors.primary);
  root.style.setProperty('--primary-foreground', theme.colors.text.primary);
  root.style.setProperty('--secondary', theme.colors.secondary);
  root.style.setProperty('--secondary-foreground', theme.colors.text.primary);
  root.style.setProperty('--muted', theme.colors.background.overlay);
  root.style.setProperty('--muted-foreground', theme.colors.text.secondary);
  root.style.setProperty('--accent', theme.colors.accent || theme.colors.secondary);
  root.style.setProperty('--accent-foreground', theme.colors.text.primary);
  root.style.setProperty('--destructive', theme.colors.status.error);
  root.style.setProperty('--destructive-foreground', theme.colors.text.primary);
  root.style.setProperty('--border', theme.colors.borders.normal);
  root.style.setProperty('--input', theme.colors.background.overlay);
  root.style.setProperty('--ring', theme.colors.borders.focus || theme.colors.primary);
}

/**
 * Apply glass effect variables
 */
function applyGlassEffectVariables(theme: ImpulseTheme, root: HTMLElement): void {
  // Convert hex to RGB for glass effects
  root.style.setProperty('--glass-opacity', '0.7');
  root.style.setProperty('--glass-blur', '12px');
  root.style.setProperty('--glass-border-color', `rgba(${hexToRgb(theme.colors.primary)}, 0.3)`);
  root.style.setProperty('--glass-background', `rgba(${hexToRgb(theme.colors.background.card)}, var(--glass-opacity))`);
}

/**
 * Helper function to convert hex to rgb string
 */
export function hexToRgb(hex: string): string {
  // Default fallback
  if (!hex || typeof hex !== 'string') return '0, 0, 0';
  
  // Handle rgba values
  if (hex.startsWith('rgba')) {
    const matches = hex.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
    if (matches) {
      return `${matches[1]}, ${matches[2]}, ${matches[3]}`;
    }
    return '0, 0, 0';
  }
  
  // Handle rgb values
  if (hex.startsWith('rgb')) {
    const matches = hex.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
    if (matches) {
      return `${matches[1]}, ${matches[2]}, ${matches[3]}`;
    }
    return '0, 0, 0';
  }
  
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex values
  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  
  // Handle invalid values
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '0, 0, 0';
  
  return `${r}, ${g}, ${b}`;
}
