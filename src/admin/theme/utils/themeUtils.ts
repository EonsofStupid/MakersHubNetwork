
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ThemeUtils', { category: LogCategory.THEME });

/**
 * Deep merge two objects
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
  if (!source) return target;
  if (!target) return source as T;
  
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

/**
 * Check if value is an object
 */
function isObject(item: any): item is Record<string, any> {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Get a nested property from a theme object using a dot-notated path
 */
export function getThemeProperty(
  theme: Partial<ImpulseTheme>,
  path: string,
  defaultValue?: any
): any {
  try {
    if (!theme) return defaultValue;
    
    const parts = path.split('.');
    let value: any = theme;
    
    for (const part of parts) {
      if (value === null || value === undefined || typeof value !== 'object') {
        return defaultValue;
      }
      value = value[part];
    }
    
    return value !== undefined ? value : defaultValue;
  } catch (error) {
    logger.warn(`Error getting theme property: ${path}`, { 
      details: { 
        error: error instanceof Error ? error.message : String(error),
        path
      } 
    });
    return defaultValue;
  }
}

/**
 * Set a nested property on a theme object using a dot-notated path
 */
export function setThemeProperty(
  theme: Partial<ImpulseTheme>,
  path: string,
  value: any
): Partial<ImpulseTheme> {
  try {
    if (!theme) return { ...theme };
    
    const result = { ...theme };
    const parts = path.split('.');
    let current: any = result;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }
    
    current[parts[parts.length - 1]] = value;
    return result;
  } catch (error) {
    logger.warn(`Error setting theme property: ${path}`, { 
      details: { 
        error: error instanceof Error ? error.message : String(error),
        path
      } 
    });
    return theme;
  }
}

/**
 * Convert theme to CSS variables object
 */
export function themeToCssVariables(theme: Partial<ImpulseTheme>): Record<string, string> {
  const variables: Record<string, string> = {};
  
  // Recursive function to flatten nested objects
  function process(obj: any, prefix = '--impulse-') {
    if (!obj || typeof obj !== 'object') return;
    
    Object.entries(obj).forEach(([key, value]) => {
      const varName = `${prefix}${key}`;
      
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        process(value, `${varName}-`);
      } else if (typeof value === 'string' || typeof value === 'number') {
        variables[varName] = String(value);
      }
    });
  }
  
  // Process theme properties
  if (theme.colors) process(theme.colors, '--impulse-');
  if (theme.effects) process(theme.effects, '--impulse-');
  if (theme.typography) process(theme.typography, '--impulse-');
  if (theme.components) process(theme.components, '--impulse-');
  
  return variables;
}

/**
 * Ensure a value is a string or return a fallback
 * @param value The value to check
 * @param fallback Optional fallback value if the input is not a string
 * @returns A string value
 */
export function ensureStringValue(value: unknown, fallback: string = ''): string {
  if (typeof value === 'string') {
    return value;
  }
  
  if (value === null || value === undefined) {
    return fallback;
  }
  
  // Handle non-string primitives by converting to string
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  // For objects, try to use toString() if available
  if (typeof value === 'object') {
    try {
      const str = String(value);
      if (str !== '[object Object]') {
        return str;
      }
    } catch (e) {
      // If toString throws, fall back to the default
    }
  }
  
  return fallback;
}

/**
 * Convert a theme property path to a readable label
 * @param path The dot-notation path
 * @returns A human-readable label
 */
export function getReadableLabel(path: string): string {
  const parts = path.split('.');
  const label = parts[parts.length - 1]
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase();
  
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * Flattens a nested theme object into an array of path/value pairs
 * Used by the theme editor
 * @param theme The theme object to flatten
 * @param prefix Optional prefix for the path
 * @returns Array of flattened theme properties with path, value and type
 */
export function flattenTheme(theme: any, prefix: string = ''): Array<{path: string, value: any, type: string}> {
  if (!theme || typeof theme !== 'object') {
    return [];
  }
  
  let result: Array<{path: string, value: any, type: string}> = [];
  
  Object.entries(theme).forEach(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // Recurse for nested objects
      result = [...result, ...flattenTheme(value, path)];
    } else {
      // Determine the type of the value
      let type = 'string';
      if (typeof value === 'number') {
        type = 'number';
      } else if (typeof value === 'boolean') {
        type = 'boolean';
      } else if (typeof value === 'string') {
        // Check if it's a color (simple check for hex, rgb, rgba, hsl)
        if (/^#([A-Fa-f0-9]{3,8})$/.test(value) || 
            /^rgba?\(/.test(value) || 
            /^hsla?\(/.test(value)) {
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
 * Validates a theme structure against expected schema
 * @param theme The theme to validate
 * @returns An object with validation result and any errors
 */
export function validateThemeSchema(theme: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!theme) {
    errors.push('Theme is null or undefined');
    return { valid: false, errors };
  }
  
  // Check required top-level properties
  if (!theme.colors) {
    errors.push('Missing required property: colors');
  }
  
  // Check required color properties
  if (theme.colors) {
    if (!theme.colors.primary) {
      errors.push('Missing required property: colors.primary');
    }
    
    if (!theme.colors.background || !theme.colors.background.main) {
      errors.push('Missing required property: colors.background.main');
    }
    
    if (!theme.colors.text || !theme.colors.text.primary) {
      errors.push('Missing required property: colors.text.primary');
    }
  }
  
  // Validate that values are of expected types
  if (theme.colors && theme.colors.primary && typeof theme.colors.primary !== 'string') {
    errors.push('Invalid type: colors.primary should be a string');
  }
  
  if (theme.typography && theme.typography.fonts) {
    if (theme.typography.fonts.body && typeof theme.typography.fonts.body !== 'string') {
      errors.push('Invalid type: typography.fonts.body should be a string');
    }
    
    if (theme.typography.fonts.heading && typeof theme.typography.fonts.heading !== 'string') {
      errors.push('Invalid type: typography.fonts.heading should be a string');
    }
  }
  
  // Validate animation durations
  if (theme.animation && theme.animation.durations) {
    const durations = theme.animation.durations;
    for (const [key, value] of Object.entries(durations)) {
      if (typeof value !== 'string') {
        errors.push(`Invalid type: animation.durations.${key} should be a string`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
