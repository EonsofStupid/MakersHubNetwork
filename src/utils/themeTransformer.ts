import { Theme, ComponentTokens, ThemeContext, ThemeToken } from '@/types/theme';
import { useLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = useLogger('themeTransformer', { category: LogCategory.THEME });

/**
 * Safely transforms raw Supabase data into a Theme object
 */
export function transformSupabaseTheme(rawData: any): Theme | null {
  try {
    if (!rawData || typeof rawData !== 'object') {
      logger.warn('Invalid theme data received from Supabase', { 
        details: { type: typeof rawData } 
      });
      return null;
    }

    // Helper function to safely get properties
    const getSafe = <T>(obj: any, path: string[], fallback: T): T => {
      try {
        let current = obj;
        for (const key of path) {
          if (current === null || current === undefined) return fallback;
          current = current[key];
        }
        return (current !== null && current !== undefined) ? current : fallback;
      } catch (e) {
        return fallback;
      }
    };

    // Safely transform component tokens
    const safeComponentTokens: ComponentTokens[] = Array.isArray(rawData.component_tokens) 
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
      component_tokens: safeComponentTokens,
      composition_rules: typeof rawData.composition_rules === 'object' ? rawData.composition_rules : {},
      cached_styles: typeof rawData.cached_styles === 'object' ? rawData.cached_styles : {},
      is_system: !!rawData.is_system,
      is_active: !!rawData.is_active
    };

    logger.debug('Successfully transformed theme data', {
      details: {
        themeId: transformedTheme.id,
        tokenCount: safeComponentTokens.length
      }
    });

    return transformedTheme;
  } catch (error) {
    logger.error('Error transforming theme data', { details: safeDetails(error) });
    return null;
  }
}

/**
 * Safely validates theme context value
 */
function validateThemeContext(context: unknown): ThemeContext {
  if (context === 'site' || context === 'admin' || context === 'chat') {
    return context;
  }
  return 'site'; // Default fallback
}

/**
 * Safely validates theme status value
 */
function validateThemeStatus(status: unknown): 'draft' | 'published' | 'archived' {
  if (status === 'draft' || status === 'published' || status === 'archived') {
    return status;
  }
  return 'draft'; // Default fallback
}

/**
 * Safely transforms raw Supabase data into ThemeToken objects
 */
export function transformThemeTokens(rawTokens: any[]): ThemeToken[] {
  if (!Array.isArray(rawTokens)) return [];
  
  try {
    return rawTokens.map(token => ({
      id: String(token.id || ''),
      token_name: String(token.token_name || ''),
      token_value: String(token.token_value || ''),
      category: String(token.category || ''),
      description: token.description || undefined,
      fallback_value: token.fallback_value || undefined,
      theme_id: token.theme_id || undefined,
      created_at: token.created_at || undefined,
      updated_at: token.updated_at || undefined
    }));
  } catch (error) {
    logger.error('Error transforming theme tokens', { details: safeDetails(error) });
    return [];
  }
}
