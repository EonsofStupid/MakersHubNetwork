import { Theme, ThemeToken, ComponentTokens, ThemeContext } from '@/types/theme';
import { ImpulseTheme, defaultImpulseTokens } from '@/admin/types/impulse.types';
import { ThemeComponent } from '@/stores/theme/types';
import { getThemeProperty } from './themeUtils';
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
 */
export function themeToImpulseTheme(theme: Theme): ImpulseTheme {
  if (!theme) {
    return defaultImpulseTokens;
  }
  
  try {
    // Extract impulse properties from design_tokens
    const dt = theme.design_tokens || {};
    const adminTokens = dt.admin || {};
    
    // Check if there are explicit admin tokens
    if (Object.keys(adminTokens).length > 0) {
      // If we have explicit admin tokens, use those with fallbacks to default
      return {
        id: theme.id,
        name: theme.name,
        version: String(theme.version || '1.0.0'),
        description: theme.description,
        
        // Colors with fallbacks
        colors: {
          primary: getThemeProperty(adminTokens, 'colors.primary', defaultImpulseTokens.colors.primary),
          secondary: getThemeProperty(adminTokens, 'colors.secondary', defaultImpulseTokens.colors.secondary),
          accent: getThemeProperty(adminTokens, 'colors.accent', defaultImpulseTokens.colors.accent),
          
          background: {
            main: getThemeProperty(adminTokens, 'colors.background.main', defaultImpulseTokens.colors.background.main),
            overlay: getThemeProperty(adminTokens, 'colors.background.overlay', defaultImpulseTokens.colors.background.overlay),
            card: getThemeProperty(adminTokens, 'colors.background.card', defaultImpulseTokens.colors.background.card),
            alt: getThemeProperty(adminTokens, 'colors.background.alt', defaultImpulseTokens.colors.background.alt)
          },
          
          text: {
            primary: getThemeProperty(adminTokens, 'colors.text.primary', defaultImpulseTokens.colors.text.primary),
            secondary: getThemeProperty(adminTokens, 'colors.text.secondary', defaultImpulseTokens.colors.text.secondary),
            accent: getThemeProperty(adminTokens, 'colors.text.accent', defaultImpulseTokens.colors.text.accent),
            muted: getThemeProperty(adminTokens, 'colors.text.muted', defaultImpulseTokens.colors.text.muted)
          },
          
          borders: {
            normal: getThemeProperty(adminTokens, 'colors.borders.normal', defaultImpulseTokens.colors.borders.normal),
            hover: getThemeProperty(adminTokens, 'colors.borders.hover', defaultImpulseTokens.colors.borders.hover),
            active: getThemeProperty(adminTokens, 'colors.borders.active', defaultImpulseTokens.colors.borders.active),
            focus: getThemeProperty(adminTokens, 'colors.borders.focus', defaultImpulseTokens.colors.borders.focus)
          },
          
          status: {
            success: getThemeProperty(adminTokens, 'colors.status.success', defaultImpulseTokens.colors.status.success),
            warning: getThemeProperty(adminTokens, 'colors.status.warning', defaultImpulseTokens.colors.status.warning),
            error: getThemeProperty(adminTokens, 'colors.status.error', defaultImpulseTokens.colors.status.error),
            info: getThemeProperty(adminTokens, 'colors.status.info', defaultImpulseTokens.colors.status.info)
          }
        },
        
        // Other theme properties with fallbacks
        effects: {
          glow: {
            primary: getThemeProperty(adminTokens, 'effects.glow.primary', defaultImpulseTokens.effects.glow.primary),
            secondary: getThemeProperty(adminTokens, 'effects.glow.secondary', defaultImpulseTokens.effects.glow.secondary),
            hover: getThemeProperty(adminTokens, 'effects.glow.hover', defaultImpulseTokens.effects.glow.hover)
          },
          gradients: {
            primary: getThemeProperty(adminTokens, 'effects.gradients.primary', defaultImpulseTokens.effects.gradients.primary),
            secondary: getThemeProperty(adminTokens, 'effects.gradients.secondary', defaultImpulseTokens.effects.gradients.secondary),
            accent: getThemeProperty(adminTokens, 'effects.gradients.accent', defaultImpulseTokens.effects.gradients.accent)
          },
          shadows: {
            small: getThemeProperty(adminTokens, 'effects.shadows.small', defaultImpulseTokens.effects.shadows.small),
            medium: getThemeProperty(adminTokens, 'effects.shadows.medium', defaultImpulseTokens.effects.shadows.medium),
            large: getThemeProperty(adminTokens, 'effects.shadows.large', defaultImpulseTokens.effects.shadows.large),
            inner: getThemeProperty(adminTokens, 'effects.shadows.inner', defaultImpulseTokens.effects.shadows.inner)
          }
        },
        
        animation: {
          duration: {
            fast: getThemeProperty(adminTokens, 'animation.duration.fast', defaultImpulseTokens.animation.duration.fast),
            normal: getThemeProperty(adminTokens, 'animation.duration.normal', defaultImpulseTokens.animation.duration.normal),
            slow: getThemeProperty(adminTokens, 'animation.duration.slow', defaultImpulseTokens.animation.duration.slow)
          },
          curves: {
            bounce: getThemeProperty(adminTokens, 'animation.curves.bounce', defaultImpulseTokens.animation.curves.bounce),
            ease: getThemeProperty(adminTokens, 'animation.curves.ease', defaultImpulseTokens.animation.curves.ease),
            spring: getThemeProperty(adminTokens, 'animation.curves.spring', defaultImpulseTokens.animation.curves.spring),
            linear: getThemeProperty(adminTokens, 'animation.curves.linear', defaultImpulseTokens.animation.curves.linear)
          },
          keyframes: getThemeProperty(adminTokens, 'animation.keyframes', defaultImpulseTokens.animation.keyframes)
        },
        
        components: {
          panel: {
            radius: getThemeProperty(adminTokens, 'components.panel.radius', defaultImpulseTokens.components.panel.radius),
            padding: getThemeProperty(adminTokens, 'components.panel.padding', defaultImpulseTokens.components.panel.padding),
            background: getThemeProperty(adminTokens, 'components.panel.background', defaultImpulseTokens.components.panel.background)
          },
          button: {
            radius: getThemeProperty(adminTokens, 'components.button.radius', defaultImpulseTokens.components.button.radius),
            padding: getThemeProperty(adminTokens, 'components.button.padding', defaultImpulseTokens.components.button.padding),
            transition: getThemeProperty(adminTokens, 'components.button.transition', defaultImpulseTokens.components.button.transition)
          },
          tooltip: {
            radius: getThemeProperty(adminTokens, 'components.tooltip.radius', defaultImpulseTokens.components.tooltip.radius),
            padding: getThemeProperty(adminTokens, 'components.tooltip.padding', defaultImpulseTokens.components.tooltip.padding),
            background: getThemeProperty(adminTokens, 'components.tooltip.background', defaultImpulseTokens.components.tooltip.background)
          },
          input: {
            radius: getThemeProperty(adminTokens, 'components.input.radius', defaultImpulseTokens.components.input.radius),
            padding: getThemeProperty(adminTokens, 'components.input.padding', defaultImpulseTokens.components.input.padding),
            background: getThemeProperty(adminTokens, 'components.input.background', defaultImpulseTokens.components.input.background)
          }
        },
        
        typography: {
          fonts: {
            body: getThemeProperty(adminTokens, 'typography.fonts.body', defaultImpulseTokens.typography.fonts.body),
            heading: getThemeProperty(adminTokens, 'typography.fonts.heading', defaultImpulseTokens.typography.fonts.heading),
            mono: getThemeProperty(adminTokens, 'typography.fonts.monospace', defaultImpulseTokens.typography.fonts.mono)
          },
          sizes: {
            xs: getThemeProperty(adminTokens, 'typography.sizes.xs', defaultImpulseTokens.typography.sizes.xs),
            sm: getThemeProperty(adminTokens, 'typography.sizes.sm', defaultImpulseTokens.typography.sizes.sm),
            base: getThemeProperty(adminTokens, 'typography.sizes.base', defaultImpulseTokens.typography.sizes.base),
            md: getThemeProperty(adminTokens, 'typography.sizes.md', defaultImpulseTokens.typography.sizes.md),
            lg: getThemeProperty(adminTokens, 'typography.sizes.lg', defaultImpulseTokens.typography.sizes.lg),
            xl: getThemeProperty(adminTokens, 'typography.sizes.xl', defaultImpulseTokens.typography.sizes.xl),
            '2xl': getThemeProperty(adminTokens, 'typography.sizes.2xl', defaultImpulseTokens.typography.sizes['2xl']),
            '3xl': getThemeProperty(adminTokens, 'typography.sizes.3xl', defaultImpulseTokens.typography.sizes['3xl'])
          },
          weights: {
            light: getThemeProperty(adminTokens, 'typography.weights.light', defaultImpulseTokens.typography.weights.light),
            normal: getThemeProperty(adminTokens, 'typography.weights.normal', defaultImpulseTokens.typography.weights.normal),
            medium: getThemeProperty(adminTokens, 'typography.weights.medium', defaultImpulseTokens.typography.weights.medium),
            bold: getThemeProperty(adminTokens, 'typography.weights.bold', defaultImpulseTokens.typography.weights.bold)
          },
          lineHeights: {
            tight: getThemeProperty(adminTokens, 'typography.lineHeights.tight', defaultImpulseTokens.typography.lineHeights.tight),
            normal: getThemeProperty(adminTokens, 'typography.lineHeights.normal', defaultImpulseTokens.typography.lineHeights.normal),
            loose: getThemeProperty(adminTokens, 'typography.lineHeights.loose', defaultImpulseTokens.typography.lineHeights.loose)
          }
        }
      };
    }
  } catch (error) {
    logger.error('Error converting Theme to ImpulseTheme', {
      details: safeDetails(error)
    });
    return defaultImpulseTokens;
  }
}
