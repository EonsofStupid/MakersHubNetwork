
import { ImpulseTheme } from '@/admin/types/impulse.types';

/**
 * Deep merge utility for theme objects
 * Merges source into target, handling nested objects properly
 */
export function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  if (!source) return target;
  
  const output = { ...target };
  
  Object.keys(source).forEach(key => {
    const targetValue = output[key as keyof T];
    const sourceValue = source[key as keyof T];
    
    if (
      targetValue && 
      sourceValue && 
      typeof targetValue === 'object' && 
      typeof sourceValue === 'object' &&
      !Array.isArray(targetValue) && 
      !Array.isArray(sourceValue)
    ) {
      // Recursively merge objects
      output[key as keyof T] = deepMerge(
        targetValue as unknown as object, 
        sourceValue as unknown as object
      ) as any;
    } else {
      // Replace value directly
      output[key as keyof T] = sourceValue !== undefined ? sourceValue : targetValue;
    }
  });
  
  return output;
}

/**
 * Safe theme access - get value or default without throwing errors
 */
export function safeThemeAccess<T>(
  theme: ImpulseTheme | null | undefined,
  path: string,
  defaultValue: T
): T {
  if (!theme) return defaultValue;
  
  try {
    const parts = path.split('.');
    let current: any = theme;
    
    for (const part of parts) {
      if (current === undefined || current === null) {
        return defaultValue;
      }
      current = current[part];
    }
    
    return current !== undefined && current !== null ? current : defaultValue;
  } catch (err) {
    return defaultValue;
  }
}

/**
 * Generate a CSS variable name from a theme property path
 */
export function themePathToCssVar(path: string): string {
  return '--' + path.replace(/\./g, '-');
}

/**
 * Check if a theme is a valid ImpulseTheme
 */
export function isValidImpulseTheme(theme: unknown): theme is ImpulseTheme {
  if (!theme || typeof theme !== 'object') return false;
  
  const requiredProps = ['name', 'colors', 'typography', 'effects', 'animation', 'components'];
  const t = theme as Partial<ImpulseTheme>;
  
  return requiredProps.every(prop => prop in t);
}

/**
 * Create a theme id from a theme name
 */
export function generateThemeId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
