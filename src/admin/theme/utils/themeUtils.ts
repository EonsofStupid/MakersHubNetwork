
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ThemeUtils', { category: LogCategory.THEME as any });

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
 * Deep merge theme objects in a type-safe way
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
          // For any override value that exists and isn't undefined, 
          // explicitly cast it to the expected type
          if (overrideVal !== undefined) {
            merged[key] = overrideVal as any;
          }
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

/**
 * Generate utility classes from theme tokens
 */
export function generateUtilityClasses(theme: any): Record<string, string> {
  const utilities: Record<string, string> = {};
  
  try {
    if (!theme || typeof theme !== 'object') {
      return utilities;
    }
    
    // Add color utilities
    const colors = theme.colors || {};
    if (colors.primary) utilities['text-primary'] = `color: ${colors.primary};`;
    if (colors.secondary) utilities['text-secondary'] = `color: ${colors.secondary};`;
    if (colors.accent) utilities['text-accent'] = `color: ${colors.accent};`;
    
    if (colors.background?.main) utilities['bg-main'] = `background-color: ${colors.background.main};`;
    if (colors.background?.card) utilities['bg-card'] = `background-color: ${colors.background.card};`;
    
    // Add effect utilities
    const effects = theme.effects || {};
    if (effects.shadows?.sm) utilities['shadow-sm'] = `box-shadow: ${effects.shadows.sm};`;
    if (effects.shadows?.md) utilities['shadow-md'] = `box-shadow: ${effects.shadows.md};`;
    if (effects.shadows?.lg) utilities['shadow-lg'] = `box-shadow: ${effects.shadows.lg};`;
    
    if (effects.glow?.primary) utilities['glow'] = `box-shadow: ${effects.glow.primary};`;
    if (effects.glow?.hover) utilities['hover-glow'] = `&:hover { box-shadow: ${effects.glow.hover}; }`;
    
    // Add typography utilities
    const typography = theme.typography || {};
    if (typography.fonts?.body) utilities['font-body'] = `font-family: ${typography.fonts.body};`;
    if (typography.fonts?.heading) utilities['font-heading'] = `font-family: ${typography.fonts.heading};`;
    if (typography.fonts?.mono) utilities['font-mono'] = `font-family: ${typography.fonts.mono};`;
    
    // Add sizing utilities based on typography
    if (typography.sizes?.xs) utilities['text-xs'] = `font-size: ${typography.sizes.xs};`;
    if (typography.sizes?.sm) utilities['text-sm'] = `font-size: ${typography.sizes.sm};`;
    if (typography.sizes?.base) utilities['text-base'] = `font-size: ${typography.sizes.base};`;
    if (typography.sizes?.lg) utilities['text-lg'] = `font-size: ${typography.sizes.lg};`;
    if (typography.sizes?.xl) utilities['text-xl'] = `font-size: ${typography.sizes.xl};`;
    
    // Add border utilities
    const borders = colors.borders || {};
    if (borders.normal) utilities['border'] = `border: 1px solid ${borders.normal};`;
    if (borders.hover) utilities['border-hover'] = `&:hover { border-color: ${borders.hover}; }`;
    
    // Animation utilities
    const animation = theme.animation || {};
    if (animation.duration?.fast) utilities['transition-fast'] = `transition-duration: ${animation.duration.fast};`;
    if (animation.duration?.normal) utilities['transition-normal'] = `transition-duration: ${animation.duration.normal};`;
    if (animation.duration?.slow) utilities['transition-slow'] = `transition-duration: ${animation.duration.slow};`;
    
  } catch (error) {
    logger.error('Error generating utility classes', { details: safeDetails(error) });
  }
  
  return utilities;
}

/**
 * Deep merge function that works for any object structure
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target };
  
  if (!source || typeof source !== 'object') return output;
  
  Object.keys(source).forEach(key => {
    if (
      source[key] !== null && 
      typeof source[key] === 'object' && 
      !Array.isArray(source[key]) &&
      target[key] !== null && 
      typeof target[key] === 'object' && 
      !Array.isArray(target[key])
    ) {
      output[key] = deepMerge(target[key], source[key]);
    } else if (source[key] !== undefined) {
      output[key] = source[key] as any;
    }
  });
  
  return output;
}
