
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const logger = getLogger('ThemeValidation');

/**
 * Validates that theme variables are properly applied to the document
 * @returns true if theme variables are applied correctly
 */
export function validateThemeVariables(): boolean {
  const rootStyle = getComputedStyle(document.documentElement);
  
  // Critical theme variables to check
  const criticalVariables = [
    '--background',
    '--foreground',
    '--primary',
    '--secondary',
    '--site-effect-color',
    '--site-effect-secondary'
  ];
  
  const missingVariables = criticalVariables.filter(variable => {
    const value = rootStyle.getPropertyValue(variable).trim();
    return !value || value === 'undefined' || value === 'null';
  });
  
  if (missingVariables.length > 0) {
    logger.warn('Missing critical theme variables', { 
      category: LogCategory.THEME,
      details: { missingVariables } 
    });
    return false;
  }
  
  logger.debug('Theme variables validated successfully', {
    category: LogCategory.THEME
  });
  return true;
}

/**
 * Emergency fallback for theme variables
 * Applies hardcoded values if the theme system fails
 */
export function applyEmergencyFallback(): void {
  try {
    logger.info('Applying emergency theme fallback', {
      category: LogCategory.THEME
    });
    
    // Apply critical CSS variables directly to ensure visual stability
    const root = document.documentElement;
    root.style.setProperty('--fallback-background', '#12121A');
    root.style.setProperty('--fallback-foreground', '#F6F6F7');
    root.style.setProperty('--fallback-primary', '#00F0FF');
    root.style.setProperty('--fallback-secondary', '#FF2D6E');
    
    // Set standard variables
    root.style.setProperty('--background', 'var(--fallback-background)');
    root.style.setProperty('--foreground', 'var(--fallback-foreground)');
    root.style.setProperty('--primary', 'var(--fallback-primary)');
    root.style.setProperty('--secondary', 'var(--fallback-secondary)');
    
    // Set critical effect colors
    root.style.setProperty('--site-effect-color', '#00F0FF');
    root.style.setProperty('--site-effect-secondary', '#FF2D6E');
    root.style.setProperty('--color-primary', '0, 240, 255');
    root.style.setProperty('--color-secondary', '255, 45, 110');
    
    // Set impulse-specific variables
    root.style.setProperty('--impulse-primary', '#00F0FF');
    root.style.setProperty('--impulse-secondary', '#FF2D6E');
    root.style.setProperty('--impulse-bg-main', '#12121A');
    root.style.setProperty('--impulse-text-primary', '#F6F6F7');
    
    // Add theme classes
    root.classList.add('theme-fallback-applied');
    root.classList.add('impulse-theme-active');
    
    // Apply emergency styles to body
    document.body.style.backgroundColor = '#12121A';
    document.body.style.color = '#F6F6F7';
    
    // Set data attribute
    root.setAttribute('data-theme-emergency', 'active');
    
    logger.info('Emergency theme fallback applied successfully', {
      category: LogCategory.THEME
    });
    return;
  } catch (error) {
    logger.error('Failed to apply emergency theme fallback', { 
      category: LogCategory.THEME,
      details: { error } 
    });
  }
}

/**
 * Logs current theme state for debugging
 * @returns Object containing the current theme state or null if error
 */
export function logThemeState(): Record<string, any> | null {
  try {
    const rootStyle = getComputedStyle(document.documentElement);
    const themeVariables = {
      background: rootStyle.getPropertyValue('--background').trim(),
      foreground: rootStyle.getPropertyValue('--foreground').trim(),
      primary: rootStyle.getPropertyValue('--primary').trim(),
      secondary: rootStyle.getPropertyValue('--secondary').trim(),
      effectColor: rootStyle.getPropertyValue('--site-effect-color').trim(),
      effectSecondary: rootStyle.getPropertyValue('--site-effect-secondary').trim(),
      themeId: document.documentElement.getAttribute('data-theme-id') || 'none',
      classes: document.documentElement.className
    };
    
    logger.info('Current theme state', { 
      category: LogCategory.THEME,
      details: { themeVariables } 
    });
    return themeVariables;
  } catch (error) {
    logger.error('Failed to log theme state', { 
      category: LogCategory.THEME,
      details: { error } 
    });
    return null;
  }
}

/**
 * Checks if theme appears to be correctly applied by validating
 * variable presence and necessary classes
 */
export function assertThemeApplied(): boolean {
  try {
    const root = document.documentElement;
    const rootStyle = getComputedStyle(root);
    
    // Check for critical theme variables
    const primaryColor = rootStyle.getPropertyValue('--primary').trim();
    const backgroundVar = rootStyle.getPropertyValue('--background').trim();
    
    // Check for theme classes
    const hasThemeClass = root.classList.contains('impulse-theme-active');
    const hasThemeAttribute = !!root.getAttribute('data-theme-id');
    
    const isThemeApplied = !!primaryColor && !!backgroundVar && hasThemeClass;
    
    if (!isThemeApplied) {
      logger.warn('Theme not fully applied', {
        category: LogCategory.THEME,
        details: {
          primaryColor,
          backgroundVar,
          hasThemeClass,
          hasThemeAttribute
        }
      });
      
      // Apply classes if missing
      if (!hasThemeClass) {
        root.classList.add('impulse-theme-active');
      }
      
      // Apply data attribute if missing
      if (!hasThemeAttribute) {
        root.setAttribute('data-theme-id', 'fallback');
      }
      
      // Check if we need to apply emergency styles
      if (!primaryColor || !backgroundVar) {
        applyEmergencyFallback();
      }
    }
    
    return isThemeApplied;
  } catch (error) {
    logger.error('Error asserting theme application', { 
      category: LogCategory.THEME,
      details: { error } 
    });
    return false;
  }
}
