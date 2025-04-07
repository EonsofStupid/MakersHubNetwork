
import { getLogger } from '@/logging';
import { ThemeTokens, ThemeTokensSchema } from '@/theme/tokenSchema';
import { z } from 'zod';

const logger = getLogger('ThemeStorage');

/**
 * Safe wrapper for localStorage to prevent SSR issues
 */
export function safeLocalStorage<T>(key: string, fallback: T, parse = true): T {
  try {
    if (typeof window === 'undefined') return fallback;
    
    const value = localStorage.getItem(key);
    if (!value) return fallback;
    
    return parse ? JSON.parse(value) : (value as unknown as T);
  } catch (error) {
    logger.warn('Error accessing localStorage:', { error });
    return fallback;
  }
}

/**
 * Save theme tokens to localStorage for offline use
 */
export function persistThemeTokens(tokens: ThemeTokens): void {
  try {
    localStorage.setItem('impulse-theme', JSON.stringify(tokens));
    logger.info('Theme tokens persisted to localStorage');
  } catch (error) {
    logger.error('Failed to persist theme tokens:', { error });
  }
}

/**
 * Types-safe local storage getter for theme tokens
 */
export function getStoredThemeTokens(): ThemeTokens | null {
  try {
    const stored = localStorage.getItem('impulse-theme');
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    const result = ThemeTokensSchema.safeParse(parsed);
    
    if (result.success) {
      return result.data;
    } else {
      logger.warn('Invalid theme tokens in localStorage:', { error: result.error.format() });
      return null;
    }
  } catch (error) {
    logger.error('Error reading theme tokens from localStorage:', { error });
    return null;
  }
}

/**
 * Safe method to set a theme context in localStorage
 */
export function setStoredThemeContext(context: string): void {
  try {
    localStorage.setItem('theme-context', context);
  } catch (error) {
    logger.error('Error saving theme context:', { error });
  }
}

/**
 * Safe method to get theme context from localStorage
 */
export function getStoredThemeContext(): string | null {
  try {
    return localStorage.getItem('theme-context');
  } catch (error) {
    logger.error('Error reading theme context:', { error });
    return null;
  }
}
