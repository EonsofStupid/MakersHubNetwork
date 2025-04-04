
/**
 * Utility functions for validating and applying themes
 */
import { defaultImpulseTokens } from '@/admin/types/impulse.types';
import { applyThemeToDocument } from '@/admin/theme/utils/themeApplicator';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const logger = getLogger('ThemeValidation', { category: LogCategory.THEME });

/**
 * Validate that required theme variables are present on the document
 */
export function validateThemeVariables(): boolean {
  const style = getComputedStyle(document.documentElement);
  
  // Define critical CSS variables that should be present
  const criticalVariables = [
    '--background',
    '--foreground',
    '--primary',
    '--secondary',
    '--impulse-primary',
    '--color-primary',
  ];
  
  // Check if all critical variables are defined
  const missingVariables = criticalVariables.filter(varName => {
    const value = style.getPropertyValue(varName).trim();
    return !value;
  });
  
  if (missingVariables.length > 0) {
    logger.warn('Missing critical theme variables', { 
      details: { missingVariables } 
    });
    return false;
  }
  
  return true;
}

/**
 * Apply emergency fallback styling when theme fails to load
 */
export function applyEmergencyFallback(): void {
  logger.info('🚨 Applying emergency fallback theme');
  
  applyThemeToDocument(defaultImpulseTokens);
  
  document.documentElement.classList.add('theme-fallback-applied');
  document.documentElement.classList.add('impulse-theme-active');
  
  document.documentElement.setAttribute('data-theme-id', 'emergency-fallback');
  document.documentElement.setAttribute('data-theme-status', 'emergency-fallback');
  
  logger.info('✔️ Emergency fallback theme applied');
}

/**
 * Log the current theme state for debugging
 */
export function logThemeState(): any {
  const style = getComputedStyle(document.documentElement);
  const classes = document.documentElement.className.split(' ');
  const dataThemeId = document.documentElement.getAttribute('data-theme-id');
  const dataThemeStatus = document.documentElement.getAttribute('data-theme-status');
  
  const themeState = {
    dataThemeId,
    dataThemeStatus,
    classes,
    hasEmergencyFallback: classes.includes('theme-fallback-applied'),
    hasActiveTheme: classes.includes('impulse-theme-active'),
    variables: {
      background: style.getPropertyValue('--background').trim(),
      foreground: style.getPropertyValue('--foreground').trim(),
      primary: style.getPropertyValue('--primary').trim(),
      secondary: style.getPropertyValue('--secondary').trim(),
      accent: style.getPropertyValue('--accent').trim(),
    }
  };
  
  logger.debug('Current theme state', { details: themeState });
  
  return themeState;
}

/**
 * Assert that theme is properly applied, returns true if valid
 */
export function assertThemeApplied(): boolean {
  const isValid = validateThemeVariables();
  
  if (!isValid) {
    logger.warn('Theme validation failed, theme is not properly applied');
  }
  
  return isValid;
}
