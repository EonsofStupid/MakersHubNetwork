
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';
import { hexToRgbString } from './colorUtils';

const logger = getLogger('ThemeValidationUtils', { category: LogCategory.THEME });

/**
 * Validate theme variables have been properly applied to the DOM
 * @returns {boolean} - Whether the theme variables are properly set
 */
export function validateThemeVariables(): boolean {
  try {
    const root = document.documentElement;
    const primary = root.style.getPropertyValue('--primary');
    const background = root.style.getPropertyValue('--background');
    const colorPrimary = root.style.getPropertyValue('--color-primary');
    
    // Check multiple CSS variable formats to be thorough
    return !!(
      (primary || colorPrimary) && 
      background && 
      root.classList.contains('impulse-theme-active')
    );
  } catch (e) {
    logger.error('Error validating theme variables', { 
      details: safeDetails(e)
    });
    return false;
  }
}

/**
 * Apply emergency fallback styling when theme loading fails
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
    
    // Direct color references
    root.style.setProperty('--color-primary', '0, 240, 255');
    root.style.setProperty('--color-secondary', '255, 45, 110');
    root.style.setProperty('--impulse-primary', '#00F0FF');
    root.style.setProperty('--impulse-secondary', '#FF2D6E');
    
    document.documentElement.classList.add('impulse-theme-active');
    document.documentElement.setAttribute('data-theme-status', 'emergency');
    
    document.body.style.background = '#12121A';
    document.body.style.color = '#F6F6F7';
    
    logger.info('Emergency fallback applied');
  } catch (e) {
    logger.error('Critical error in emergency fallback', { 
      details: safeDetails(e)
    });
  }
}

/**
 * Log current theme state to console for debugging
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
    logger.error('Error logging theme state', { 
      details: safeDetails(e)
    });
  }
}

/**
 * Verify theme has been applied at the document level
 */
export function assertThemeApplied(): boolean {
  try {
    const root = document.documentElement;
    return root.style.getPropertyValue('--background') !== '' || 
           root.style.getPropertyValue('--color-primary') !== '';
  } catch (e) {
    logger.error('Error checking theme application', { 
      details: safeDetails(e)
    });
    return false;
  }
}
