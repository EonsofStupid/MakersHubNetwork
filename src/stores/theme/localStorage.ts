
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const THEME_ID_KEY = 'impulse-theme-id';
const THEME_PREFS_KEY = 'impulse-theme-prefs';

const logger = getLogger('ThemeLocalStorage', { category: LogCategory.THEME as string });

/**
 * Safe stringify function that won't throw
 */
function safeStringify(obj: any): string {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    logger.error('Failed to stringify object', { 
      details: { error: error instanceof Error ? error.message : String(error) }
    });
    return '{}';
  }
}

/**
 * Safe parse function that won't throw
 */
function safeParse<T>(str: string, defaultValue: T): T {
  try {
    return JSON.parse(str) as T;
  } catch (error) {
    logger.error('Failed to parse JSON string', { 
      details: { error: error instanceof Error ? error.message : String(error) }
    });
    return defaultValue;
  }
}

/**
 * Safe details formatter for logging
 */
function safeDetails(error: unknown): Record<string, any> {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }
  return { message: String(error) };
}

/**
 * Save theme ID to localStorage
 */
export function saveThemeToLocalStorage(themeId: string): void {
  try {
    localStorage.setItem(THEME_ID_KEY, themeId);
    logger.debug('Theme ID saved to localStorage', { details: { themeId } });
  } catch (error) {
    logger.error('Failed to save theme ID to localStorage', { details: safeDetails(error) });
  }
}

/**
 * Get theme ID from localStorage
 */
export function getThemeFromLocalStorage(): string | null {
  try {
    const themeId = localStorage.getItem(THEME_ID_KEY);
    logger.debug('Got theme ID from localStorage', { 
      details: { themeId: themeId || 'not found' } 
    });
    return themeId;
  } catch (error) {
    logger.error('Failed to get theme ID from localStorage', { details: safeDetails(error) });
    return null;
  }
}

/**
 * Clear theme ID from localStorage
 */
export function clearThemeFromLocalStorage(): void {
  try {
    localStorage.removeItem(THEME_ID_KEY);
    logger.debug('Theme ID cleared from localStorage');
  } catch (error) {
    logger.error('Failed to clear theme ID from localStorage', { details: safeDetails(error) });
  }
}

/**
 * Save theme preferences to localStorage
 */
export function saveThemePreferences(preferences: Record<string, any>): void {
  try {
    localStorage.setItem(THEME_PREFS_KEY, safeStringify(preferences));
    logger.debug('Theme preferences saved to localStorage');
  } catch (error) {
    logger.error('Failed to save theme preferences to localStorage', { details: safeDetails(error) });
  }
}

/**
 * Get theme preferences from localStorage
 */
export function getThemePreferences<T extends Record<string, any>>(defaultPrefs: T): T {
  try {
    const prefsJson = localStorage.getItem(THEME_PREFS_KEY);
    if (!prefsJson) return defaultPrefs;
    
    return { ...defaultPrefs, ...safeParse(prefsJson, {}) };
  } catch (error) {
    logger.error('Failed to get theme preferences from localStorage', { details: safeDetails(error) });
    return defaultPrefs;
  }
}

/**
 * Get information about theme storage
 */
export function getThemeStorageInfo() {
  try {
    const themeId = getThemeFromLocalStorage();
    const prefsJson = localStorage.getItem(THEME_PREFS_KEY);
    
    return {
      themeId,
      hasPreferences: !!prefsJson,
      lastUpdated: localStorage.getItem('impulse-theme-last-updated') || 'unknown'
    };
  } catch (error) {
    logger.error('Failed to get theme storage info', { details: safeDetails(error) });
    return {
      themeId: null,
      hasPreferences: false,
      lastUpdated: 'error'
    };
  }
}
