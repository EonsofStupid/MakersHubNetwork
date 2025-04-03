
import { getLogger } from '@/logging';

const THEME_STORAGE_KEY = 'site-theme-id';
const DEFAULT_THEME_ID = 'default';

const logger = getLogger('ThemeLocalStorage');

/**
 * Save theme ID to localStorage
 */
export function saveThemeToLocalStorage(themeId: string): void {
  if (!themeId) {
    logger.warn('Attempted to save empty theme ID to localStorage', { details: { themeId } });
    return;
  }
  
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
    logger.debug('Theme saved to localStorage', { details: { themeId } });
  } catch (error) {
    logger.error('Failed to save theme to localStorage', { details: { error } });
    
    // Try using sessionStorage as fallback
    try {
      sessionStorage.setItem(THEME_STORAGE_KEY, themeId);
      logger.debug('Theme saved to sessionStorage as fallback', { details: { themeId } });
    } catch (sessionError) {
      logger.error('Failed to save theme to sessionStorage as well', { details: { sessionError } });
    }
  }
}

/**
 * Get theme ID from localStorage
 * Returns the stored theme ID or DEFAULT_THEME_ID if none is stored
 */
export function getThemeFromLocalStorage(): string {
  try {
    const themeId = localStorage.getItem(THEME_STORAGE_KEY);
    logger.debug('Getting theme from localStorage', { details: { themeId: themeId || 'not found' } });
    
    if (!themeId) {
      // Try sessionStorage as backup
      try {
        const sessionThemeId = sessionStorage.getItem(THEME_STORAGE_KEY);
        if (sessionThemeId) {
          logger.debug('Found theme in sessionStorage instead', { details: { sessionThemeId } });
          return sessionThemeId;
        }
      } catch (sessionError) {
        // Ignore sessionStorage errors
      }
    }
    
    return themeId || DEFAULT_THEME_ID;
  } catch (error) {
    logger.error('Failed to get theme from localStorage', { details: { error } });
    
    // Try sessionStorage as fallback
    try {
      const sessionThemeId = sessionStorage.getItem(THEME_STORAGE_KEY);
      if (sessionThemeId) {
        logger.debug('Retrieved theme from sessionStorage after localStorage failure', { details: { sessionThemeId } });
        return sessionThemeId;
      }
    } catch (sessionError) {
      logger.error('Failed to get theme from sessionStorage as well', { details: { sessionError } });
    }
    
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
    
    // Clear from sessionStorage too if present
    try {
      sessionStorage.removeItem(THEME_STORAGE_KEY);
    } catch (sessionError) {
      // Ignore sessionStorage errors
    }
  } catch (error) {
    logger.error('Failed to clear theme from localStorage', { details: { error } });
  }
}

/**
 * Check if theme exists in localStorage
 */
export function hasThemeInLocalStorage(): boolean {
  try {
    const hasLocalTheme = !!localStorage.getItem(THEME_STORAGE_KEY);
    if (hasLocalTheme) return true;
    
    // Check sessionStorage as backup
    try {
      return !!sessionStorage.getItem(THEME_STORAGE_KEY);
    } catch (sessionError) {
      return false;
    }
  } catch (error) {
    logger.error('Failed to check if theme exists in localStorage', { details: { error } });
    
    // Try sessionStorage as fallback
    try {
      return !!sessionStorage.getItem(THEME_STORAGE_KEY);
    } catch (sessionError) {
      logger.error('Failed to check if theme exists in sessionStorage as well', { details: { sessionError } });
      return false;
    }
  }
}

/**
 * Get theme debug info for troubleshooting
 */
export function getThemeStorageInfo(): Record<string, any> {
  try {
    const localValue = localStorage.getItem(THEME_STORAGE_KEY);
    const sessionValue = sessionStorage.getItem(THEME_STORAGE_KEY);
    
    return {
      hasLocalStorage: !!localValue,
      hasSessionStorage: !!sessionValue,
      localStorageValue: localValue,
      sessionStorageValue: sessionValue,
      storageAvailable: true
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      storageAvailable: false
    };
  }
}
