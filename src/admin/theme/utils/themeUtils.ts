
import { ImpulseTheme } from '../../types/impulse.types';

/**
 * Gets a nested property from a theme object by path
 */
export function getThemeProperty(theme: any, path: string, defaultValue: any = undefined): any {
  if (!theme) return defaultValue;
  
  const parts = path.split('.');
  let current = theme;
  
  for (const part of parts) {
    if (current === undefined || current === null || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[part];
  }
  
  return current !== undefined ? current : defaultValue;
}

/**
 * Deeply merges two objects, preferring values from the second object
 */
export function deepMerge(target: any, source: any): any {
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
 * Checks if a value is an object
 */
function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Generates utility classes from theme for use in components
 */
export function generateUtilityClasses(theme: ImpulseTheme): Record<string, string> {
  return {
    // Text colors
    textPrimary: `text-[${theme.colors.text?.primary || '#FFFFFF'}]`,
    textSecondary: `text-[${theme.colors.text?.secondary || 'rgba(255,255,255,0.7)'}]`,
    textMuted: `text-[${theme.colors.text?.muted || 'rgba(255,255,255,0.5)'}]`,
    
    // Background colors
    bgPrimary: `bg-[${theme.colors.primary}]`,
    bgSecondary: `bg-[${theme.colors.secondary}]`,
    bgMain: `bg-[${theme.colors.background?.main || '#12121A'}]`,
    bgCard: `bg-[${theme.colors.background?.card || '#1E1E1E'}]`,
    
    // Border colors
    borderPrimary: `border-[${theme.colors.primary}]`,
    borderNormal: `border-[${theme.colors.borders?.normal || 'rgba(255,255,255,0.1)'}]`,
    
    // Components
    button: `rounded-[${theme.components?.button?.radius || '0.5rem'}]`,
    panel: `rounded-[${theme.components?.panel?.radius || '0.75rem'}]`,
    
    // Typography
    fontBody: `font-[${theme.typography?.fonts?.body || 'system-ui, sans-serif'}]`,
    fontHeading: `font-[${theme.typography?.fonts?.heading || 'system-ui, sans-serif'}]`,
  };
}
