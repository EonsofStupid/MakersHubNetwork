
import { logger } from '@/logging/service/logger.service';
import { ImpulseTheme, Theme } from '../types';
import { LogCategory } from '@/logging';

/**
 * Type guard for ImpulseTheme
 */
export function isImpulseTheme(theme: any): theme is ImpulseTheme {
  try {
    if (!theme) return false;
    
    // Check required properties
    if (!theme.id || !theme.name || !theme.version) {
      logger.debug('Not an ImpulseTheme - missing required properties', { 
        category: LogCategory.THEME 
      });
      return false;
    }
    
    // Check for essential structure
    if (!theme.text || !theme.bg || !theme.border) {
      logger.debug('Not an ImpulseTheme - missing color structure', { 
        category: LogCategory.THEME 
      });
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error in isImpulseTheme', { 
      category: LogCategory.THEME,
      details: error 
    });
    return false;
  }
}

/**
 * Type guard for Theme
 */
export function isTheme(theme: any): theme is Theme {
  try {
    if (!theme) return false;
    
    // Check required properties
    if (!theme.id || !theme.name) {
      logger.debug('Not a Theme - missing required properties', { 
        category: LogCategory.THEME 
      });
      return false;
    }
    
    // The Theme interface is less strict than ImpulseTheme
    return true;
  } catch (error) {
    logger.error('Error in isTheme', { 
      category: LogCategory.THEME,
      details: error 
    });
    return false;
  }
}

/**
 * Check if a value is a valid theme (either ImpulseTheme or Theme)
 */
export function isValidTheme(theme: any): boolean {
  return isImpulseTheme(theme) || isTheme(theme);
}

/**
 * Create a defensive copy of a theme
 * Prevents accidental mutation of theme objects
 */
export function cloneTheme<T extends ImpulseTheme | Theme>(theme: T): T {
  try {
    return JSON.parse(JSON.stringify(theme));
  } catch (error) {
    logger.error('Error cloning theme', { 
      category: LogCategory.THEME,
      details: error 
    });
    return theme; // Return original as fallback
  }
}
