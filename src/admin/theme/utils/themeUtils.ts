
/**
 * Theme utility functions
 */

import { ImpulseTheme } from '@/admin/types/impulse.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const logger = getLogger('ThemeUtils', { category: LogCategory.THEME });

/**
 * Safely get a property from a theme using a dot-notation path
 * @param theme - Theme object
 * @param path - Dot-notation path to property (e.g. "colors.primary")
 * @param defaultValue - Default value if property doesn't exist
 * @returns Property value or default value
 */
export function getThemeProperty<T>(theme: Partial<ImpulseTheme> | null, path: string, defaultValue: T): T {
  if (!theme) {
    return defaultValue;
  }
  
  try {
    const parts = path.split('.');
    let current: any = theme;
    
    for (const part of parts) {
      if (current === undefined || current === null) {
        return defaultValue;
      }
      current = current[part];
    }
    
    return (current !== undefined && current !== null) ? current as T : defaultValue;
  } catch (error) {
    logger.warn(`Error getting theme property: ${path}`, {
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    return defaultValue;
  }
}

/**
 * Get a theme color value, handling nested objects
 * @param theme - Theme object
 * @param path - Path to color property
 * @param defaultValue - Default color if not found
 * @returns Color value or default
 */
export function getThemeColorValue(theme: Partial<ImpulseTheme> | null, path: string, defaultValue: string): string {
  const value = getThemeProperty<any>(theme, path, defaultValue);
  
  // If value is a string, return directly
  if (typeof value === 'string') {
    return value;
  }
  
  // If value is an object with a 'value' property (common in theme systems)
  if (value && typeof value === 'object' && 'value' in value) {
    return typeof value.value === 'string' ? value.value : defaultValue;
  }
  
  return defaultValue;
}

/**
 * Ensure a value is a string
 * @param value - Value to check
 * @param defaultValue - Default value if not a string
 * @returns String value or default
 */
export function ensureStringValue(value: any, defaultValue: string): string {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  try {
    // If value is a number or boolean, convert to string
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    
    // If value is an object with toString method
    if (typeof value === 'object' && 'toString' in value) {
      return value.toString();
    }
  } catch (e) {
    // Fall back to default value on error
  }
  
  return defaultValue;
}

/**
 * Flattens a theme object into an array of key/value pairs
 * Useful for theme editors to display properties in a list
 */
export function flattenTheme(theme: any) {
  if (!theme) return [];
  
  const result: { path: string; value: any; type: string }[] = [];
  
  function flatten(obj: any, prefix = '') {
    if (!obj || typeof obj !== 'object') return;
    
    Object.entries(obj).forEach(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        flatten(value, path);
      } else {
        let type = 'string';
        if (typeof value === 'number') type = 'number';
        else if (typeof value === 'boolean') type = 'boolean';
        else if (key.includes('color') || path.includes('color') || 
                (typeof value === 'string' && 
                 (value.startsWith('#') || 
                  value.startsWith('rgb') || 
                  value.startsWith('hsl')))) {
          type = 'color';
        }
        
        result.push({ path, value, type });
      }
    });
  }
  
  flatten(theme);
  return result;
}

/**
 * Converts a dot-notation path to a readable label
 * e.g. "colors.primary" -> "Colors Primary"
 */
export function getReadableLabel(path: string): string {
  if (!path) return '';
  
  return path
    .split('.')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Create a theme from values in CSS variables
 * Useful for extracting the current theme from the DOM
 */
export function createThemeFromCssVariables(): Partial<ImpulseTheme> {
  const styles = getComputedStyle(document.documentElement);
  
  return {
    colors: {
      primary: styles.getPropertyValue('--color-primary').trim(),
      secondary: styles.getPropertyValue('--color-secondary').trim(),
      accent: styles.getPropertyValue('--color-accent').trim(),
      background: {
        main: styles.getPropertyValue('--color-bg-main').trim(),
        overlay: styles.getPropertyValue('--color-bg-overlay').trim(),
        card: styles.getPropertyValue('--color-bg-card').trim(),
        alt: styles.getPropertyValue('--color-bg-alt').trim()
      },
      text: {
        primary: styles.getPropertyValue('--color-text-primary').trim(),
        secondary: styles.getPropertyValue('--color-text-secondary').trim(),
        accent: styles.getPropertyValue('--color-text-accent').trim(),
        muted: styles.getPropertyValue('--color-text-muted').trim()
      },
      borders: {
        normal: styles.getPropertyValue('--color-border').trim(),
        hover: styles.getPropertyValue('--color-border-hover').trim(),
        active: styles.getPropertyValue('--color-border').trim(),
        focus: styles.getPropertyValue('--color-border').trim()
      },
      status: {
        success: styles.getPropertyValue('--color-success').trim(),
        warning: styles.getPropertyValue('--color-warning').trim(),
        error: styles.getPropertyValue('--color-error').trim(),
        info: styles.getPropertyValue('--color-info').trim()
      }
    }
  };
}
