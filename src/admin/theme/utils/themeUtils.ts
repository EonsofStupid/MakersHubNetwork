
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { Theme } from '@/types/theme';

const logger = getLogger('themeUtils', { category: LogCategory.THEME });

/**
 * Get a specific property from a theme using dot notation path
 * @param theme The theme object
 * @param path Dot notation path (e.g., 'colors.primary')
 * @param defaultValue Default value if path doesn't exist
 * @returns The property value or default value
 */
export function getThemeProperty<T>(
  theme: ImpulseTheme | Theme | null | undefined,
  path: string,
  defaultValue: T
): T {
  try {
    if (!theme) return defaultValue;
    
    const keys = path.split('.');
    let current: any = theme;
    
    for (const key of keys) {
      if (current === undefined || current === null || typeof current !== 'object') {
        return defaultValue;
      }
      current = current[key];
    }
    
    return current !== undefined && current !== null ? current : defaultValue;
  } catch (error) {
    logger.error(`Error getting theme property: ${path}`, {
      details: { error }
    });
    return defaultValue;
  }
}

/**
 * Set a specific property in a theme using dot notation path
 * @param theme The theme object to modify
 * @param path Dot notation path (e.g., 'colors.primary')
 * @param value The value to set
 * @returns A new theme object with the updated property
 */
export function setThemeProperty<T extends Record<string, any>>(
  theme: T,
  path: string,
  value: any
): T {
  try {
    if (!theme) return theme;
    
    const result = { ...theme };
    const keys = path.split('.');
    let current: any = result;
    
    // Traverse the path and create objects as needed
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      
      // If key doesn't exist or isn't an object, create it
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      
      current = current[key];
    }
    
    // Set the value at the final key
    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;
    
    return result;
  } catch (error) {
    logger.error(`Error setting theme property: ${path}`, {
      details: { error, value }
    });
    return theme;
  }
}

/**
 * Flatten a theme object into an array of properties
 * @param theme The theme object to flatten
 * @returns Array of flattened properties with paths and values
 */
export function flattenTheme(theme: ImpulseTheme | null | undefined): {
  path: string;
  value: any;
  type: string;
}[] {
  const result: { path: string; value: any; type: string }[] = [];
  
  if (!theme) return result;
  
  try {
    const flatten = (obj: any, path: string = '') => {
      if (!obj || typeof obj !== 'object') return;
      
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          flatten(value, currentPath);
        } else {
          // Determine type
          let type = typeof value;
          
          // Special case for color values
          if (
            type === 'string' && 
            (
              (value as string).startsWith('#') || 
              (value as string).startsWith('rgb') ||
              (value as string).startsWith('rgba') ||
              (value as string).startsWith('hsl') ||
              (value as string).match(/^#?[0-9A-Fa-f]{3,8}$/)
            )
          ) {
            type = 'color';
          }
          
          result.push({
            path: currentPath,
            value,
            type
          });
        }
      });
    };
    
    flatten(theme);
    return result;
  } catch (error) {
    logger.error('Error flattening theme', {
      details: { error }
    });
    return [];
  }
}

/**
 * Convert a property path to a human-readable label
 * @param path The property path (e.g., 'colors.primary')
 * @returns Human-readable label (e.g., 'Colors Primary')
 */
export function getReadableLabel(path: string): string {
  try {
    return path
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  } catch (error) {
    logger.error(`Error creating readable label for: ${path}`, {
      details: { error }
    });
    return path;
  }
}

/**
 * Theme registry for managing default theme presets
 */
export function getAllThemes() {
  // This would normally fetch from a theme registry or API
  // For now, return a static array of presets
  return [
    {
      id: 'default',
      name: 'Default Theme',
      description: 'The default Impulsivity theme',
      theme: {} // This would contain the actual theme values
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      description: 'A darker theme variant',
      theme: {} // This would contain the actual theme values
    }
  ];
}
