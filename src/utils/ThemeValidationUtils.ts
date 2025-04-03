
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { defaultImpulseTokens } from '@/admin/types/impulse.types';
import { applyThemeToDocument } from '@/admin/theme/utils/themeApplicator';

const logger = getLogger('ThemeValidationUtils', { category: LogCategory.THEME as string });

/**
 * Validates that theme CSS variables were properly applied to the document
 */
export function validateThemeVariables(): boolean {
  try {
    // Core variables that must be present
    const requiredVars = [
      '--impulse-primary',
      '--color-primary',
      '--impulse-secondary',
      '--color-secondary',
      '--impulse-bg-main',
      '--impulse-text-primary'
    ];
    
    const computedStyle = getComputedStyle(document.documentElement);
    
    // Verify each variable exists
    const missingVars = requiredVars.filter(varName => {
      const value = computedStyle.getPropertyValue(varName).trim();
      return !value || value === 'undefined' || value === 'null';
    });
    
    if (missingVars.length > 0) {
      logger.warn('Theme validation failed - missing CSS variables', { 
        details: { missingVars } 
      });
      return false;
    }
    
    logger.debug('Theme validation successful', { 
      details: { 
        validatedVars: requiredVars.length,
        hasThemeClass: document.documentElement.classList.contains('impulse-theme-applied')
      } 
    });
    
    return true;
  } catch (error) {
    logger.error('Error validating theme variables', { 
      details: { 
        error: error instanceof Error ? error.message : String(error)
      } 
    });
    return false;
  }
}

/**
 * Apply emergency fallback styles if theme fails to load
 */
export function applyEmergencyFallback(): void {
  logger.warn('Applying emergency fallback theme');
  
  try {
    // Apply the default theme
    applyThemeToDocument(defaultImpulseTokens);
    
    // Force apply critical CSS variables directly
    document.documentElement.style.setProperty('--impulse-primary', '#00F0FF');
    document.documentElement.style.setProperty('--color-primary', '0, 240, 255');
    document.documentElement.style.setProperty('--impulse-secondary', '#FF2D6E');
    document.documentElement.style.setProperty('--color-secondary', '255, 45, 110');
    document.documentElement.style.setProperty('--impulse-bg-main', '#12121A');
    document.documentElement.style.setProperty('--impulse-text-primary', '#F6F6F7');
    
    // Document body fallbacks
    document.body.style.backgroundColor = '#12121A';
    document.body.style.color = '#F6F6F7';
    
    // Add emergency class
    document.documentElement.classList.add('impulse-emergency-fallback');
    
    logger.debug('Emergency fallback theme applied');
  } catch (error) {
    logger.error('Failed to apply emergency fallback theme', { 
      details: { 
        error: error instanceof Error ? error.message : String(error)
      } 
    });
  }
}

/**
 * Log the current theme state for debugging
 */
export function logThemeState(): void {
  if (process.env.NODE_ENV !== 'development') return;
  
  try {
    const computedStyle = getComputedStyle(document.documentElement);
    const themeVars = {
      primaryColor: computedStyle.getPropertyValue('--impulse-primary').trim(),
      secondaryColor: computedStyle.getPropertyValue('--impulse-secondary').trim(),
      bgMain: computedStyle.getPropertyValue('--impulse-bg-main').trim(),
      textPrimary: computedStyle.getPropertyValue('--impulse-text-primary').trim(),
      themeId: document.documentElement.getAttribute('data-theme-id') || 'none',
      themeStatus: document.documentElement.getAttribute('data-theme-status') || 'none',
      hasAppliedClass: document.documentElement.classList.contains('impulse-theme-applied'),
      hasFallbackClass: document.documentElement.classList.contains('theme-fallback-applied'),
      hasEmergencyClass: document.documentElement.classList.contains('impulse-emergency-fallback')
    };
    
    logger.debug('Current theme state', { details: themeVars });
  } catch (error) {
    logger.error('Error logging theme state', { 
      details: { 
        error: error instanceof Error ? error.message : String(error)
      } 
    });
  }
}

/**
 * Verify theme is applied correctly
 */
export function assertThemeApplied(): boolean {
  try {
    // Check if basic theme CSS variables are present
    const computedStyle = getComputedStyle(document.documentElement);
    
    const primaryColor = computedStyle.getPropertyValue('--impulse-primary').trim();
    const bgMain = computedStyle.getPropertyValue('--impulse-bg-main').trim();
    
    const isApplied = primaryColor && bgMain && 
                      primaryColor !== 'undefined' && 
                      bgMain !== 'undefined';
    
    if (!isApplied) {
      logger.warn('Theme assertion failed - theme not properly applied');
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error asserting theme application', { 
      details: { 
        error: error instanceof Error ? error.message : String(error)
      } 
    });
    return false;
  }
}
