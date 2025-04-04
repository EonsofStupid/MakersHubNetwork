
import { get, has, isObject } from 'lodash-es';
import { ImpulseTheme } from '@/admin/types/impulse.types';

/**
 * Safely get a property from a theme object with fallback
 */
export function getThemeProperty<T>(
  theme: ImpulseTheme | Record<string, any> | null | undefined,
  path: string,
  fallback: T
): T {
  if (!theme) return fallback;
  
  return get(theme, path, fallback);
}

/**
 * Ensure the value is a string
 */
export function ensureStringValue(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

/**
 * Ensure the value is a number
 */
export function ensureNumberValue(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) return parsed;
  }
  return 0;
}

/**
 * Check if theme has a specific property
 */
export function hasThemeProperty(
  theme: ImpulseTheme | Record<string, any> | null | undefined,
  path: string
): boolean {
  if (!theme) return false;
  return has(theme, path);
}

/**
 * Get a color value from the theme, with proper fallback
 */
export function getThemeColorValue(
  theme: ImpulseTheme | Record<string, any> | null | undefined,
  path: string,
  fallback: string
): string {
  const value = getThemeProperty<string | undefined>(theme, path, undefined);
  
  if (!value) return fallback;
  return value;
}

/**
 * Deep merge theme objects
 */
export function mergeThemes<T extends Record<string, any>>(base: T, override: Partial<T>): T {
  const result = { ...base };

  for (const key in override) {
    if (!Object.prototype.hasOwnProperty.call(override, key)) continue;
    
    if (isObject(result[key]) && isObject(override[key])) {
      result[key] = mergeThemes(result[key], override[key] as any);
    } else if (override[key] !== undefined) {
      result[key] = override[key];
    }
  }

  return result;
}
