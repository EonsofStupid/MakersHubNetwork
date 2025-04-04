
import { ImpulseTheme } from '../types/impulse.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';
import { defaultImpulseTokens } from './impulse/tokens';

interface ThemeRegistryItem {
  id: string;
  name: string;
  description?: string;
  theme: ImpulseTheme;
}

/**
 * Registry for theme management
 */
class ThemeRegistry {
  private themes: Map<string, ThemeRegistryItem>;
  private activeThemeId: string | null = null;
  private logger = getLogger('ThemeRegistry', { category: LogCategory.THEME });
  
  constructor() {
    this.themes = new Map();
    this.logger.debug('ThemeRegistry initialized');
  }
  
  /**
   * Register a theme in the registry
   */
  registerTheme(id: string, theme: ImpulseTheme, name?: string, description?: string): void {
    try {
      // Ensure the theme has an id property that matches the registry id
      const themeWithId: ImpulseTheme = {
        ...theme,
        id
      };
      
      this.themes.set(id, {
        id,
        name: name || id,
        description,
        theme: themeWithId
      });
      
      this.logger.debug(`Theme registered: ${id}`);
    } catch (error) {
      this.logger.error(`Error registering theme: ${id}`, {
        details: safeDetails(error)
      });
    }
  }
  
  /**
   * Get a theme from the registry
   */
  getTheme(id: string): ImpulseTheme | null {
    try {
      const themeItem = this.themes.get(id);
      return themeItem ? themeItem.theme : null;
    } catch (error) {
      this.logger.error(`Error getting theme: ${id}`, {
        details: safeDetails(error)
      });
      return null;
    }
  }
  
  /**
   * Set active theme
   */
  setActiveTheme(id: string): boolean {
    if (this.themes.has(id)) {
      this.activeThemeId = id;
      return true;
    }
    return false;
  }
  
  /**
   * Get the active theme
   */
  getActiveTheme(): ImpulseTheme | null {
    if (this.activeThemeId) {
      return this.getTheme(this.activeThemeId);
    }
    return null;
  }
  
  /**
   * Get the default theme
   */
  getDefaultTheme(): ImpulseTheme {
    return defaultImpulseTokens;
  }
  
  /**
   * Get all registered themes
   */
  getAllThemes(): ThemeRegistryItem[] {
    return Array.from(this.themes.values());
  }
  
  /**
   * Remove a theme from the registry
   */
  removeTheme(id: string): boolean {
    try {
      const result = this.themes.delete(id);
      
      if (result) {
        this.logger.debug(`Theme removed: ${id}`);
        
        // If we removed the active theme, reset to null
        if (this.activeThemeId === id) {
          this.activeThemeId = null;
        }
      } else {
        this.logger.warn(`Theme not found for removal: ${id}`);
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Error removing theme: ${id}`, {
        details: safeDetails(error)
      });
      return false;
    }
  }
  
  /**
   * Check if a theme exists in the registry
   */
  hasTheme(id: string): boolean {
    return this.themes.has(id);
  }
  
  /**
   * Clear all themes from the registry
   */
  clearThemes(): void {
    try {
      this.themes.clear();
      this.activeThemeId = null;
      this.logger.debug('All themes cleared from registry');
    } catch (error) {
      this.logger.error('Error clearing themes', {
        details: safeDetails(error)
      });
    }
  }
}

// Singleton instance
export const themeRegistry = new ThemeRegistry();

// For backwards compatibility, maintain the old export name
export const getAllThemes = () => themeRegistry.getAllThemes();
