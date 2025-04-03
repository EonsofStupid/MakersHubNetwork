
import { Theme, ThemeToken, ComponentTokens } from '@/types/theme';
import { ThemeComponent } from '@/stores/theme/types';
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ThemeModelTransformers', { category: LogCategory.THEME as string });

/**
 * Transform a database row to a Theme object
 */
export function dbRowToTheme(row: any): Theme | null {
  try {
    if (!row || typeof row !== 'object') {
      logger.warn('Invalid row data for theme transformation');
      return null;
    }
    
    return {
      id: row.id,
      name: row.name,
      description: row.description || '',
      status: row.status || 'draft',
      is_default: row.is_default || false,
      created_by: row.created_by,
      created_at: row.created_at || '',
      updated_at: row.updated_at || '',
      published_at: row.published_at,
      version: row.version || 1,
      cache_key: row.cache_key,
      parent_theme_id: row.parent_theme_id,
      design_tokens: row.design_tokens || {},
      component_tokens: Array.isArray(row.component_tokens) ? row.component_tokens : [],
      composition_rules: row.composition_rules || {},
      cached_styles: row.cached_styles || {},
    };
  } catch (error) {
    logger.error('Error transforming DB row to Theme', { details: safeDetails(error) });
    return null;
  }
}

/**
 * Transform a database row to a ThemeToken object
 */
export function dbRowToThemeToken(row: any): ThemeToken | null {
  try {
    if (!row || typeof row !== 'object') {
      logger.warn('Invalid row data for theme token transformation');
      return null;
    }
    
    return {
      id: row.id,
      token_name: row.token_name,
      token_value: row.token_value,
      category: row.category,
      description: row.description || '',
      fallback_value: row.fallback_value,
      theme_id: row.theme_id,
      created_at: row.created_at || '',
      updated_at: row.updated_at || '',
    };
  } catch (error) {
    logger.error('Error transforming DB row to ThemeToken', { details: safeDetails(error) });
    return null;
  }
}

/**
 * Transform database rows to ThemeToken array
 */
export function dbRowsToThemeTokens(rows: any[]): ThemeToken[] {
  if (!Array.isArray(rows)) {
    logger.warn('Invalid rows data for theme tokens transformation');
    return [];
  }
  
  return rows
    .map(row => dbRowToThemeToken(row))
    .filter((token): token is ThemeToken => token !== null);
}

/**
 * Transform a database row to a ComponentTokens object
 */
export function dbRowToComponentToken(row: any): ThemeComponent | null {
  try {
    if (!row || typeof row !== 'object') {
      logger.warn('Invalid row data for component token transformation');
      return null;
    }
    
    return {
      id: row.id,
      component_name: row.component_name,
      styles: row.styles || {},
      description: row.description || '',
      theme_id: row.theme_id,
      context: row.context || 'site',
      created_at: row.created_at || '',
      updated_at: row.updated_at || '',
    };
  } catch (error) {
    logger.error('Error transforming DB row to ComponentToken', { details: safeDetails(error) });
    return null;
  }
}

/**
 * Transform database rows to ComponentTokens array
 */
export function dbRowsToComponentTokens(rows: any[]): ThemeComponent[] {
  if (!Array.isArray(rows)) {
    logger.warn('Invalid rows data for component tokens transformation');
    return [];
  }
  
  return rows
    .map(row => dbRowToComponentToken(row))
    .filter((token): token is ThemeComponent => token !== null);
}

/**
 * Format a ThemeComponent for database insertion/update
 */
export function componentToDbFormat(component: ThemeComponent): Record<string, any> {
  return {
    component_name: component.component_name,
    styles: component.styles || {},
    description: component.description || '',
    theme_id: component.theme_id,
    context: component.context || 'site',
  };
}

/**
 * Convert a theme object to an ImpulseTheme format
 */
export function themeToImpulseTheme(theme: Theme): ImpulseTheme {
  try {
    if (!theme?.design_tokens) {
      logger.warn('Invalid theme data for impulse transformation');
      throw new Error('Invalid theme data');
    }
    
    const design = theme.design_tokens;
    
    return {
      id: theme.id,
      name: theme.name,
      description: theme.description,
      version: theme.version?.toString(),
      colors: {
        primary: design.colors?.primary || '#00F0FF',
        secondary: design.colors?.secondary || '#FF2D6E',
        accent: design.colors?.accent || '#8B5CF6',
        background: {
          main: design.colors?.background?.main || '#12121A',
          overlay: design.colors?.background?.overlay,
          card: design.colors?.background?.card,
          alt: design.colors?.background?.alt,
        },
        text: {
          primary: design.colors?.text?.primary || '#F6F6F7',
          secondary: design.colors?.text?.secondary,
          accent: design.colors?.text?.accent,
          muted: design.colors?.text?.muted,
        },
        borders: design.colors?.borders,
        status: design.colors?.status,
      },
      effects: design.effects,
      animation: design.animation,
      components: design.components,
      typography: design.typography,
    };
  } catch (error) {
    logger.error('Error converting theme to ImpulseTheme', { details: safeDetails(error) });
    throw error;
  }
}

/**
 * Convert an ImpulseTheme to a Theme design_tokens format
 */
export function impulseThemeToDesignTokens(impulse: ImpulseTheme): Record<string, any> {
  try {
    return {
      colors: impulse.colors,
      effects: impulse.effects || {},
      animation: impulse.animation || {},
      components: impulse.components || {},
      typography: impulse.typography || {},
    };
  } catch (error) {
    logger.error('Error converting ImpulseTheme to design tokens', { details: safeDetails(error) });
    return {};
  }
}
