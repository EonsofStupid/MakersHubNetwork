
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { Theme } from '@/types/theme';

const logger = getLogger('ThemeUtils', { category: LogCategory.THEME as string });

/**
 * Safely ensures a value is a string or returns a fallback
 */
export function ensureStringValue(value: any, fallback: string = ''): string {
  if (value === undefined || value === null) {
    return fallback;
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  // Log a warning in development
  if (process.env.NODE_ENV === 'development') {
    logger.warn('Expected string value in theme property but got:', { 
      details: { value, type: typeof value } 
    });
  }
  
  return fallback;
}

/**
 * Gets a property from a theme object safely by path
 * @param theme Theme object
 * @param path Dot notation path like 'colors.background.main'
 * @param fallback Fallback value if property doesn't exist or isn't a string
 */
export function getThemeProperty(theme: any, path: string, fallback: string = ''): string {
  if (!theme || typeof theme !== 'object') {
    return fallback;
  }
  
  try {
    const parts = path.split('.');
    let current: any = theme;
    
    for (const part of parts) {
      if (current === undefined || current === null || typeof current !== 'object') {
        return fallback;
      }
      current = current[part];
    }
    
    return ensureStringValue(current, fallback);
  } catch (error) {
    logger.warn(`Error getting theme property: ${path}`, { 
      details: safeDetails(error) 
    });
    return fallback;
  }
}

/**
 * Deep merge utility for objects
 * Used to combine default and custom theme settings
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  Object.keys(source).forEach(key => {
    const sourceValue = source[key as keyof typeof source] as any;
    const targetValue = target[key as keyof typeof target] as any;

    if (
      sourceValue && 
      targetValue && 
      typeof sourceValue === 'object' && 
      typeof targetValue === 'object' && 
      !Array.isArray(sourceValue) && 
      !Array.isArray(targetValue)
    ) {
      result[key as keyof typeof result] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      result[key as keyof typeof result] = sourceValue;
    }
  });

  return result;
}

/**
 * Validates a theme object has all required color properties
 * @returns Array of missing or invalid properties
 */
export function validateThemeSchema(theme: any): string[] {
  const requiredProperties = [
    'colors.primary',
    'colors.secondary',
    'colors.background.main',
    'colors.text.primary'
  ];
  
  const issues: string[] = [];
  
  for (const prop of requiredProperties) {
    const value = getThemeProperty(theme, prop);
    if (!value) {
      issues.push(`Missing required theme property: ${prop}`);
    }
  }
  
  return issues;
}

/**
 * Get the CSS variable name for a theme property
 */
export function getCSSVariableName(path: string): string {
  const parts = path.split('.');
  return `--${parts.join('-')}`;
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
