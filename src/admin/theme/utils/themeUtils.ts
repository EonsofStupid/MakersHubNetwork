
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
  if (typeof value === 'string') {
    return value;
  }
  
  // Handle common cases gracefully
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  // If it's an object with toString method, use it
  if (typeof value === 'object' && value !== null) {
    try {
      // For color objects that might have a toString()
      if ('toString' in value && typeof value.toString === 'function') {
        return value.toString();
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
  
  // For numbers and other primitives
  return String(value);
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
