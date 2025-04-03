
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ThemeRegistry', { category: LogCategory.THEME });

/**
 * ThemeRegistry provides a central storage for registering and accessing themes
 * throughout the application
 */
class ThemeRegistry {
  private themes: Map<string, ImpulseTheme> = new Map();
  private activeThemeId: string | null = null;

  constructor() {
    logger.debug('ThemeRegistry initialized');
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
        logger.warn('Theme is missing required properties', { details: { id, themeName: theme.name } });
      }
      
      this.themes.set(id, { ...theme, id });
      logger.debug(`Theme registered: ${theme.name}`, { details: { id } });
    } catch (error) {
      logger.error('Error registering theme', { details: safeDetails(error) });
    }
  }

  /**
   * Get a theme by its ID
   */
  getTheme(id: string): ImpulseTheme | null {
    try {
      const theme = this.themes.get(id);
      if (!theme) {
        logger.warn(`Theme not found: ${id}`);
        return null;
      }
      return theme;
    } catch (error) {
      logger.error('Error getting theme', { details: safeDetails(error) });
      return null;
    }
  }

  /**
   * Set the active theme
   */
  setActiveTheme(id: string): boolean {
    try {
      if (!this.themes.has(id)) {
        logger.warn(`Cannot set active theme - theme not found: ${id}`);
        return false;
      }
      this.activeThemeId = id;
      logger.debug(`Active theme set: ${id}`);
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
        logger.warn('No active theme set');
        return null;
      }
      return this.getTheme(this.activeThemeId);
    } catch (error) {
      logger.error('Error getting active theme', { details: safeDetails(error) });
      return null;
    }
  }

  /**
   * Get all registered themes
   */
  getAllThemes(): ImpulseTheme[] {
    return Array.from(this.themes.values());
  }

  /**
   * Check if a theme is registered
   */
  hasTheme(id: string): boolean {
    return this.themes.has(id);
  }

  /**
   * Unregister a theme
   */
  unregisterTheme(id: string): boolean {
    try {
      const result = this.themes.delete(id);
      if (result) {
        logger.debug(`Theme unregistered: ${id}`);
        // If we just removed the active theme, clear it
        if (this.activeThemeId === id) {
          this.activeThemeId = null;
          logger.debug('Active theme cleared (was unregistered)');
        }
      }
      return result;
    } catch (error) {
      logger.error('Error unregistering theme', { details: safeDetails(error) });
      return false;
    }
  }

  /**
   * Clear all themes
   */
  clearAll(): void {
    this.themes.clear();
    this.activeThemeId = null;
    logger.debug('All themes cleared from registry');
  }
}

// Export a singleton instance
export const themeRegistry = new ThemeRegistry();

/**
 * Get all registered themes with proper typing
 * Used by the theme editor
 */
export function getAllThemes(): ImpulseTheme[] {
  return themeRegistry.getAllThemes();
}
