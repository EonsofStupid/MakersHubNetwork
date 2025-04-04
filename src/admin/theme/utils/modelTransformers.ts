
import { ImpulseTheme, defaultImpulseTokens } from '@/admin/types/impulse.types';
import { ThemeRecord } from '../types';
import { Theme, ComponentTokens, ThemeComponent, ThemeToken } from '@/types/theme';
import { deepMerge } from './themeUtils';

/**
 * Create an ImpulseTheme from database record
 */
export function createThemeFromRecord(themeRecord: ThemeRecord): ImpulseTheme {
  // Start with default theme
  const baseTheme = { ...defaultImpulseTheme };
  
  // Construct new theme object
  const newTheme: ImpulseTheme = {
    ...baseTheme,
    id: themeRecord.id || 'unknown',
    name: themeRecord.name || 'Untitled Theme',
    version: themeRecord.version || 1
  };
  
  // If we have theme_data, merge it into the new theme
  if (themeRecord.theme_data) {
    // Merge each theme section if present
    if (themeRecord.theme_data.colors) {
      newTheme.colors = deepMerge(newTheme.colors, themeRecord.theme_data.colors);
    }
    
    if (themeRecord.theme_data.typography) {
      newTheme.typography = deepMerge(newTheme.typography, themeRecord.theme_data.typography);
    }
    
    if (themeRecord.theme_data.effects) {
      newTheme.effects = deepMerge(newTheme.effects, themeRecord.theme_data.effects);
    }
    
    if (themeRecord.theme_data.animation) {
      newTheme.animation = deepMerge(newTheme.animation, themeRecord.theme_data.animation);
    }
    
    if (themeRecord.theme_data.components) {
      newTheme.components = deepMerge(newTheme.components, themeRecord.theme_data.components);
    }
  }
  
  return newTheme;
}

/**
 * Default impulse theme for fallbacks
 */
export const defaultImpulseTheme = defaultImpulseTokens;

/**
 * Transform ImpulseTheme to Theme (site theme model)
 */
export function impulseThemeToTheme(impulseTheme: ImpulseTheme): Theme {
  // Map ImpulseTheme's structure to the Theme structure
  return {
    id: impulseTheme.id,
    name: impulseTheme.name,
    description: impulseTheme.description || '',
    status: 'published',
    is_default: impulseTheme.id === 'default',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: impulseTheme.version,
    design_tokens: {
      colors: {
        primary: impulseTheme.colors.primary,
        secondary: impulseTheme.colors.secondary,
        accent: impulseTheme.colors.accent || impulseTheme.colors.primary, // Ensure accent is always defined
        background: impulseTheme.colors.background,
        text: impulseTheme.colors.text,
        borders: impulseTheme.colors.borders,
        status: impulseTheme.colors.status
      },
      typography: impulseTheme.typography,
      effects: impulseTheme.effects,
      animation: impulseTheme.animation,
      components: impulseTheme.components
    },
    component_tokens: [],
    is_system: true,
    context: 'site'
  };
}

/**
 * Transform Theme to ImpulseTheme
 */
export function themeToImpulseTheme(theme: Theme): ImpulseTheme {
  // Extract design tokens from Theme and map to ImpulseTheme structure
  return {
    id: theme.id,
    name: theme.name,
    description: theme.description,
    version: theme.version,
    
    colors: theme.design_tokens?.colors || defaultImpulseTokens.colors,
    typography: theme.design_tokens?.typography || defaultImpulseTokens.typography,
    effects: theme.design_tokens?.effects || defaultImpulseTokens.effects,
    animation: theme.design_tokens?.animation || defaultImpulseTokens.animation,
    components: theme.design_tokens?.components || defaultImpulseTokens.components
  };
}

/**
 * Convert DB rows to ThemeToken[]
 */
export function dbRowsToThemeTokens(rows: any[]): ThemeToken[] {
  if (!Array.isArray(rows)) return [];
  
  return rows.map(row => ({
    id: row.id || '',
    token_name: row.token_name || '',
    token_value: row.token_value || '',
    category: row.category || '',
    description: row.description || '',
    fallback_value: row.fallback_value || '',
    theme_id: row.theme_id || '',
    created_at: row.created_at || '',
    updated_at: row.updated_at || ''
  }));
}

/**
 * Convert DB rows to ComponentTokens[]
 */
export function dbRowsToComponentTokens(rows: any[]): ComponentTokens[] {
  if (!Array.isArray(rows)) return [];
  
  return rows.map(row => ({
    id: row.id || '',
    component_name: row.component_name || '',
    styles: row.styles || {},
    description: row.description || '',
    created_at: row.created_at || null,
    updated_at: row.updated_at || null,
    theme_id: row.theme_id || '',
    context: row.context || 'site'
  }));
}

/**
 * Convert Theme DB row to Theme object
 */
export function dbRowToTheme(row: any): Theme | null {
  if (!row) return null;
  
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
    is_active: row.is_active || false,
    context: row.context || 'site'
  };
}

/**
 * Convert ThemeComponent to DB format
 */
export function componentToDbFormat(component: ThemeComponent): Record<string, any> {
  return {
    id: component.id,
    theme_id: component.theme_id,
    component_name: component.component_name,
    styles: component.styles,
    description: component.description || '',
    context: component.context || 'site',
    updated_at: new Date().toISOString()
  };
}

/**
 * Ensure all ThemeComponents have a context value
 */
export function ensureThemeComponentContext(components: ThemeComponent[]): ThemeComponent[] {
  return components.map(component => ({
    ...component,
    context: component.context || 'site'
  }));
}
