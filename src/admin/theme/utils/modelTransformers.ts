
import { ImpulseTheme, ImpulseThemeColors } from '@/admin/types/impulse.types';
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

// Default ImpulseTheme for use in transformations
export const defaultImpulseTheme: ImpulseTheme = {
  id: 'default-transform',
  name: 'Default Transform Theme',
  version: 1, // Changed from string to number
  colors: {
    primary: '#00F0FF',
    secondary: '#FF2D6E',
    accent: '#8B5CF6',
    background: {
      main: '#12121A',
      overlay: 'rgba(22, 24, 29, 0.85)',
      card: 'rgba(28, 32, 42, 0.7)',
      alt: '#1A1E24'
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
      focus: 'rgba(0, 240, 255, 0.5)'
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    }
  },
  typography: {
    fonts: {
      body: 'Inter, system-ui, sans-serif',
      heading: 'Inter, system-ui, sans-serif',
      mono: 'Consolas, monospace'
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
      sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      md: '0 4px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3)',
      lg: '0 10px 25px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.22)',
      xl: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.15)'
    },
    glow: {
      primary: '0 0 15px rgba(0, 240, 255, 0.7)',
      secondary: '0 0 15px rgba(255, 45, 110, 0.7)',
      hover: '0 0 25px rgba(0, 240, 255, 0.9)'
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
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.155, 1.105, 0.295, 1.12)',
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
      radius: '0.375rem',
      padding: '0.5rem 1rem',
      transition: '150ms ease-in-out'
    },
    tooltip: {
      radius: '0.375rem',
      padding: '0.5rem',
      background: 'rgba(0, 0, 0, 0.8)'
    },
    input: {
      radius: '0.375rem',
      padding: '0.5rem',
      background: 'rgba(255, 255, 255, 0.05)'
    }
  }
};

/**
 * Create a complete ImpulseTheme from a partial record
 */
export function createThemeFromRecord(record: Partial<ImpulseTheme>): ImpulseTheme {
  return {
    ...defaultImpulseTheme,
    ...record,
    id: record.id || 'generated-theme',
    name: record.name || 'Generated Theme',
    version: record.version || 1,
    colors: {
      ...defaultImpulseTheme.colors,
      ...(record.colors || {}),
      background: {
        ...defaultImpulseTheme.colors.background,
        ...(record.colors?.background || {})
      },
      text: {
        ...defaultImpulseTheme.colors.text,
        ...(record.colors?.text || {})
      },
      borders: {
        ...defaultImpulseTheme.colors.borders,
        ...(record.colors?.borders || {})
      },
      status: {
        ...defaultImpulseTheme.colors.status,
        ...(record.colors?.status || {})
      }
    }
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
    // Create a complete ImpulseTheme structure
    const impulseTheme: ImpulseTheme = {
      id: theme.id,
      name: theme.name,
      description: theme.description,
      version: theme.version,
      colors: {
        primary: '',
        secondary: '',
        accent: '',
        background: {
          main: '',
          overlay: '',
          card: '',
          alt: ''
        },
        text: {
          primary: '',
          secondary: '',
          accent: '',
          muted: ''
        },
        borders: {
          normal: '',
          hover: '',
          active: '',
          focus: ''
        },
        status: {
          success: '',
          warning: '',
          error: '',
          info: ''
        }
      },
      typography: {
        fonts: {
          body: '',
          heading: '',
          mono: ''
        },
        sizes: {
          xs: '',
          sm: '',
          base: '',
          md: '',
          lg: '',
          xl: '',
          '2xl': '',
          '3xl': ''
        },
        weights: {
          light: 300,
          normal: 400,
          medium: 500,
          bold: 700
        },
        lineHeights: {
          tight: '',
          normal: '',
          relaxed: ''
        }
      },
      effects: {
        shadows: {
          sm: '',
          md: '',
          lg: '',
          xl: ''
        },
        glow: {
          primary: '',
          secondary: '',
          hover: ''
        }
      },
      animation: {
        duration: {
          fast: '',
          normal: '',
          slow: ''
        },
        curves: {
          bounce: '',
          ease: '',
          spring: '',
          linear: ''
        }
      },
      components: {
        panel: {
          radius: '',
          padding: '',
          background: ''
        },
        button: {
          radius: '',
          padding: '',
          transition: ''
        },
        tooltip: {
          radius: '',
          padding: '',
          background: ''
        },
        input: {
          radius: '',
          padding: '',
          background: ''
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
            mono: theme.design_tokens.typography.fonts?.mono || '' // Fixed from 'code' to 'mono'
          },
          sizes: {
            xs: theme.design_tokens.typography.sizes?.xs || '',
            sm: theme.design_tokens.typography.sizes?.sm || '',
            base: theme.design_tokens.typography.sizes?.base || '',
            md: theme.design_tokens.typography.sizes?.md || '',
            lg: theme.design_tokens.typography.sizes?.lg || '',
            xl: theme.design_tokens.typography.sizes?.xl || '',
            '2xl': theme.design_tokens.typography.sizes?.['2xl'] || '',
            '3xl': theme.design_tokens.typography.sizes?.['3xl'] || ''
          },
          weights: {
            light: theme.design_tokens.typography.weights?.light || 300,
            normal: theme.design_tokens.typography.weights?.normal || 400,
            medium: theme.design_tokens.typography.weights?.medium || 500,
            bold: theme.design_tokens.typography.weights?.bold || 700
          },
          lineHeights: {
            tight: theme.design_tokens.typography.lineHeights?.tight || '',
            normal: theme.design_tokens.typography.lineHeights?.normal || '',
            relaxed: theme.design_tokens.typography.lineHeights?.relaxed || ''
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
          shadows: {
            sm: theme.design_tokens.effects.shadows?.sm || '',
            md: theme.design_tokens.effects.shadows?.md || '',
            lg: theme.design_tokens.effects.shadows?.lg || '',
            xl: theme.design_tokens.effects.shadows?.xl || ''
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
          curves: {
            bounce: theme.design_tokens.animation.curves?.bounce || '',
            ease: theme.design_tokens.animation.curves?.ease || '',
            spring: theme.design_tokens.animation.curves?.spring || '',
            linear: theme.design_tokens.animation.curves?.linear || ''
          }
        };
      }
      
      // Components
      if (theme.design_tokens.components) {
        impulseTheme.components = {
          panel: {
            radius: theme.design_tokens.components.panel?.radius || '',
            padding: theme.design_tokens.components.panel?.padding || '',
            background: theme.design_tokens.components.panel?.background || ''
          },
          button: {
            radius: theme.design_tokens.components.button?.radius || '',
            padding: theme.design_tokens.components.button?.padding || '',
            transition: theme.design_tokens.components.button?.transition || ''
          },
          input: {
            radius: theme.design_tokens.components.input?.radius || '',
            padding: theme.design_tokens.components.input?.padding || '',
            background: theme.design_tokens.components.input?.background || ''
          },
          tooltip: {
            radius: theme.design_tokens.components.tooltip?.radius || '',
            padding: theme.design_tokens.components.tooltip?.padding || '',
            background: theme.design_tokens.components.tooltip?.background || ''
          }
        };
      }
    }
    
    return impulseTheme;
  } catch (error) {
    console.error('Error transforming Theme to ImpulseTheme:', error);
    // Return a fallback theme with at least the required fields
    return {
      id: theme.id,
      name: theme.name,
      version: theme.version,
      colors: {
        primary: '#00F0FF',
        secondary: '#FF2D6E',
        accent: '#8B5CF6',
        background: {
          main: '#12121A',
          overlay: 'rgba(22, 24, 29, 0.85)',
          card: 'rgba(28, 32, 42, 0.7)',
          alt: '#1A1E24'
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
          focus: 'rgba(0, 240, 255, 0.5)'
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6'
        }
      },
      typography: defaultImpulseTheme.typography,
      effects: defaultImpulseTheme.effects,
      animation: defaultImpulseTheme.animation,
      components: defaultImpulseTheme.components
    };
  }
}
