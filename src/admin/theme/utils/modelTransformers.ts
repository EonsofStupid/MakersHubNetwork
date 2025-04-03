import { z } from 'zod';
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { Theme, ComponentTokens } from '@/types/theme';
import { ThemeMetadata } from '@/admin/types/impulse.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';
import { 
  ComponentTokenSchema, 
  ImpulseThemeSchema,
  ThemeSchema,
  ThemeStatusEnum,
  ThemeContextEnum
} from '../validation/themeSchemas';

const logger = getLogger('ThemeTransformers', LogCategory.THEME);

/**
 * Type guard for ComponentTokens
 */
export function isComponentToken(obj: unknown): obj is ComponentTokens {
  if (!obj || typeof obj !== 'object') return false;
  
  const token = obj as Partial<ComponentTokens>;
  return (
    typeof token.id === 'string' &&
    typeof token.component_name === 'string' &&
    token.styles !== undefined
  );
}

/**
 * Safe transform for component tokens
 */
export function transformComponentTokens(data: unknown): ComponentTokens[] {
  if (!Array.isArray(data)) return [];
  
  return data
    .filter(isComponentToken)
    .map(item => {
      try {
        return ComponentTokenSchema.parse(item);
      } catch (error) {
        logger.warn('Invalid component token structure', { 
          details: safeDetails({ token: item, error }) 
        });
        return null;
      }
    })
    .filter((token): token is ComponentTokens => token !== null);
}

/**
 * Safely extract ImpulseTheme structure from design tokens
 */
export function extractImpulseTheme(designTokens: unknown): ImpulseTheme {
  try {
    if (!designTokens || typeof designTokens !== 'object') {
      logger.warn('Invalid design tokens', { details: { type: typeof designTokens } });
      return { name: 'Fallback Theme' };
    }
    
    const themeData = {
      name: 'Extracted Theme',
      colors: (designTokens as any).colors || {},
      effects: (designTokens as any).effects || {},
      animation: (designTokens as any).animation || {},
      components: (designTokens as any).components || {},
      typography: (designTokens as any).typography || {}
    };
    
    const parseResult = ImpulseThemeSchema.safeParse(themeData);
    
    if (!parseResult.success) {
      logger.warn('Failed to parse design tokens to ImpulseTheme', { 
        details: safeDetails(parseResult.error) 
      });
      return { name: 'Fallback Theme' };
    }
    
    return parseResult.data;
  } catch (error) {
    logger.error('Error extracting impulse theme', { details: safeDetails(error) });
    return { name: 'Fallback Theme' };
  }
}

/**
 * Transform raw DB theme to application Theme model
 */
export function transformDbThemeToAppTheme(rawTheme: any): Theme | null {
  try {
    if (!rawTheme || typeof rawTheme !== 'object') {
      logger.warn('Invalid raw theme data', { details: { type: typeof rawTheme } });
      return null;
    }
    
    // Ensure status is valid
    const statusResult = ThemeStatusEnum.safeParse(rawTheme.status);
    const status = statusResult.success ? statusResult.data : 'draft';
    
    // Transform component tokens safely
    const componentTokens = transformComponentTokens(rawTheme.component_tokens || []);
    
    // Create a validated Theme object
    const theme: Theme = {
      id: String(rawTheme.id),
      name: String(rawTheme.name || 'Unnamed Theme'),
      description: String(rawTheme.description || ''),
      status,
      is_default: Boolean(rawTheme.is_default),
      created_by: rawTheme.created_by ? String(rawTheme.created_by) : undefined,
      created_at: String(rawTheme.created_at || new Date().toISOString()),
      updated_at: String(rawTheme.updated_at || new Date().toISOString()),
      published_at: rawTheme.published_at ? String(rawTheme.published_at) : undefined,
      version: Number(rawTheme.version || 1),
      cache_key: rawTheme.cache_key ? String(rawTheme.cache_key) : undefined,
      parent_theme_id: rawTheme.parent_theme_id ? String(rawTheme.parent_theme_id) : undefined,
      design_tokens: typeof rawTheme.design_tokens === 'object' ? rawTheme.design_tokens : {},
      component_tokens: componentTokens,
      composition_rules: typeof rawTheme.composition_rules === 'object' ? rawTheme.composition_rules : {},
      cached_styles: typeof rawTheme.cached_styles === 'object' ? rawTheme.cached_styles : {},
      is_system: Boolean(rawTheme.is_system),
      is_active: Boolean(rawTheme.is_active)
    };
    
    logger.debug('Successfully transformed DB theme to app theme', {
      details: { themeId: theme.id, name: theme.name }
    });
    
    return theme;
  } catch (error) {
    logger.error('Error transforming DB theme to app theme', { details: safeDetails(error) });
    return null;
  }
}

/**
 * Transform theme to metadata summary
 */
export function extractThemeMetadata(theme: Theme | null): ThemeMetadata | null {
  if (!theme) return null;
  
  try {
    return {
      id: theme.id,
      name: theme.name,
      description: theme.description,
      preview_url: undefined,
      created_at: theme.created_at,
      updated_at: theme.updated_at,
      is_system: theme.is_system,
      is_active: theme.is_active
    };
  } catch (error) {
    logger.error('Error extracting theme metadata', { details: safeDetails(error) });
    return null;
  }
}

/**
 * Validate theme context value from any source
 */
export function validateThemeContext(context: unknown): 'site' | 'admin' | 'chat' {
  try {
    const result = ThemeContextEnum.safeParse(context);
    if (result.success) {
      return result.data;
    }
    // Default to 'site' for invalid values
    logger.warn('Invalid theme context value, defaulting to site', { 
      details: { receivedValue: context } 
    });
    return 'site';
  } catch (error) {
    logger.error('Error validating theme context', { details: safeDetails(error) });
    return 'site';
  }
}
