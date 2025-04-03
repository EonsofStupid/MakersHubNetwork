
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
   * Get a theme by its ID
   */
  getTheme(id: string): ImpulseTheme | null {
    const theme = this.themes.get(id);
    return theme ? theme.tokens : null;
  }

  /**
   * Get all registered themes
   */
  getAllThemes(): RegisteredTheme[] {
    return Array.from(this.themes.values());
  }

  /**
   * Set the active theme
   */
  setActiveTheme(id: string): boolean {
    if (!this.themes.has(id)) {
      this.logger.warn(`Theme not found: ${id}`);
      return false;
    }

    this.activeThemeId = id;
    this.logger.debug(`Active theme set to: ${id}`);
    return true;
  }

  /**
   * Get the active theme ID
   */
  getActiveThemeId(): string | null {
    return this.activeThemeId;
  }

  /**
   * Get the active theme
   */
  getActiveTheme(): ImpulseTheme | null {
    return this.activeThemeId ? this.getTheme(this.activeThemeId) : null;
  }

  /**
   * Get the default theme
   */
  getDefaultTheme(): ImpulseTheme {
    return this.getTheme('default') || defaultImpulseTokens;
  }

  /**
   * Reset the registry
   */
  reset(): void {
    this.themes.clear();
    this.activeThemeId = null;
    
    // Re-register the default theme
    this.registerTheme('default', defaultImpulseTokens);
  }
}

// Create and export a singleton instance
export const themeRegistry = new ThemeRegistry();

// Export the get themes function for convenience
export const getAllThemes = () => themeRegistry.getAllThemes();
