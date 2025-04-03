
import { ImpulseTheme, defaultImpulseTokens } from '@/admin/types/impulse.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ThemeRegistry', { category: LogCategory.THEME as string });

/**
 * ThemeRegistry provides a central storage for registering and accessing themes
 * throughout the application
 */
class ThemeRegistry {
  private themes: Map<string, ImpulseTheme> = new Map();
  private activeThemeId: string | null = null;

  constructor() {
    // Register default theme on initialization
    this.registerTheme('default', defaultImpulseTokens);
    logger.debug('ThemeRegistry initialized with default theme');
  }

  /**
   * Register a theme with the registry
   */
  registerTheme(id: string, theme: ImpulseTheme): void {
    try {
      if (!theme || typeof theme !== 'object') {
        logger.warn('Invalid theme object provided for registration', { details: { id } });
        return;
      }
      
      // Ensure theme has required properties
      if (!theme.colors?.primary || !theme.colors?.background?.main || !theme.colors?.text?.primary) {
        logger.warn('Theme missing required properties', { 
          details: { 
            id, 
            name: theme.name, 
            hasPrimary: !!theme.colors?.primary,
            hasBackground: !!theme.colors?.background?.main,
            hasTextPrimary: !!theme.colors?.text?.primary
          } 
        });
      }
      
      // Clone the theme to prevent external modifications
      const safeTheme = JSON.parse(JSON.stringify(theme)) as ImpulseTheme;
      
      // Store with ID
      this.themes.set(id, safeTheme);
      logger.debug('Theme registered successfully', { details: { id, name: theme.name } });
    } catch (error) {
      logger.error('Error registering theme', { details: safeDetails(error) });
    }
  }

  /**
   * Get a theme by ID
   */
  getTheme(id: string): ImpulseTheme | null {
    try {
      const theme = this.themes.get(id);
      
      if (!theme) {
        logger.warn('Theme not found', { details: { id } });
        return null;
      }
      
      // Clone the theme to prevent external modifications
      return JSON.parse(JSON.stringify(theme)) as ImpulseTheme;
    } catch (error) {
      logger.error('Error getting theme', { details: safeDetails(error) });
      return null;
    }
  }

  /**
   * Remove a theme from the registry
   */
  unregisterTheme(id: string): boolean {
    try {
      if (id === 'default') {
        logger.warn('Cannot unregister default theme');
        return false;
      }
      
      const deleted = this.themes.delete(id);
      
      if (deleted) {
        logger.debug('Theme unregistered successfully', { details: { id } });
        
        // If active theme was removed, reset to default
        if (this.activeThemeId === id) {
          this.activeThemeId = 'default';
          logger.info('Active theme was unregistered, reset to default');
        }
      } else {
        logger.warn('Theme not found for unregistration', { details: { id } });
      }
      
      return deleted;
    } catch (error) {
      logger.error('Error unregistering theme', { details: safeDetails(error) });
      return false;
    }
  }

  /**
   * Set the active theme
   */
  setActiveTheme(id: string): boolean {
    try {
      if (!this.themes.has(id)) {
        logger.warn('Cannot set active theme - not found in registry', { details: { id } });
        return false;
      }
      
      this.activeThemeId = id;
      logger.info('Active theme set', { details: { id } });
      return true;
    } catch (error) {
      logger.error('Error setting active theme', { details: safeDetails(error) });
      return false;
    }
  }

  /**
   * Get the active theme
   */
  getActiveTheme(): ImpulseTheme | null {
    try {
      if (!this.activeThemeId) {
        logger.debug('No active theme set, returning default');
        return this.getTheme('default');
      }
      
      return this.getTheme(this.activeThemeId);
    } catch (error) {
      logger.error('Error getting active theme', { details: safeDetails(error) });
      return this.getTheme('default');
    }
  }

  /**
   * Get the ID of the active theme
   */
  getActiveThemeId(): string {
    return this.activeThemeId || 'default';
  }

  /**
   * Check if a theme exists in the registry
   */
  hasTheme(id: string): boolean {
    return this.themes.has(id);
  }

  /**
   * Get all registered theme IDs
   */
  getAllThemeIds(): string[] {
    return Array.from(this.themes.keys());
  }

  /**
   * Get all registered themes
   */
  getAllThemes(): ImpulseTheme[] {
    return Array.from(this.themes.values()).map(theme => {
      // Clone the theme to prevent external modifications
      return JSON.parse(JSON.stringify(theme)) as ImpulseTheme;
    });
  }
}

// Export a singleton instance
export const themeRegistry = new ThemeRegistry();
