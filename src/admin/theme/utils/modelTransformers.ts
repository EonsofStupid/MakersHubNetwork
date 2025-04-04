
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { Theme, ThemeToken, ComponentTokens } from '@/types/theme';

/**
 * Transform database row data to Theme type
 */
export function dbRowToTheme(data: any): Theme | null {
  if (!data) return null;
  
  try {
    return {
      id: data.id,
      name: data.name || '',
      description: data.description || '',
      status: data.status || 'draft',
      is_default: data.is_default || false,
      created_by: data.created_by,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
      published_at: data.published_at,
      version: data.version || 1,
      cache_key: data.cache_key,
      parent_theme_id: data.parent_theme_id,
      design_tokens: data.design_tokens || {
        colors: {
          primary: '#00F0FF',
          secondary: '#FF2D6E',
          accent: '#8B5CF6',
          background: {
            main: '#12121A',
            card: '#1C202A',
            alt: '#1A1A25',
            overlay: 'rgba(18, 18, 26, 0.8)'
          },
          text: {
            primary: '#F6F6F7',
            secondary: 'rgba(255, 255, 255, 0.7)',
            muted: 'rgba(255, 255, 255, 0.5)',
            accent: '#00F0FF'
          },
          borders: {
            normal: 'rgba(0, 240, 255, 0.2)',
            hover: 'rgba(0, 240, 255, 0.4)',
            active: 'rgba(0, 240, 255, 0.6)',
            focus: 'rgba(0, 240, 255, 0.7)'
          },
          status: {
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#60A5FA'
          }
        },
        typography: {
          fonts: {
            body: 'Inter, system-ui, sans-serif',
            heading: 'Inter, system-ui, sans-serif',
            mono: 'JetBrains Mono, monospace'
          },
          sizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            md: '1.125rem',
            lg: '1.25rem',
            xl: '1.5rem',
            '2xl': '1.875rem',
            '3xl': '2.25rem'
          },
          weights: {
            light: 300,
            normal: 400,
            medium: 500,
            bold: 700
          },
          lineHeights: {
            tight: '1.25',
            normal: '1.5',
            relaxed: '1.75'
          }
        },
        effects: {
          shadows: {
            sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          },
          glow: {
            primary: '0 0 15px rgba(0, 240, 255, 0.7)',
            secondary: '0 0 15px rgba(255, 45, 110, 0.7)',
            hover: '0 0 20px rgba(0, 240, 255, 0.9)'
          },
          blurs: {
            default: 'blur(8px)',
            strong: 'blur(16px)',
            subtle: 'blur(4px)'
          }
        },
        animation: {
          duration: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms'
          },
          curves: {
            bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
            spring: 'cubic-bezier(0.37, 0, 0.63, 1)',
            linear: 'linear'
          }
        },
        components: {
          panel: {
            radius: '0.75rem',
            padding: '1.5rem',
            background: 'rgba(28, 32, 42, 0.7)'
          },
          button: {
            radius: '0.5rem',
            padding: '0.5rem 1rem',
            transition: '0.3s ease'
          },
          tooltip: {
            radius: '0.25rem',
            padding: '0.5rem',
            background: 'rgba(0, 0, 0, 0.8)'
          },
          input: {
            radius: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(255, 255, 255, 0.05)'
          }
        }
      },
      component_tokens: Array.isArray(data.component_tokens) ? data.component_tokens : [],
      composition_rules: data.composition_rules || {},
      cached_styles: data.cached_styles || {}
    };
  } catch (error) {
    console.error('Error transforming DB row to Theme:', error);
    return null;
  }
}

/**
 * Transform database rows to ThemeToken[] type
 */
export function dbRowsToThemeTokens(rows: any[]): ThemeToken[] {
  if (!Array.isArray(rows)) return [];
  
  try {
    return rows.map(row => ({
      id: row.id,
      token_name: row.token_name || '',
      token_value: row.token_value || '',
      category: row.category || '',
      description: row.description || '',
      fallback_value: row.fallback_value,
      theme_id: row.theme_id,
      created_at: row.created_at || '',
      updated_at: row.updated_at || ''
    }));
  } catch (error) {
    console.error('Error transforming DB rows to ThemeTokens:', error);
    return [];
  }
}

/**
 * Transform database rows to ComponentTokens[] type
 */
export function dbRowsToComponentTokens(rows: any[]): ComponentTokens[] {
  if (!Array.isArray(rows)) return [];
  
  try {
    return rows.map(row => ({
      id: row.id,
      component_name: row.component_name || '',
      styles: row.styles || {},
      description: row.description || '',
      theme_id: row.theme_id || '',
      created_at: row.created_at || null,
      updated_at: row.updated_at || null,
      context: row.context || 'site'
    }));
  } catch (error) {
    console.error('Error transforming DB rows to ComponentTokens:', error);
    return [];
  }
}

/**
 * Transform ComponentToken to DB format for saving
 */
export function componentToDbFormat(component: any): Record<string, any> {
  return {
    id: component.id,
    component_name: component.component_name || '',
    styles: component.styles || {},
    description: component.description || '',
    theme_id: component.theme_id || '',
    context: component.context || 'site'
  };
}

/**
 * Transform Theme to ImpulseTheme format
 * This converts between the database Theme structure and the ImpulseTheme format
 * used for rendering and theme application
 */
export function themeToImpulseTheme(theme: Theme): ImpulseTheme {
  if (!theme) {
    throw new Error('Cannot transform undefined theme to ImpulseTheme');
  }
  
  try {
    // Create default structure to ensure required properties
    const impulseTheme: ImpulseTheme = {
      id: theme.id,
      name: theme.name,
      description: theme.description,
      // Convert version from number to string for ImpulseTheme
      version: String(theme.version),
      colors: {
        primary: '',
        secondary: '',
        background: {
          main: '',
          card: '',
          alt: '',
          overlay: ''
        },
        text: {
          primary: '',
          secondary: '',
          accent: '',
          muted: ''
        }
      }
    };
    
    // Map design tokens to ImpulseTheme format
    if (theme.design_tokens) {
      // Colors
      if (theme.design_tokens.colors) {
        impulseTheme.colors = {
          primary: theme.design_tokens.colors.primary,
          secondary: theme.design_tokens.colors.secondary,
          accent: theme.design_tokens.colors.accent,
          background: {
            main: theme.design_tokens.colors.background?.main || '',
            card: theme.design_tokens.colors.background?.card || '',
            alt: theme.design_tokens.colors.background?.alt || '',
            overlay: theme.design_tokens.colors.background?.overlay || ''
          },
          text: {
            primary: theme.design_tokens.colors.text?.primary || '',
            secondary: theme.design_tokens.colors.text?.secondary || '',
            accent: theme.design_tokens.colors.text?.accent || '',
            muted: theme.design_tokens.colors.text?.muted || ''
          },
          borders: {
            normal: theme.design_tokens.colors.borders?.normal || '',
            hover: theme.design_tokens.colors.borders?.hover || '',
            active: theme.design_tokens.colors.borders?.active || '',
            focus: theme.design_tokens.colors.borders?.focus || ''
          },
          status: {
            success: theme.design_tokens.colors.status?.success || '',
            warning: theme.design_tokens.colors.status?.warning || '',
            error: theme.design_tokens.colors.status?.error || '',
            info: theme.design_tokens.colors.status?.info || ''
          }
        };
      }
      
      // Typography
      if (theme.design_tokens.typography) {
        impulseTheme.typography = {
          fonts: {
            body: theme.design_tokens.typography.fonts?.body || '',
            heading: theme.design_tokens.typography.fonts?.heading || '',
            code: theme.design_tokens.typography.fonts?.mono || ''
          },
          sizes: {
            xs: theme.design_tokens.typography.sizes?.xs || '',
            sm: theme.design_tokens.typography.sizes?.sm || '',
            base: theme.design_tokens.typography.sizes?.base || '',
            lg: theme.design_tokens.typography.sizes?.lg || '',
            xl: theme.design_tokens.typography.sizes?.xl || '',
            '2xl': theme.design_tokens.typography.sizes?.['2xl'] || '',
            '3xl': theme.design_tokens.typography.sizes?.['3xl'] || '',
            '4xl': theme.design_tokens.typography.sizes?.['3xl'] || ''
          },
          weights: {
            light: theme.design_tokens.typography.weights?.light || 300,
            normal: theme.design_tokens.typography.weights?.normal || 400,
            medium: theme.design_tokens.typography.weights?.medium || 500,
            semibold: theme.design_tokens.typography.weights?.medium || 600,
            bold: theme.design_tokens.typography.weights?.bold || 700
          }
        };
      }
      
      // Effects
      if (theme.design_tokens.effects) {
        impulseTheme.effects = {
          glow: {
            primary: theme.design_tokens.effects.glow?.primary || '',
            secondary: theme.design_tokens.effects.glow?.secondary || '',
            hover: theme.design_tokens.effects.glow?.hover || ''
          },
          shadow: {
            small: theme.design_tokens.effects.shadows?.sm || '',
            medium: theme.design_tokens.effects.shadows?.md || '',
            large: theme.design_tokens.effects.shadows?.lg || ''
          },
          glass: {
            opacity: '0.1',
            blur: '10px',
            background: 'rgba(28, 32, 42, 0.7)'
          }
        };
      }
      
      // Animation
      if (theme.design_tokens.animation) {
        impulseTheme.animation = {
          duration: {
            fast: theme.design_tokens.animation.duration?.fast || '',
            normal: theme.design_tokens.animation.duration?.normal || '',
            slow: theme.design_tokens.animation.duration?.slow || ''
          },
          easing: {
            default: theme.design_tokens.animation.curves?.ease || '',
            in: theme.design_tokens.animation.curves?.linear || '',
            out: theme.design_tokens.animation.curves?.ease || '',
            inOut: theme.design_tokens.animation.curves?.spring || ''
          }
        };
      }
      
      // Components
      if (theme.design_tokens.components) {
        impulseTheme.components = {
          panel: {
            radius: theme.design_tokens.components.panel?.radius || '',
            shadow: theme.design_tokens.effects?.shadows?.md || '',
            border: `1px solid ${theme.design_tokens.colors.borders?.normal || ''}`
          },
          button: {
            radius: theme.design_tokens.components.button?.radius || '',
            shadow: theme.design_tokens.effects?.shadows?.sm || '',
            padding: theme.design_tokens.components.button?.padding || ''
          },
          input: {
            radius: theme.design_tokens.components.input?.radius || '',
            border: `1px solid ${theme.design_tokens.colors.borders?.normal || ''}`,
            padding: theme.design_tokens.components.input?.padding || ''
          }
        };
      }
    }
    
    return impulseTheme;
  } catch (error) {
    console.error('Error transforming Theme to ImpulseTheme:', error);
    return {
      id: theme.id,
      name: theme.name,
      version: String(theme.version),
      colors: {
        primary: '#00F0FF',
        secondary: '#FF2D6E',
        background: {
          main: '#12121A',
        },
        text: {
          primary: '#F6F6F7',
        }
      }
    };
  }
}
