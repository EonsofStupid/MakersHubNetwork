
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';
import { hexToRgbString } from '@/admin/theme/utils/colorUtils';

const logger = getLogger('ThemeValidation', { category: LogCategory.THEME as any });

/**
 * Validate if theme variables have been properly applied
 */
export function validateThemeVariables(): boolean {
  try {
    const root = document.documentElement;
    const hasPrimary = root.style.getPropertyValue('--primary') !== '';
    const hasBackground = root.style.getPropertyValue('--background') !== '';
    const hasForeground = root.style.getPropertyValue('--foreground') !== '';
    const hasColorPrimary = root.style.getPropertyValue('--color-primary') !== '';
    
    // Theme is considered valid if at least these critical variables are set
    return hasPrimary && hasBackground && (hasForeground || hasColorPrimary);
  } catch (e) {
    logger.error('Error validating theme variables', { details: safeDetails(e) });
    return false;
  }
}

/**
 * Apply emergency fallback theme in case all other methods fail
 */
export function applyEmergencyFallback(): void {
  try {
    logger.warn('Applying emergency theme fallback');
    const root = document.documentElement;
    
    // Critical base fallback colors
    root.style.setProperty('--background', '228 47% 8%');
    root.style.setProperty('--foreground', '210 40% 98%');
    root.style.setProperty('--primary', '186 100% 50%');
    root.style.setProperty('--primary-foreground', '210 40% 98%');
    root.style.setProperty('--secondary', '334 100% 59%');
    root.style.setProperty('--secondary-foreground', '210 40% 98%');
    
    // Direct color references
    root.style.setProperty('--color-primary', '0, 240, 255');
    root.style.setProperty('--color-secondary', '255, 45, 110');
    root.style.setProperty('--impulse-primary', '#00F0FF');
    root.style.setProperty('--impulse-secondary', '#FF2D6E');
    
    // Timing variables
    root.style.setProperty('--transition-fast', '150ms');
    root.style.setProperty('--transition-normal', '300ms');
    root.style.setProperty('--transition-slow', '500ms');
    root.style.setProperty('--animation-fast', '1s');
    root.style.setProperty('--animation-normal', '2s');
    root.style.setProperty('--animation-slow', '3s');
    
    document.documentElement.classList.add('impulse-theme-active');
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme-status', 'emergency');
    
    document.body.style.background = '#12121A';
    document.body.style.color = '#F6F6F7';
  } catch (e) {
    logger.error('Critical error in emergency fallback', { details: safeDetails(e) });
  }
}

/**
 * Log theme state for debugging purposes
 */
export function logThemeState(): void {
  try {
    const root = document.documentElement;
    logger.debug('Theme state:', { 
      details: {
        '--background': root.style.getPropertyValue('--background'),
        '--foreground': root.style.getPropertyValue('--foreground'),
        '--primary': root.style.getPropertyValue('--primary'),
        '--secondary': root.style.getPropertyValue('--secondary'),
        '--color-primary': root.style.getPropertyValue('--color-primary'),
        'data-theme-id': root.getAttribute('data-theme-id'),
        'data-theme-status': root.getAttribute('data-theme-status'),
        'classes': root.className
      }
    });
  } catch (e) {
    logger.error('Error logging theme state', { details: safeDetails(e) });
  }
}

/**
 * Check if theme has been applied
 */
export function assertThemeApplied(): boolean {
  try {
    const root = document.documentElement;
    
    const hasAtLeastOneVariable = root.style.getPropertyValue('--background') !== '' || 
                                  root.style.getPropertyValue('--color-primary') !== '' ||
                                  root.style.getPropertyValue('--impulse-primary') !== '';
    
    if (!hasAtLeastOneVariable) {
      logger.warn('Theme variables not detected, forcing emergency fallback');
      applyEmergencyFallback();
      return false;
    }
    
    return true;
  } catch (e) {
    logger.error('Error checking theme application', { details: safeDetails(e) });
    applyEmergencyFallback();
    return false;
  }
}
