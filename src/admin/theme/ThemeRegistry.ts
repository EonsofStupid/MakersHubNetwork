
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ThemeRegistry', { category: LogCategory.THEME });

type ThemeDefinition = Record<string, any>;

/**
 * Theme Registry for managing theme definitions
 */
class ThemeRegistry {
  private themes: Map<string, ThemeDefinition> = new Map();
  private defaultTheme: string | null = null;
  
  /**
   * Register a theme with the registry
   */
  registerTheme(key: string, theme: ThemeDefinition): void {
    try {
      if (!key || typeof key !== 'string') {
        logger.warn('Invalid theme key provided to registerTheme');
        return;
      }
      
      if (!theme || typeof theme !== 'object') {
        logger.warn('Invalid theme object provided to registerTheme');
        return;
      }
      
      this.themes.set(key, theme);
      logger.debug(`Theme "${key}" registered`);
      
      // Set as default if it's the first one
      if (this.defaultTheme === null) {
        this.defaultTheme = key;
        logger.debug(`Theme "${key}" set as default`);
      }
    } catch (error) {
      logger.error('Error registering theme', { details: safeDetails(error) });
    }
  }
  
  /**
   * Get a theme by key
   */
  getTheme(key: string): ThemeDefinition | null {
    try {
      const theme = this.themes.get(key);
      if (!theme) {
        logger.warn(`Theme "${key}" not found`);
        return null;
      }
      return theme;
    } catch (error) {
      logger.error('Error getting theme', { details: safeDetails(error) });
      return null;
    }
  }
  
  /**
   * Get the default theme
   */
  getDefaultTheme(): ThemeDefinition | null {
    try {
      if (!this.defaultTheme) {
        logger.warn('No default theme set');
        return null;
      }
      return this.getTheme(this.defaultTheme);
    } catch (error) {
      logger.error('Error getting default theme', { details: safeDetails(error) });
      return null;
    }
  }
  
  /**
   * Set the default theme
   */
  setDefaultTheme(key: string): void {
    try {
      if (!this.themes.has(key)) {
        logger.warn(`Cannot set "${key}" as default theme, it's not registered`);
        return;
      }
      
      this.defaultTheme = key;
      logger.debug(`Theme "${key}" set as default`);
    } catch (error) {
      logger.error('Error setting default theme', { details: safeDetails(error) });
    }
  }
  
  /**
   * Check if a theme is registered
   */
  hasTheme(key: string): boolean {
    return this.themes.has(key);
  }
  
  /**
   * Get all registered themes
   */
  getAllThemes(): { key: string, theme: ThemeDefinition }[] {
    return Array.from(this.themes.entries()).map(([key, theme]) => ({ key, theme }));
  }
  
  /**
   * Create CSS variables for a theme
   */
  createCssVariables(theme: ThemeDefinition): string {
    try {
      if (!theme || typeof theme !== 'object') {
        logger.warn('Invalid theme object provided to createCssVariables');
        return '';
      }
      
      let css = ':root {\n';
      
      // Basic colors
      if (theme.colors?.primary) css += `  --color-primary: ${theme.colors.primary};\n`;
      if (theme.colors?.secondary) css += `  --color-secondary: ${theme.colors.secondary};\n`;
      if (theme.colors?.accent) css += `  --color-accent: ${theme.colors.accent};\n`;
      
      // Background colors
      if (theme.colors?.background?.main) css += `  --color-background: ${theme.colors.background.main};\n`;
      if (theme.colors?.background?.overlay) css += `  --color-overlay: ${theme.colors.background.overlay};\n`;
      if (theme.colors?.background?.card) css += `  --color-card: ${theme.colors.background.card};\n`;
      if (theme.colors?.background?.popup) css += `  --color-popup: ${theme.colors.background.popup};\n`;
      
      // Text colors
      if (theme.colors?.text?.primary) css += `  --color-text: ${theme.colors.text.primary};\n`;
      if (theme.colors?.text?.secondary) css += `  --color-text-secondary: ${theme.colors.text.secondary};\n`;
      if (theme.colors?.text?.accent) css += `  --color-text-accent: ${theme.colors.text.accent};\n`;
      if (theme.colors?.text?.muted) css += `  --color-text-muted: ${theme.colors.text.muted};\n`;
      
      // Status colors
      if (theme.colors?.status?.success) css += `  --color-success: ${theme.colors.status.success};\n`;
      if (theme.colors?.status?.warning) css += `  --color-warning: ${theme.colors.status.warning};\n`;
      if (theme.colors?.status?.error) css += `  --color-error: ${theme.colors.status.error};\n`;
      if (theme.colors?.status?.info) css += `  --color-info: ${theme.colors.status.info};\n`;
      
      css += '}\n';
      
      return css;
    } catch (error) {
      logger.error('Error creating CSS variables', { details: safeDetails(error) });
      return '';
    }
  }
}

export const themeRegistry = new ThemeRegistry();
