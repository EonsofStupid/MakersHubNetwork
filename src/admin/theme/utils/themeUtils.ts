
import { get } from 'lodash-es';

/**
 * Safely gets a property from a theme using a path string
 * @param theme Theme object to extract property from
 * @param path Path to property (e.g., 'colors.primary')
 * @param defaultValue Default value if property doesn't exist
 */
export function getThemeProperty(theme: any, path: string, defaultValue?: any): any {
  if (!theme) {
    return defaultValue;
  }
  const value = get(theme, path);
  return value !== undefined ? value : defaultValue;
}

/**
 * Deep merges two objects
 * @param target The target object to merge into
 * @param source The source object to merge from
 * @returns A new merged object
 */
export function deepMerge(target: any, source: any): any {
  const output = { ...target };
  
  if (!source || typeof source !== 'object') {
    return output;
  }
  
  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const sourceValue = source[key];
    
    if (
      targetValue && 
      typeof targetValue === 'object' && 
      sourceValue && 
      typeof sourceValue === 'object' && 
      !Array.isArray(targetValue) && 
      !Array.isArray(sourceValue)
    ) {
      output[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      output[key] = sourceValue;
    }
  });
  
  return output;
}

/**
 * Ensures a value is converted to a string
 * @param value Any value
 * @returns String representation of value
 */
export function ensureStringValue(value: any): string {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
}

/**
 * Converts a color hex code to RGB format
 * @param hex Hex color code
 * @returns RGB color object or null if invalid
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const formattedHex = hex.replace(shorthandRegex, (_, r, g, b) => {
    return r + r + g + g + b + b;
  });
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Checks if a theme has all required properties
 * @param theme Theme to validate
 * @returns Boolean indicating if theme is valid
 */
export function validateTheme(theme: any): boolean {
  if (!theme) return false;
  
  const requiredProps = [
    'colors.primary',
    'colors.secondary',
    'colors.background.main',
    'colors.text.primary'
  ];
  
  return requiredProps.every((prop) => {
    const value = getThemeProperty(theme, prop, null);
    return value !== null && value !== undefined;
  });
}
