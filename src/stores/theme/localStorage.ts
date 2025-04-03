import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ThemeLocalStorage', { category: LogCategory.THEME as string });

// Local storage key for theme data
const THEME_STORAGE_KEY = 'theme-storage';

/**
 * Get the theme ID from local storage
 */
export function getThemeFromLocalStorage(): string | null {
  try {
    const storedData = localStorage.getItem(THEME_STORAGE_KEY);
    
    if (!storedData) {
      return null;
    }
    
    const parsedData = JSON.parse(storedData);
    
    if (parsedData?.state?.currentTheme?.id) {
      return parsedData.state.currentTheme.id;
    }
    
    return null;
  } catch (error) {
    logger.error('Error reading theme from localStorage', { details: safeDetails(error) });
    return null;
  }
}

/**
 * Save a theme ID to local storage
 */
export function saveThemeToLocalStorage(themeId: string): boolean {
  try {
    const storedData = localStorage.getItem(THEME_STORAGE_KEY);
    let parsedData = storedData ? JSON.parse(storedData) : { state: {} };
    
    // Ensure we have a state object
    if (!parsedData.state) {
      parsedData.state = {};
    }
    
    // Update just the theme ID if we already have a currentTheme object
    if (parsedData.state.currentTheme) {
      parsedData.state.currentTheme.id = themeId;
    } else {
      // Otherwise create a minimal currentTheme object
      parsedData.state.currentTheme = { id: themeId };
    }
    
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(parsedData));
    return true;
  } catch (error) {
    logger.error('Error saving theme to localStorage', { details: safeDetails(error) });
    return false;
  }
}

/**
 * Clear theme data from local storage
 */
export function clearThemeFromLocalStorage(): boolean {
  try {
    const storedData = localStorage.getItem(THEME_STORAGE_KEY);
    
    if (!storedData) {
      return true; // Already clear
    }
    
    const parsedData = JSON.parse(storedData);
    
    // Remove just the currentTheme, preserving other state
    if (parsedData?.state) {
      delete parsedData.state.currentTheme;
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(parsedData));
    }
    
    return true;
  } catch (error) {
    logger.error('Error clearing theme from localStorage', { details: safeDetails(error) });
    return false;
  }
}
