import { ImpulseTheme } from '../../types/impulse.types';
import { themeRegistry } from '../ThemeRegistry';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

const logger = getLogger('themeApplicator', { category: LogCategory.THEME });

/**
 * Apply theme to document by either direct object or by theme ID from registry
 */
export function applyThemeToDocument(themeOrId: ImpulseTheme | string): void {
  try {
    let theme: ImpulseTheme;
    
    // If a string ID is provided, get the theme from the registry
    if (typeof themeOrId === 'string') {
      const themeName = themeOrId;
      logger.debug('Applying theme by ID', { 
        themeName 
      });
      theme = themeRegistry.getTheme(themeOrId);
    } else {
      // Otherwise use the direct theme object
      theme = themeOrId;
    }
    
    // Make sure we have a valid theme
    if (!theme) {
      logger.warn('No valid theme to apply, using default');
      theme = themeRegistry.getDefaultTheme();
    }
    
    const root = document.documentElement;
    
    // Apply color variables
    if (theme.colors) {
      // Primary colors
      root.style.setProperty('--impulse-primary', theme.colors.primary);
      root.style.setProperty('--impulse-secondary', theme.colors.secondary);
      if (theme.colors.accent) {
        root.style.setProperty('--impulse-accent', theme.colors.accent);
      }
      
      // Background colors
      if (theme.colors.background) {
        root.style.setProperty('--impulse-bg-main', theme.colors.background.main);
        root.style.setProperty('--impulse-bg-overlay', theme.colors.background.overlay);
        root.style.setProperty('--impulse-bg-card', theme.colors.background.card);
        if (theme.colors.background.alt) {
          root.style.setProperty('--impulse-bg-alt', theme.colors.background.alt);
        }
      }
      
      // Text colors
      if (theme.colors.text) {
        root.style.setProperty('--impulse-text-primary', theme.colors.text.primary);
        root.style.setProperty('--impulse-text-secondary', theme.colors.text.secondary);
        if (theme.colors.text.accent) {
          root.style.setProperty('--impulse-text-accent', theme.colors.text.accent);
        }
        if (theme.colors.text.muted) {
          root.style.setProperty('--impulse-text-muted', theme.colors.text.muted);
        }
      }
      
      // Border colors
      if (theme.colors.borders) {
        root.style.setProperty('--impulse-border-normal', theme.colors.borders.normal);
        root.style.setProperty('--impulse-border-hover', theme.colors.borders.hover);
        root.style.setProperty('--impulse-border-active', theme.colors.borders.active);
        if (theme.colors.borders.focus) {
          root.style.setProperty('--impulse-border-focus', theme.colors.borders.focus);
        }
      }
      
      // Status colors
      if (theme.colors.status) {
        root.style.setProperty('--impulse-status-success', theme.colors.status.success);
        root.style.setProperty('--impulse-status-warning', theme.colors.status.warning);
        root.style.setProperty('--impulse-status-error', theme.colors.status.error);
        root.style.setProperty('--impulse-status-info', theme.colors.status.info);
      }
      
      // Glass effect variables
      root.style.setProperty('--glass-opacity', '0.7');
      root.style.setProperty('--glass-blur', '12px');
      root.style.setProperty('--glass-border-color', `rgba(${hexToRgb(theme.colors.primary)}, 0.3)`);
      if (theme.colors.background && theme.colors.background.card) {
        root.style.setProperty('--glass-background', `rgba(${hexToRgb(theme.colors.background.card)}, var(--glass-opacity))`);
      }
    }
    
    // Apply effect variables
    if (theme.effects) {
      if (theme.effects.glow) {
        root.style.setProperty('--impulse-glow-primary', theme.effects.glow.primary);
        root.style.setProperty('--impulse-glow-secondary', theme.effects.glow.secondary);
        root.style.setProperty('--impulse-glow-hover', theme.effects.glow.hover);
      }
      
      if (theme.effects.gradients) {
        root.style.setProperty('--impulse-gradient-primary', theme.effects.gradients.primary);
        root.style.setProperty('--impulse-gradient-secondary', theme.effects.gradients.secondary);
        if (theme.effects.gradients.accent) {
          root.style.setProperty('--impulse-gradient-accent', theme.effects.gradients.accent);
        }
      }
      
      if (theme.effects.shadows) {
        root.style.setProperty('--impulse-shadow-small', theme.effects.shadows.small);
        root.style.setProperty('--impulse-shadow-medium', theme.effects.shadows.medium);
        root.style.setProperty('--impulse-shadow-large', theme.effects.shadows.large);
        if (theme.effects.shadows.inner) {
          root.style.setProperty('--impulse-shadow-inner', theme.effects.shadows.inner);
        }
      }
    }
    
    // Apply animation variables
    if (theme.animation) {
      if (theme.animation.duration) {
        root.style.setProperty('--impulse-duration-fast', theme.animation.duration.fast);
        root.style.setProperty('--impulse-duration-normal', theme.animation.duration.normal);
        root.style.setProperty('--impulse-duration-slow', theme.animation.duration.slow);
      }
      
      if (theme.animation.curves) {
        root.style.setProperty('--impulse-curve-bounce', theme.animation.curves.bounce);
        root.style.setProperty('--impulse-curve-ease', theme.animation.curves.ease);
        root.style.setProperty('--impulse-curve-spring', theme.animation.curves.spring);
        if (theme.animation.curves.linear) {
          root.style.setProperty('--impulse-curve-linear', theme.animation.curves.linear);
        }
      }
      
      if (theme.animation.keyframes) {
        root.style.setProperty('--impulse-keyframes-fade', theme.animation.keyframes.fade);
        root.style.setProperty('--impulse-keyframes-pulse', theme.animation.keyframes.pulse);
        root.style.setProperty('--impulse-keyframes-glow', theme.animation.keyframes.glow);
        if (theme.animation.keyframes.slide) {
          root.style.setProperty('--impulse-keyframes-slide', theme.animation.keyframes.slide);
        }
      }
    }
    
    // Apply component specific variables
    if (theme.components) {
      if (theme.components.panel) {
        root.style.setProperty('--impulse-panel-radius', theme.components.panel.radius);
        root.style.setProperty('--impulse-panel-padding', theme.components.panel.padding);
        if (theme.components.panel.background) {
          root.style.setProperty('--impulse-panel-background', theme.components.panel.background);
        }
      }
      
      if (theme.components.button) {
        root.style.setProperty('--impulse-button-radius', theme.components.button.radius);
        root.style.setProperty('--impulse-button-padding', theme.components.button.padding);
        if (theme.components.button.transition) {
          root.style.setProperty('--impulse-button-transition', theme.components.button.transition);
        }
      }
      
      if (theme.components.tooltip) {
        root.style.setProperty('--impulse-tooltip-radius', theme.components.tooltip.radius);
        root.style.setProperty('--impulse-tooltip-padding', theme.components.tooltip.padding);
        if (theme.components.tooltip.background) {
          root.style.setProperty('--impulse-tooltip-background', theme.components.tooltip.background);
        }
      }
      
      if (theme.components.input) {
        root.style.setProperty('--impulse-input-radius', theme.components.input.radius);
        root.style.setProperty('--impulse-input-padding', theme.components.input.padding);
        if (theme.components.input.background) {
          root.style.setProperty('--impulse-input-background', theme.components.input.background);
        }
      }
    }
    
    // Apply typography variables
    if (theme.typography) {
      if (theme.typography.fonts) {
        root.style.setProperty('--impulse-font-body', theme.typography.fonts.body);
        root.style.setProperty('--impulse-font-heading', theme.typography.fonts.heading);
        root.style.setProperty('--impulse-font-monospace', theme.typography.fonts.monospace);
      }
      
      if (theme.typography.sizes) {
        root.style.setProperty('--impulse-size-xs', theme.typography.sizes.xs);
        root.style.setProperty('--impulse-size-sm', theme.typography.sizes.sm);
        root.style.setProperty('--impulse-size-md', theme.typography.sizes.md);
        root.style.setProperty('--impulse-size-lg', theme.typography.sizes.lg);
        root.style.setProperty('--impulse-size-xl', theme.typography.sizes.xl);
        root.style.setProperty('--impulse-size-2xl', theme.typography.sizes['2xl']);
        root.style.setProperty('--impulse-size-3xl', theme.typography.sizes['3xl']);
      }
      
      if (theme.typography.weights) {
        root.style.setProperty('--impulse-weight-light', theme.typography.weights.light.toString());
        root.style.setProperty('--impulse-weight-normal', theme.typography.weights.normal.toString());
        root.style.setProperty('--impulse-weight-medium', theme.typography.weights.medium.toString());
        root.style.setProperty('--impulse-weight-bold', theme.typography.weights.bold.toString());
      }
      
      if (theme.typography.lineHeights) {
        root.style.setProperty('--impulse-lineheight-tight', theme.typography.lineHeights.tight);
        root.style.setProperty('--impulse-lineheight-normal', theme.typography.lineHeights.normal);
        root.style.setProperty('--impulse-lineheight-loose', theme.typography.lineHeights.loose);
      }
    }
    
    // Apply to standard theme variables as well for compatibility
    if (theme.colors) {
      if (theme.colors.background) {
        root.style.setProperty('--background', theme.colors.background.main);
      }
      if (theme.colors.text) {
        root.style.setProperty('--foreground', theme.colors.text.primary);
      }
      if (theme.colors.background) {
        root.style.setProperty('--card', theme.colors.background.card);
      }
      if (theme.colors.text) {
        root.style.setProperty('--card-foreground', theme.colors.text.primary);
      }
      root.style.setProperty('--primary', theme.colors.primary);
      if (theme.colors.text) {
        root.style.setProperty('--primary-foreground', theme.colors.text.primary);
      }
      root.style.setProperty('--secondary', theme.colors.secondary);
      if (theme.colors.text) {
        root.style.setProperty('--secondary-foreground', theme.colors.text.primary);
      }
      if (theme.colors.accent) {
        root.style.setProperty('--accent', theme.colors.accent);
      }
      if (theme.colors.text) {
        root.style.setProperty('--accent-foreground', theme.colors.text.primary);
      }
      if (theme.colors.status && theme.colors.status.error) {
        root.style.setProperty('--destructive', theme.colors.status.error);
      }
      if (theme.colors.text) {
        root.style.setProperty('--destructive-foreground', theme.colors.text.primary);
      }
      if (theme.colors.borders) {
        root.style.setProperty('--border', theme.colors.borders.normal);
      }
      if (theme.colors.background) {
        root.style.setProperty('--input', theme.colors.background.overlay);
      }
      if (theme.colors.borders) {
        root.style.setProperty('--ring', theme.colors.borders.focus || theme.colors.borders.hover);
      }
    }
    
    // Mark the document as having our theme applied
    root.classList.add('impulse-theme-applied');
    
    logger.debug('Theme applied successfully');
  } catch (error) {
    logger.error('Error applying theme', { 
      details: { error: error instanceof Error ? error.message : String(error) }
    });
  }
}

// Helper function to convert hex to rgb
export function hexToRgb(hex: string | null): string {
  // Default fallback
  if (!hex || typeof hex !== 'string') return '0, 0, 0';
  
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
