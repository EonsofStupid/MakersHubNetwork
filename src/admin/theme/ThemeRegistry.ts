
import { ImpulseTheme } from "../types/impulse.types";
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const logger = getLogger('ThemeRegistry', { category: LogCategory.THEME });

/**
 * Theme Registry - Maintains a store of available themes
 * for the admin interface. This allows for hot-swapping themes
 * and maintaining theme state throughout the application.
 */
class ThemeRegistry {
  private themes: Map<string, ImpulseTheme> = new Map();
  
  /**
   * Register a theme with the registry
   */
  registerTheme(name: string, theme: ImpulseTheme): void {
    try {
      this.themes.set(name, { ...theme });
      logger.debug(`Theme "${name}" registered successfully`);
    } catch (error) {
      logger.error(`Failed to register theme "${name}"`, {
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
  }
  
  /**
   * Get a theme by name
   */
  getTheme(name: string): ImpulseTheme | undefined {
    const theme = this.themes.get(name);
    
    if (!theme) {
      logger.warn(`Theme "${name}" not found in registry`);
    }
    
    return theme;
  }
  
  /**
   * Check if a theme exists in the registry
   */
  hasTheme(name: string): boolean {
    return this.themes.has(name);
  }
  
  /**
   * Get names of all registered themes
   */
  getThemeNames(): string[] {
    return Array.from(this.themes.keys());
  }
  
  /**
   * Get all registered themes
   */
  getAllThemes(): ImpulseTheme[] {
    return Array.from(this.themes.values());
  }
  
  /**
   * Remove a theme from the registry
   */
  removeTheme(name: string): void {
    if (this.themes.has(name)) {
      this.themes.delete(name);
      logger.debug(`Theme "${name}" removed from registry`);
    } else {
      logger.warn(`Cannot remove theme "${name}", not found in registry`);
    }
  }
  
  /**
   * Clear all themes from the registry
   */
  clearThemes(): void {
    this.themes.clear();
    logger.debug('All themes cleared from registry');
  }
}

// Create singleton instance
export const themeRegistry = new ThemeRegistry();
