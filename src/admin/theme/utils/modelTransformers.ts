
import { Json } from '@/integrations/supabase/types';
import { Theme, ThemeToken, ComponentTokens, ThemeColors, ThemeTypography, ThemeEffects, ThemeAnimation, ThemeComponents } from '@/types/theme';
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ModelTransformers', { category: LogCategory.THEME });

/**
 * Convert a database row to a Theme object
 */
export function dbRowToTheme(row: any): Theme | null {
  if (!row) return null;

  try {
    const theme: Theme = {
      id: row.id,
      name: row.name,
      description: row.description || '',
      status: row.status || 'draft',
      is_default: row.is_default || false,
      created_by: row.created_by || undefined,
      created_at: row.created_at || '',
      updated_at: row.updated_at || '',
      published_at: row.published_at || undefined,
      version: row.version || 1,
      cache_key: row.cache_key || undefined,
      parent_theme_id: row.parent_theme_id || undefined,
      design_tokens: row.design_tokens as any || {},
      component_tokens: [],
      composition_rules: row.composition_rules as any || {},
      cached_styles: row.cached_styles as any || {},
      context: row.context as any || 'site',
      is_system: row.is_system || false,
      is_active: row.is_active || false
    };
    
    return theme;
  } catch (error) {
    logger.error('Error converting database row to Theme', {
      details: safeDetails(error)
    });
    return null;
  }
}

/**
 * Convert database rows to ThemeToken array
 */
export function dbRowsToThemeTokens(rows: any[]): ThemeToken[] {
  if (!rows || !Array.isArray(rows)) return [];

  try {
    return rows.map(row => ({
      id: row.id,
      token_name: row.token_name || '',
      token_value: row.token_value || '',
      category: row.category || '',
      description: row.description || '',
      fallback_value: row.fallback_value || undefined,
      theme_id: row.theme_id || undefined,
      created_at: row.created_at || '',
      updated_at: row.updated_at || ''
    }));
  } catch (error) {
    logger.error('Error converting database rows to ThemeTokens', {
      details: safeDetails(error)
    });
    return [];
  }
}

/**
 * Convert database rows to ComponentTokens array
 */
export function dbRowsToComponentTokens(rows: any[]): ComponentTokens[] {
  if (!rows || !Array.isArray(rows)) return [];

  try {
    return rows.map(row => ({
      id: row.id || `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      component_name: row.component_name || '',
      styles: row.styles || {},
      description: row.description || '',
      theme_id: row.theme_id,
      context: row.context,
      created_at: row.created_at || '',
      updated_at: row.updated_at || ''
    }));
  } catch (error) {
    logger.error('Error converting database rows to ComponentTokens', {
      details: safeDetails(error)
    });
    return [];
  }
}

/**
 * Convert a ComponentToken to database format
 */
export function componentToDbFormat(component: ComponentTokens): any {
  try {
    return {
      id: component.id,
      component_name: component.component_name,
      styles: component.styles as Json,
      description: component.description || '',
      theme_id: component.theme_id,
      context: component.context
    };
  } catch (error) {
    logger.error('Error converting ComponentToken to database format', {
      details: safeDetails(error)
    });
    return {};
  }
}

/**
 * Convert Theme object to ImpulseTheme format
 */
export function themeToImpulseTheme(theme: Theme): ImpulseTheme {
  try {
    const designTokens = theme.design_tokens || {};
    
    const impulseTheme: ImpulseTheme = {
      id: theme.id,
      name: theme.name,
      version: String(theme.version) || '1.0.0',
      description: theme.description,
      
      colors: {
        primary: designTokens.colors?.primary || '#00F0FF',
        secondary: designTokens.colors?.secondary || '#FF2D6E',
        accent: designTokens.colors?.accent || '#F97316',
        
        background: {
          main: designTokens.colors?.background?.main || '#12121A',
          overlay: designTokens.colors?.background?.overlay || 'rgba(22, 24, 29, 0.85)',
          card: designTokens.colors?.background?.card || 'rgba(28, 32, 42, 0.7)',
          alt: designTokens.colors?.background?.alt || '#1A1E24',
        },
        
        text: {
          primary: designTokens.colors?.text?.primary || '#F6F6F7',
          secondary: designTokens.colors?.text?.secondary || 'rgba(255, 255, 255, 0.7)',
          accent: designTokens.colors?.text?.accent || '#00F0FF',
          muted: designTokens.colors?.text?.muted || 'rgba(255, 255, 255, 0.5)',
        },
        
        borders: {
          normal: designTokens.colors?.borders?.normal || 'rgba(0, 240, 255, 0.2)',
          hover: designTokens.colors?.borders?.hover || 'rgba(0, 240, 255, 0.4)',
          active: designTokens.colors?.borders?.active || 'rgba(0, 240, 255, 0.6)',
          focus: designTokens.colors?.borders?.focus || 'rgba(0, 240, 255, 0.5)',
        },
        
        status: {
          success: designTokens.colors?.status?.success || '#10B981',
          warning: designTokens.colors?.status?.warning || '#F59E0B',
          error: designTokens.colors?.status?.error || '#EF4444',
          info: designTokens.colors?.status?.info || '#3B82F6',
        },
      },
      
      effects: {
        glow: {
          primary: designTokens.effects?.glow?.primary || '0 0 15px rgba(0, 240, 255, 0.7)',
          secondary: designTokens.effects?.glow?.secondary || '0 0 15px rgba(255, 45, 110, 0.7)',
          hover: designTokens.effects?.glow?.hover || '0 0 20px rgba(0, 240, 255, 0.9)',
        },
        
        gradients: {
          primary: designTokens.effects?.gradients?.primary || 'linear-gradient(90deg, #00F0FF, #00B8D4)',
          secondary: designTokens.effects?.gradients?.secondary || 'linear-gradient(90deg, #FF2D6E, #FF5252)',
          accent: designTokens.effects?.gradients?.accent || 'linear-gradient(90deg, #F97316, #FB923C)',
        },
        
        shadows: {
          small: designTokens.effects?.shadows?.sm || '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
          medium: designTokens.effects?.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3)',
          large: designTokens.effects?.shadows?.lg || '0 10px 25px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.22)',
          inner: designTokens.effects?.shadows?.inner || 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.15)',
        },
      },
      
      animation: {
        duration: {
          fast: designTokens.animation?.durations?.fast || '150ms',
          normal: designTokens.animation?.durations?.normal || '300ms',
          slow: designTokens.animation?.durations?.slow || '500ms',
        },
        
        curves: {
          bounce: designTokens.animation?.curves?.bounce || 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          ease: designTokens.animation?.curves?.ease || 'cubic-bezier(0.4, 0, 0.2, 1)',
          spring: designTokens.animation?.curves?.spring || 'cubic-bezier(0.43, 0.13, 0.23, 0.96)',
          linear: designTokens.animation?.curves?.linear || 'linear',
        },
        
        keyframes: {
          fade: designTokens.animation?.keyframes?.fade || `
            @keyframes fade {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `,
          pulse: designTokens.animation?.keyframes?.pulse || `
            @keyframes pulse {
              0%, 100% { opacity: 0.8; }
              50% { opacity: 0.4; }
            }
          `,
          glow: designTokens.animation?.keyframes?.glow || `
            @keyframes glow {
              0%, 100% { box-shadow: 0 0 5px rgba(0, 240, 255, 0.5); }
              50% { box-shadow: 0 0 20px rgba(0, 240, 255, 0.7); }
            }
          `,
          slide: designTokens.animation?.keyframes?.slide || `
            @keyframes slide {
              from { transform: translateY(10px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `,
        },
      },
      
      components: {
        panel: {
          radius: designTokens.components?.panel?.radius || '0.75rem',
          padding: designTokens.components?.panel?.padding || '1.5rem',
          background: designTokens.components?.panel?.background || 'rgba(28, 32, 42, 0.7)',
        },
        
        button: {
          radius: designTokens.components?.button?.radius || '0.5rem',
          padding: designTokens.components?.button?.padding || '0.5rem 1rem',
          transition: designTokens.components?.button?.transition || 'all 0.2s ease',
        },
        
        tooltip: {
          radius: designTokens.components?.tooltip?.radius || '0.25rem',
          padding: designTokens.components?.tooltip?.padding || '0.5rem',
          background: designTokens.components?.tooltip?.background || 'rgba(0, 0, 0, 0.8)',
        },
        
        input: {
          radius: designTokens.components?.input?.radius || '0.375rem',
          padding: designTokens.components?.input?.padding || '0.5rem 0.75rem',
          background: designTokens.components?.input?.background || 'rgba(0, 0, 0, 0.15)',
        },
      },
      
      typography: {
        fonts: {
          body: designTokens.typography?.fonts?.body || 'Inter, system-ui, sans-serif',
          heading: designTokens.typography?.fonts?.heading || 'Inter, system-ui, sans-serif',
          monospace: designTokens.typography?.fonts?.mono || 'Consolas, monospace',
        },
        
        sizes: {
          xs: designTokens.typography?.sizes?.xs || '0.75rem',
          sm: designTokens.typography?.sizes?.sm || '0.875rem',
          base: designTokens.typography?.sizes?.base || '1rem',
          md: designTokens.typography?.sizes?.base || '1rem',
          lg: designTokens.typography?.sizes?.lg || '1.125rem',
          xl: designTokens.typography?.sizes?.xl || '1.25rem',
          '2xl': designTokens.typography?.sizes?.['2xl'] || '1.5rem',
          '3xl': designTokens.typography?.sizes?.['3xl'] || '1.875rem',
        },
        
        weights: {
          light: Number(designTokens.typography?.weights?.light) || 300,
          normal: Number(designTokens.typography?.weights?.normal) || 400,
          medium: Number(designTokens.typography?.weights?.medium) || 500,
          bold: Number(designTokens.typography?.weights?.bold) || 700,
        },
        
        lineHeights: {
          tight: designTokens.typography?.lineHeights?.tight || '1.25',
          normal: designTokens.typography?.lineHeights?.normal || '1.5',
          loose: designTokens.typography?.lineHeights?.relaxed || '1.75',
        },
      },
    };
    
    return impulseTheme;
  } catch (error) {
    logger.error('Error converting Theme to ImpulseTheme', {
      details: safeDetails(error)
    });
    
    // Return default ImpulseTheme
    return {
      id: 'fallback',
      name: 'Fallback Theme',
      version: '1.0.0',
      colors: {
        primary: '#00F0FF',
        secondary: '#FF2D6E',
        accent: '#F97316',
        background: {
          main: '#12121A',
          overlay: 'rgba(22, 24, 29, 0.85)',
          card: 'rgba(28, 32, 42, 0.7)',
          alt: '#1A1E24',
        },
        text: {
          primary: '#F6F6F7',
          secondary: 'rgba(255, 255, 255, 0.7)',
          accent: '#00F0FF',
          muted: 'rgba(255, 255, 255, 0.5)',
        },
        borders: {
          normal: 'rgba(0, 240, 255, 0.2)',
          hover: 'rgba(0, 240, 255, 0.4)',
          active: 'rgba(0, 240, 255, 0.6)',
          focus: 'rgba(0, 240, 255, 0.5)',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
      },
      effects: {
        glow: {
          primary: '0 0 15px rgba(0, 240, 255, 0.7)',
          secondary: '0 0 15px rgba(255, 45, 110, 0.7)',
          hover: '0 0 20px rgba(0, 240, 255, 0.9)',
        },
        gradients: {
          primary: 'linear-gradient(90deg, #00F0FF, #00B8D4)',
          secondary: 'linear-gradient(90deg, #FF2D6E, #FF5252)',
          accent: 'linear-gradient(90deg, #F97316, #FB923C)',
        },
        shadows: {
          small: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
          medium: '0 4px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3)',
          large: '0 10px 25px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.22)',
          inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.15)',
        },
      },
      animation: {
        duration: {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms',
        },
        curves: {
          bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
          spring: 'cubic-bezier(0.43, 0.13, 0.23, 0.96)',
          linear: 'linear',
        },
        keyframes: {
          fade: '@keyframes fade { from { opacity: 0; } to { opacity: 1; } }',
          pulse: '@keyframes pulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 0.4; } }',
          glow: '@keyframes glow { 0%, 100% { box-shadow: 0 0 5px rgba(0, 240, 255, 0.5); } 50% { box-shadow: 0 0 20px rgba(0, 240, 255, 0.7); } }',
          slide: '@keyframes slide { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }',
        },
      },
      components: {
        panel: {
          radius: '0.75rem',
          padding: '1.5rem',
          background: 'rgba(28, 32, 42, 0.7)',
        },
        button: {
          radius: '0.5rem',
          padding: '0.5rem 1rem',
          transition: 'all 0.2s ease',
        },
        tooltip: {
          radius: '0.25rem',
          padding: '0.5rem',
          background: 'rgba(0, 0, 0, 0.8)',
        },
        input: {
          radius: '0.375rem',
          padding: '0.5rem 0.75rem',
          background: 'rgba(0, 0, 0, 0.15)',
        },
      },
      typography: {
        fonts: {
          body: 'Inter, system-ui, sans-serif',
          heading: 'Inter, system-ui, sans-serif',
          monospace: 'Consolas, monospace',
        },
        sizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          md: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
        },
        weights: {
          light: 300,
          normal: 400,
          medium: 500,
          bold: 700,
        },
        lineHeights: {
          tight: '1.25',
          normal: '1.5',
          loose: '1.75',
        },
      },
    };
  }
}

/**
 * Convert ImpulseTheme to database-compatible Theme format
 */
export function impulseThemeToDbFormat(theme: ImpulseTheme): any {
  try {
    return {
      name: theme.name,
      description: theme.description || '',
      design_tokens: {
        colors: theme.colors,
        typography: theme.typography,
        effects: theme.effects,
        animation: theme.animation,
        components: theme.components
      },
      version: parseInt(theme.version, 10) || 1
    };
  } catch (error) {
    logger.error('Error converting ImpulseTheme to database format', {
      details: safeDetails(error)
    });
    return {};
  }
}
