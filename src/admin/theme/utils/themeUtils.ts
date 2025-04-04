
import { get } from 'lodash';
import { ImpulseTheme } from '@/admin/types/impulse.types';

/**
 * Gets a theme property using dot notation path, with fallback value
 */
export function getThemeProperty(theme: ImpulseTheme, path: string, fallback: any): any {
  return get(theme, path, fallback);
}

/**
 * Ensures a value is a string and provides fallback if not
 */
export function ensureStringValue(value: any, fallback: string): string {
  if (typeof value === 'string') {
    return value;
  }
  return fallback;
}

/**
 * Gets a color value from theme or returns fallback
 */
export function getThemeColorValue(theme: ImpulseTheme, path: string, fallback: string): string {
  const color = getThemeProperty(theme, path, null);
  return ensureStringValue(color, fallback);
}

/**
 * Deep merge utility for theme objects
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceValue = source[key as keyof typeof source];
      
      if (isObject(sourceValue)) {
        if (!(key in target)) {
          Object.assign(output, { [key]: sourceValue });
        } else {
          // Safe type casting with specific types
          const targetValue = target[key as keyof typeof target];
          if (isObject(targetValue)) {
            output[key as keyof T] = deepMerge(
              targetValue as Record<string, any>, 
              sourceValue as Record<string, any>
            ) as any;
          }
        }
      } else {
        Object.assign(output, { [key]: sourceValue });
      }
    });
  }
  
  return output;
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Validates if a theme has all required properties
 */
export function validateTheme(theme: Partial<ImpulseTheme>): boolean {
  if (!theme) return false;
  
  const requiredProperties = ['colors', 'typography', 'effects', 'animation', 'components'];
  
  for (const prop of requiredProperties) {
    if (!theme[prop as keyof ImpulseTheme]) return false;
  }
  
  return true;
}
