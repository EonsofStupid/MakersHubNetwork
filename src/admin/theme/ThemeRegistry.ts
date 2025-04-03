
import { ImpulseTheme, defaultImpulseTokens } from './impulse/tokens';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const logger = getLogger('ThemeRegistry', { category: LogCategory.THEME as string });

class ThemeRegistry {
  private themes: Map<string, ImpulseTheme> = new Map();
  private activeThemeId: string | null = null;
  
  constructor() {
    // Register default theme
    this.registerTheme('default', defaultImpulseTokens);
    this.setActiveTheme('default');
    logger.debug('ThemeRegistry initialized with default theme');
  }
  
  /**
   * Register a theme with the registry
   */
  registerTheme(id: string, theme: ImpulseTheme): void {
    if (!id || !theme) {
      logger.warn('Attempted to register invalid theme', { 
        details: { id, hasTheme: !!theme } 
      });
      return;
    }
    
    // Create a deep copy to prevent external mutation
    const themeCopy = JSON.parse(JSON.stringify(theme)) as ImpulseTheme;
    
    // Set the ID if not already set
    if (!themeCopy.id) {
      themeCopy.id = id;
    }
    
    this.themes.set(id, themeCopy);
    logger.debug(`Theme "${id}" registered`, { 
      details: { 
        themeName: themeCopy.name,
        id
      } 
    });
  }
  
  /**
   * Get a theme by ID
   */
  getTheme(id: string): ImpulseTheme | null {
    const theme = this.themes.get(id);
    
    if (!theme) {
      logger.warn(`Theme "${id}" not found in registry`);
      return null;
    }
    
    // Return a deep copy to prevent external mutation
    return JSON.parse(JSON.stringify(theme)) as ImpulseTheme;
  }
  
  /**
   * Set the active theme
   */
  setActiveTheme(id: string): void {
    if (!this.themes.has(id)) {
      logger.warn(`Cannot set active theme to "${id}" - not registered`);
      return;
    }
    
    this.activeThemeId = id;
    logger.debug(`Active theme set to "${id}"`);
  }
  
  /**
   * Get the active theme
   */
  getActiveTheme(): ImpulseTheme | null {
    if (!this.activeThemeId) {
      logger.warn('No active theme set');
      return this.getTheme('default');
    }
    
    return this.getTheme(this.activeThemeId);
  }
  
  /**
   * Get all registered theme IDs
   */
  getAllThemeIds(): string[] {
    return Array.from(this.themes.keys());
  }
  
  /**
   * Check if a theme is registered
   */
  hasTheme(id: string): boolean {
    return this.themes.has(id);
  }
  
  /**
   * Remove a theme from the registry
   */
  removeTheme(id: string): void {
    if (id === 'default') {
      logger.warn('Cannot remove default theme');
      return;
    }
    
    if (!this.themes.has(id)) {
      logger.warn(`Theme "${id}" not found in registry`);
      return;
    }
    
    this.themes.delete(id);
    
    // Reset active theme if it was the deleted one
    if (this.activeThemeId === id) {
      this.activeThemeId = 'default';
      logger.debug('Active theme reset to default after deletion');
    }
    
    logger.debug(`Theme "${id}" removed from registry`);
  }
}

// Create a singleton instance
export const themeRegistry = new ThemeRegistry();
