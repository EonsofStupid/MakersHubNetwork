
import { Theme, ComponentTokens, ThemeToken } from '@/types/theme';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

/**
 * Type guard for DB component rows to ensure they match ComponentTokens
 */
export function isValidComponentToken(component: any): component is ComponentTokens {
  return (
    component &&
    typeof component === 'object' &&
    'id' in component &&
    'component_name' in component &&
    'styles' in component
  );
}

const logger = getLogger('ModelTransformers', { category: LogCategory.THEME });

/**
 * Transform a database row to a Theme object with proper typing
 */
export function dbRowToTheme(row: any): Theme | null {
  if (!row || typeof row !== 'object') return null;
  
  try {
    const componentTokens = Array.isArray(row.component_tokens) 
      ? row.component_tokens
          .filter(isValidComponentToken)
          .map(component => ({
            ...component,
            context: component.context || 'site' // Default to 'site' if missing
          }))
      : [];

    return {
      id: row.id || '',
      name: row.name || '',
      description: row.description || '',
      context: row.context || 'site',
      colors: (row.design_tokens?.colors || {}),
      typography: (row.design_tokens?.typography || {}),
      effects: (row.design_tokens?.effects || {}),
      components: (row.design_tokens?.components || {}),
    };
  } catch (error) {
    logger.error('Error transforming DB row to Theme', { 
      details: safeDetails(error)
    });
    return null;
  }
}

/**
 * Transform DB component rows to ComponentTokens array with proper typing
 */
export function dbRowsToComponentTokens(rows: any[]): ComponentTokens[] {
  if (!Array.isArray(rows)) return [];

  try {
    return rows
      .filter(isValidComponentToken)
      .map(row => ({
        id: row.id,
        component_name: row.component_name,
        styles: row.styles || {},
        context: row.context || 'site',
        description: row.description || '',
        theme_id: row.theme_id || '',
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
  } catch (error) {
    logger.error('Error transforming DB rows to ComponentTokens', { 
      details: safeDetails(error)
    });
    return [];
  }
}

/**
 * Transform DB token rows to ThemeToken array with proper typing
 */
export function dbRowsToThemeTokens(rows: any[]): ThemeToken[] {
  if (!Array.isArray(rows)) return [];

  try {
    return rows
      .filter(row => row && typeof row === 'object' && 'id' in row && 'token_name' in row)
      .map(row => ({
        id: row.id,
        token_name: row.token_name,
        token_value: row.token_value || '',
        category: row.category || '',
        description: row.description || '',
        fallback_value: row.fallback_value,
        theme_id: row.theme_id || '',
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
  } catch (error) {
    logger.error('Error transforming DB rows to ThemeTokens', { 
      details: safeDetails(error)
    });
    return [];
  }
}
