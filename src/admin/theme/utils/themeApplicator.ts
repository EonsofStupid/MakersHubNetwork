
import { ImpulseTheme } from '../../types/impulse.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';
import { safeGet } from './safeThemeAccess';
import { hexToRgbString } from '@/utils/colorUtils';

const logger = getLogger('ThemeApplicator', { category: LogCategory.THEME });

/**
 * Safely get a property from a theme with fallback
 */
export function getSafeThemeProperty<T>(
  theme: any,
  path: string[],
  fallback: T
): T {
  if (!theme) {
    return fallback;
  }

  try {
    let current: any = theme;
    
    for (const segment of path) {
      if (current === undefined || current === null) {
        return fallback;
      }
      current = current[segment];
    }
    
    if (current === undefined || current === null) {
      return fallback;
    }
    
    return current as T;
  } catch (error) {
    logger.warn('Error accessing theme property', {
      details: { path, error: error instanceof Error ? error.message : String(error) }
    });
    return fallback;
  }
}

/**
 * Applies a theme to the document by setting CSS variables
 * Now with enhanced type safety and error handling
 */
export function applyThemeToDocument(theme: ImpulseTheme | unknown): void {
  try {
    if (!theme || typeof theme !== 'object') {
      logger.warn('Invalid theme provided to applyThemeToDocument');
      return;
    }

    const root = document.documentElement;
    
    // Apply basic colors with safe property access
    const getProp = (path: string[], fallback: string): string => {
      return getSafeThemeProperty(theme, path, fallback);
    };
    
    // Apply basic colors
    root.style.setProperty('--color-primary', hexToRgbString(getProp(['colors', 'primary'], '#00F0FF')));
    root.style.setProperty('--color-secondary', hexToRgbString(getProp(['colors', 'secondary'], '#FF2D6E')));
    root.style.setProperty('--color-accent', hexToRgbString(getProp(['colors', 'accent'], '#8B5CF6')));
    
    // Apply background colors
    root.style.setProperty('--color-background', hexToRgbString(getProp(['colors', 'background', 'main'], '#12121A')));
    root.style.setProperty('--color-card', hexToRgbString(getProp(['colors', 'background', 'card'], 'rgba(28, 32, 42, 0.7)')));
    
    // Apply text colors
    root.style.setProperty('--color-text', hexToRgbString(getProp(['colors', 'text', 'primary'], '#F6F6F7')));
    root.style.setProperty('--color-text-secondary', hexToRgbString(getProp(['colors', 'text', 'secondary'], 'rgba(255, 255, 255, 0.7)')));
    
    // Apply border colors
    root.style.setProperty('--color-border', hexToRgbString(getProp(['colors', 'borders', 'normal'], 'rgba(0, 240, 255, 0.2)')));
    
    // Apply status colors
    root.style.setProperty('--color-success', hexToRgbString(getProp(['colors', 'status', 'success'], '#10B981')));
    root.style.setProperty('--color-warning', hexToRgbString(getProp(['colors', 'status', 'warning'], '#F59E0B')));
    root.style.setProperty('--color-error', hexToRgbString(getProp(['colors', 'status', 'error'], '#EF4444')));
    
    // Apply radii
    root.style.setProperty('--radius-panel', getProp(['components', 'panel', 'radius'], '0.75rem'));
    root.style.setProperty('--radius-button', getProp(['components', 'button', 'radius'], '0.5rem'));
    
    // Apply typography if available
    if (typeof getProp(['typography', 'fonts', 'body'], '') === 'string') {
      root.style.setProperty('--font-body', getProp(['typography', 'fonts', 'body'], 'system-ui, sans-serif'));
    }
    
    if (typeof getProp(['typography', 'fonts', 'heading'], '') === 'string') {
      root.style.setProperty('--font-heading', getProp(['typography', 'fonts', 'heading'], 'system-ui, sans-serif'));
    }
    
    // Apply direct theme references for shared variables
    root.style.setProperty('--impulse-primary', getProp(['colors', 'primary'], '#00F0FF'));
    root.style.setProperty('--impulse-secondary', getProp(['colors', 'secondary'], '#FF2D6E'));
    root.style.setProperty('--impulse-accent', getProp(['colors', 'accent'], '#8B5CF6'));
    
    logger.info('Theme applied to document successfully');
  } catch (error) {
    logger.error('Error applying theme to document', { details: safeDetails(error) });
  }
}

// Validate that a theme is properly set with basic checks
export function validateThemeApplication(): boolean {
  try {
    const root = document.documentElement;
    const primary = root.style.getPropertyValue('--color-primary');
    const background = root.style.getPropertyValue('--color-background');
    
    return !!(primary && background);
  } catch (error) {
    logger.error('Error validating theme application', { details: safeDetails(error) });
    return false;
  }
}
