
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const logger = getLogger('ThemeUtils', { category: LogCategory.THEME as string });

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
