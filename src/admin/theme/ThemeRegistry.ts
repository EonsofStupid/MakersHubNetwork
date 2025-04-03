
import { ImpulseTheme } from '../types/impulse.types';
import { defaultImpulseTokens } from './impulse/tokens';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

interface RegisteredTheme {
  id: string;
  name: string;
  description?: string;
  tokens: ImpulseTheme;
}

/**
 * Theme Registry for managing registered themes
 */
class ThemeRegistry {
  private themes: Map<string, RegisteredTheme>;
  private activeThemeId: string | null = null;
  private logger = getLogger('ThemeRegistry', { category: LogCategory.THEME });

  constructor() {
    this.themes = new Map();
    
    // Register the default theme
    this.registerTheme('default', defaultImpulseTokens);
    this.logger.debug('Theme registry initialized with default theme');
  }

  /**
   * Register a theme with the registry
   */
  registerTheme(id: string, theme: ImpulseTheme): void {
    if (this.themes.has(id)) {
      this.logger.debug(`Updating existing theme: ${id}`);
    } else {
      this.logger.debug(`Registering new theme: ${id}`);
    }

    this.themes.set(id, {
      id,
      name: theme.name || id,
      description: theme.description,
      tokens: { ...theme }
    });
  }

  /**
   * Get a theme from the registry
   */
  getTheme(id: string): ImpulseTheme | null {
    const theme = this.themes.get(id);
    
    if (!theme) {
      this.logger.warn(`Theme not found: ${id}`);
      
      // Return default theme as fallback
      return this.getDefaultTheme();
    }
    
    return theme.tokens;
  }

  /**
   * Set the active theme ID
   */
  setActiveTheme(id: string): void {
    this.activeThemeId = id;
    this.logger.debug(`Active theme set to: ${id}`);
  }

  /**
   * Get the active theme
   */
  getActiveTheme(): ImpulseTheme | null {
    if (!this.activeThemeId) {
      this.logger.debug('No active theme set, using default');
      return this.getDefaultTheme();
    }
    
    return this.getTheme(this.activeThemeId);
  }

  /**
   * Get the default theme
   */
  getDefaultTheme(): ImpulseTheme {
    return { ...defaultImpulseTokens };
  }

  /**
   * Get all registered themes
   */
  getAllThemes(): RegisteredTheme[] {
    return Array.from(this.themes.values());
  }

  /**
   * Check if a theme exists
   */
  hasTheme(id: string): boolean {
    return this.themes.has(id);
  }

  /**
   * Delete a theme from the registry
   */
  deleteTheme(id: string): boolean {
    if (id === 'default') {
      this.logger.warn('Cannot delete default theme');
      return false;
    }
    
    if (this.activeThemeId === id) {
      this.logger.warn('Cannot delete active theme');
      return false;
    }
    
    const result = this.themes.delete(id);
    
    if (result) {
      this.logger.debug(`Theme deleted: ${id}`);
    } else {
      this.logger.warn(`Theme not found for deletion: ${id}`);
    }
    
    return result;
  }
}

// Export a singleton instance
export const themeRegistry = new ThemeRegistry();
