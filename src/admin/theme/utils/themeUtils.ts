
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { Theme } from '@/types/theme';

/**
 * Deep merge two objects
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
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
 * Convert any theme format to ImpulseTheme
 */
export function convertToImpulseTheme(theme: Theme | Partial<ImpulseTheme>): ImpulseTheme {
  // This is a simplified version - in a real app you would have more conversion logic
  if ('design_tokens' in theme) {
    // Convert from Theme format
    const impulse: Partial<ImpulseTheme> = {
      id: theme.id,
      name: theme.name,
      colors: theme.design_tokens?.colors || {},
      typography: theme.design_tokens?.typography || {},
      effects: theme.design_tokens?.effects || {},
      animation: theme.design_tokens?.animation || {},
      components: theme.design_tokens?.components || {}
    };
    
    return impulse as ImpulseTheme;
  }
  
  // Already in ImpulseTheme format
  return theme as ImpulseTheme;
}
