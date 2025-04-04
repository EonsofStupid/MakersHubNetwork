
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
      is_system: row.is_system || false,
      is_active: row.is_active || false,
      context: row.context || 'admin'
    };
  } catch (error) {
    logger.error('Error transforming DB row to Theme', {
      details: safeDetails(error)
    });
    return null;
  }
}

/**
 * Convert a Theme object to an ImpulseTheme object
 * This is crucial for transforming database theme records into 
 * the format needed for the admin interface
 */
export function themeToImpulseTheme(theme: Theme | null): ImpulseTheme {
  if (!theme) {
    logger.warn('No theme provided for transformation, using default tokens');
    return { ...defaultImpulseTokens };
  }
  
  try {
    // Ensure design_tokens exists
    if (!theme.design_tokens) {
      logger.warn('Theme missing design tokens, using defaults', {
        details: { themeId: theme.id, themeName: theme.name }
      });
      return { ...defaultImpulseTokens };
    }
    
    // Map the database theme to Impulse theme structure
    const impulseTheme: ImpulseTheme = {
      id: theme.id,
      name: theme.name,
      version: theme.version.toString(),
      description: theme.description || 'Impulse Theme',
      
      // Extract and map colors from design tokens
      colors: {
        primary: theme.design_tokens.colors?.primary || defaultImpulseTokens.colors.primary,
        secondary: theme.design_tokens.colors?.secondary || defaultImpulseTokens.colors.secondary,
        accent: theme.design_tokens.colors?.accent || defaultImpulseTokens.colors.accent,
        background: {
          main: theme.design_tokens.colors?.background?.main || defaultImpulseTokens.colors.background.main,
          overlay: theme.design_tokens.colors?.background?.overlay || defaultImpulseTokens.colors.background.overlay,
          card: theme.design_tokens.colors?.background?.card || defaultImpulseTokens.colors.background.card,
          alt: theme.design_tokens.colors?.background?.alt || defaultImpulseTokens.colors.background.alt
        },
        text: {
          primary: theme.design_tokens.colors?.text?.primary || defaultImpulseTokens.colors.text.primary,
          secondary: theme.design_tokens.colors?.text?.secondary || defaultImpulseTokens.colors.text.secondary,
          accent: theme.design_tokens.colors?.text?.accent || defaultImpulseTokens.colors.text.accent,
          muted: theme.design_tokens.colors?.text?.muted || defaultImpulseTokens.colors.text.muted
        },
        borders: {
          normal: theme.design_tokens.colors?.borders?.normal || defaultImpulseTokens.colors.borders.normal,
          hover: theme.design_tokens.colors?.borders?.hover || defaultImpulseTokens.colors.borders.hover,
          active: theme.design_tokens.colors?.borders?.active || defaultImpulseTokens.colors.borders.active,
          focus: theme.design_tokens.colors?.borders?.focus || defaultImpulseTokens.colors.borders.focus
        },
        status: {
          success: theme.design_tokens.colors?.status?.success || defaultImpulseTokens.colors.status.success,
          warning: theme.design_tokens.colors?.status?.warning || defaultImpulseTokens.colors.status.warning,
          error: theme.design_tokens.colors?.status?.error || defaultImpulseTokens.colors.status.error,
          info: theme.design_tokens.colors?.status?.info || defaultImpulseTokens.colors.status.info
        }
      },
      
      // Extract and map effects from design tokens
      effects: {
        glow: {
          primary: theme.design_tokens.effects?.glow?.primary || defaultImpulseTokens.effects.glow.primary,
          secondary: theme.design_tokens.effects?.glow?.secondary || defaultImpulseTokens.effects.glow.secondary,
          hover: theme.design_tokens.effects?.glow?.hover || defaultImpulseTokens.effects.glow.hover
        },
        shadows: {
          small: theme.design_tokens.effects?.shadows?.sm || defaultImpulseTokens.effects.shadows.small,
          medium: theme.design_tokens.effects?.shadows?.md || defaultImpulseTokens.effects.shadows.medium,
          large: theme.design_tokens.effects?.shadows?.lg || defaultImpulseTokens.effects.shadows.large,
          inner: theme.design_tokens.effects?.shadows?.inner || 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.15)'
        },
        gradients: theme.design_tokens.effects?.gradients || defaultImpulseTokens.effects.gradients
      },
      
      // Extract and map animation from design tokens
      animation: {
        duration: {
          fast: theme.design_tokens.animation?.duration?.fast || defaultImpulseTokens.animation.duration.fast,
          normal: theme.design_tokens.animation?.duration?.normal || defaultImpulseTokens.animation.duration.normal,
          slow: theme.design_tokens.animation?.duration?.slow || defaultImpulseTokens.animation.duration.slow
        },
        curves: {
          bounce: theme.design_tokens.animation?.curves?.bounce || defaultImpulseTokens.animation.curves.bounce,
          ease: theme.design_tokens.animation?.curves?.ease || defaultImpulseTokens.animation.curves.ease,
          spring: theme.design_tokens.animation?.curves?.spring || defaultImpulseTokens.animation.curves.spring,
          linear: theme.design_tokens.animation?.curves?.linear || defaultImpulseTokens.animation.curves.linear
        },
        keyframes: theme.design_tokens.animation?.keyframes || defaultImpulseTokens.animation.keyframes
      },
      
      // Extract and map components from design tokens
      components: {
        panel: {
          radius: theme.design_tokens.components?.panel?.radius || defaultImpulseTokens.components.panel.radius,
          padding: theme.design_tokens.components?.panel?.padding || defaultImpulseTokens.components.panel.padding,
          background: theme.design_tokens.components?.panel?.background || defaultImpulseTokens.components.panel.background
        },
        button: {
          radius: theme.design_tokens.components?.button?.radius || defaultImpulseTokens.components.button.radius,
          padding: theme.design_tokens.components?.button?.padding || defaultImpulseTokens.components.button.padding,
          transition: theme.design_tokens.components?.button?.transition || defaultImpulseTokens.components.button.transition
        },
        tooltip: {
          radius: theme.design_tokens.components?.tooltip?.radius || defaultImpulseTokens.components.tooltip.radius,
          padding: theme.design_tokens.components?.tooltip?.padding || defaultImpulseTokens.components.tooltip.padding,
          background: theme.design_tokens.components?.tooltip?.background || defaultImpulseTokens.components.tooltip.background
        },
        input: {
          radius: theme.design_tokens.components?.input?.radius || defaultImpulseTokens.components.input.radius,
          padding: theme.design_tokens.components?.input?.padding || defaultImpulseTokens.components.input.padding,
          background: theme.design_tokens.components?.input?.background || defaultImpulseTokens.components.input.background
        }
      },
      
      // Extract and map typography from design tokens
      typography: {
        fonts: {
          body: theme.design_tokens.typography?.fonts?.body || defaultImpulseTokens.typography.fonts.body,
          heading: theme.design_tokens.typography?.fonts?.heading || defaultImpulseTokens.typography.fonts.heading,
          mono: theme.design_tokens.typography?.fonts?.mono || defaultImpulseTokens.typography.fonts.mono
        },
        sizes: {
          xs: theme.design_tokens.typography?.sizes?.xs || defaultImpulseTokens.typography.sizes.xs,
          sm: theme.design_tokens.typography?.sizes?.sm || defaultImpulseTokens.typography.sizes.sm,
          base: theme.design_tokens.typography?.sizes?.base || defaultImpulseTokens.typography.sizes.base,
          md: theme.design_tokens.typography?.sizes?.md || defaultImpulseTokens.typography.sizes.md,
          lg: theme.design_tokens.typography?.sizes?.lg || defaultImpulseTokens.typography.sizes.lg,
          xl: theme.design_tokens.typography?.sizes?.xl || defaultImpulseTokens.typography.sizes.xl,
          '2xl': theme.design_tokens.typography?.sizes?.['2xl'] || defaultImpulseTokens.typography.sizes['2xl'],
          '3xl': theme.design_tokens.typography?.sizes?.['3xl'] || defaultImpulseTokens.typography.sizes['3xl']
        },
        weights: {
          light: theme.design_tokens.typography?.weights?.light || defaultImpulseTokens.typography.weights.light,
          normal: theme.design_tokens.typography?.weights?.normal || defaultImpulseTokens.typography.weights.normal,
          medium: theme.design_tokens.typography?.weights?.medium || defaultImpulseTokens.typography.weights.medium,
          bold: theme.design_tokens.typography?.weights?.bold || defaultImpulseTokens.typography.weights.bold
        },
        lineHeights: {
          tight: theme.design_tokens.typography?.lineHeights?.tight || defaultImpulseTokens.typography.lineHeights.tight,
          normal: theme.design_tokens.typography?.lineHeights?.normal || defaultImpulseTokens.typography.lineHeights.normal,
          loose: theme.design_tokens.typography?.lineHeights?.relaxed || defaultImpulseTokens.typography.lineHeights.loose
        }
      }
    };
    
    logger.debug('Successfully transformed Theme to ImpulseTheme', {
      details: { themeId: theme.id }
    });
    
    return impulseTheme;
  } catch (error) {
    logger.error('Error transforming Theme to ImpulseTheme', {
      details: safeDetails(error)
    });
    // Fall back to default tokens
    return { ...defaultImpulseTokens };
  }
}

/**
 * Convert ImpulseTheme to Theme for storing in database
 */
export function impulseThemeToTheme(impulseTheme: ImpulseTheme, existingTheme?: Theme): Theme {
  try {
    // Start with existing theme or create a new one
    const theme: Theme = existingTheme || {
      id: impulseTheme.id,
      name: impulseTheme.name,
      description: impulseTheme.description,
      status: 'draft',
      is_default: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: parseInt(impulseTheme.version, 10) || 1,
      design_tokens: {},
      component_tokens: [],
      context: 'admin'
    };
    
    // Update the theme with the impulse theme values
    theme.name = impulseTheme.name;
    theme.description = impulseTheme.description;
    theme.version = parseInt(impulseTheme.version, 10) || theme.version;
    theme.updated_at = new Date().toISOString();
    
    // Map the impulse theme structure to design tokens
    theme.design_tokens = {
      colors: impulseTheme.colors,
      typography: impulseTheme.typography,
      effects: impulseTheme.effects,
      animation: impulseTheme.animation,
      components: impulseTheme.components
    };
    
    logger.debug('Successfully transformed ImpulseTheme to Theme', {
      details: { themeId: impulseTheme.id }
    });
    
    return theme;
  } catch (error) {
    logger.error('Error transforming ImpulseTheme to Theme', {
      details: safeDetails(error)
    });
    throw error;
  }
}

/**
 * Convert ComponentTokens to ThemeComponent
 */
export function componentTokensToThemeComponent(componentToken: ComponentTokens): ThemeComponent {
  return {
    id: componentToken.id,
    component_name: componentToken.component_name,
    theme_id: componentToken.theme_id || '',
    context: (componentToken.context || 'admin') as ThemeContext,
    styles: componentToken.styles,
    created_at: componentToken.created_at || null,
    updated_at: componentToken.updated_at || null,
    description: componentToken.description || ''
  };
}

/**
 * Convert ThemeComponent to ComponentTokens
 */
export function themeComponentToComponentTokens(themeComponent: ThemeComponent): ComponentTokens {
  return {
    id: themeComponent.id,
    component_name: themeComponent.component_name,
    theme_id: themeComponent.theme_id,
    context: themeComponent.context,
    styles: themeComponent.styles,
    created_at: themeComponent.created_at,
    updated_at: themeComponent.updated_at,
    description: themeComponent.description
  };
}

/**
 * Get an array of all available themes
 */
export function getAllThemes() {
  // This would typically fetch from an API or database
  // For now, just return the default theme
  return [
    { 
      id: 'default', 
      name: 'Default Theme', 
      description: 'The default Impulsivity theme', 
      theme: defaultImpulseTokens 
    },
    { 
      id: 'cyberpunk', 
      name: 'Cyberpunk', 
      description: 'High contrast neon theme', 
      theme: {
        ...defaultImpulseTokens,
        colors: {
          ...defaultImpulseTokens.colors,
          primary: '#00FFC2',
          secondary: '#FF00E5',
          background: {
            ...defaultImpulseTokens.colors.background,
            main: '#090E16'
          }
        }
      }
    },
    { 
      id: 'midnight', 
      name: 'Midnight Blue', 
      description: 'Deep blue professional theme', 
      theme: {
        ...defaultImpulseTokens,
        colors: {
          ...defaultImpulseTokens.colors,
          primary: '#3A86FF',
          secondary: '#FF006E',
          background: {
            ...defaultImpulseTokens.colors.background,
            main: '#121833'
          }
        }
      }
    }
  ];
}
