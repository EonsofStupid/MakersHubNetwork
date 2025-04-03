
export const THEME_LOCAL_STORAGE_KEY = 'makers-impulse-theme';

/**
 * Save theme ID to localStorage
 */
export function saveThemeToLocalStorage(themeId: string) {
  try {
    localStorage.setItem(THEME_LOCAL_STORAGE_KEY, themeId);
    return true;
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error);
    return false;
  }
}

/**
 * Get theme ID from localStorage
 */
export function getThemeFromLocalStorage(): string | null {
  try {
    return localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to get theme from localStorage:', error);
    return null;
  }
}

/**
 * Remove theme ID from localStorage
 */
export function removeThemeFromLocalStorage(): boolean {
  try {
    localStorage.removeItem(THEME_LOCAL_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to remove theme from localStorage:', error);
    return false;
  }
}
