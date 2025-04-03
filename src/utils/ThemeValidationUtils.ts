
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { applyFallbackStyles } from '@/admin/theme/impulse/fallback';

const logger = getLogger('ThemeValidator', LogCategory.THEME);

/**
 * Checks if critical theme variables are properly set in the DOM
 */
export function validateThemeVariables(): boolean {
  try {
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    
    // Critical variables that must be set for the UI to render correctly
    const criticalVariables = [
      '--color-primary',
      '--color-background',
      '--background',
      '--foreground'
    ];
    
    // Check each critical variable
    const missingVariables = criticalVariables.filter(variable => {
      const value = styles.getPropertyValue(variable).trim();
      return !value || value === 'none' || value === 'initial';
    });
    
    if (missingVariables.length > 0) {
      logger.warn('Missing critical theme variables', { 
        details: { missing: missingVariables } 
      });
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error validating theme variables', { details: { error } });
    return false;
  }
}

/**
 * Apply emergency fallback in case of theme loading failure
 */
export function applyEmergencyFallback(): void {
  logger.warn('Applying emergency fallback theme');
  applyFallbackStyles();
}

/**
 * Log the current state of theme variables for debugging
 */
export function logThemeState(): void {
  try {
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    const themeVariables: Record<string, string> = {};
    
    // Key variables to log
    const keyVariables = [
      '--color-primary',
      '--color-secondary',
      '--color-background',
      '--color-text',
      '--background',
      '--foreground',
      '--primary',
      '--secondary'
    ];
    
    // Collect current variable values
    keyVariables.forEach(variable => {
      themeVariables[variable] = styles.getPropertyValue(variable).trim();
    });
    
    // Log theme state
    logger.debug('Current theme state', { 
      details: { 
        variables: themeVariables,
        themeId: root.getAttribute('data-theme-id') || 'unknown',
        themeStatus: root.getAttribute('data-theme-status') || 'unknown',
        classes: root.className
      } 
    });
  } catch (error) {
    logger.error('Error logging theme state', { details: { error } });
  }
}

/**
 * Verify theme is applied, otherwise force fallback
 */
export function assertThemeApplied(): boolean {
  try {
    const hasTheme = validateThemeVariables();
    
    if (!hasTheme) {
      logger.warn('Theme not properly applied, forcing fallback');
      applyEmergencyFallback();
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error asserting theme application', { details: { error } });
    applyEmergencyFallback();
    return false;
  }
}
