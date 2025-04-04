
import { ImpulseTheme } from '../types/impulse.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

interface ThemeRegistryItem {
  id: string;
  name: string;
  description?: string;
  theme: Partial<ImpulseTheme>;
}

/**
 * Registry for theme management
 */
class ThemeRegistry {
  private themes: Map<string, ThemeRegistryItem>;
  private logger = getLogger('ThemeRegistry', { category: LogCategory.THEME });
  
  constructor() {
    this.themes = new Map();
    this.logger.debug('ThemeRegistry initialized');
  }
  
  /**
   * Register a theme in the registry
   */
  registerTheme(id: string, theme: Partial<ImpulseTheme>, name?: string, description?: string): void {
    try {
      this.themes.set(id, {
        id,
        name: name || id,
        description,
        theme
      });
      
      this.logger.debug(`Theme registered: ${id}`);
    } catch (error) {
      this.logger.error(`Error registering theme: ${id}`, {
        details: { error }
      });
    }
  }
  
  /**
   * Get a theme from the registry
   */
  getTheme(id: string): Partial<ImpulseTheme> | null {
    try {
      const themeItem = this.themes.get(id);
      return themeItem ? themeItem.theme : null;
    } catch (error) {
      this.logger.error(`Error getting theme: ${id}`, {
        details: { error }
      });
      return null;
    }
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
      } else {
        this.logger.warn(`Theme not found for removal: ${id}`);
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Error removing theme: ${id}`, {
        details: { error }
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
      this.logger.debug('All themes cleared from registry');
    } catch (error) {
      this.logger.error('Error clearing themes', {
        details: { error }
      });
    }
  }
}

// Singleton instance
export const themeRegistry = new ThemeRegistry();

// For backwards compatibility, maintain the old export name
export const getAllThemes = () => themeRegistry.getAllThemes();
