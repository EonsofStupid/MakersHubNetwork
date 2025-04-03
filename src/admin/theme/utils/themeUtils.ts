import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ThemeUtils', { category: LogCategory.THEME });

/**
 * Safely get a property from a theme object
 */
export function getThemeProperty<T>(theme: any, path: string, defaultValue: T): T {
  try {
    if (!theme || typeof theme !== 'object') {
      return defaultValue;
    }
    
    const parts = path.split('.');
    let current = theme;
    
    for (const part of parts) {
      if (current === null || current === undefined) {
        return defaultValue;
      }
      current = current[part];
    }
    
    return (current !== null && current !== undefined) ? current : defaultValue;
  } catch (error) {
    logger.warn('Error getting theme property', {
      details: safeDetails({
        path,
        error: error instanceof Error ? error.message : String(error)
      })
    });
    return defaultValue;
  }
}

/**
 * Deep merge theme objects
 */
export function mergeThemes<T extends Record<string, any>>(base: T, override: Partial<T>): T {
  try {
    if (!override || Object.keys(override).length === 0) return base;
    if (!base || Object.keys(base).length === 0) return override as T;
    
    const merged = { ...base };
    
    for (const key in override) {
      if (Object.prototype.hasOwnProperty.call(override, key)) {
        const overrideVal = override[key];
        const baseVal = base[key];
        
        // If both values are objects, deep merge them
        if (
          overrideVal && 
          typeof overrideVal === 'object' && 
          !Array.isArray(overrideVal) &&
          baseVal && 
          typeof baseVal === 'object' && 
          !Array.isArray(baseVal)
        ) {
          merged[key] = mergeThemes(baseVal, overrideVal);
        } else {
          // Otherwise just override
          merged[key] = overrideVal;
        }
      }
    }
    
    return merged;
  } catch (error) {
    logger.error('Error merging themes', { details: safeDetails(error) });
    return base;
  }
}

/**
 * Validate a theme object has all required properties
 */
export function validateThemeStructure(theme: unknown): boolean {
  try {
    if (!theme || typeof theme !== 'object') return false;
    
    const requiredProperties = [
      'colors',
      'typography',
      'effects',
      'animation'
    ];
    
    const themeObj = theme as Record<string, any>;
    
    // Check if all required top-level properties exist
    for (const prop of requiredProperties) {
      if (!(prop in themeObj) || !themeObj[prop] || typeof themeObj[prop] !== 'object') {
        return false;
      }
    }
    
    // Check for critical color properties
    const colors = themeObj.colors as Record<string, any>;
    if (!colors.primary || !colors.secondary) {
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error validating theme structure', { details: safeDetails(error) });
    return false;
  }
}
