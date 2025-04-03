
import { Json } from '@/integrations/supabase/types';
import { Theme, ComponentTokens, ThemeContext } from '@/types/theme';
import { getLogger } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';
import { LogCategory } from '@/logging/types';

const logger = getLogger('TransformUtils', { category: LogCategory.THEME as string });

/**
 * Convert database row to application Theme model
 */
export function transformThemeModel(rawData: any): Theme | null {
  try {
    if (!rawData) return null;

    // Transform component_tokens from Json to ComponentTokens[]
    const componentTokens: ComponentTokens[] = Array.isArray(rawData.component_tokens)
      ? rawData.component_tokens.map((token: any) => ({
          id: String(token.id || ''),
          component_name: String(token.component_name || ''),
          styles: typeof token.styles === 'object' ? token.styles : {},
          description: token.description || '',
          theme_id: token.theme_id || rawData.id || '',
          created_at: token.created_at || '',
          updated_at: token.updated_at || '',
          context: validateThemeContext(token.context)
        }))
      : [];

    // Transform to Theme object
    const transformedTheme: Theme = {
      id: String(rawData.id || ''),
      name: String(rawData.name || 'Unnamed Theme'),
      description: rawData.description || '',
      status: validateThemeStatus(rawData.status),
      is_default: !!rawData.is_default,
      created_by: rawData.created_by || undefined,
      created_at: rawData.created_at || new Date().toISOString(),
      updated_at: rawData.updated_at || new Date().toISOString(),
      published_at: rawData.published_at || undefined,
      version: Number(rawData.version || 1),
      cache_key: rawData.cache_key || undefined,
      parent_theme_id: rawData.parent_theme_id || undefined,
      design_tokens: typeof rawData.design_tokens === 'object' ? rawData.design_tokens : {},
      component_tokens: componentTokens,
      composition_rules: typeof rawData.composition_rules === 'object' ? rawData.composition_rules : {},
      cached_styles: typeof rawData.cached_styles === 'object' ? rawData.cached_styles : {},
      is_system: !!rawData.is_system,
      is_active: !!rawData.is_active
    };

    return transformedTheme;
  } catch (error) {
    logger.error('Error transforming theme data', { details: safeDetails(error) });
    return null;
  }
}

/**
 * Convert application Theme model to database format
 */
export function prepareThemeForDatabase(theme: Theme): Record<string, any> {
  try {
    // Convert ComponentTokens[] to raw JSON format
    const rawComponentTokens = theme.component_tokens.map(token => ({
      id: token.id,
      component_name: token.component_name,
      styles: token.styles,
      description: token.description || '',
      theme_id: token.theme_id || theme.id,
      created_at: token.created_at || new Date().toISOString(),
      updated_at: token.updated_at || new Date().toISOString(),
      context: token.context || 'site'
    }));

    // Return database-ready object
    return {
      name: theme.name,
      description: theme.description || '',
      status: theme.status,
      is_default: theme.is_default,
      created_by: theme.created_by,
      created_at: theme.created_at,
      updated_at: theme.updated_at,
      published_at: theme.published_at,
      version: theme.version,
      cache_key: theme.cache_key,
      parent_theme_id: theme.parent_theme_id,
      design_tokens: theme.design_tokens as Json,
      component_tokens: rawComponentTokens as Json,
      composition_rules: theme.composition_rules as Json,
      cached_styles: theme.cached_styles as Json,
      is_system: theme.is_system,
      is_active: theme.is_active
    };
  } catch (error) {
    logger.error('Error preparing theme for database', { details: safeDetails(error) });
    throw error;
  }
}

/**
 * Safely validates theme context value
 */
export function validateThemeContext(context: unknown): ThemeContext {
  if (context === 'site' || context === 'admin' || context === 'chat') {
    return context;
  }
  return 'site'; // Default fallback
}

/**
 * Safely validates theme status value
 */
export function validateThemeStatus(status: unknown): 'draft' | 'published' | 'archived' {
  if (status === 'draft' || status === 'published' || status === 'archived') {
    return status;
  }
  return 'draft'; // Default fallback
}

/**
 * Convert a single theme component from database to application model
 */
export function transformComponentToken(component: any): ComponentTokens | null {
  try {
    if (!component || typeof component !== 'object') {
      return null;
    }

    return {
      id: String(component.id || ''),
      component_name: String(component.component_name || ''),
      styles: typeof component.styles === 'object' ? component.styles : {},
      description: component.description || '',
      theme_id: component.theme_id || '',
      created_at: component.created_at || '',
      updated_at: component.updated_at || '',
      context: validateThemeContext(component.context)
    };
  } catch (error) {
    logger.error('Error transforming component token', { details: safeDetails(error) });
    return null;
  }
}

/**
 * Transform array of raw theme components to ComponentTokens[]
 */
export function transformComponentTokens(components: any[]): ComponentTokens[] {
  if (!Array.isArray(components)) return [];
  
  return components
    .map(transformComponentToken)
    .filter((token): token is ComponentTokens => token !== null);
}
