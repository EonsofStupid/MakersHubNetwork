
import { Theme, ComponentTokens, ThemeToken, ThemeContext } from '@/types/theme';
import { ThemeComponent } from '@/stores/theme/types';
import { Json } from '@/integrations/supabase/types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ModelTransformers', { category: LogCategory.THEME as any });

/**
 * Convert a DB row to a Theme object
 */
export function dbRowToTheme(row: any): Theme | null {
  try {
    if (!row || typeof row !== 'object') return null;
    
    return {
      id: row.id || '',
      name: row.name || '',
      description: row.description || '',
      status: row.status || 'draft',
      is_default: Boolean(row.is_default),
      created_by: row.created_by,
      created_at: row.created_at || new Date().toISOString(),
      updated_at: row.updated_at || new Date().toISOString(),
      published_at: row.published_at,
      version: row.version || 1,
      cache_key: row.cache_key,
      parent_theme_id: row.parent_theme_id,
      design_tokens: row.design_tokens || {},
      component_tokens: Array.isArray(row.component_tokens) 
        ? row.component_tokens.map(safeParseComponentToken)
        : [],
      composition_rules: row.composition_rules || {},
      cached_styles: row.cached_styles || {},
      is_system: Boolean(row.is_system),
      is_active: Boolean(row.is_active),
      context: (row.context as ThemeContext) || 'site',
    };
  } catch (error) {
    logger.error('Error converting DB row to Theme', { details: safeDetails(error) });
    return null;
  }
}

/**
 * Safely parse a component token
 */
function safeParseComponentToken(token: any): ComponentTokens {
  try {
    if (!token || typeof token !== 'object') {
      return {
        id: `fallback-${Date.now()}`,
        component_name: 'unknown',
        styles: {},
      };
    }
    
    return {
      id: token.id || `token-${Date.now()}`,
      component_name: token.component_name || '',
      styles: typeof token.styles === 'object' ? token.styles : {},
      description: token.description || '',
      theme_id: token.theme_id,
      context: token.context as ThemeContext || 'site',
      created_at: token.created_at || '',
      updated_at: token.updated_at || ''
    };
  } catch (error) {
    logger.error('Error parsing component token', { details: safeDetails(error) });
    return {
      id: `error-${Date.now()}`,
      component_name: 'error',
      styles: {},
    };
  }
}

/**
 * Convert DB rows to Theme Component tokens
 */
export function dbRowsToComponentTokens(rows: any[]): ThemeComponent[] {
  try {
    if (!Array.isArray(rows)) return [];
    
    return rows.map(row => {
      if (!row || typeof row !== 'object') return null;
      
      const parsed: ThemeComponent = {
        id: row.id || `gen-${Date.now()}`,
        component_name: row.component_name || '',
        styles: typeof row.styles === 'object' ? row.styles : {},
        theme_id: row.theme_id || '',
        context: (row.context as ThemeContext) || 'site',
        description: row.description || '',
        created_at: row.created_at || '',
        updated_at: row.updated_at || ''
      };
      
      return parsed;
    }).filter(Boolean) as ThemeComponent[];
  } catch (error) {
    logger.error('Error converting DB rows to ComponentTokens', { details: safeDetails(error) });
    return [];
  }
}

/**
 * Convert DB rows to Theme Tokens
 */
export function dbRowsToThemeTokens(rows: any[]): ThemeToken[] {
  try {
    if (!Array.isArray(rows)) return [];
    
    return rows.map(row => {
      if (!row || typeof row !== 'object') return null;
      
      return {
        id: row.id || '',
        token_name: row.token_name || '',
        token_value: row.token_value || '',
        category: row.category || '',
        description: row.description || '',
        fallback_value: row.fallback_value || '',
        theme_id: row.theme_id || '',
        created_at: row.created_at || '',
        updated_at: row.updated_at || ''
      };
    }).filter(Boolean) as ThemeToken[];
  } catch (error) {
    logger.error('Error converting DB rows to ThemeTokens', { details: safeDetails(error) });
    return [];
  }
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  
  try {
    return JSON.parse(value) as T;
  } catch (e) {
    return fallback;
  }
}

/**
 * Convert ComponentTokens to ThemeComponents (type coercion with validation)
 */
export function componentTokensToThemeComponents(tokens: ComponentTokens[]): ThemeComponent[] {
  try {
    if (!Array.isArray(tokens)) return [];
    
    return tokens
      .filter(token => token && typeof token === 'object' && token.id)
      .map(token => ({
        id: token.id,
        component_name: token.component_name,
        styles: typeof token.styles === 'object' ? token.styles : {},
        theme_id: token.theme_id || '',
        context: (token.context as ThemeContext) || 'site',
        description: token.description || '',
        created_at: token.created_at || '',
        updated_at: token.updated_at || ''
      }));
  } catch (error) {
    logger.error('Error converting ComponentTokens to ThemeComponents', { details: safeDetails(error) });
    return [];
  }
}
