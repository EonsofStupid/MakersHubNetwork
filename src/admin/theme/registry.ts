
import { defaultImpulseTokens } from './impulse/tokens';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { ImpulseTheme } from '../types/impulse.types';
import { getThemeProperty, validateTheme } from './utils/themeUtils';

// Interface for theme registry entries
interface ThemeRegistryEntry {
  name: string;
  description: string;
  theme: ImpulseTheme;
}

/**
 * Theme Registry for managing theme registration and access
 */
class ThemeRegistry {
  private themes: Map<string, ImpulseTheme> = new Map();
  private activeThemeId: string | null = null;
  private logger = getLogger('ThemeRegistry', { category: LogCategory.THEME });

  constructor() {
    // Register default theme
    this.registerTheme('default', defaultImpulseTokens);
    this.logger.info('Theme registry initialized with default theme');
  }

  /**
   * Register a theme with the registry
   */
  registerTheme(id: string, theme: ImpulseTheme): void {
    if (!theme || !id) {
      this.logger.error('Cannot register theme: Invalid theme or ID');
      return;
    }

    if (this.themes.has(id)) {
      this.logger.warn(`Theme ${id} already exists, overwriting`);
    }

    // Ensure theme has required ID
    theme.id = id;
    
    // Always validate/ensure complete theme objects
    const validatedTheme = this.validateTheme(theme);
    this.themes.set(id, validatedTheme);
    this.logger.debug(`Theme ${id} registered successfully`);
  }

  /**
   * Get a theme by ID
   */
  getTheme(id: string): ImpulseTheme {
    if (!this.themes.has(id)) {
      this.logger.warn(`Theme ${id} not found, using default`);
      return this.getDefaultTheme();
    }

    this.activeThemeId = id;
    return this.themes.get(id) as ImpulseTheme;
  }

  /**
   * Get the default theme
   */
  getDefaultTheme(): ImpulseTheme {
    this.activeThemeId = 'default';
    return this.themes.get('default') as ImpulseTheme;
  }

  /**
   * Get the currently active theme ID
   */
  getActiveThemeId(): string | null {
    return this.activeThemeId;
  }

  /**
   * Get all available themes
   */
  getAllThemes(): { id: string; name: string; description: string; theme: ImpulseTheme }[] {
    const themes: { id: string; name: string; description: string; theme: ImpulseTheme }[] = [];
    
    this.themes.forEach((theme, id) => {
      themes.push({
        id,
        name: theme.name || id,
        description: theme.description || '',
        theme
      });
    });
    
    return themes;
  }

  /**
   * Validate a theme object and ensure it has all required properties
   */
  private validateTheme(theme: ImpulseTheme): ImpulseTheme {
    const defaultTheme = this.getDefaultTheme();
    
    // Create a complete theme with all required properties
    const validatedTheme: ImpulseTheme = {
      // Basic theme properties
      id: theme.id,
      name: theme.name || 'Unknown Theme',
      version: theme.version || 1,
      description: theme.description || '',
      
      // Colors with fallbacks to ensure there are no undefined values
      colors: {
        primary: theme.colors?.primary || defaultTheme.colors.primary,
        secondary: theme.colors?.secondary || defaultTheme.colors.secondary,
        accent: theme.colors?.accent || defaultTheme.colors.accent || '#F97316',
        
        background: {
          main: theme.colors?.background?.main || defaultTheme.colors.background.main,
          overlay: theme.colors?.background?.overlay || defaultTheme.colors.background.overlay,
          card: theme.colors?.background?.card || defaultTheme.colors.background.card,
          alt: theme.colors?.background?.alt || defaultTheme.colors.background.alt
        },
        
        text: {
          primary: theme.colors?.text?.primary || defaultTheme.colors.text.primary,
          secondary: theme.colors?.text?.secondary || defaultTheme.colors.text.secondary,
          accent: theme.colors?.text?.accent || defaultTheme.colors.text.accent,
          muted: theme.colors?.text?.muted || defaultTheme.colors.text.muted
        },
        
        borders: {
          normal: theme.colors?.borders?.normal || defaultTheme.colors.borders.normal,
          hover: theme.colors?.borders?.hover || defaultTheme.colors.borders.hover,
          active: theme.colors?.borders?.active || defaultTheme.colors.borders.active,
          focus: theme.colors?.borders?.focus || defaultTheme.colors.borders.focus
        },
        
        status: {
          success: theme.colors?.status?.success || defaultTheme.colors.status.success,
          warning: theme.colors?.status?.warning || defaultTheme.colors.status.warning,
          error: theme.colors?.status?.error || defaultTheme.colors.status.error,
          info: theme.colors?.status?.info || defaultTheme.colors.status.info
        }
      },
      
      // Effects with fallbacks
      effects: {
        glow: {
          primary: theme.effects?.glow?.primary || defaultTheme.effects.glow.primary,
          secondary: theme.effects?.glow?.secondary || defaultTheme.effects.glow.secondary,
          hover: theme.effects?.glow?.hover || defaultTheme.effects.glow.hover
        },
        
        gradients: theme.effects?.gradients || defaultTheme.effects.gradients,
        
        shadows: {
          sm: theme.effects?.shadows?.sm || defaultTheme.effects.shadows.sm,
          md: theme.effects?.shadows?.md || defaultTheme.effects.shadows.md,
          lg: theme.effects?.shadows?.lg || defaultTheme.effects.shadows.lg,
          xl: theme.effects?.shadows?.xl || defaultTheme.effects.shadows.xl
        }
      },
      
      // Animation with fallbacks
      animation: {
        duration: {
          fast: theme.animation?.duration?.fast || defaultTheme.animation.duration.fast,
          normal: theme.animation?.duration?.normal || defaultTheme.animation.duration.normal,
          slow: theme.animation?.duration?.slow || defaultTheme.animation.duration.slow
        },
        
        curves: {
          bounce: theme.animation?.curves?.bounce || defaultTheme.animation.curves.bounce,
          ease: theme.animation?.curves?.ease || defaultTheme.animation.curves.ease,
          spring: theme.animation?.curves?.spring || defaultTheme.animation.curves.spring,
          linear: theme.animation?.curves?.linear || defaultTheme.animation.curves.linear
        },
        
        keyframes: theme.animation?.keyframes || defaultTheme.animation.keyframes
      },
      
      // Component styling
      components: {
        panel: {
          radius: theme.components?.panel?.radius || defaultTheme.components.panel.radius,
          padding: theme.components?.panel?.padding || defaultTheme.components.panel.padding,
          background: theme.components?.panel?.background || defaultTheme.components.panel.background
        },
        
        button: {
          radius: theme.components?.button?.radius || defaultTheme.components.button.radius,
          padding: theme.components?.button?.padding || defaultTheme.components.button.padding,
          transition: theme.components?.button?.transition || defaultTheme.components.button.transition
        },
        
        tooltip: {
          radius: theme.components?.tooltip?.radius || defaultTheme.components.tooltip.radius,
          padding: theme.components?.tooltip?.padding || defaultTheme.components.tooltip.padding,
          background: theme.components?.tooltip?.background || defaultTheme.components.tooltip.background
        },
        
        input: {
          radius: theme.components?.input?.radius || defaultTheme.components.input.radius,
          padding: theme.components?.input?.padding || defaultTheme.components.input.padding,
          background: theme.components?.input?.background || defaultTheme.components.input.background
        }
      },
      
      // Typography
      typography: {
        fonts: {
          body: theme.typography?.fonts?.body || defaultTheme.typography.fonts.body,
          heading: theme.typography?.fonts?.heading || defaultTheme.typography.fonts.heading,
          mono: theme.typography?.fonts?.mono || defaultTheme.typography.fonts.mono
        },
        
        sizes: {
          xs: theme.typography?.sizes?.xs || defaultTheme.typography.sizes.xs,
          sm: theme.typography?.sizes?.sm || defaultTheme.typography.sizes.sm,
          base: theme.typography?.sizes?.base || defaultTheme.typography.sizes.base,
          md: theme.typography?.sizes?.md || defaultTheme.typography.sizes.md,
          lg: theme.typography?.sizes?.lg || defaultTheme.typography.sizes.lg,
          xl: theme.typography?.sizes?.xl || defaultTheme.typography.sizes.xl,
          '2xl': theme.typography?.sizes?.['2xl'] || defaultTheme.typography.sizes['2xl'],
          '3xl': theme.typography?.sizes?.['3xl'] || defaultTheme.typography.sizes['3xl']
        },
        
        weights: {
          light: theme.typography?.weights?.light || defaultTheme.typography.weights.light,
          normal: theme.typography?.weights?.normal || defaultTheme.typography.weights.normal,
          medium: theme.typography?.weights?.medium || defaultTheme.typography.weights.medium,
          bold: theme.typography?.weights?.bold || defaultTheme.typography.weights.bold
        },
        
        lineHeights: {
          tight: theme.typography?.lineHeights?.tight || defaultTheme.typography.lineHeights.tight,
          normal: theme.typography?.lineHeights?.normal || defaultTheme.typography.lineHeights.normal,
          relaxed: theme.typography?.lineHeights?.relaxed || defaultTheme.typography.lineHeights.relaxed
        }
      }
    };
    
    return validatedTheme;
  }
}

// Create and export the singleton instance
const themeRegistryInstance = new ThemeRegistry();
export { themeRegistryInstance as themeRegistry };
