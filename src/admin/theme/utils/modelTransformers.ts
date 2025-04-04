
import { Theme, ThemeToken, ComponentTokens, ThemeContext } from '@/types/theme';
import { ImpulseTheme, defaultImpulseTokens } from '@/admin/types/impulse.types';
import { ThemeComponent } from '@/stores/theme/types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ModelTransformers', { category: LogCategory.THEME });

/**
 * Convert a database row to a Theme object
 */
export function dbRowToTheme(row: any): Theme | null {
  if (!row || typeof row !== 'object') {
    return null;
  }
  
  try {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      status: row.status,
      is_default: row.is_default,
      created_by: row.created_by,
      created_at: row.created_at,
      updated_at: row.updated_at,
      published_at: row.published_at,
      version: row.version,
      cache_key: row.cache_key,
      parent_theme_id: row.parent_theme_id,
      design_tokens: row.design_tokens || {},
      component_tokens: row.component_tokens || [],
      composition_rules: row.composition_rules,
      cached_styles: row.cached_styles,
      is_system: row.is_system,
      is_active: row.is_active,
      context: row.context
    };
  } catch (error) {
    logger.error('Error converting DB row to Theme', {
      details: safeDetails(error)
    });
    return null;
  }
}

/**
 * Convert database rows to ThemeToken array
 */
export function dbRowsToThemeTokens(rows: any[]): ThemeToken[] {
  if (!Array.isArray(rows)) {
    return [];
  }
  
  try {
    return rows.map(row => ({
      id: row.id,
      token_name: row.token_name,
      token_value: row.token_value,
      category: row.category,
      description: row.description,
      fallback_value: row.fallback_value,
      theme_id: row.theme_id,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  } catch (error) {
    logger.error('Error converting DB rows to ThemeTokens', {
      details: safeDetails(error)
    });
    return [];
  }
}

/**
 * Convert database rows to ComponentTokens array
 */
export function dbRowsToComponentTokens(rows: any[]): ThemeComponent[] {
  if (!Array.isArray(rows)) {
    return [];
  }
  
  try {
    return rows.map(row => ({
      id: row.id,
      component_name: row.component_name,
      styles: row.styles || {},
      description: row.description,
      theme_id: row.theme_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      context: row.context as ThemeContext
    }));
  } catch (error) {
    logger.error('Error converting DB rows to ComponentTokens', {
      details: safeDetails(error)
    });
    return [];
  }
}

/**
 * Convert a component to DB format
 */
export function componentToDbFormat(component: ThemeComponent): any {
  try {
    return {
      id: component.id,
      component_name: component.component_name,
      styles: component.styles,
      description: component.description,
      theme_id: component.theme_id,
      context: component.context
    };
  } catch (error) {
    logger.error('Error converting component to DB format', {
      details: safeDetails(error)
    });
    throw error;
  }
}

/**
 * Convert a Theme to ImpulseTheme format
 * Fixed implementation that correctly handles the theme structure
 */
export function themeToImpulseTheme(theme: Theme): ImpulseTheme {
  if (!theme) {
    logger.warn('No theme provided to themeToImpulseTheme, returning default tokens');
    return defaultImpulseTokens;
  }
  
  try {
    logger.debug('Converting Theme to ImpulseTheme', { 
      details: { themeId: theme.id, themeName: theme.name }
    });
    
    // If theme already contains admin-specific tokens, use those directly
    if (theme.design_tokens?.admin && typeof theme.design_tokens.admin === 'object') {
      // Extract all admin-specific properties
      const adminTokens = theme.design_tokens.admin;
      
      // Create a base ImpulseTheme with required fields
      const impulseTheme: ImpulseTheme = {
        id: theme.id,
        name: theme.name,
        version: String(theme.version || '1.0.0'),
        description: theme.description || 'Admin Theme',
        colors: {
          primary: adminTokens.colors?.primary || defaultImpulseTokens.colors.primary,
          secondary: adminTokens.colors?.secondary || defaultImpulseTokens.colors.secondary,
          accent: adminTokens.colors?.accent || defaultImpulseTokens.colors.accent,
          background: {
            main: adminTokens.colors?.background?.main || defaultImpulseTokens.colors.background.main,
            overlay: adminTokens.colors?.background?.overlay || defaultImpulseTokens.colors.background.overlay,
            card: adminTokens.colors?.background?.card || defaultImpulseTokens.colors.background.card,
            alt: adminTokens.colors?.background?.alt || defaultImpulseTokens.colors.background.alt,
          },
          text: {
            primary: adminTokens.colors?.text?.primary || defaultImpulseTokens.colors.text.primary,
            secondary: adminTokens.colors?.text?.secondary || defaultImpulseTokens.colors.text.secondary,
            accent: adminTokens.colors?.text?.accent || defaultImpulseTokens.colors.text.accent,
            muted: adminTokens.colors?.text?.muted || defaultImpulseTokens.colors.text.muted,
          },
          borders: {
            normal: adminTokens.colors?.borders?.normal || defaultImpulseTokens.colors.borders.normal,
            hover: adminTokens.colors?.borders?.hover || defaultImpulseTokens.colors.borders.hover,
            active: adminTokens.colors?.borders?.active || defaultImpulseTokens.colors.borders.active,
            focus: adminTokens.colors?.borders?.focus || defaultImpulseTokens.colors.borders.focus,
          },
          status: {
            success: adminTokens.colors?.status?.success || defaultImpulseTokens.colors.status.success,
            warning: adminTokens.colors?.status?.warning || defaultImpulseTokens.colors.status.warning,
            error: adminTokens.colors?.status?.error || defaultImpulseTokens.colors.status.error,
            info: adminTokens.colors?.status?.info || defaultImpulseTokens.colors.status.info,
          }
        },
        effects: {
          glow: {
            primary: adminTokens.effects?.glow?.primary || defaultImpulseTokens.effects.glow.primary,
            secondary: adminTokens.effects?.glow?.secondary || defaultImpulseTokens.effects.glow.secondary,
            hover: adminTokens.effects?.glow?.hover || defaultImpulseTokens.effects.glow.hover,
          },
          gradients: {
            primary: adminTokens.effects?.gradients?.primary || defaultImpulseTokens.effects.gradients.primary,
            secondary: adminTokens.effects?.gradients?.secondary || defaultImpulseTokens.effects.gradients.secondary,
            accent: adminTokens.effects?.gradients?.accent || defaultImpulseTokens.effects.gradients.accent,
          },
          shadows: {
            small: adminTokens.effects?.shadows?.small || defaultImpulseTokens.effects.shadows.small,
            medium: adminTokens.effects?.shadows?.medium || defaultImpulseTokens.effects.shadows.medium,
            large: adminTokens.effects?.shadows?.large || defaultImpulseTokens.effects.shadows.large,
            inner: adminTokens.effects?.shadows?.inner || defaultImpulseTokens.effects.shadows.inner,
          }
        },
        animation: {
          duration: {
            fast: adminTokens.animation?.duration?.fast || defaultImpulseTokens.animation.duration.fast,
            normal: adminTokens.animation?.duration?.normal || defaultImpulseTokens.animation.duration.normal,
            slow: adminTokens.animation?.duration?.slow || defaultImpulseTokens.animation.duration.slow,
          },
          curves: {
            bounce: adminTokens.animation?.curves?.bounce || defaultImpulseTokens.animation.curves.bounce,
            ease: adminTokens.animation?.curves?.ease || defaultImpulseTokens.animation.curves.ease,
            spring: adminTokens.animation?.curves?.spring || defaultImpulseTokens.animation.curves.spring,
            linear: adminTokens.animation?.curves?.linear || defaultImpulseTokens.animation.curves.linear,
          },
          keyframes: adminTokens.animation?.keyframes || defaultImpulseTokens.animation.keyframes
        },
        components: {
          panel: {
            radius: adminTokens.components?.panel?.radius || defaultImpulseTokens.components.panel.radius,
            padding: adminTokens.components?.panel?.padding || defaultImpulseTokens.components.panel.padding,
            background: adminTokens.components?.panel?.background || defaultImpulseTokens.components.panel.background,
          },
          button: {
            radius: adminTokens.components?.button?.radius || defaultImpulseTokens.components.button.radius,
            padding: adminTokens.components?.button?.padding || defaultImpulseTokens.components.button.padding,
            transition: adminTokens.components?.button?.transition || defaultImpulseTokens.components.button.transition,
          },
          tooltip: {
            radius: adminTokens.components?.tooltip?.radius || defaultImpulseTokens.components.tooltip.radius,
            padding: adminTokens.components?.tooltip?.padding || defaultImpulseTokens.components.tooltip.padding,
            background: adminTokens.components?.tooltip?.background || defaultImpulseTokens.components.tooltip.background,
          },
          input: {
            radius: adminTokens.components?.input?.radius || defaultImpulseTokens.components.input.radius,
            padding: adminTokens.components?.input?.padding || defaultImpulseTokens.components.input.padding,
            background: adminTokens.components?.input?.background || defaultImpulseTokens.components.input.background,
          }
        },
        typography: {
          fonts: {
            body: adminTokens.typography?.fonts?.body || defaultImpulseTokens.typography.fonts.body,
            heading: adminTokens.typography?.fonts?.heading || defaultImpulseTokens.typography.fonts.heading,
            mono: adminTokens.typography?.fonts?.mono || defaultImpulseTokens.typography.fonts.mono,
          },
          sizes: {
            xs: adminTokens.typography?.sizes?.xs || defaultImpulseTokens.typography.sizes.xs,
            sm: adminTokens.typography?.sizes?.sm || defaultImpulseTokens.typography.sizes.sm,
            base: adminTokens.typography?.sizes?.base || defaultImpulseTokens.typography.sizes.base,
            md: adminTokens.typography?.sizes?.md || defaultImpulseTokens.typography.sizes.md,
            lg: adminTokens.typography?.sizes?.lg || defaultImpulseTokens.typography.sizes.lg,
            xl: adminTokens.typography?.sizes?.xl || defaultImpulseTokens.typography.sizes.xl,
            '2xl': adminTokens.typography?.sizes?.['2xl'] || defaultImpulseTokens.typography.sizes['2xl'],
            '3xl': adminTokens.typography?.sizes?.['3xl'] || defaultImpulseTokens.typography.sizes['3xl'],
          },
          weights: {
            light: adminTokens.typography?.weights?.light || defaultImpulseTokens.typography.weights.light,
            normal: adminTokens.typography?.weights?.normal || defaultImpulseTokens.typography.weights.normal,
            medium: adminTokens.typography?.weights?.medium || defaultImpulseTokens.typography.weights.medium,
            bold: adminTokens.typography?.weights?.bold || defaultImpulseTokens.typography.weights.bold,
          },
          lineHeights: {
            tight: adminTokens.typography?.lineHeights?.tight || defaultImpulseTokens.typography.lineHeights.tight,
            normal: adminTokens.typography?.lineHeights?.normal || defaultImpulseTokens.typography.lineHeights.normal,
            loose: adminTokens.typography?.lineHeights?.loose || defaultImpulseTokens.typography.lineHeights.loose,
          }
        }
      };
      
      logger.debug('Created ImpulseTheme from admin tokens', { 
        details: { themeId: impulseTheme.id } 
      });
      
      return impulseTheme;
    }
    
    // If no admin tokens, map from design_tokens directly
    const dt = theme.design_tokens || {};
    
    // Create impulse theme by mapping from core design tokens
    const impulseTheme: ImpulseTheme = {
      id: theme.id,
      name: theme.name,
      version: String(theme.version || '1.0.0'),
      description: theme.description || 'Admin Theme',
      
      // Map colors from core design tokens
      colors: {
        primary: dt.colors?.primary || defaultImpulseTokens.colors.primary,
        secondary: dt.colors?.secondary || defaultImpulseTokens.colors.secondary,
        accent: dt.colors?.accent || defaultImpulseTokens.colors.accent,
        background: {
          main: dt.colors?.background?.main || defaultImpulseTokens.colors.background.main,
          overlay: dt.colors?.background?.overlay || defaultImpulseTokens.colors.background.overlay,
          card: dt.colors?.background?.card || defaultImpulseTokens.colors.background.card,
          alt: dt.colors?.background?.alt || defaultImpulseTokens.colors.background.alt,
        },
        text: {
          primary: dt.colors?.text?.primary || defaultImpulseTokens.colors.text.primary,
          secondary: dt.colors?.text?.secondary || defaultImpulseTokens.colors.text.secondary,
          accent: dt.colors?.text?.accent || defaultImpulseTokens.colors.text.accent,
          muted: dt.colors?.text?.muted || defaultImpulseTokens.colors.text.muted,
        },
        borders: {
          normal: dt.colors?.borders?.normal || defaultImpulseTokens.colors.borders.normal,
          hover: dt.colors?.borders?.hover || defaultImpulseTokens.colors.borders.hover,
          active: dt.colors?.borders?.active || defaultImpulseTokens.colors.borders.active,
          focus: dt.colors?.borders?.focus || defaultImpulseTokens.colors.borders.focus,
        },
        status: {
          success: dt.colors?.status?.success || defaultImpulseTokens.colors.status.success,
          warning: dt.colors?.status?.warning || defaultImpulseTokens.colors.status.warning,
          error: dt.colors?.status?.error || defaultImpulseTokens.colors.status.error,
          info: dt.colors?.status?.info || defaultImpulseTokens.colors.status.info,
        }
      },
      
      // Map effects from core design tokens
      effects: {
        glow: {
          primary: dt.effects?.glow?.primary || defaultImpulseTokens.effects.glow.primary,
          secondary: dt.effects?.glow?.secondary || defaultImpulseTokens.effects.glow.secondary,
          hover: dt.effects?.glow?.hover || defaultImpulseTokens.effects.glow.hover,
        },
        gradients: {
          primary: dt.effects?.gradients?.primary || defaultImpulseTokens.effects.gradients.primary,
          secondary: dt.effects?.gradients?.secondary || defaultImpulseTokens.effects.gradients.secondary,
          accent: dt.effects?.gradients?.accent || defaultImpulseTokens.effects.gradients.accent,
        },
        shadows: {
          small: dt.effects?.shadows?.small || defaultImpulseTokens.effects.shadows.small,
          medium: dt.effects?.shadows?.medium || defaultImpulseTokens.effects.shadows.medium,
          large: dt.effects?.shadows?.large || defaultImpulseTokens.effects.shadows.large,
          inner: dt.effects?.shadows?.inner || defaultImpulseTokens.effects.shadows.inner,
        }
      },
      
      // Map animation properties
      animation: {
        duration: {
          fast: dt.animation?.duration?.fast || defaultImpulseTokens.animation.duration.fast,
          normal: dt.animation?.duration?.normal || defaultImpulseTokens.animation.duration.normal,
          slow: dt.animation?.duration?.slow || defaultImpulseTokens.animation.duration.slow,
        },
        curves: {
          bounce: dt.animation?.curves?.bounce || defaultImpulseTokens.animation.curves.bounce,
          ease: dt.animation?.curves?.ease || defaultImpulseTokens.animation.curves.ease,
          spring: dt.animation?.curves?.spring || defaultImpulseTokens.animation.curves.spring,
          linear: dt.animation?.curves?.linear || defaultImpulseTokens.animation.curves.linear,
        },
        keyframes: dt.animation?.keyframes || defaultImpulseTokens.animation.keyframes
      },
      
      // Map component styles
      components: {
        panel: {
          radius: dt.components?.panel?.radius || defaultImpulseTokens.components.panel.radius,
          padding: dt.components?.panel?.padding || defaultImpulseTokens.components.panel.padding,
          background: dt.components?.panel?.background || defaultImpulseTokens.components.panel.background,
        },
        button: {
          radius: dt.components?.button?.radius || defaultImpulseTokens.components.button.radius,
          padding: dt.components?.button?.padding || defaultImpulseTokens.components.button.padding,
          transition: dt.components?.button?.transition || defaultImpulseTokens.components.button.transition,
        },
        tooltip: {
          radius: dt.components?.tooltip?.radius || defaultImpulseTokens.components.tooltip.radius,
          padding: dt.components?.tooltip?.padding || defaultImpulseTokens.components.tooltip.padding,
          background: dt.components?.tooltip?.background || defaultImpulseTokens.components.tooltip.background,
        },
        input: {
          radius: dt.components?.input?.radius || defaultImpulseTokens.components.input.radius,
          padding: dt.components?.input?.padding || defaultImpulseTokens.components.input.padding,
          background: dt.components?.input?.background || defaultImpulseTokens.components.input.background,
        }
      },
      
      // Map typography styles
      typography: {
        fonts: {
          body: dt.typography?.fonts?.body || defaultImpulseTokens.typography.fonts.body,
          heading: dt.typography?.fonts?.heading || defaultImpulseTokens.typography.fonts.heading,
          mono: dt.typography?.fonts?.mono || defaultImpulseTokens.typography.fonts.mono,
        },
        sizes: {
          xs: dt.typography?.sizes?.xs || defaultImpulseTokens.typography.sizes.xs,
          sm: dt.typography?.sizes?.sm || defaultImpulseTokens.typography.sizes.sm,
          base: dt.typography?.sizes?.base || defaultImpulseTokens.typography.sizes.base,
          md: dt.typography?.sizes?.md || defaultImpulseTokens.typography.sizes.md,
          lg: dt.typography?.sizes?.lg || defaultImpulseTokens.typography.sizes.lg,
          xl: dt.typography?.sizes?.xl || defaultImpulseTokens.typography.sizes.xl,
          '2xl': dt.typography?.sizes?.['2xl'] || defaultImpulseTokens.typography.sizes['2xl'],
          '3xl': dt.typography?.sizes?.['3xl'] || defaultImpulseTokens.typography.sizes['3xl'],
        },
        weights: {
          light: dt.typography?.weights?.light || defaultImpulseTokens.typography.weights.light,
          normal: dt.typography?.weights?.normal || defaultImpulseTokens.typography.weights.normal,
          medium: dt.typography?.weights?.medium || defaultImpulseTokens.typography.weights.medium,
          bold: dt.typography?.weights?.bold || defaultImpulseTokens.typography.weights.bold,
        },
        lineHeights: {
          tight: dt.typography?.lineHeights?.tight || defaultImpulseTokens.typography.lineHeights.tight,
          normal: dt.typography?.lineHeights?.normal || defaultImpulseTokens.typography.lineHeights.normal,
          loose: dt.typography?.lineHeights?.loose || defaultImpulseTokens.typography.lineHeights.loose,
        }
      }
    };
    
    logger.debug('Created ImpulseTheme from design tokens', { 
      details: { themeId: impulseTheme.id } 
    });
    
    return impulseTheme;
  } catch (error) {
    logger.error('Error converting Theme to ImpulseTheme', {
      details: safeDetails(error)
    });
    
    // Return default tokens on error
    return defaultImpulseTokens;
  }
}
