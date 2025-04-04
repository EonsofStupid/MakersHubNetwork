
import { get } from 'lodash';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

// Create a logger for theme utilities
const logger = getLogger('ThemeUtils', { category: LogCategory.THEME });

/**
 * Safely get a property from a theme object with improved type handling
 * @param obj The theme object to extract from
 * @param path The dot-notation path to the property
 * @param defaultValue A fallback value if property doesn't exist
 * @returns The property value or default value
 */
export function getThemeProperty<T>(obj: any, path: string, defaultValue: T): T {
  try {
    // Validate inputs to prevent errors
    if (!obj || typeof obj !== 'object') {
      return defaultValue;
    }
    
    if (!path || typeof path !== 'string') {
      logger.warn('Invalid path provided to getThemeProperty', { details: { path } });
      return defaultValue;
    }

    // Use lodash get for safe property access
    const value = get(obj, path);
    
    // Explicit check for undefined and null
    if (value === undefined || value === null) {
      return defaultValue;
    }
    
    return value as T;
  } catch (error) {
    logger.warn(`Error accessing theme property at path: ${path}`, { 
      details: { error: error instanceof Error ? error.message : 'Unknown error' } 
    });
    return defaultValue;
  }
}

/**
 * Ensure a value is a string with improved handling for complex objects
 * @param value Any value that should be converted to a string
 * @param defaultValue Optional fallback if value is not a string
 * @returns A guaranteed string
 */
export function ensureStringValue(value: any, defaultValue: string = ''): string {
  // Return early for simple cases
  if (value === undefined || value === null) {
    return defaultValue;
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  // Handle primitive types
  if (typeof value !== 'object') {
    return String(value);
  }
  
  // Special handling for color objects
  try {
    // If it's a color object with a main property
    if (value && typeof value === 'object' && 'main' in value && value.main !== undefined) {
      return ensureStringValue(value.main, defaultValue);
    }
    
    // For color objects that have toString methods
    if (value && typeof value === 'object' && 'toString' in value && typeof value.toString === 'function') {
      const result = value.toString();
      if (result && typeof result === 'string' && result !== '[object Object]') {
        return result;
      }
    }
    
    // If it's an RGB object
    if (value && typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value &&
        typeof value.r === 'number' && typeof value.g === 'number' && typeof value.b === 'number') {
      return `rgb(${value.r}, ${value.g}, ${value.b})`;
    }
    
    // Last resort for objects
    return JSON.stringify(value);
  } catch (e) {
    logger.warn('Failed to convert object to string', {
      details: { value, error: e instanceof Error ? e.message : 'Unknown error' }
    });
    return defaultValue;
  }
}

/**
 * Format a CSS variable name from a path
 */
export function formatCssVarName(path: string): string {
  if (!path || typeof path !== 'string') {
    return '';
  }
  return `--${path.replace(/\./g, '-')}`;
}

/**
 * Checks if a CSS color is valid using DOM API
 */
export function isValidColor(color: string): boolean {
  if (!color || typeof color !== 'string') return false;
  
  try {
    // Create a test element to check if the color is valid
    const testEl = document.createElement('div');
    testEl.style.color = color;
    
    return !!testEl.style.color;
  } catch (error) {
    logger.warn('Error validating color', {
      details: { color, error: error instanceof Error ? error.message : 'Unknown error' }
    });
    return false;
  }
}

/**
 * Safely accesses a nested theme property that should be a color string
 * with improved handling for objects with main property
 */
export function getThemeColorValue(theme: any, path: string, defaultColor: string = '#000000'): string {
  if (!theme || typeof theme !== 'object') {
    return defaultColor;
  }
  
  try {
    const value = getThemeProperty(theme, path, null);
    
    // Direct string value
    if (typeof value === 'string') {
      return value;
    }
    
    // Handle nested color object with main property
    if (value && typeof value === 'object' && 'main' in value) {
      return typeof value.main === 'string' ? value.main : defaultColor;
    }
    
    // Return default if nothing worked
    return defaultColor;
  } catch (error) {
    logger.warn(`Error getting theme color at path: ${path}`, { 
      details: { error: error instanceof Error ? error.message : 'Unknown error' } 
    });
    return defaultColor;
  }
}

/**
 * Flatten a nested theme object into key-value pairs with improved type safety
 */
export function flattenTheme(obj: any, prefix: string = ''): Array<{path: string, value: any, type: string}> {
  if (!obj || typeof obj !== 'object') {
    return [];
  }
  
  let result: Array<{path: string, value: any, type: string}> = [];
  
  try {
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
  } catch (error) {
    logger.warn('Error flattening theme object', {
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }
  
  return result;
}

/**
 * Convert a theme property path to a readable label
 */
export function getReadableLabel(path: string): string {
  if (!path || typeof path !== 'string') {
    return '';
  }
  
  try {
    const parts = path.split('.');
    const lastPart = parts[parts.length - 1];
    
    // Convert camelCase to Title Case
    return lastPart
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  } catch (error) {
    logger.warn('Error converting path to readable label', {
      details: { path, error: error instanceof Error ? error.message : 'Unknown error' }
    });
    return path;
  }
}
