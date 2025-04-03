
import { ImpulseTheme } from '../types/impulse.types';
import { defaultImpulseTokens } from './impulse/tokens';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { getThemeProperty } from './utils/themeUtils';

// Define the registry interface
interface ThemeRegistryEntry {
  name: string;
  description: string;
  theme: ImpulseTheme;
}

type ThemeRegistryMap = {
  [key: string]: ThemeRegistryEntry;
};

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
        accent: theme.colors?.accent || defaultTheme.colors.accent || '#F97316',
        
        background: {
          main: getThemeProperty(theme, 'colors.background.main', defaultTheme.colors.background?.main) || '#000000',
          overlay: getThemeProperty(theme, 'colors.background.overlay', defaultTheme.colors.background?.overlay) || 'rgba(0,0,0,0.5)',
          card: getThemeProperty(theme, 'colors.background.card', defaultTheme.colors.background?.card) || '#111111',
          alt: getThemeProperty(theme, 'colors.background.alt', defaultTheme.colors.background?.alt)
        },
        
        text: {
          primary: getThemeProperty(theme, 'colors.text.primary', defaultTheme.colors.text?.primary) || '#ffffff',
          secondary: getThemeProperty(theme, 'colors.text.secondary', defaultTheme.colors.text?.secondary) || 'rgba(255,255,255,0.7)',
          accent: getThemeProperty(theme, 'colors.text.accent', defaultTheme.colors.text?.accent) || '#00F0FF',
          muted: getThemeProperty(theme, 'colors.text.muted', defaultTheme.colors.text?.muted) || 'rgba(255,255,255,0.5)'
        },
        
        borders: {
          normal: getThemeProperty(theme, 'colors.borders.normal', defaultTheme.colors.borders?.normal) || 'rgba(255,255,255,0.1)',
          hover: getThemeProperty(theme, 'colors.borders.hover', defaultTheme.colors.borders?.hover) || 'rgba(255,255,255,0.2)',
          active: getThemeProperty(theme, 'colors.borders.active', defaultTheme.colors.borders?.active) || 'rgba(255,255,255,0.3)',
          focus: getThemeProperty(theme, 'colors.borders.focus', defaultTheme.colors.borders?.focus) || 'rgba(255,255,255,0.25)'
        },
        
        status: {
          success: getThemeProperty(theme, 'colors.status.success', defaultTheme.colors.status?.success) || '#10B981',
          warning: getThemeProperty(theme, 'colors.status.warning', defaultTheme.colors.status?.warning) || '#F59E0B',
          error: getThemeProperty(theme, 'colors.status.error', defaultTheme.colors.status?.error) || '#EF4444',
          info: getThemeProperty(theme, 'colors.status.info', defaultTheme.colors.status?.info) || '#3B82F6'
        }
      },
      
      // Effects
      effects: {
        glow: {
          primary: getThemeProperty(theme, 'effects.glow.primary', defaultTheme.effects?.glow?.primary) || '0 0 10px rgba(0, 240, 255, 0.7)',
          secondary: getThemeProperty(theme, 'effects.glow.secondary', defaultTheme.effects?.glow?.secondary) || '0 0 10px rgba(255, 45, 110, 0.7)',
          hover: getThemeProperty(theme, 'effects.glow.hover', defaultTheme.effects?.glow?.hover) || '0 0 15px rgba(0, 240, 255, 0.9)'
        },
        
        gradients: {
          primary: getThemeProperty(theme, 'effects.gradients.primary', defaultTheme.effects?.gradients?.primary) || 'linear-gradient(90deg, #00F0FF, #00F0FF44)',
          secondary: getThemeProperty(theme, 'effects.gradients.secondary', defaultTheme.effects?.gradients?.secondary) || 'linear-gradient(90deg, #FF2D6E, #FF2D6E44)',
          accent: getThemeProperty(theme, 'effects.gradients.accent', defaultTheme.effects?.gradients?.accent) || 'linear-gradient(90deg, #8B5CF6, #8B5CF644)'
        },
        
        shadows: {
          small: getThemeProperty(theme, 'effects.shadows.small', defaultTheme.effects?.shadows?.small) || '0 2px 4px rgba(0,0,0,0.1)',
          medium: getThemeProperty(theme, 'effects.shadows.medium', defaultTheme.effects?.shadows?.medium) || '0 4px 6px rgba(0,0,0,0.1)',
          large: getThemeProperty(theme, 'effects.shadows.large', defaultTheme.effects?.shadows?.large) || '0 10px 15px rgba(0,0,0,0.1)',
          inner: getThemeProperty(theme, 'effects.shadows.inner', defaultTheme.effects?.shadows?.inner) || 'inset 0 2px 4px rgba(0,0,0,0.1)'
        }
      },
      
      // Animation
      animation: {
        duration: {
          fast: getThemeProperty(theme, 'animation.duration.fast', defaultTheme.animation?.duration?.fast) || '150ms',
          normal: getThemeProperty(theme, 'animation.duration.normal', defaultTheme.animation?.duration?.normal) || '300ms',
          slow: getThemeProperty(theme, 'animation.duration.slow', defaultTheme.animation?.duration?.slow) || '500ms'
        },
        
        curves: {
          bounce: getThemeProperty(theme, 'animation.curves.bounce', defaultTheme.animation?.curves?.bounce) || 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          ease: getThemeProperty(theme, 'animation.curves.ease', defaultTheme.animation?.curves?.ease) || 'cubic-bezier(0.4, 0, 0.2, 1)',
          spring: getThemeProperty(theme, 'animation.curves.spring', defaultTheme.animation?.curves?.spring) || 'cubic-bezier(0.43, 0.13, 0.23, 0.96)',
          linear: getThemeProperty(theme, 'animation.curves.linear', defaultTheme.animation?.curves?.linear) || 'linear'
        },
        
        keyframes: {
          fade: getThemeProperty(theme, 'animation.keyframes.fade', defaultTheme.animation?.keyframes?.fade) || '',
          pulse: getThemeProperty(theme, 'animation.keyframes.pulse', defaultTheme.animation?.keyframes?.pulse) || '',
          glow: getThemeProperty(theme, 'animation.keyframes.glow', defaultTheme.animation?.keyframes?.glow) || '',
          slide: getThemeProperty(theme, 'animation.keyframes.slide', defaultTheme.animation?.keyframes?.slide) || ''
        }
      },
      
      // Component styling
      components: {
        panel: {
          radius: getThemeProperty(theme, 'components.panel.radius', defaultTheme.components?.panel?.radius) || '0.75rem',
          padding: getThemeProperty(theme, 'components.panel.padding', defaultTheme.components?.panel?.padding) || '1.5rem',
          background: getThemeProperty(theme, 'components.panel.background', defaultTheme.components?.panel?.background) || getThemeProperty(theme, 'colors.background.card', '#111111')
        },
        
        button: {
          radius: getThemeProperty(theme, 'components.button.radius', defaultTheme.components?.button?.radius) || '0.5rem',
          padding: getThemeProperty(theme, 'components.button.padding', defaultTheme.components?.button?.padding) || '0.5rem 1rem',
          transition: getThemeProperty(theme, 'components.button.transition', defaultTheme.components?.button?.transition) || 'all 300ms ease'
        },
        
        tooltip: {
          radius: getThemeProperty(theme, 'components.tooltip.radius', defaultTheme.components?.tooltip?.radius) || '0.25rem',
          padding: getThemeProperty(theme, 'components.tooltip.padding', defaultTheme.components?.tooltip?.padding) || '0.5rem',
          background: getThemeProperty(theme, 'components.tooltip.background', defaultTheme.components?.tooltip?.background) || 'rgba(0, 0, 0, 0.8)'
        },
        
        input: {
          radius: getThemeProperty(theme, 'components.input.radius', defaultTheme.components?.input?.radius) || '0.5rem',
          padding: getThemeProperty(theme, 'components.input.padding', defaultTheme.components?.input?.padding) || '0.5rem 0.75rem',
          background: getThemeProperty(theme, 'components.input.background', defaultTheme.components?.input?.background) || 'rgba(0, 0, 0, 0.2)'
        }
      },
      
      // Typography
      typography: {
        fonts: {
          body: getThemeProperty(theme, 'typography.fonts.body', defaultTheme.typography?.fonts?.body) || 'system-ui, sans-serif',
          heading: getThemeProperty(theme, 'typography.fonts.heading', defaultTheme.typography?.fonts?.heading) || 'system-ui, sans-serif',
          monospace: getThemeProperty(theme, 'typography.fonts.monospace', defaultTheme.typography?.fonts?.monospace) || 'monospace'
        },
        
        sizes: {
          xs: getThemeProperty(theme, 'typography.sizes.xs', defaultTheme.typography?.sizes?.xs) || '0.75rem',
          sm: getThemeProperty(theme, 'typography.sizes.sm', defaultTheme.typography?.sizes?.sm) || '0.875rem',
          md: getThemeProperty(theme, 'typography.sizes.md', defaultTheme.typography?.sizes?.md) || '1rem',
          lg: getThemeProperty(theme, 'typography.sizes.lg', defaultTheme.typography?.sizes?.lg) || '1.125rem',
          xl: getThemeProperty(theme, 'typography.sizes.xl', defaultTheme.typography?.sizes?.xl) || '1.25rem',
          '2xl': getThemeProperty(theme, 'typography.sizes.2xl', defaultTheme.typography?.sizes?.['2xl']) || '1.5rem',
          '3xl': getThemeProperty(theme, 'typography.sizes.3xl', defaultTheme.typography?.sizes?.['3xl']) || '1.875rem'
        },
        
        weights: {
          light: Number(getThemeProperty(theme, 'typography.weights.light', defaultTheme.typography?.weights?.light) || 300),
          normal: Number(getThemeProperty(theme, 'typography.weights.normal', defaultTheme.typography?.weights?.normal) || 400),
          medium: Number(getThemeProperty(theme, 'typography.weights.medium', defaultTheme.typography?.weights?.medium) || 500),
          bold: Number(getThemeProperty(theme, 'typography.weights.bold', defaultTheme.typography?.weights?.bold) || 700)
        },
        
        lineHeights: {
          tight: getThemeProperty(theme, 'typography.lineHeights.tight', defaultTheme.typography?.lineHeights?.tight) || '1.25',
          normal: getThemeProperty(theme, 'typography.lineHeights.normal', defaultTheme.typography?.lineHeights?.normal) || '1.5',
          loose: getThemeProperty(theme, 'typography.lineHeights.loose', defaultTheme.typography?.lineHeights?.loose) || '2'
        }
      }
    };
    
    return validatedTheme;
  }
  
  /**
   * Get all registered themes
   */
  public getAllThemes(): { id: string, name: string, description: string, theme: ImpulseTheme }[] {
    const result: { id: string, name: string, description: string, theme: ImpulseTheme }[] = [];
    
    this.themes.forEach((theme, id) => {
      result.push({
        id,
        name: theme.name || id,
        description: theme.description || '',
        theme
      });
    });
    
    return result;
  }
}

// Create and export a singleton instance
const themeRegistryInstance = new ThemeRegistryManager();
export { themeRegistryInstance as themeRegistry };

// Initialize with default themes
export const impulsivityTheme = defaultImpulseTokens;

// Utility to get all available themes
export function getAllThemes(): { id: string, name: string, description: string, theme: ImpulseTheme }[] {
  return themeRegistry.getAllThemes();
}
