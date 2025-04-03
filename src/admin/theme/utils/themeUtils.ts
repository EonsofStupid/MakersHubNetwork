
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { safeGet } from './safeThemeAccess';

const logger = getLogger('ThemeUtils', LogCategory.THEME);

/**
 * Get a property from a theme with type safety and fallback
 */
export function getThemeProperty<T>(
  theme: any,
  path: string,
  defaultValue: T
): T {
  if (!theme) {
    logger.debug('Null theme provided to getThemeProperty, using default', {
      details: { path, defaultUsed: true }
    });
    return defaultValue;
  }
  
  try {
    return safeGet(theme, path, defaultValue);
  } catch (error) {
    logger.warn('Error accessing theme property', {
      details: { path, error: error instanceof Error ? error.message : String(error) }
    });
    return defaultValue;
  }
}

/**
 * Get theme component by name and context
 */
export function getThemeComponent(
  theme: any,
  componentName: string,
  context: 'site' | 'admin' | 'chat' = 'site'
): any {
  if (!theme || !theme.component_tokens) {
    return null;
  }
  
  try {
    const component = theme.component_tokens.find(
      (comp: any) => 
        comp.component_name === componentName && 
        (comp.context === context || !comp.context)
    );
    
    return component || null;
  } catch (error) {
    logger.warn('Error getting theme component', {
      details: { 
        componentName, 
        context,
        error: error instanceof Error ? error.message : String(error)
      }
    });
    return null;
  }
}
