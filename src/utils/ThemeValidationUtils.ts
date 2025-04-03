
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { defaultImpulseTokens } from '@/admin/theme/impulse/tokens';
import { hexToRgbString } from '@/admin/theme/utils/colorUtils';

const logger = getLogger('ThemeValidation', { category: LogCategory.THEME as string });

/**
 * Validate that critical theme variables are properly set in the document
 */
export function validateThemeVariables(): boolean {
  try {
    const style = getComputedStyle(document.documentElement);
    
    // Check for required CSS variables
    const requiredVars = [
      '--background',
      '--foreground',
      '--primary',
      '--secondary',
      '--color-primary',
      '--color-secondary',
      '--site-effect-color',
      '--site-effect-secondary'
    ];
    
    // Check if all required variables are set
    const missingVars = requiredVars.filter(v => !style.getPropertyValue(v));
    
    if (missingVars.length > 0) {
      logger.warn('Missing theme CSS variables', { 
        details: { missing: missingVars.join(', ') } 
      });
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error validating theme variables', { 
      details: { error: error instanceof Error ? error.message : String(error) } 
    });
    return false;
  }
}

/**
 * Apply emergency fallback theme when all else fails
 */
export function applyEmergencyFallback(): void {
  logger.warn('Applying emergency theme fallback');
  
  try {
    const root = document.documentElement;
    const bgColor = defaultImpulseTokens.colors?.background?.main || '#12121A';
    const textColor = defaultImpulseTokens.colors?.text?.primary || '#F6F6F7';
    const primaryColor = defaultImpulseTokens.colors?.primary || '#00F0FF';
    const secondaryColor = defaultImpulseTokens.colors?.secondary || '#FF2D6E';
    
    // Apply direct styling for essential elements
    root.style.backgroundColor = bgColor;
    root.style.color = textColor;
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;
    
    // Set critical CSS variables
    root.style.setProperty('--background', '224 10% 9%'); // #12121A in HSL
    root.style.setProperty('--foreground', '220 6% 97%'); // #F6F6F7 in HSL
    root.style.setProperty('--primary', '183 100% 50%'); // #00F0FF in HSL
    root.style.setProperty('--primary-foreground', '0 0% 100%'); // #FFFFFF in HSL
    root.style.setProperty('--secondary', '341 100% 59%'); // #FF2D6E in HSL
    root.style.setProperty('--secondary-foreground', '0 0% 100%'); // #FFFFFF in HSL
    
    // Set RGB variables
    root.style.setProperty('--color-primary', hexToRgbString(primaryColor));
    root.style.setProperty('--color-secondary', hexToRgbString(secondaryColor));
    
    // Set effect colors
    root.style.setProperty('--site-effect-color', primaryColor);
    root.style.setProperty('--site-effect-secondary', secondaryColor);
    root.style.setProperty('--impulse-primary', primaryColor);
    root.style.setProperty('--impulse-secondary', secondaryColor);
    
    // Add theme fallback class
    root.classList.add('theme-emergency-fallback');
    
    // Set dark mode
    root.classList.add('dark');
    root.classList.remove('light');
    
    logger.info('Emergency theme fallback applied successfully');
  } catch (error) {
    logger.error('Failed to apply emergency theme fallback', { 
      details: { error: error instanceof Error ? error.message : String(error) } 
    });
  }
}

/**
 * Check if a theme has been applied to the document
 */
export function assertThemeApplied(): boolean {
  try {
    const style = getComputedStyle(document.documentElement);
    
    // Check for a background color that's not white
    const bg = style.backgroundColor;
    const hasCustomBg = bg && bg !== 'rgb(255, 255, 255)' && bg !== 'rgba(0, 0, 0, 0)';
    
    // Check for critical CSS variables
    const hasPrimary = !!style.getPropertyValue('--primary');
    const hasSecondary = !!style.getPropertyValue('--secondary');
    
    // Also check for theme classes
    const hasThemeClass = document.documentElement.classList.contains('impulse-theme-active') ||
                          document.documentElement.classList.contains('theme-fallback-applied') ||
                          document.documentElement.classList.contains('theme-emergency-fallback');
    
    return hasCustomBg && hasPrimary && hasSecondary && hasThemeClass;
  } catch (error) {
    logger.error('Error checking theme application', { 
      details: { error: error instanceof Error ? error.message : String(error) } 
    });
    return false;
  }
}

/**
 * Log theme state for debugging
 */
export function logThemeState(): void {
  try {
    const style = getComputedStyle(document.documentElement);
    
    logger.debug('Theme state', {
      details: {
        background: style.getPropertyValue('--background'),
        primary: style.getPropertyValue('--primary'),
        secondary: style.getPropertyValue('--secondary'),
        effectColor: style.getPropertyValue('--site-effect-color'),
        backgroundColor: style.backgroundColor,
        hasThemeFallbackClass: document.documentElement.classList.contains('theme-fallback-applied'),
        hasImpulseActiveClass: document.documentElement.classList.contains('impulse-theme-active'),
        hasEmergencyClass: document.documentElement.classList.contains('theme-emergency-fallback'),
        isDark: document.documentElement.classList.contains('dark'),
        themeId: document.documentElement.getAttribute('data-theme-id'),
        themeStatus: document.documentElement.getAttribute('data-theme-status')
      }
    });
  } catch (error) {
    logger.error('Error logging theme state', { 
      details: { error: error instanceof Error ? error.message : String(error) } 
    });
  }
}
