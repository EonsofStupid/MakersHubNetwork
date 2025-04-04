
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { Theme, ThemeStatus } from '@/types/theme';
import { defaultImpulseTokens } from '../impulse/tokens';

/**
 * Default Impulse theme with fallbacks for all values
 */
export const defaultImpulseTheme: ImpulseTheme = defaultImpulseTokens;

/**
 * Create a theme object from a database record
 */
export function createThemeFromRecord(record: any): Theme {
  try {
    return {
      id: record.id || `theme-${Date.now()}`,
      name: record.name || 'Unnamed Theme',
      description: record.description || '',
      status: (record.status as ThemeStatus) || 'draft',
      is_default: record.is_default || false,
      created_at: record.created_at || new Date().toISOString(),
      updated_at: record.updated_at || new Date().toISOString(),
      published_at: record.published_at || null,
      version: record.version || 1,
      design_tokens: record.design_tokens || {
        colors: defaultImpulseTokens.colors,
        typography: defaultImpulseTokens.typography,
        effects: defaultImpulseTokens.effects,
        animation: defaultImpulseTokens.animation,
        components: defaultImpulseTokens.components
      },
      component_tokens: record.component_tokens || [],
      context: record.context || 'site',
      is_active: record.is_active || false
    };
  } catch (error) {
    console.error('Error creating theme from record', error);
    
    // Return a fallback theme
    return {
      id: `fallback-${Date.now()}`,
      name: 'Fallback Theme',
      description: 'Generated due to an error',
      status: 'draft',
      is_default: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1,
      design_tokens: {
        colors: defaultImpulseTokens.colors,
        typography: defaultImpulseTokens.typography,
        effects: defaultImpulseTokens.effects,
        animation: defaultImpulseTokens.animation,
        components: defaultImpulseTokens.components
      },
      component_tokens: [],
      context: 'site',
      is_active: false
    };
  }
}

/**
 * Transform an ImpulseTheme to prepare it for database storage
 */
export function prepareImpulseThemeForStorage(theme: ImpulseTheme): Record<string, any> {
  return {
    name: theme.name || 'Unnamed Theme',
    description: theme.description || '',
    version: theme.version || 1,
    design_tokens: {
      colors: theme.colors || defaultImpulseTokens.colors,
      typography: theme.typography || defaultImpulseTokens.typography,
      effects: theme.effects || defaultImpulseTokens.effects,
      animation: theme.animation || defaultImpulseTokens.animation,
      components: theme.components || defaultImpulseTokens.components
    },
    is_active: theme.isActive || false,
    context: theme.context || 'admin'
  };
}
