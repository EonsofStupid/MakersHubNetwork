
import { getLogger } from '@/logging';

const THEME_STORAGE_KEY = 'site-theme-id';
const DEFAULT_THEME_ID = 'default';

const logger = getLogger('ThemeLocalStorage');

/**
 * Save theme ID to localStorage
 */
export function saveThemeToLocalStorage(themeId: string): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
    logger.debug('Theme saved to localStorage', { details: { themeId } });
  } catch (error) {
    logger.error('Failed to save theme to localStorage', { details: { error } });
  }
}

/**
 * Get theme ID from localStorage
 * Returns the stored theme ID or DEFAULT_THEME_ID if none is stored
 */
export function getThemeFromLocalStorage(): string {
  try {
    const themeId = localStorage.getItem(THEME_STORAGE_KEY);
    return themeId || DEFAULT_THEME_ID;
  } catch (error) {
    logger.error('Failed to get theme from localStorage', { details: { error } });
    return DEFAULT_THEME_ID;
  }
}

/**
 * Remove theme ID from localStorage
 */
export function clearThemeFromLocalStorage(): void {
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
    logger.debug('Theme cleared from localStorage');
  } catch (error) {
    logger.error('Failed to clear theme from localStorage', { details: { error } });
  }
}

/**
 * Check if theme exists in localStorage
 */
export function hasThemeInLocalStorage(): boolean {
  try {
    return !!localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    logger.error('Failed to check if theme exists in localStorage', { details: { error } });
    return false;
  }
}
