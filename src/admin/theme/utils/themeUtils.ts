
import { ImpulseTheme } from "../../types/impulse.types";

/**
 * Deep merge utility function for theme objects
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  Object.keys(source).forEach(key => {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (
      sourceValue && 
      targetValue && 
      typeof sourceValue === 'object' && 
      typeof targetValue === 'object' && 
      !Array.isArray(sourceValue) && 
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue;
    }
  });

  return result;
}

/**
 * Flattens a nested theme object into key-value pairs
 * Used by the visual theme editor to list editable properties
 */
export function flattenTheme(
  theme: ImpulseTheme, 
  prefix = '',
  excludePaths: string[] = []
): Array<{ path: string; value: any; type: string }> {
  const result: Array<{ path: string; value: any; type: string }> = [];

  for (const key in theme) {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    
    // Skip excluded paths
    if (excludePaths.some(path => newPrefix.startsWith(path))) {
      continue;
    }
    
    const value = (theme as any)[key];
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result.push(...flattenTheme(value, newPrefix, excludePaths));
    } else {
      // Determine the type for the editor
      let type = 'text';
      if (typeof value === 'number') {
        type = 'number';
      } else if (/^#([0-9A-F]{3}){1,2}$/i.test(value) || 
               /^rgb/i.test(value) || 
               /^hsl/i.test(value)) {
        type = 'color';
      } else if (typeof value === 'boolean') {
        type = 'boolean';
      }
      
      result.push({ path: newPrefix, value, type });
    }
  }
  
  return result;
}

/**
 * Get a readable label from a theme property path
 */
export function getReadableLabel(path: string): string {
  return path
    .split('.')
    .pop()!
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}

/**
 * Get a value from a nested object using a path string
 */
export function getValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((prev, curr) => {
    return prev && prev[curr] !== undefined ? prev[curr] : undefined;
  }, obj);
}

/**
 * Set a value in a nested object using a path string
 */
export function setValueByPath(obj: any, path: string, value: any): any {
  const copy = { ...obj };
  const keys = path.split('.');
  
  let current = copy;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = { ...current[key] };
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return copy;
}
