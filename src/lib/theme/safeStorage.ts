
import { getLogger } from '@/logging';
import { ThemeTokens, ThemeTokensSchema } from '@/theme/tokenSchema';
import { z } from 'zod';
import { isBoolean, toBoolean, toBooleanOrUndefined, zodErrorToBool } from '@/utils/typeGuards';

const logger = getLogger('ThemeStorage');

/**
 * Safe wrapper for localStorage to prevent SSR issues
 */
export function safeLocalStorage<T>(key: string, fallback: T, parse = true): T {
  try {
    if (typeof window === 'undefined') return fallback;
    
    const value = localStorage.getItem(key);
    if (!value) return fallback;
    
    // Safe parsing with type checking
    if (parse) {
      try {
        const parsed = JSON.parse(value);
        return parsed as T;
      } catch (error) {
        logger.warn('Error parsing localStorage value:', { 
          details: { error: error instanceof Error ? error.message : String(error) }
        });
        return fallback;
      }
    }
    
    return (value as unknown as T);
  } catch (error) {
    logger.warn('Error accessing localStorage:', { 
      details: { error: error instanceof Error ? error.message : String(error) }
    });
    return fallback;
  }
}

/**
 * Save theme tokens to localStorage for offline use
 */
export function persistThemeTokens(tokens: ThemeTokens): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem('impulse-theme', JSON.stringify(tokens));
    logger.info('Theme tokens persisted to localStorage');
  } catch (error) {
    logger.error('Failed to persist theme tokens:', { 
      details: { error: error instanceof Error ? error.message : String(error) }
    });
  }
}

/**
 * Types-safe local storage getter for theme tokens
 */
export function getStoredThemeTokens(): ThemeTokens | null {
  try {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem('impulse-theme');
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    const result = ThemeTokensSchema.safeParse(parsed);
    
    if (result.success) {
      return result.data;
    } else {
      // Safe handling of ZodError
      logger.warn('Invalid theme tokens in localStorage:', { 
        details: { error: result.error.message }
      });
      return null;
    }
  } catch (error) {
    // Safe error handling 
    logger.error('Error reading theme tokens from localStorage:', { 
      details: { error: error instanceof Error ? error.message : String(error) }
    });
    return null;
  }
}

/**
 * Safe method to set a theme context in localStorage
 */
export function setStoredThemeContext(context: string): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem('theme-context', context);
  } catch (error) {
    logger.error('Error saving theme context:', { 
      details: { error: error instanceof Error ? error.message : String(error) }
    });
  }
}

/**
 * Safe method to get theme context from localStorage
 */
export function getStoredThemeContext(): string | null {
  try {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('theme-context');
  } catch (error) {
    logger.error('Error reading theme context:', { 
      details: { error: error instanceof Error ? error.message : String(error) }
    });
    return null;
  }
}
