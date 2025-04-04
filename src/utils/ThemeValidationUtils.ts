
import { getLogger } from '@/logging';
import { LogCategory } from '@/constants/logLevel';
import { defaultImpulseTokens } from '@/admin/theme/impulse/tokens';
import { getThemeProperty } from '@/admin/theme/utils/themeUtils';
import { applyThemeToDocument } from '@/admin/theme/utils/themeApplicator';

const logger = getLogger('ThemeValidation', { category: LogCategory.THEME });

/**
 * Validates that theme CSS variables are properly applied to the document
 */
export function validateThemeVariables(): boolean {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  
  const requiredVars = [
    '--impulse-primary',
    '--impulse-bg-main',
    '--impulse-text-primary'
  ];
  
  const missingVars = requiredVars.filter(varName => {
    const value = computedStyle.getPropertyValue(varName);
    return !value || value.trim() === '';
  });
  
  if (missingVars.length > 0) {
    logger.warn('Missing required theme variables', {
      details: { missingVars }
    });
    return false;
  }
  
  return true;
}

/**
 * Apply emergency fallback theme if validation fails
 */
export function applyEmergencyFallback(): void {
  logger.warn('Applying emergency fallback theme');
  
  // Apply the default theme
  applyThemeToDocument(defaultImpulseTokens);
  
  // Direct CSS applications for critical fallback
  const root = document.documentElement;
  
  // Critical colors
  root.style.setProperty('--impulse-primary', '#00F0FF');
  root.style.setProperty('--impulse-bg-main', '#12121A');
  root.style.setProperty('--impulse-text-primary', '#F6F6F7');
  
  // Ensure the body has proper colors
  document.body.style.backgroundColor = getThemeProperty(defaultImpulseTokens, 'colors.background.main', '#12121A');
  document.body.style.color = getThemeProperty(defaultImpulseTokens, 'colors.text.primary', '#F6F6F7');
  
  // Add emergency class
  document.documentElement.classList.add('theme-emergency-fallback');
  
  logger.info('Emergency fallback theme applied');
}

/**
 * Log the current theme state for debugging
 */
export function logThemeState(): void {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  
  logger.debug('Current theme state', {
    details: {
      cssVars: {
        primary: computedStyle.getPropertyValue('--impulse-primary'),
        bgMain: computedStyle.getPropertyValue('--impulse-bg-main'),
        textPrimary: computedStyle.getPropertyValue('--impulse-text-primary')
      },
      classes: Array.from(root.classList),
      dataTheme: root.getAttribute('data-theme-id'),
      dataStatus: root.getAttribute('data-theme-status')
    }
  });
}

/**
 * Assert that theme CSS is properly applied
 */
export function assertThemeApplied(): boolean {
  const isValid = validateThemeVariables();
  
  if (!isValid) {
    logger.warn('Theme not properly applied, applying emergency fallback');
    applyEmergencyFallback();
    return false;
  }
  
  return true;
}
