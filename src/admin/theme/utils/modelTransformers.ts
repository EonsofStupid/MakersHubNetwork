
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { ThemeComponent } from '@/stores/theme/types';
import { Theme, ComponentTokens, ThemeToken, ThemeContext } from '@/types/theme';
import { isRecord } from '@/shared/utils/type-guards';

const logger = getLogger('ModelTransformers', { category: LogCategory.THEME as string });

/**
 * Convert a database row to a Theme object
 */
export function dbRowToTheme(row: any): Theme | null {
  if (!row || !isRecord(row)) {
    logger.warn('Invalid row data provided to dbRowToTheme');
    return null;
  }

  try {
    return {
      id: row.id || '',
      name: row.name || '',
      description: row.description || '',
      status: row.status || 'draft',
      is_default: row.is_default || false,
      created_by: row.created_by || '',
      created_at: row.created_at || '',
      updated_at: row.updated_at || '',
      published_at: row.published_at || null,
      version: row.version || 1,
      cache_key: row.cache_key || '',
      parent_theme_id: row.parent_theme_id || null,
      design_tokens: row.design_tokens || {},
      component_tokens: row.component_tokens || [],
      composition_rules: row.composition_rules || {},
      cached_styles: row.cached_styles || {},
      is_system: row.is_system || false,
      is_active: row.is_active || false
    };
  } catch (error) {
    logger.error('Failed to transform database row to Theme', { 
      details: { error: error instanceof Error ? error.message : String(error) }
    });
    return null;
  }
}

/**
 * Convert database rows to ThemeToken array
 */
export function dbRowsToThemeTokens(rows: any[]): ThemeToken[] {
  if (!Array.isArray(rows)) {
    logger.warn('Invalid rows data provided to dbRowsToThemeTokens');
    return [];
  }

  try {
    return rows.map(row => ({
      id: row.id || '',
      token_name: row.token_name || '',
      token_value: row.token_value || '',
      category: row.category || '',
      description: row.description || '',
      fallback_value: row.fallback_value || undefined,
      theme_id: row.theme_id || '',
      created_at: row.created_at || '',
      updated_at: row.updated_at || ''
    }));
  } catch (error) {
    logger.error('Failed to transform database rows to ThemeTokens', { 
      details: { error: error instanceof Error ? error.message : String(error) }
    });
    return [];
  }
}

/**
 * Convert database rows to ComponentTokens array
 */
export function dbRowsToComponentTokens(rows: any[]): ThemeComponent[] {
  if (!Array.isArray(rows)) {
    logger.warn('Invalid rows data provided to dbRowsToComponentTokens');
    return [];
  }

  try {
    return rows.map(row => {
      // Ensure styles is always an object
      let styles: Record<string, any> = {};
      
      if (row.styles) {
        if (typeof row.styles === 'string') {
          try {
            styles = JSON.parse(row.styles);
          } catch (e) {
            logger.warn(`Could not parse styles string for component ${row.id}`);
          }
        } else if (typeof row.styles === 'object') {
          styles = row.styles;
        }
      }
      
      return {
        id: row.id || '',
        component_name: row.component_name || '',
        styles,
        description: row.description || '',
        theme_id: row.theme_id || '',
        created_at: row.created_at || null,
        updated_at: row.updated_at || null,
        context: (row.context as ThemeContext) || 'site'
      };
    });
  } catch (error) {
    logger.error('Failed to transform database rows to ComponentTokens', { 
      details: { error: error instanceof Error ? error.message : String(error) }
    });
    return [];
  }
}

/**
 * Convert ThemeComponent to database format
 */
export function componentToDbFormat(component: ThemeComponent): Record<string, any> {
  return {
    id: component.id,
    component_name: component.component_name,
    styles: component.styles,
    description: component.description || '',
    theme_id: component.theme_id,
    context: component.context || 'site'
  };
}
