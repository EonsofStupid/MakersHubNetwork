
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { Theme } from '@/types/theme';
import { logger } from '@/logging/service/logger.service';
import { LogCategory } from '@/logging';

/**
 * Deep merge utility for theme objects
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key as keyof typeof source])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key as keyof typeof source] });
        } else {
          (output as any)[key] = deepMerge(
            (target as any)[key],
            source[key as keyof typeof source] as any
          );
        }
      } else {
        Object.assign(output, { [key]: source[key as keyof typeof source] });
      }
    });
  }
  
  return output;
}

/**
 * Check if value is an object
 */
function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Get a property from a theme object with fallback
 */
export function getThemeProperty<T>(
  theme: Partial<ImpulseTheme> | Theme | null | undefined, 
  path: string, 
  fallback: T
): T {
  if (!theme) return fallback;
  
  try {
    const parts = path.split('.');
    let current: any = theme;
    
    for (const part of parts) {
      if (current === undefined || current === null) {
        return fallback;
      }
      current = current[part];
    }
    
    return (current !== undefined && current !== null) ? current : fallback;
  } catch (error) {
    logger.error('Error accessing theme property', { 
      category: LogCategory.THEME,
      details: { path, error } 
    });
    return fallback;
  }
}

/**
 * Flatten a theme object into a list of path/value pairs
 * Useful for theme editors and debugging
 */
export function flattenTheme(theme: any): Array<{ path: string; value: any; type: string }> {
  const result: Array<{ path: string; value: any; type: string }> = [];
  
  function flatten(obj: any, currentPath: string = '') {
    if (!obj || typeof obj !== 'object') return;
    
    Object.entries(obj).forEach(([key, value]) => {
      const path = currentPath ? `${currentPath}.${key}` : key;
      
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        flatten(value, path);
      } else {
        const type = getValueType(value);
        result.push({ path, value, type });
      }
    });
  }
  
  flatten(theme);
  return result;
}

/**
 * Get the type of a value for editor purposes
 */
function getValueType(value: any): string {
  if (value === null || value === undefined) return 'empty';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'string') {
    if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) {
      return 'color';
    }
    return 'string';
  }
  if (Array.isArray(value)) return 'array';
  return 'object';
}

/**
 * Convert camelCase or snake_case to readable label
 */
export function getReadableLabel(path: string): string {
  const parts = path.split('.');
  const lastPart = parts[parts.length - 1];
  
  // Convert camelCase or snake_case to space-separated words
  return lastPart
    .replace(/([A-Z])/g, ' $1') // camelCase to space-separated
    .replace(/_/g, ' ') // snake_case to space-separated
    .replace(/^\w/, c => c.toUpperCase()); // Capitalize first letter
}

/**
 * Validate theme schema
 */
export function validateThemeSchema(theme: any): boolean {
  if (!theme) return false;
  
  // Check required top-level properties
  const requiredProps = ['id', 'name', 'colors', 'effects'];
  for (const prop of requiredProps) {
    if (!theme[prop]) return false;
  }
  
  // Check required color properties
  if (!theme.colors.primary || !theme.colors.secondary) return false;
  
  return true;
}
