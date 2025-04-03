
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { ImpulseTheme } from '../../types/impulse.types';

// Initialize logger
const logger = getLogger('ThemeUtils', { category: LogCategory.THEME });

/**
 * Deep merge utility for merging themes
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
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
 * Helper function to check if a value is an object
 */
function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Get a property from a theme object with dot notation
 */
export function getThemeProperty<T>(
  theme: ImpulseTheme | null | undefined, 
  path: string, 
  fallback: T
): T {
  try {
    if (!theme) return fallback;
    
    const keys = path.split('.');
    let result: any = theme;
    
    for (const key of keys) {
      if (result === undefined || result === null) return fallback;
      result = result[key];
    }
    
    return (result !== undefined && result !== null) ? result : fallback;
  } catch (error) {
    logger.error('Error getting theme property', { 
      details: { path, error } 
    });
    return fallback;
  }
}

/**
 * Set a property in a theme object with dot notation
 */
export function setThemeProperty<T>(
  theme: ImpulseTheme,
  path: string,
  value: T
): ImpulseTheme {
  try {
    if (!theme) return theme;
    
    const keys = path.split('.');
    const lastKey = keys.pop();
    if (!lastKey) return theme;
    
    const newTheme = { ...theme };
    let current: any = newTheme;
    
    for (const key of keys) {
      // Create the object path if it doesn't exist
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[lastKey] = value;
    return newTheme;
  } catch (error) {
    logger.error('Error setting theme property', { 
      details: { path, error } 
    });
    return theme;
  }
}

/**
 * Create a safe copy of a theme
 */
export function safeThemeCopy(theme: ImpulseTheme | null): ImpulseTheme {
  if (!theme) return { ...defaultImpulseTokens };
  
  try {
    // Create a deep copy by serializing and deserializing
    return JSON.parse(JSON.stringify(theme));
  } catch (error) {
    logger.error('Error creating safe theme copy', { 
      details: { error } 
    });
    return { ...defaultImpulseTokens };
  }
}

// We need to provide default impulse tokens for the safe theme copy function
const defaultImpulseTokens: ImpulseTheme = {
  name: 'Default Theme',
  colors: {
    primary: '#00F0FF',
    secondary: '#FF2D6E',
    background: {
      main: '#12121A'
    },
    text: {
      primary: '#F6F6F7'
    }
  }
};
