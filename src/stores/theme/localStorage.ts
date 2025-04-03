
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ThemeLocalStorage', { category: LogCategory.THEME });
const THEME_ID_KEY = 'theme-id';

/**
 * Save theme ID to localStorage
 */
export function saveThemeToLocalStorage(themeId: string): void {
  try {
    localStorage.setItem(THEME_ID_KEY, themeId);
    logger.debug('Saved theme ID to localStorage', { details: { themeId } });
  } catch (error) {
    logger.error('Error saving theme ID to localStorage', { details: safeDetails(error) });
  }
}

/**
 * Get theme ID from localStorage
 */
export function getThemeFromLocalStorage(): string | null {
  try {
    const themeId = localStorage.getItem(THEME_ID_KEY);
    logger.debug('Retrieved theme ID from localStorage', { details: { themeId } });
    return themeId;
  } catch (error) {
    logger.error('Error retrieving theme ID from localStorage', { details: safeDetails(error) });
    return null;
  }
}

/**
 * Remove theme ID from localStorage
 */
export function removeThemeFromLocalStorage(): void {
  try {
    localStorage.removeItem(THEME_ID_KEY);
    logger.debug('Removed theme ID from localStorage');
  } catch (error) {
    logger.error('Error removing theme ID from localStorage', { details: safeDetails(error) });
  }
}
