
import { get, merge } from 'lodash';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

// Create a logger for theme utilities
const logger = getLogger('ThemeUtils', { category: LogCategory.THEME });

/**
 * Safely get a property from a theme object with proper type handling
 * @param obj The theme object to extract from
 * @param path The dot-notation path to the property
 * @param defaultValue A fallback value if property doesn't exist
 * @returns The property value or default value
 */
export function getThemeProperty<T>(obj: any, path: string, defaultValue: T): T {
  try {
    if (!obj || typeof obj !== 'object') {
      return defaultValue;
    }

    const value = get(obj, path);
    return value !== undefined ? value : defaultValue;
  } catch (error) {
    logger.warn(`Error accessing theme property at path: ${path}`, { 
      details: { error: error instanceof Error ? error.message : 'Unknown error' } 
    });
    return defaultValue;
  }
}

/**
 * Ensure a value is a string, to prevent errors with string methods
 * @param value Any value that should be a string
 * @param defaultValue Optional fallback if value is not a string
 * @returns A guaranteed string
 */
export function ensureStringValue(value: any, defaultValue: string = ''): string {
  // Handle simple cases first
  if (typeof value === 'string') {
    return value;
  }
  
  // Handle null/undefined
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  // Handle numbers, booleans and other primitive types
  if (typeof value !== 'object') {
    return String(value);
  }
  
  // Special case: nested object that might be a color object
  if (typeof value === 'object') {
    try {
      // If it's a color background object with a main property
      if (value.main && typeof value.main === 'string') {
        return value.main;
      }
      
      // For color objects that might have a toString()
      if ('toString' in value && typeof value.toString === 'function') {
        const result = value.toString();
        if (result !== '[object Object]') {
          return result;
        }
      }
      
      // If it's a color object with an "r" property, assume it's RGB
      if ('r' in value && 'g' in value && 'b' in value) {
        return `rgb(${value.r}, ${value.g}, ${value.b})`;
      }
      
      // Last resort for objects, JSON stringify
      return JSON.stringify(value);
    } catch (e) {
      logger.warn('Failed to convert object to string', {
        details: { value, error: e instanceof Error ? e.message : 'Unknown error' }
      });
      return defaultValue;
    }
  }
  
  // Final fallback
  return defaultValue;
}

/**
 * Deep merge two objects with type safety
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
  return merge({}, target, source);
}

/**
 * Format a CSS variable name from a path
 */
export function formatCssVarName(path: string): string {
  return `--${path.replace(/\./g, '-')}`;
}

/**
 * Checks if a CSS color is valid
 */
export function isValidColor(color: string): boolean {
  if (!color || typeof color !== 'string') return false;
  
  // Create a test element to check if the color is valid
  const testEl = document.createElement('div');
  testEl.style.color = color;
  
  return !!testEl.style.color;
}

/**
 * Safely accesses a nested theme property that should be a color string
 * and handles cases where it might be an object with a main property
 */
export function getThemeColorValue(theme: any, path: string, defaultColor: string = '#000000'): string {
  const value = getThemeProperty(theme, path, null);
  
  // Handle direct string value
  if (typeof value === 'string') {
    return value;
  }
  
  // Handle nested color object with main property
  if (value && typeof value === 'object' && 'main' in value && typeof value.main === 'string') {
    return value.main;
  }
  
  // Handle background object special case
  if (path === 'colors.background' && value && typeof value === 'object' && 'main' in value) {
    return ensureStringValue(value.main, defaultColor);
  }
  
  // Return default if nothing worked
  return defaultColor;
}

/**
 * Flatten a nested theme object into key-value pairs
 * @param obj The theme object to flatten
 * @param prefix Current path prefix
 * @returns A flat object with paths as keys
 */
export function flattenTheme(obj: any, prefix: string = ''): Array<{path: string, value: any, type: string}> {
  if (!obj || typeof obj !== 'object') {
    return [];
  }
  
  let result: Array<{path: string, value: any, type: string}> = [];
  
  Object.entries(obj).forEach(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result = result.concat(flattenTheme(value, path));
    } else {
      // Determine type for UI purposes
      let type = 'text';
      if (typeof value === 'number') {
        type = 'number';
      } else if (typeof value === 'string') {
        // Check if it looks like a color
        if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) {
          type = 'color';
        }
      }
      
      result.push({
        path,
        value,
        type
      });
    }
  });
  
  return result;
}

/**
 * Convert a theme property path to a readable label
 * Used by the visual theme editor
 */
export function getReadableLabel(path: string): string {
  const parts = path.split('.');
  const label = parts[parts.length - 1]
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase();
  
  return label.charAt(0).toUpperCase() + label.slice(1);
}
