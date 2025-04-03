
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const logger = getLogger('safeThemeAccess', { category: LogCategory.THEME });

/**
 * Safely get a property from a nested object by path
 * Prevents the dreaded "cannot read property X of undefined"
 */
export function safeGet<T>(obj: any, path: string, defaultValue: T): T {
  try {
    if (obj === null || obj === undefined) {
      return defaultValue;
    }
    
    const keys = path.split('.');
    let current: any = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return defaultValue;
      }
      current = current[key];
    }
    
    return (current === null || current === undefined) ? defaultValue : current;
  } catch (error) {
    logger.error('Error safely accessing theme property', { 
      details: { 
        path, 
        error: error instanceof Error ? error.message : String(error),
        defaultValueReturned: true
      } 
    });
    return defaultValue;
  }
}

/**
 * Safely set a property on a nested object by path
 * Creates objects along the way if they don't exist
 */
export function safeSet(obj: any, path: string, value: any): any {
  try {
    if (!obj) {
      obj = {};
    }
    
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (current[key] === undefined) {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
    return obj;
  } catch (error) {
    logger.error('Error safely setting theme property', { 
      details: { 
        path, 
        error: error instanceof Error ? error.message : String(error) 
      } 
    });
    return obj;
  }
}

/**
 * Create a simple utility to get theme properties with specified defaults
 */
export function createThemeAccessor<T>(defaultValues: Record<string, T>) {
  return (theme: any, key: keyof typeof defaultValues) => {
    const path = String(key);
    const defaultValue = defaultValues[key];
    return safeGet(theme, path, defaultValue);
  };
}
