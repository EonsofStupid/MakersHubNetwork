
import { ImpulseTheme } from '@/admin/types/impulse.types';
import get from 'lodash-es/get';
import { validateColor } from './colorUtils';

/**
 * Get a property from a theme object using lodash's get for safe access
 * @param theme The theme object
 * @param path Dot notation path to the property
 * @param defaultValue Default value if property doesn't exist
 */
export function getThemeProperty<T>(
  theme: Partial<ImpulseTheme> | undefined | null, 
  path: string, 
  defaultValue: T
): T {
  if (!theme) return defaultValue;
  
  const value = get(theme, path, defaultValue);
  return value !== undefined ? value : defaultValue;
}

/**
 * Get a color value from the theme with validation
 * @param theme The theme object
 * @param path Dot notation path to the property
 * @param defaultValue Default value if property doesn't exist or is invalid
 */
export function getThemeColorValue(
  theme: Partial<ImpulseTheme> | undefined | null,
  path: string,
  defaultValue: string
): string {
  const colorValue = getThemeProperty(theme, path, defaultValue);
  
  // Validate color format
  if (typeof colorValue === 'string' && validateColor(colorValue)) {
    return colorValue;
  }
  
  return defaultValue;
}

/**
 * Ensure a theme value is a valid string
 */
export function ensureStringValue(value: unknown, defaultValue: string): string {
  if (typeof value === 'string' && value.trim() !== '') {
    return value;
  }
  
  if (typeof value === 'number') {
    return value.toString();
  }
  
  return defaultValue;
}

/**
 * Create a lookup function that safely accesses the theme
 */
export function createThemeLookup(theme: Partial<ImpulseTheme> | null | undefined) {
  return function lookup<T>(path: string, defaultValue: T): T {
    return getThemeProperty(theme, path, defaultValue);
  };
}

/**
 * Check if a theme contains a specific feature
 */
export function hasThemeFeature(
  theme: Partial<ImpulseTheme> | null | undefined,
  featurePath: string
): boolean {
  if (!theme) return false;
  return get(theme, featurePath) !== undefined;
}
