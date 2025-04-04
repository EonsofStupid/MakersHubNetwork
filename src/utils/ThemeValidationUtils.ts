
import { getLogger } from '@/logging';
import { LogCategory } from '@/constants/logLevel';
import { EMERGENCY_COLORS } from '@/admin/theme/constants';
import { applyEmergencyTheme } from '@/admin/theme/utils/themeApplicator';

const logger = getLogger('ThemeValidationUtils', { category: LogCategory.THEME });

/**
 * Validates that critical theme CSS variables are properly set
 */
export function validateThemeVariables(): boolean {
  const root = document.documentElement;
  
  const criticalVars = [
    '--impulse-primary',
    '--impulse-bg-main',
    '--impulse-text-primary'
  ];
  
  const missingVars = criticalVars.filter(varName => {
    const value = getComputedStyle(root).getPropertyValue(varName).trim();
    return !value;
  });
  
  if (missingVars.length > 0) {
    logger.warn('Missing critical theme variables', {
      details: { missingVars }
    });
    return false;
  }
  
  return true;
}

/**
 * Assert that theme is properly applied, apply emergency theme if not
 */
export function assertThemeApplied(): boolean {
  const root = document.documentElement;
  
  // Check for essential theme variables
  const bgColor = getComputedStyle(root).getPropertyValue('--impulse-bg-main').trim();
  const textColor = getComputedStyle(root).getPropertyValue('--impulse-text-primary').trim();
  const primaryColor = getComputedStyle(root).getPropertyValue('--impulse-primary').trim();
  
  // Check if theme is properly applied
  const isApplied = !!bgColor && !!textColor && !!primaryColor;
  
  if (!isApplied) {
    logger.warn('Theme not properly applied - forcing emergency theme', {
      details: { bgColor, textColor, primaryColor }
    });
    applyEmergencyTheme();
    return false;
  }
  
  logger.debug('Theme properly applied', {
    details: { bgColor, textColor, primaryColor }
  });
  
  return true;
}

/**
 * Log the current theme state for debugging
 */
export function logThemeState(): void {
  const root = document.documentElement;
  
  try {
    const compStyles = getComputedStyle(root);
    const bgColor = compStyles.getPropertyValue('--impulse-bg-main').trim();
    const textColor = compStyles.getPropertyValue('--impulse-text-primary').trim();
    const primaryColor = compStyles.getPropertyValue('--impulse-primary').trim();
    const secondaryColor = compStyles.getPropertyValue('--impulse-secondary').trim();
    const themeId = root.getAttribute('data-theme-id') || 'unknown';
    const themeStatus = root.getAttribute('data-theme-status') || 'unknown';
    const hasThemeClass = root.classList.contains('impulse-theme-applied');
    const hasFallbackClass = root.classList.contains('theme-fallback-applied');
    const hasEmergencyClass = root.classList.contains('theme-emergency-applied');
    
    logger.debug('Theme state', {
      details: {
        themeId,
        themeStatus,
        hasThemeClass,
        hasFallbackClass,
        hasEmergencyClass,
        cssVars: {
          bgColor,
          textColor,
          primaryColor,
          secondaryColor,
        }
      }
    });
  } catch (error) {
    logger.error('Error logging theme state', {
      details: { error }
    });
  }
}

/**
 * Apply emergency fallback for critical failures
 */
export function applyEmergencyFallback(): void {
  const root = document.documentElement;
  
  try {
    // Apply critical background/text colors for visibility
    root.style.backgroundColor = EMERGENCY_COLORS.background;
    root.style.color = EMERGENCY_COLORS.foreground;
    document.body.style.backgroundColor = EMERGENCY_COLORS.background;
    document.body.style.color = EMERGENCY_COLORS.foreground;
    
    // Set critical CSS variables
    root.style.setProperty('--impulse-primary', EMERGENCY_COLORS.primary);
    root.style.setProperty('--impulse-secondary', EMERGENCY_COLORS.secondary);
    root.style.setProperty('--impulse-bg-main', EMERGENCY_COLORS.background);
    root.style.setProperty('--impulse-text-primary', EMERGENCY_COLORS.foreground);
    
    // Add classes for CSS targeting
    root.classList.add('theme-emergency-applied');
    
    logger.warn('Emergency fallback styles applied due to critical theme failure');
  } catch (error) {
    logger.error('Error applying emergency fallback styles', {
      details: { error }
    });
  }
}
