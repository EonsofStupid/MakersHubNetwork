
/**
 * Helper functions for theme localStorage persistence
 */

const THEME_STORAGE_KEY = 'theme-storage';

/**
 * Get the theme ID from localStorage
 */
export function getThemeFromLocalStorage(): string | null {
  try {
    const storage = localStorage.getItem(THEME_STORAGE_KEY);
    if (!storage) return null;
    
    const data = JSON.parse(storage);
    return data?.state?.currentTheme?.id || null;
  } catch (error) {
    console.error('Error reading theme from localStorage:', error);
    return null;
  }
}

/**
 * Get complete theme storage information for debugging
 */
export function getThemeStorageInfo(): any {
  try {
    const storage = localStorage.getItem(THEME_STORAGE_KEY);
    if (!storage) return { exists: false };
    
    const data = JSON.parse(storage);
    return {
      exists: true,
      themeId: data?.state?.currentTheme?.id || null,
      lastFetchTimestamp: data?.state?.lastFetchTimestamp || null,
      size: storage.length,
      ...data
    };
  } catch (error) {
    console.error('Error reading theme storage info:', error);
    return { exists: false, error: String(error) };
  }
}

/**
 * Remove theme from localStorage
 */
export function clearThemeFromLocalStorage(): void {
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing theme from localStorage:', error);
  }
}

/**
 * Set theme ID in localStorage directly (emergency override)
 */
export function setThemeInLocalStorage(themeId: string): void {
  try {
    const storage = localStorage.getItem(THEME_STORAGE_KEY);
    if (!storage) {
      // Create new storage
      const newData = {
        state: {
          currentTheme: { id: themeId },
          lastFetchTimestamp: new Date().toISOString()
        },
        version: 0
      };
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newData));
      return;
    }
    
    // Update existing storage
    const data = JSON.parse(storage);
    if (!data.state) data.state = {};
    if (!data.state.currentTheme) data.state.currentTheme = {};
    
    data.state.currentTheme.id = themeId;
    data.state.lastFetchTimestamp = new Date().toISOString();
    
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error setting theme in localStorage:', error);
  }
}
