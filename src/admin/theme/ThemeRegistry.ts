
import { ImpulseTheme } from '../types/impulse.types';
import { defaultImpulseTokens } from './impulse/tokens';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

/**
 * Theme Registry - Single source of truth for theme management
 * Handles theme registration, validation, and provides fallback mechanisms
 */
class ThemeRegistry {
  private themes: Map<string, ImpulseTheme> = new Map();
  private logger = getLogger('ThemeRegistry', LogCategory.THEME);
  private activeThemeId: string | null = null;

  constructor() {
    // Register default theme immediately
    this.registerTheme('default', defaultImpulseTokens);
    this.logger.info('Theme registry initialized with default theme');
  }

  /**
   * Register a theme in the registry
   */
  public registerTheme(id: string, theme: ImpulseTheme): void {
    if (!theme || !id) {
      this.logger.error('Cannot register theme: Invalid theme or ID');
      return;
    }

    if (this.themes.has(id)) {
      this.logger.warn(`Theme with ID ${id} already exists, overwriting`);
    }

    // Ensure the theme has all required properties
    const validatedTheme = this.validateTheme(theme);
    this.themes.set(id, validatedTheme);
    this.logger.debug(`Theme "${id}" registered successfully`);
  }

  /**
   * Get a theme by ID, with fallback to default
   */
  public getTheme(id: string): ImpulseTheme {
    if (!this.themes.has(id)) {
      this.logger.warn(`Theme "${id}" not found, using default`);
      return this.getDefaultTheme();
    }

    this.activeThemeId = id;
    return this.themes.get(id) as ImpulseTheme;
  }

  /**
   * Get default theme
   */
  public getDefaultTheme(): ImpulseTheme {
    this.activeThemeId = 'default';
    return this.themes.get('default') as ImpulseTheme;
  }

  /**
   * Get active theme ID
   */
  public getActiveThemeId(): string | null {
    return this.activeThemeId;
  }

  /**
   * Validate theme and ensure all required properties are present
   */
  private validateTheme(theme: Partial<ImpulseTheme>): ImpulseTheme {
    const defaultTheme = this.themes.get('default') as ImpulseTheme;
    
    if (!theme) return defaultTheme;
    
    // Create a deep merged theme with all required properties
    const validatedTheme: ImpulseTheme = {
      id: theme.id || 'unknown',
      name: theme.name || 'Unknown Theme',
      version: theme.version || '1.0.0',
      
      // Colors section with fallbacks
      colors: {
        primary: theme.colors?.primary || defaultTheme.colors.primary,
        secondary: theme.colors?.secondary || defaultTheme.colors.secondary,
        accent: theme.colors?.accent || defaultTheme.colors.accent,
        
        background: {
          main: theme.colors?.background?.main || defaultTheme.colors.background.main,
          overlay: theme.colors?.background?.overlay || defaultTheme.colors.background.overlay,
          card: theme.colors?.background?.card || defaultTheme.colors.background.card,
          alt: theme.colors?.background?.alt || defaultTheme.colors.background.alt,
        },
        
        text: {
          primary: theme.colors?.text?.primary || defaultTheme.colors.text.primary,
          secondary: theme.colors?.text?.secondary || defaultTheme.colors.text.secondary,
          accent: theme.colors?.text?.accent || defaultTheme.colors.text.accent,
          muted: theme.colors?.text?.muted || defaultTheme.colors.text.muted,
        },
        
        borders: {
          normal: theme.colors?.borders?.normal || defaultTheme.colors.borders.normal,
          hover: theme.colors?.borders?.hover || defaultTheme.colors.borders.hover,
          active: theme.colors?.borders?.active || defaultTheme.colors.borders.active,
          focus: theme.colors?.borders?.focus || defaultTheme.colors.borders.focus,
        },
        
        status: {
          success: theme.colors?.status?.success || defaultTheme.colors.status.success,
          warning: theme.colors?.status?.warning || defaultTheme.colors.status.warning,
          error: theme.colors?.status?.error || defaultTheme.colors.status.error,
          info: theme.colors?.status?.info || defaultTheme.colors.status.info,
        },
      },
      
      // Effects section with fallbacks
      effects: {
        glow: {
          primary: theme.effects?.glow?.primary || defaultTheme.effects.glow.primary,
          secondary: theme.effects?.glow?.secondary || defaultTheme.effects.glow.secondary,
          hover: theme.effects?.glow?.hover || defaultTheme.effects.glow.hover,
        },
        
        gradients: {
          primary: theme.effects?.gradients?.primary || defaultTheme.effects.gradients.primary,
          secondary: theme.effects?.gradients?.secondary || defaultTheme.effects.gradients.secondary,
          accent: theme.effects?.gradients?.accent || defaultTheme.effects.gradients.accent,
        },
        
        shadows: {
          small: theme.effects?.shadows?.small || defaultTheme.effects.shadows.small,
          medium: theme.effects?.shadows?.medium || defaultTheme.effects.shadows.medium,
          large: theme.effects?.shadows?.large || defaultTheme.effects.shadows.large,
          inner: theme.effects?.shadows?.inner || defaultTheme.effects.shadows.inner,
        },
      },
      
      // Animation section with fallbacks
      animation: {
        duration: {
          fast: theme.animation?.duration?.fast || defaultTheme.animation.duration.fast,
          normal: theme.animation?.duration?.normal || defaultTheme.animation.duration.normal,
          slow: theme.animation?.duration?.slow || defaultTheme.animation.duration.slow,
        },
        
        curves: {
          bounce: theme.animation?.curves?.bounce || defaultTheme.animation.curves.bounce,
          ease: theme.animation?.curves?.ease || defaultTheme.animation.curves.ease,
          spring: theme.animation?.curves?.spring || defaultTheme.animation.curves.spring,
          linear: theme.animation?.curves?.linear || defaultTheme.animation.curves.linear,
        },
        
        keyframes: {
          fade: theme.animation?.keyframes?.fade || defaultTheme.animation.keyframes.fade,
          pulse: theme.animation?.keyframes?.pulse || defaultTheme.animation.keyframes.pulse,
          glow: theme.animation?.keyframes?.glow || defaultTheme.animation.keyframes.glow,
          slide: theme.animation?.keyframes?.slide || defaultTheme.animation.keyframes.slide,
        },
      },
      
      // Component section with fallbacks
      components: {
        panel: {
          radius: theme.components?.panel?.radius || defaultTheme.components.panel.radius,
          padding: theme.components?.panel?.padding || defaultTheme.components.panel.padding,
          background: theme.components?.panel?.background || defaultTheme.components.panel.background,
        },
        
        button: {
          radius: theme.components?.button?.radius || defaultTheme.components.button.radius,
          padding: theme.components?.button?.padding || defaultTheme.components.button.padding,
          transition: theme.components?.button?.transition || defaultTheme.components.button.transition,
        },
        
        tooltip: {
          radius: theme.components?.tooltip?.radius || defaultTheme.components.tooltip.radius,
          padding: theme.components?.tooltip?.padding || defaultTheme.components.tooltip.padding,
          background: theme.components?.tooltip?.background || defaultTheme.components.tooltip.background,
        },
        
        input: {
          radius: theme.components?.input?.radius || defaultTheme.components.input.radius,
          padding: theme.components?.input?.padding || defaultTheme.components.input.padding,
          background: theme.components?.input?.background || defaultTheme.components.input.background,
        },
      },
      
      // Typography section with fallbacks
      typography: theme.typography ? {
        fonts: {
          body: theme.typography.fonts?.body || defaultTheme.typography.fonts.body,
          heading: theme.typography.fonts?.heading || defaultTheme.typography.fonts.heading,
          monospace: theme.typography.fonts?.monospace || defaultTheme.typography.fonts.monospace,
        },
        
        sizes: {
          xs: theme.typography.sizes?.xs || defaultTheme.typography.sizes.xs,
          sm: theme.typography.sizes?.sm || defaultTheme.typography.sizes.sm,
          md: theme.typography.sizes?.md || defaultTheme.typography.sizes.md,
          lg: theme.typography.sizes?.lg || defaultTheme.typography.sizes.lg,
          xl: theme.typography.sizes?.xl || defaultTheme.typography.sizes.xl,
          '2xl': theme.typography.sizes?.['2xl'] || defaultTheme.typography.sizes['2xl'],
          '3xl': theme.typography.sizes?.['3xl'] || defaultTheme.typography.sizes['3xl'],
        },
        
        weights: {
          light: theme.typography.weights?.light || defaultTheme.typography.weights.light,
          normal: theme.typography.weights?.normal || defaultTheme.typography.weights.normal,
          medium: theme.typography.weights?.medium || defaultTheme.typography.weights.medium,
          bold: theme.typography.weights?.bold || defaultTheme.typography.weights.bold,
        },
        
        lineHeights: {
          tight: theme.typography.lineHeights?.tight || defaultTheme.typography.lineHeights.tight,
          normal: theme.typography.lineHeights?.normal || defaultTheme.typography.lineHeights.normal,
          loose: theme.typography.lineHeights?.loose || defaultTheme.typography.lineHeights.loose,
        },
      } : defaultTheme.typography,
    };
    
    return validatedTheme;
  }
}

// Export a singleton instance
export const themeRegistry = new ThemeRegistry();
