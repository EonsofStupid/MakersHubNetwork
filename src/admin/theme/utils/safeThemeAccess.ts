
import { getLogger } from '@/logging';
import { ImpulseTheme } from '../../types/impulse.types';

const logger = getLogger('SafeThemeAccess');

/**
 * Helper function to get a deeply nested property safely from an Impulse theme
 * @param theme The theme to get the property from
 * @param path Dot-notation path to the property (e.g., 'colors.primary')
 * @param defaultValue Default value to return if property doesn't exist
 * @returns The property value or default value if not found
 */
export function safeGet<T>(
  theme: ImpulseTheme | null | undefined,
  path: string,
  defaultValue: T
): T {
  if (!theme) return defaultValue;
  
  try {
    const segments = path.split('.');
    let current: any = theme;
    
    for (const segment of segments) {
      if (current === undefined || current === null) {
        return defaultValue;
      }
      current = current[segment];
    }
    
    return (current !== undefined && current !== null) ? current : defaultValue;
  } catch (error) {
    logger.error('Error in safeGet', { 
      details: { path, error: String(error) } 
    });
    return defaultValue;
  }
}

/**
 * Safely access color values with fallbacks for common theme colors
 */
export function safeColor(
  theme: ImpulseTheme | null | undefined,
  colorPath: string,
  defaultColor: string = '#000000'
): string {
  // Common fallbacks for important colors
  const colorFallbacks: Record<string, string> = {
    'colors.primary': '#00F0FF',
    'colors.secondary': '#FF2D6E',
    'colors.accent': '#F97316',
    'colors.background.main': '#12121A',
    'colors.text.primary': '#F6F6F7'
  };
  
  const fallback = colorFallbacks[colorPath] || defaultColor;
  return safeGet(theme, colorPath, fallback);
}

/**
 * Get safe CSS variable value with proper fallbacks
 */
export function safeCssVar(
  theme: ImpulseTheme | null | undefined,
  path: string,
  cssVarName: string,
  defaultValue: string
): string {
  const value = safeGet(theme, path, '');
  if (!value) {
    logger.debug(`Using default for CSS var ${cssVarName}`, {
      details: { path, defaultValue }
    });
    return `var(--${cssVarName}, ${defaultValue})`;
  }
  return `var(--${cssVarName}, ${value})`;
}

/**
 * Check if an impulse theme has expected required properties
 */
export function isValidImpulseTheme(theme: any): boolean {
  if (!theme) return false;
  
  // Check minimal required properties
  if (!theme.name) return false;
  
  // Check for essential color properties
  const hasColors = theme.colors && 
    (theme.colors.primary || theme.colors.background?.main || theme.colors.text?.primary);
  
  return hasColors === true;
}
