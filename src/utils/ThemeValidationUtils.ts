
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { hexToRgbString } from './colorUtils';

const logger = getLogger('ThemeValidation', { category: LogCategory.THEME });

// Fallback values for emergency cases
const FALLBACKS = {
  background: '#12121A',
  foreground: '#F6F6F7',
  primary: '#00F0FF',
  secondary: '#FF2D6E',
  accent: '#8B5CF6'
};

/**
 * Validates that critical theme variables are properly set on the document
 * @returns True if critical theme variables are set, false otherwise
 */
export function validateThemeVariables(): boolean {
  try {
    // Check for critical CSS variables
    const styles = getComputedStyle(document.documentElement);
    const criticalVars = [
      '--background',
      '--foreground',
      '--primary',
      '--secondary',
      '--card',
      '--card-foreground'
    ];
    
    // Check that all critical variables are defined and have non-empty values
    const missingVars = criticalVars.filter(varName => {
      const value = styles.getPropertyValue(varName).trim();
      return !value || value === 'undefined' || value === 'null';
    });
    
    if (missingVars.length > 0) {
      logger.warn('Missing critical theme variables', { details: { missingVars } });
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error validating theme variables', { details: { error } });
    return false;
  }
}

/**
 * Apply emergency fallback styling to the document
 * Used when theme loading fails completely
 */
export function applyEmergencyFallback(): void {
  try {
    logger.warn('Applying emergency theme fallback');
    
    // Apply fallback colors directly
    document.documentElement.style.setProperty('--background', FALLBACKS.background);
    document.documentElement.style.setProperty('--foreground', FALLBACKS.foreground);
    document.documentElement.style.setProperty('--primary', FALLBACKS.primary);
    document.documentElement.style.setProperty('--secondary', FALLBACKS.secondary);
    document.documentElement.style.setProperty('--card', FALLBACKS.background);
    document.documentElement.style.setProperty('--card-foreground', FALLBACKS.foreground);
    document.documentElement.style.setProperty('--effect-color', FALLBACKS.primary);
    
    // Set RGB variables for components that expect them
    document.documentElement.style.setProperty('--color-primary', hexToRgbString(FALLBACKS.primary));
    document.documentElement.style.setProperty('--color-secondary', hexToRgbString(FALLBACKS.secondary));
    
    // Force body colors
    document.documentElement.style.backgroundColor = FALLBACKS.background;
    document.documentElement.style.color = FALLBACKS.foreground;
    document.body.style.backgroundColor = FALLBACKS.background;
    document.body.style.color = FALLBACKS.foreground;
    
    // Set data attribute to track fallback status
    document.documentElement.setAttribute('data-theme-status', 'emergency-fallback');
    
    logger.info('Emergency fallback styling applied');
  } catch (error) {
    logger.error('Failed to apply emergency fallback', { details: { error } });
  }
}

/**
 * Verify that theme styling is properly applied to the document
 * @returns True if any theme styling is applied, false otherwise
 */
export function assertThemeApplied(): boolean {
  try {
    const styles = getComputedStyle(document.documentElement);
    const bgColor = styles.backgroundColor;
    
    // If the background color is still the browser default (often white),
    // then theme styling has not been applied
    if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent' || bgColor === 'rgb(255, 255, 255)') {
      logger.warn('Theme not correctly applied, applying emergency fallback');
      applyEmergencyFallback();
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error checking theme application', { details: { error } });
    applyEmergencyFallback();
    return false;
  }
}

/**
 * Log the current theme state for debugging
 */
export function logThemeState(): void {
  try {
    const styles = getComputedStyle(document.documentElement);
    
    const themeState = {
      background: styles.getPropertyValue('--background').trim(),
      foreground: styles.getPropertyValue('--foreground').trim(),
      primary: styles.getPropertyValue('--primary').trim(),
      secondary: styles.getPropertyValue('--secondary').trim(),
      dataThemeId: document.documentElement.getAttribute('data-theme-id'),
      dataThemeStatus: document.documentElement.getAttribute('data-theme-status'),
      classes: Array.from(document.documentElement.classList)
    };
    
    logger.debug('Current theme state', { details: { themeState } });
  } catch (error) {
    logger.error('Error logging theme state', { details: { error } });
  }
}
