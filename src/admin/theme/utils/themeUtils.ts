
import { ImpulseTheme } from "../types/impulse.types";
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

const logger = getLogger('AdminThemeUtils', { category: LogCategory.THEME });

/**
 * Deep merge utility for objects
 * Used to combine default and custom theme settings
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  Object.keys(source).forEach(key => {
    const sourceValue = source[key as keyof typeof source] as any;
    const targetValue = target[key as keyof typeof target] as any;

    if (
      sourceValue && 
      targetValue && 
      typeof sourceValue === 'object' && 
      typeof targetValue === 'object' && 
      !Array.isArray(sourceValue) && 
      !Array.isArray(targetValue)
    ) {
      result[key as keyof T] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      result[key as keyof T] = sourceValue;
    }
  });

  return result;
}

/**
 * Safely access a nested property in a theme
 * Returns undefined if any part of the path doesn't exist
 */
export function getThemeProperty(
  theme: Partial<ImpulseTheme> | null | undefined, 
  path: string, 
  defaultValue: any = undefined
): any {
  if (!theme) return defaultValue;
  
  const parts = path.split('.');
  let result: any = theme;
  
  for (const part of parts) {
    if (result === undefined || result === null) return defaultValue;
    result = result[part];
  }
  
  return result !== undefined ? result : defaultValue;
}

/**
 * Type for flattened theme property
 */
export interface FlattenedThemeProperty {
  path: string;
  value: any;
  type: 'color' | 'number' | 'string' | 'object';
}

/**
 * Flatten theme object into array of path/value pairs for easier manipulation
 */
export function flattenTheme(theme: Partial<ImpulseTheme> | null | undefined): FlattenedThemeProperty[] {
  if (!theme) return [];
  
  const result: FlattenedThemeProperty[] = [];
  
  function flatten(obj: any, prefix = '') {
    if (!obj || typeof obj !== 'object') return;
    
    Object.entries(obj).forEach(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        flatten(value, path);
      } else {
        let type: 'color' | 'number' | 'string' | 'object' = 'string';
        
        if (typeof value === 'number') {
          type = 'number';
        } else if (typeof value === 'object') {
          type = 'object';
        } else if (typeof value === 'string' && 
          (value.startsWith('#') || 
           value.startsWith('rgb') || 
           value.startsWith('hsl') || 
           value.startsWith('rgba'))) {
          type = 'color';
        }
        
        result.push({
          path,
          value,
          type
        });
      }
    });
  }
  
  flatten(theme);
  return result;
}

/**
 * Convert a theme property path to a readable label
 */
export function getReadableLabel(path: string): string {
  if (!path) return '';
  
  const parts = path.split('.');
  const lastPart = parts[parts.length - 1];
  
  // Convert camelCase to Title Case
  return lastPart
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}

/**
 * Safe accessor for theme colors with default fallbacks
 */
export function getThemeColor(
  theme: Partial<ImpulseTheme> | null | undefined,
  colorPath: string,
  defaultColor: string = '#000000'
): string {
  return getThemeProperty(theme, `colors.${colorPath}`, defaultColor);
}

/**
 * Safe accessor for effect properties
 */
export function getThemeEffect(
  theme: Partial<ImpulseTheme> | null | undefined,
  effectPath: string,
  defaultValue: string = 'none'
): string {
  return getThemeProperty(theme, `effects.${effectPath}`, defaultValue);
}

/**
 * Get CSS variable name for a theme property
 */
export function getCSSVariableName(path: string): string {
  const parts = path.split('.');
  return `--${parts.join('-')}`;
}
