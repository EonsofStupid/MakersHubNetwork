
import { ImpulseTheme } from '../../types/impulse.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

const logger = getLogger('themeUtils', LogCategory.THEME);

/**
 * Apply theme tokens to document CSS variables
 */
export function applyThemeToDocument(theme: ImpulseTheme): void {
  try {
    if (!theme) {
      logger.warn('No theme provided to applyThemeToDocument');
      return;
    }

    const root = document.documentElement;
    
    // Apply color variables
    if (theme.colors) {
      // Primary colors
      root.style.setProperty('--impulse-primary', theme.colors.primary);
      root.style.setProperty('--impulse-secondary', theme.colors.secondary);
      root.style.setProperty('--impulse-accent', theme.colors.accent || '#F97316');
      
      // Background colors
      root.style.setProperty('--impulse-bg-main', theme.colors.background?.main || '#12121A');
      root.style.setProperty('--impulse-bg-overlay', theme.colors.background?.overlay || 'rgba(22, 24, 32, 0.85)');
      root.style.setProperty('--impulse-bg-card', theme.colors.background?.card || 'rgba(28, 32, 42, 0.7)');
      
      // Text colors
      root.style.setProperty('--impulse-text-primary', theme.colors.text?.primary || '#F6F6F7');
      root.style.setProperty('--impulse-text-secondary', theme.colors.text?.secondary || 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--impulse-text-accent', theme.colors.text?.accent || '#00F0FF');
      
      // Border colors
      root.style.setProperty('--impulse-border-normal', theme.colors.borders?.normal || 'rgba(0, 240, 255, 0.2)');
      root.style.setProperty('--impulse-border-hover', theme.colors.borders?.hover || 'rgba(0, 240, 255, 0.4)');
      root.style.setProperty('--impulse-border-active', theme.colors.borders?.active || 'rgba(0, 240, 255, 0.6)');
      
      // Glass effect variables
      root.style.setProperty('--glass-opacity', '0.7');
      root.style.setProperty('--glass-blur', '12px');
      root.style.setProperty('--glass-border-color', `rgba(${hexToRgb(theme.colors.primary)}, 0.3)`);
      root.style.setProperty('--glass-background', `rgba(${hexToRgb(theme.colors.background?.card || '#1C202A')}, var(--glass-opacity))`);
    }
    
    // Apply effect variables
    if (theme.effects) {
      root.style.setProperty('--impulse-glow-primary', theme.effects.glow?.primary || '0 0 15px rgba(0, 240, 255, 0.7)');
      root.style.setProperty('--impulse-glow-secondary', theme.effects.glow?.secondary || '0 0 15px rgba(255, 45, 110, 0.7)');
      root.style.setProperty('--impulse-glow-hover', theme.effects.glow?.hover || '0 0 20px rgba(0, 240, 255, 0.9)');
    }
    
    // Apply animation variables
    if (theme.animation) {
      root.style.setProperty('--impulse-duration-fast', theme.animation.duration?.fast || '150ms');
      root.style.setProperty('--impulse-duration-normal', theme.animation.duration?.normal || '300ms');
      root.style.setProperty('--impulse-duration-slow', theme.animation.duration?.slow || '500ms');
      
      root.style.setProperty('--impulse-curve-bounce', theme.animation.curves?.bounce || 'cubic-bezier(0.175, 0.885, 0.32, 1.275)');
      root.style.setProperty('--impulse-curve-ease', theme.animation.curves?.ease || 'cubic-bezier(0.4, 0, 0.2, 1)');
      root.style.setProperty('--impulse-curve-spring', theme.animation.curves?.spring || 'cubic-bezier(0.43, 0.13, 0.23, 0.96)');
    }
    
    // Apply component specific variables
    if (theme.components) {
      root.style.setProperty('--impulse-panel-radius', theme.components.panel?.radius || '0.75rem');
      root.style.setProperty('--impulse-panel-padding', theme.components.panel?.padding || '1rem');
      root.style.setProperty('--impulse-button-radius', theme.components.button?.radius || '0.5rem');
      root.style.setProperty('--impulse-button-padding', theme.components.button?.padding || '0.5rem 1rem');
      root.style.setProperty('--impulse-tooltip-radius', theme.components.tooltip?.radius || '0.25rem');
      root.style.setProperty('--impulse-tooltip-padding', theme.components.tooltip?.padding || '0.5rem');
    }
    
    // Apply to standard theme variables as well for compatibility
    root.style.setProperty('--background', theme.colors?.background?.main || '#12121A');
    root.style.setProperty('--foreground', theme.colors?.text?.primary || '#F6F6F7');
    root.style.setProperty('--card', theme.colors?.background?.card || 'rgba(28, 32, 42, 0.7)');
    root.style.setProperty('--card-foreground', theme.colors?.text?.primary || '#F6F6F7');
    root.style.setProperty('--primary', theme.colors?.primary || '#00F0FF');
    root.style.setProperty('--primary-foreground', theme.colors?.text?.primary || '#F6F6F7');
    root.style.setProperty('--secondary', theme.colors?.secondary || '#FF2D6E');
    root.style.setProperty('--secondary-foreground', theme.colors?.text?.primary || '#F6F6F7');
    
    logger.debug('Theme successfully applied to document');
  } catch (error) {
    logger.error('Error applying theme to document', { 
      details: { error: error instanceof Error ? error.message : String(error) }
    });
  }
}

// Helper function to convert hex to rgb
export function hexToRgb(hex: string): string {
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

// Deep merge utility for theme objects
export function deepMergeThemes<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target };
  
  if (!source) return output;
  
  Object.keys(source).forEach(key => {
    if (source[key] !== undefined) {
      if (
        source[key] !== null &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMergeThemes(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    }
  });
  
  return output;
}
