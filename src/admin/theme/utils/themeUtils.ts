
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { ImpulseTheme } from '@/admin/types/impulse.types';

const logger = getLogger('ThemeUtils', { category: LogCategory.THEME as string });

/**
 * Get a property from a theme object with type safety and fallback
 */
export function getThemeProperty<T extends Record<string, any>>(
  theme: T | null | undefined, 
  path: string, 
  fallback: any
): any {
  if (!theme) return fallback;
  
  try {
    const parts = path.split('.');
    let current: any = theme;
    
    for (const part of parts) {
      if (current === undefined || current === null) {
        return fallback;
      }
      current = current[part];
    }
    
    return current !== undefined && current !== null ? current : fallback;
  } catch (error) {
    logger.warn(`Error getting theme property: ${path}`, {
      details: {
        error: error instanceof Error ? error.message : String(error),
        fallback
      }
    });
    return fallback;
  }
}

/**
 * Deep merge utility for combining theme objects
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  if (!source) return target;
  
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const k = key as Extract<keyof T, string>;
      
      if (isObject(source[k])) {
        if (!(k in target)) {
          Object.assign(output, { [k]: source[k] });
        } else {
          output[k] = deepMerge(target[k], source[k] as any);
        }
      } else {
        Object.assign(output, { [k]: source[k] });
      }
    });
  }
  
  return output;
}

/**
 * Check if a value is an object
 */
function isObject(item: any): item is Record<string, any> {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Get the effective shadow for a theme
 */
export function getThemeShadow(theme: ImpulseTheme | null, size: 'sm' | 'md' | 'lg' | 'xl' = 'md'): string {
  if (!theme || !theme.effects || !theme.effects.shadows) {
    return '0 4px 8px rgba(0, 0, 0, 0.1)';
  }
  
  return theme.effects.shadows[size] || '0 4px 8px rgba(0, 0, 0, 0.1)';
}

/**
 * Get theme animation duration
 */
export function getThemeAnimationDuration(theme: ImpulseTheme | null, speed: 'fast' | 'normal' | 'slow' = 'normal'): string {
  if (!theme || !theme.animation || !theme.animation.duration) {
    return speed === 'fast' ? '150ms' : speed === 'slow' ? '500ms' : '300ms';
  }
  
  return theme.animation.duration[speed] || '300ms';
}

/**
 * Get theme font family
 */
export function getThemeFontFamily(theme: ImpulseTheme | null, type: 'body' | 'heading' | 'mono' = 'body'): string {
  if (!theme || !theme.typography || !theme.typography.fonts) {
    return 'system-ui, sans-serif';
  }
  
  return theme.typography.fonts[type] || 'system-ui, sans-serif';
}

/**
 * Get theme font size
 */
export function getThemeFontSize(theme: ImpulseTheme | null, size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' = 'base'): string {
  if (!theme || !theme.typography || !theme.typography.sizes) {
    return '1rem';
  }
  
  return theme.typography.sizes[size] || '1rem';
}
