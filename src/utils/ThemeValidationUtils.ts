
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const logger = getLogger('ThemeValidation', { category: LogCategory.THEME });

/**
 * Validate that essential theme variables are properly set on the document
 * @returns boolean indicating if all essential variables are set
 */
export function validateThemeVariables(): boolean {
  try {
    const styles = getComputedStyle(document.documentElement);
    const essentialVars = [
      '--color-primary',
      '--color-secondary',
      '--color-background',
      '--color-foreground'
    ];
    
    let allValid = true;
    const missing: string[] = [];
    
    essentialVars.forEach(varName => {
      const value = styles.getPropertyValue(varName).trim();
      if (!value) {
        allValid = false;
        missing.push(varName);
      }
    });
    
    if (!allValid) {
      logger.warn('Theme validation failed - missing variables', { 
        details: { missing } 
      });
    } else {
      logger.debug('Theme validation successful - all essential variables present');
    }
    
    return allValid;
  } catch (error) {
    logger.error('Error validating theme variables', {
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    return false;
  }
}

/**
 * Apply emergency fallback styles directly to ensure the UI is usable
 */
export function applyEmergencyFallback(): void {
  try {
    const root = document.documentElement;
    
    logger.warn('Applying emergency theme fallbacks');
    
    // Apply critical colors directly
    root.style.backgroundColor = '#12121A';
    root.style.color = '#F6F6F7';
    document.body.style.backgroundColor = '#12121A';
    document.body.style.color = '#F6F6F7';
    
    // Set essential CSS variables
    root.style.setProperty('--color-primary', '#00F0FF');
    root.style.setProperty('--color-secondary', '#FF2D6E');
    root.style.setProperty('--color-accent', '#8B5CF6');
    root.style.setProperty('--color-background', '#12121A');
    root.style.setProperty('--color-foreground', '#F6F6F7');
    root.style.setProperty('--impulse-primary', '#00F0FF');
    root.style.setProperty('--impulse-secondary', '#FF2D6E');
    
    // Add fallback classes for styling
    root.classList.add('theme-fallback-applied');
    root.setAttribute('data-theme-status', 'emergency-fallback');
    
    logger.info('Emergency fallback styling applied');
  } catch (error) {
    logger.error('Critical failure applying emergency fallback', {
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }
}

/**
 * Assert that essential theme styles are applied, or fix if possible
 * @returns boolean indicating if styles are correctly applied
 */
export function assertThemeApplied(): boolean {
  const root = document.documentElement;
  const bg = getComputedStyle(root).backgroundColor;
  
  // If background is transparent or not set, we need to fix it
  if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
    logger.warn('Background color not applied, forcing emergency styling');
    applyEmergencyFallback();
    return false;
  }
  
  return true;
}

/**
 * Log the current theme state for debugging
 */
export function logThemeState(): void {
  try {
    const styles = getComputedStyle(document.documentElement);
    const themeVars = {
      primary: styles.getPropertyValue('--color-primary'),
      secondary: styles.getPropertyValue('--color-secondary'),
      background: styles.getPropertyValue('--color-background'),
      foreground: styles.getPropertyValue('--color-foreground'),
      statusTheme: document.documentElement.getAttribute('data-theme-status'),
      themeId: document.documentElement.getAttribute('data-theme-id'),
      classList: Array.from(document.documentElement.classList)
    };
    
    logger.debug('Current theme state', { details: themeVars });
  } catch (error) {
    logger.error('Error logging theme state', {
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }
}
