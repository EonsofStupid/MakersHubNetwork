
import { ImpulseTheme } from '../types/impulse.types';
import { defaultImpulseTokens } from './impulse/tokens';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

/**
 * Theme Registry - Single source of truth for theme management
 * Handles theme registration, validation, and provides fallback mechanisms
 */
class ThemeRegistryManager {
  private themes: Map<string, ImpulseTheme> = new Map();
  private logger = getLogger('ThemeRegistry', { category: LogCategory.THEME });
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
    
    // Create a validated theme with all required properties
    const validatedTheme: ImpulseTheme = {
      id: theme.id || 'unknown',
      name: theme.name || 'Unknown Theme',
      version: theme.version || '1.0.0',
      
      // Colors section with fallbacks
      colors: {
        primary: theme.colors?.primary || defaultTheme.colors.primary,
        secondary: theme.colors?.secondary || defaultTheme.colors.secondary,
        accent: theme.colors?.accent || (defaultTheme.colors.accent || '#F97316'),
        
        background: {
          main: theme.colors?.background?.main || (defaultTheme.colors.background?.main || '#12121A'),
          overlay: theme.colors?.background?.overlay || (defaultTheme.colors.background?.overlay || 'rgba(22, 24, 29, 0.85)'),
          card: theme.colors?.background?.card || (defaultTheme.colors.background?.card || 'rgba(28, 32, 42, 0.7)'),
          alt: theme.colors?.background?.alt || (defaultTheme.colors.background?.alt || '#1A1E24'),
        },
        
        text: {
          primary: theme.colors?.text?.primary || (defaultTheme.colors.text?.primary || '#F6F6F7'),
          secondary: theme.colors?.text?.secondary || (defaultTheme.colors.text?.secondary || 'rgba(255, 255, 255, 0.7)'),
          accent: theme.colors?.text?.accent || (defaultTheme.colors.text?.accent || '#00F0FF'),
          muted: theme.colors?.text?.muted || (defaultTheme.colors.text?.muted || 'rgba(255, 255, 255, 0.5)'),
        },
        
        borders: {
          normal: theme.colors?.borders?.normal || (defaultTheme.colors.borders?.normal || 'rgba(0, 240, 255, 0.2)'),
          hover: theme.colors?.borders?.hover || (defaultTheme.colors.borders?.hover || 'rgba(0, 240, 255, 0.4)'),
          active: theme.colors?.borders?.active || (defaultTheme.colors.borders?.active || 'rgba(0, 240, 255, 0.6)'),
          focus: theme.colors?.borders?.focus || (defaultTheme.colors.borders?.focus || 'rgba(0, 240, 255, 0.5)'),
        },
        
        status: {
          success: theme.colors?.status?.success || (defaultTheme.colors.status?.success || '#10B981'),
          warning: theme.colors?.status?.warning || (defaultTheme.colors.status?.warning || '#F59E0B'),
          error: theme.colors?.status?.error || (defaultTheme.colors.status?.error || '#EF4444'),
          info: theme.colors?.status?.info || (defaultTheme.colors.status?.info || '#3B82F6'),
        },
      },
    };
    
    // Effects section with fallbacks
    validatedTheme.effects = {
      glow: {
        primary: theme.effects?.glow?.primary || (defaultTheme.effects?.glow?.primary || '0 0 15px rgba(0, 240, 255, 0.7)'),
        secondary: theme.effects?.glow?.secondary || (defaultTheme.effects?.glow?.secondary || '0 0 15px rgba(255, 45, 110, 0.7)'),
        hover: theme.effects?.glow?.hover || (defaultTheme.effects?.glow?.hover || '0 0 20px rgba(0, 240, 255, 0.9)'),
      },
      
      gradients: {
        primary: theme.effects?.gradients?.primary || (defaultTheme.effects?.gradients?.primary || 'linear-gradient(90deg, #00F0FF, #00B8D4)'),
        secondary: theme.effects?.gradients?.secondary || (defaultTheme.effects?.gradients?.secondary || 'linear-gradient(90deg, #FF2D6E, #FF5252)'),
        accent: theme.effects?.gradients?.accent || (defaultTheme.effects?.gradients?.accent || 'linear-gradient(90deg, #F97316, #FB923C)'),
      },
      
      shadows: {
        small: theme.effects?.shadows?.small || (defaultTheme.effects?.shadows?.small || '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)'),
        medium: theme.effects?.shadows?.medium || (defaultTheme.effects?.shadows?.medium || '0 4px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3)'),
        large: theme.effects?.shadows?.large || (defaultTheme.effects?.shadows?.large || '0 10px 25px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.22)'),
        inner: theme.effects?.shadows?.inner || (defaultTheme.effects?.shadows?.inner || 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.15)'),
      },
    };
    
    // Animation section with fallbacks
    validatedTheme.animation = {
      duration: {
        fast: theme.animation?.duration?.fast || (defaultTheme.animation?.duration?.fast || '150ms'),
        normal: theme.animation?.duration?.normal || (defaultTheme.animation?.duration?.normal || '300ms'),
        slow: theme.animation?.duration?.slow || (defaultTheme.animation?.duration?.slow || '500ms'),
      },
      
      curves: {
        bounce: theme.animation?.curves?.bounce || (defaultTheme.animation?.curves?.bounce || 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'),
        ease: theme.animation?.curves?.ease || (defaultTheme.animation?.curves?.ease || 'cubic-bezier(0.4, 0, 0.2, 1)'),
        spring: theme.animation?.curves?.spring || (defaultTheme.animation?.curves?.spring || 'cubic-bezier(0.43, 0.13, 0.23, 0.96)'),
        linear: theme.animation?.curves?.linear || (defaultTheme.animation?.curves?.linear || 'linear'),
      },
      
      keyframes: {
        fade: theme.animation?.keyframes?.fade || (defaultTheme.animation?.keyframes?.fade || `
          @keyframes fade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `),
        pulse: theme.animation?.keyframes?.pulse || (defaultTheme.animation?.keyframes?.pulse || `
          @keyframes pulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 0.4; }
          }
        `),
        glow: theme.animation?.keyframes?.glow || (defaultTheme.animation?.keyframes?.glow || `
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px rgba(0, 240, 255, 0.5); }
            50% { box-shadow: 0 0 20px rgba(0, 240, 255, 0.7); }
          }
        `),
        slide: theme.animation?.keyframes?.slide || (defaultTheme.animation?.keyframes?.slide || `
          @keyframes slide {
            from { transform: translateY(10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `),
      },
    };
    
    // Component section with fallbacks
    validatedTheme.components = {
      panel: {
        radius: theme.components?.panel?.radius || (defaultTheme.components?.panel?.radius || '0.75rem'),
        padding: theme.components?.panel?.padding || (defaultTheme.components?.panel?.padding || '1.5rem'),
        background: theme.components?.panel?.background || (defaultTheme.components?.panel?.background || 'rgba(28, 32, 42, 0.7)'),
      },
      
      button: {
        radius: theme.components?.button?.radius || (defaultTheme.components?.button?.radius || '0.5rem'),
        padding: theme.components?.button?.padding || (defaultTheme.components?.button?.padding || '0.5rem 1rem'),
        transition: theme.components?.button?.transition || (defaultTheme.components?.button?.transition || 'all 0.2s ease'),
      },
      
      tooltip: {
        radius: theme.components?.tooltip?.radius || (defaultTheme.components?.tooltip?.radius || '0.25rem'),
        padding: theme.components?.tooltip?.padding || (defaultTheme.components?.tooltip?.padding || '0.5rem'),
        background: theme.components?.tooltip?.background || (defaultTheme.components?.tooltip?.background || 'rgba(0, 0, 0, 0.8)'),
      },
      
      input: {
        radius: theme.components?.input?.radius || (defaultTheme.components?.input?.radius || '0.375rem'),
        padding: theme.components?.input?.padding || (defaultTheme.components?.input?.padding || '0.5rem 0.75rem'),
        background: theme.components?.input?.background || (defaultTheme.components?.input?.background || 'rgba(0, 0, 0, 0.15)'),
      },
    };
    
    // Typography section with fallbacks
    const defaultFonts = {
      body: 'Inter, system-ui, sans-serif',
      heading: 'Inter, system-ui, sans-serif',
      monospace: 'Consolas, monospace',
    };

    const defaultSizes = {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    };

    const defaultWeights = {
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700,
    };

    const defaultLineHeights = {
      tight: '1.25',
      normal: '1.5',
      loose: '1.75',
    };

    validatedTheme.typography = {
      fonts: {
        body: theme.typography?.fonts?.body || (defaultTheme.typography?.fonts?.body || defaultFonts.body),
        heading: theme.typography?.fonts?.heading || (defaultTheme.typography?.fonts?.heading || defaultFonts.heading),
        monospace: theme.typography?.fonts?.monospace || (defaultTheme.typography?.fonts?.monospace || defaultFonts.monospace),
      },
      
      sizes: {
        xs: theme.typography?.sizes?.xs || (defaultTheme.typography?.sizes?.xs || defaultSizes.xs),
        sm: theme.typography?.sizes?.sm || (defaultTheme.typography?.sizes?.sm || defaultSizes.sm),
        md: theme.typography?.sizes?.md || (defaultTheme.typography?.sizes?.md || defaultSizes.md),
        lg: theme.typography?.sizes?.lg || (defaultTheme.typography?.sizes?.lg || defaultSizes.lg),
        xl: theme.typography?.sizes?.xl || (defaultTheme.typography?.sizes?.xl || defaultSizes.xl),
        '2xl': theme.typography?.sizes?.['2xl'] || (defaultTheme.typography?.sizes?.['2xl'] || defaultSizes['2xl']),
        '3xl': theme.typography?.sizes?.['3xl'] || (defaultTheme.typography?.sizes?.['3xl'] || defaultSizes['3xl']),
      },
      
      weights: {
        light: theme.typography?.weights?.light || (defaultTheme.typography?.weights?.light || defaultWeights.light),
        normal: theme.typography?.weights?.normal || (defaultTheme.typography?.weights?.normal || defaultWeights.normal),
        medium: theme.typography?.weights?.medium || (defaultTheme.typography?.weights?.medium || defaultWeights.medium),
        bold: theme.typography?.weights?.bold || (defaultTheme.typography?.weights?.bold || defaultWeights.bold),
      },
      
      lineHeights: {
        tight: theme.typography?.lineHeights?.tight || (defaultTheme.typography?.lineHeights?.tight || defaultLineHeights.tight),
        normal: theme.typography?.lineHeights?.normal || (defaultTheme.typography?.lineHeights?.normal || defaultLineHeights.normal),
        loose: theme.typography?.lineHeights?.loose || (defaultTheme.typography?.lineHeights?.loose || defaultLineHeights.loose),
      },
    };
    
    return validatedTheme;
  }
}

// Export a singleton instance
export const themeRegistry = new ThemeRegistryManager();
