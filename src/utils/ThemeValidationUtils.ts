
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';
import { Theme } from '@/types/theme';
import { ensureHexColor } from '@/admin/theme/utils/colorUtils';

const logger = getLogger('ThemeValidationUtils', { category: LogCategory.THEME as string });

// Critical CSS variables that must be set for a functioning theme
const CRITICAL_CSS_VARS = [
  '--background',
  '--foreground',
  '--primary',
  '--secondary',
  '--color-primary',
  '--color-secondary'
];

/**
 * Validates if essential theme CSS variables are set
 */
export function validateThemeVariables(): boolean {
  try {
    const styles = getComputedStyle(document.documentElement);
    const missingVars: string[] = [];
    
    for (const varName of CRITICAL_CSS_VARS) {
      const value = styles.getPropertyValue(varName).trim();
      if (!value) {
        missingVars.push(varName);
      }
    }
    
    if (missingVars.length > 0) {
      logger.warn('Missing critical theme CSS variables', { 
        details: { missingVars } 
      });
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error validating theme variables', { 
      details: safeDetails(error) 
    });
    return false;
  }
}

/**
 * Validates if a theme object has all required properties
 */
export function validateThemeObject(theme: Theme | null): string[] {
  const issues: string[] = [];
  
  if (!theme) {
    issues.push('Theme object is null or undefined');
    return issues;
  }
  
  // Check for id and name
  if (!theme.id) issues.push('Theme is missing required ID');
  if (!theme.name) issues.push('Theme is missing required name');
  
  // Check required design tokens
  const designTokens = theme.design_tokens;
  if (!designTokens) {
    issues.push('Theme is missing design_tokens object');
    return issues;
  }
  
  // Check essential colors
  const colors = designTokens.colors;
  if (!colors) {
    issues.push('Theme is missing colors object');
  } else {
    // Check primary and secondary colors
    if (!colors.primary) issues.push('Missing primary color');
    if (!colors.secondary) issues.push('Missing secondary color');
    
    // Check background colors
    if (!colors.background) {
      issues.push('Missing background object');
    } else if (!colors.background.main) {
      issues.push('Missing background.main color');
    }
    
    // Check text colors
    if (!colors.text) {
      issues.push('Missing text object');
    } else if (!colors.text.primary) {
      issues.push('Missing text.primary color');
    }
  }
  
  return issues;
}

/**
 * Log the current theme state for debugging
 */
export function logThemeState(): void {
  try {
    const styles = getComputedStyle(document.documentElement);
    const themeVars: Record<string, string> = {};
    
    // Collect theme-related CSS variables
    const varPrefixes = ['--background', '--foreground', '--primary', '--secondary', '--color'];
    
    for (let i = 0; i < styles.length; i++) {
      const prop = styles[i];
      if (varPrefixes.some(prefix => prop.startsWith(prefix))) {
        themeVars[prop] = styles.getPropertyValue(prop).trim();
      }
    }
    
    // Get theme classes and attributes
    const htmlClasses = Array.from(document.documentElement.classList);
    const themeId = document.documentElement.getAttribute('data-theme-id') || 'none';
    const themeStatus = document.documentElement.getAttribute('data-theme-status') || 'none';
    
    logger.debug('Current theme state', {
      details: {
        themeId,
        themeStatus,
        htmlClasses,
        cssVariables: themeVars
      }
    });
  } catch (error) {
    logger.error('Error logging theme state', { details: safeDetails(error) });
  }
}

/**
 * Apply emergency fallback styling for theming
 */
export function applyEmergencyFallback(): void {
  try {
    logger.warn('Applying emergency theme fallback');
    
    // Emergency fallback colors
    const bgColor = '#12121A';
    const textColor = '#F6F6F7';
    const primaryColor = '#00F0FF';
    const secondaryColor = '#FF2D6E';
    
    const root = document.documentElement;
    
    // Apply direct styling
    root.style.backgroundColor = bgColor;
    root.style.color = textColor;
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;
    
    // Set minimum CSS variables
    root.style.setProperty('--background', '224 10% 9%');
    root.style.setProperty('--foreground', '220 6% 97%');
    root.style.setProperty('--primary', '183 100% 50%');
    root.style.setProperty('--secondary', '341 100% 59%');
    
    root.style.setProperty('--color-primary', '0, 240, 255');
    root.style.setProperty('--color-secondary', '255, 45, 110');
    
    // Set direct colors for legacy compatibility
    root.style.setProperty('--impulse-primary', primaryColor);
    root.style.setProperty('--impulse-secondary', secondaryColor);
    root.style.setProperty('--site-effect-color', primaryColor);
    root.style.setProperty('--site-effect-secondary', secondaryColor);
    
    // Add fallback classes
    root.classList.add('impulse-theme-fallback');
    root.classList.add('dark');
    root.setAttribute('data-theme-status', 'emergency-fallback');
  } catch (error) {
    logger.error('Critical error in emergency fallback', { details: safeDetails(error) });
  }
}

/**
 * Verify theme is actually applied to document
 */
export function assertThemeApplied(): boolean {
  try {
    const styles = getComputedStyle(document.documentElement);
    const bgColor = styles.backgroundColor;
    const textColor = styles.color;
    
    // Check if background color is set (not transparent or default)
    const hasBackground = bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent';
    
    // Check if at least one theme variable is set
    const primaryVar = styles.getPropertyValue('--primary').trim();
    
    const isThemeApplied = hasBackground && !!primaryVar;
    
    if (!isThemeApplied) {
      logger.warn('Theme is not properly applied', {
        details: { bgColor, textColor, primaryVar }
      });
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error checking theme application', { details: safeDetails(error) });
    return false;
  }
}
