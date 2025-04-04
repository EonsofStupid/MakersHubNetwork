
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { Theme, ThemeStatus, ThemeToken, ComponentTokens } from '@/types/theme';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ThemeUtils', { category: LogCategory.THEME });

/**
 * Deep merge two objects
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
  const output = { ...target } as any;
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceValue = source[key as keyof typeof source];
      const targetValue = (target as any)[key];

      if (
        sourceValue && 
        targetValue && 
        typeof sourceValue === 'object' && 
        typeof targetValue === 'object' && 
        !Array.isArray(sourceValue) && 
        !Array.isArray(targetValue)
      ) {
        output[key] = deepMerge(targetValue, sourceValue as any);
      } else if (sourceValue !== undefined) {
        output[key] = sourceValue;
      }
    });
  }
  
  return output as T;
}

/**
 * Check if value is an object
 */
function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Validate a theme against the required schema
 */
export function validateThemeSchema(theme: any): boolean {
  if (!theme) return false;
  
  // Basic schema validation
  const requiredRootKeys = ['colors', 'typography', 'effects', 'animation'];
  const hasRequiredKeys = requiredRootKeys.every(key => key in theme);
  
  if (!hasRequiredKeys) return false;
  
  // Validate colors
  if (!theme.colors.primary || !theme.colors.secondary) {
    return false;
  }
  
  return true;
}

/**
 * Get a theme property by path
 */
export function getThemeProperty(theme: any, path: string, fallback: any = undefined): any {
  if (!theme) return fallback;
  
  const parts = path.split('.');
  let result = theme;
  
  for (const part of parts) {
    if (!result || typeof result !== 'object') {
      return fallback;
    }
    result = result[part];
  }
  
  return result !== undefined ? result : fallback;
}

/**
 * Ensures a value is a string or provides a fallback
 */
export function ensureStringValue(value: unknown, fallback: string = ''): string {
  if (typeof value === 'string') {
    return value;
  }
  
  if (value === null || value === undefined) {
    return fallback;
  }
  
  // Handle non-string primitives by converting to string
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  // For objects, try to use toString() if available
  if (typeof value === 'object') {
    try {
      const str = String(value);
      if (str !== '[object Object]') {
        return str;
      }
    } catch (e) {
      // If toString throws, fall back to the default
    }
  }
  
  return fallback;
}

/**
 * Flattens a nested theme object into an array of path/value pairs
 */
export function flattenTheme(theme: any, prefix: string = ''): Array<{path: string, value: any, type: string}> {
  if (!theme || typeof theme !== 'object') {
    return [];
  }
  
  let result: Array<{path: string, value: any, type: string}> = [];
  
  Object.entries(theme).forEach(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // Recurse for nested objects
      result = [...result, ...flattenTheme(value, path)];
    } else {
      // Determine the type of the value
      let type = 'string';
      if (typeof value === 'number') {
        type = 'number';
      } else if (typeof value === 'boolean') {
        type = 'boolean';
      } else if (typeof value === 'string') {
        // Check if it's a color (simple check for hex, rgb, rgba, hsl)
        if (/^#([A-Fa-f0-9]{3,8})$/.test(value) || 
            /^rgba?\(/.test(value) || 
            /^hsla?\(/.test(value)) {
          type = 'color';
        }
      }
      
      result.push({
        path,
        value,
        type
      });
    }
  });
  
  return result;
}

/**
 * Convert a theme property path to a readable label
 */
export function getReadableLabel(path: string): string {
  const parts = path.split('.');
  const label = parts[parts.length - 1]
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase();
  
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * Get the CSS variable name for a theme property
 */
export function getCSSVariableName(path: string): string {
  const parts = path.split('.');
  return `--${parts.join('-')}`;
}

/**
 * Generate CSS variables from theme object
 */
export function generateCSSVariables(theme: ImpulseTheme): Record<string, string> {
  const flattened = flattenTheme(theme);
  const cssVars: Record<string, string> = {};
  
  flattened.forEach(({ path, value }) => {
    if (typeof value === 'string' || typeof value === 'number') {
      const varName = getCSSVariableName(path);
      cssVars[varName] = String(value);
    }
  });
  
  return cssVars;
}

/**
 * Generate a unique theme ID
 */
export function generateThemeId(): string {
  return `theme_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a minimal theme with default values
 */
export function createMinimalTheme(name: string): Partial<Theme> {
  return {
    name,
    description: `${name} theme`,
    status: 'draft' as ThemeStatus,
    is_default: false,
    version: 1,
    design_tokens: {
      colors: {
        primary: '#00F0FF',
        secondary: '#FF2D6E',
        background: {
          main: '#12121A'
        },
        text: {
          primary: '#FFFFFF'
        }
      }
    },
    component_tokens: [],
    is_system: false
  };
}

/**
 * Check if two themes are equivalent
 */
export function areThemesEqual(themeA: ImpulseTheme, themeB: ImpulseTheme): boolean {
  // Simple implementation: compare stringified versions
  // In a production app, you might want a more sophisticated comparison
  try {
    const stringA = JSON.stringify(themeA);
    const stringB = JSON.stringify(themeB);
    return stringA === stringB;
  } catch (error) {
    logger.error('Error comparing themes', {
      details: safeDetails(error)
    });
    return false;
  }
}
