
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const logger = getLogger('SafeThemeAccess', { category: LogCategory.THEME });

/**
 * Safely gets a property from an object by path with type safety
 */
export function safeGet<T>(obj: any, path: string, defaultValue: T): T {
  if (!obj) return defaultValue;
  
  try {
    const parts = path.split('.');
    let current = obj;
    
    for (let i = 0; i < parts.length; i++) {
      if (current === null || current === undefined) {
        return defaultValue;
      }
      
      current = current[parts[i]];
    }
    
    // Handle empty strings, undefined or null
    if (current === null || current === undefined || current === '') {
      return defaultValue;
    }
    
    return current as T;
  } catch (error) {
    logger.warn('Error accessing property by path', {
      details: { path, error: error instanceof Error ? error.message : String(error) }
    });
    return defaultValue;
  }
}

/**
 * Deep merge two objects with type safety
 */
export function deepMerge<T extends object = object>(target: T, source: any): T {
  if (!source) return target;
  if (!target) return source as T;
  
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          // @ts-ignore - this is safe due to the recursion
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
 * Check if a value is an object
 */
function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Safe toString to prevent null errors
 */
export function safeToString(value: any): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  try {
    return JSON.stringify(value);
  } catch (e) {
    return String(value);
  }
}

/**
 * Flatten a theme object into key-value pairs with dot notation
 */
export function flattenTheme(obj: any, prefix = ''): Record<string, string> {
  if (!obj || typeof obj !== 'object') return {};
  
  return Object.keys(obj).reduce((acc: Record<string, string>, key: string) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    
    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenTheme(obj[key], prefixedKey));
    } else {
      acc[prefixedKey] = safeToString(obj[key]);
    }
    
    return acc;
  }, {});
}

/**
 * Generate a human-readable label from a theme path
 */
export function getReadableLabel(path: string): string {
  try {
    return path
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
      .replace(/([A-Z])/g, ' $1')
      .trim();
  } catch (e) {
    return path;
  }
}
