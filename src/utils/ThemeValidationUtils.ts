
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { defaultImpulseTokens } from '@/admin/types/impulse.types';
import { Theme } from '@/types/theme';

const logger = getLogger('ThemeValidationUtils', { category: LogCategory.THEME });

/**
 * Validate that critical theme CSS variables are present
 */
export function validateThemeVariables(): boolean {
  logger.debug('Validating theme variables');
  
  try {
    const styles = getComputedStyle(document.documentElement);
    const criticalVars = [
      '--impulse-bg-main',
      '--impulse-primary',
      '--impulse-text-primary'
    ];
    
    // Check if critical CSS variables are set
    const allVarsPresent = criticalVars.every(varName => {
      const value = styles.getPropertyValue(varName).trim();
      const isPresent = value !== '';
      
      if (!isPresent) {
        logger.warn(`Missing critical theme variable: ${varName}`);
      }
      
      return isPresent;
    });
    
    return allVarsPresent;
  } catch (error) {
    logger.error('Error validating theme variables', {
      details: { error }
    });
    return false;
  }
}

/**
 * Verify that fallback theme styling is applied
 */
export function assertThemeApplied(): boolean {
  try {
    const html = document.documentElement;
    const hasThemeClass = html.classList.contains('impulse-theme-active');
    const hasFallbackClass = html.classList.contains('theme-fallback-applied');
    
    return hasThemeClass || hasFallbackClass;
  } catch (error) {
    logger.error('Error checking theme application', {
      details: { error }
    });
    return false;
  }
}

/**
 * Apply emergency fallback styling
 */
export function applyEmergencyFallback(): void {
  try {
    logger.warn('Applying emergency fallback styling');
    
    // Apply the default theme immediately
    document.documentElement.classList.add('theme-fallback-applied');
    document.documentElement.classList.add('impulse-theme-active');
    
    // Force the browser to apply default colors immediately
    const bgColor = defaultImpulseTokens.colors.background.main;
    const textColor = defaultImpulseTokens.colors.text.primary;
    const primaryColor = defaultImpulseTokens.colors.primary;
    
    document.documentElement.style.backgroundColor = bgColor;
    document.documentElement.style.color = textColor;
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;
    
    // Set critical CSS variables
    document.documentElement.style.setProperty('--impulse-bg-main', bgColor);
    document.documentElement.style.setProperty('--impulse-primary', primaryColor);
    document.documentElement.style.setProperty('--impulse-text-primary', textColor);
    
    document.documentElement.setAttribute('data-theme-id', 'emergency-fallback');
    document.documentElement.setAttribute('data-theme-status', 'emergency-fallback');
    
    logger.info('Emergency fallback styling applied');
  } catch (error) {
    logger.error('Error applying emergency fallback', {
      details: { error }
    });
    
    // Last resort fallback - directly apply critical styles
    try {
      document.body.style.backgroundColor = '#12121A';
      document.body.style.color = '#F6F6F7';
    } catch (e) {
      // Nothing more we can do here
    }
  }
}

/**
 * Log current theme state for debugging
 */
export function logThemeState(): void {
  try {
    const html = document.documentElement;
    const styles = getComputedStyle(html);
    
    logger.debug('Current theme state', {
      details: {
        themeId: html.getAttribute('data-theme-id'),
        themeStatus: html.getAttribute('data-theme-status'),
        classList: Array.from(html.classList),
        bgColor: styles.backgroundColor,
        textColor: styles.color,
        impulseVars: {
          bgMain: styles.getPropertyValue('--impulse-bg-main'),
          primary: styles.getPropertyValue('--impulse-primary'),
          textPrimary: styles.getPropertyValue('--impulse-text-primary')
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
 * Validate a theme object
 */
export function validateTheme(theme: Theme | null): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!theme) {
    errors.push('Theme is null or undefined');
    return { valid: false, errors };
  }
  
  // Check required fields
  if (!theme.id) errors.push('Theme is missing id');
  if (!theme.name) errors.push('Theme is missing name');
  if (!theme.status) errors.push('Theme is missing status');
  
  // Check design tokens
  if (!theme.design_tokens) {
    errors.push('Theme is missing design_tokens');
  } else {
    // Check critical design token sections
    if (!theme.design_tokens.colors) errors.push('Theme is missing colors section');
    
    // Check critical color tokens
    const colors = theme.design_tokens.colors;
    if (colors) {
      if (!colors.primary) errors.push('Theme is missing primary color');
      if (!colors.background?.main) errors.push('Theme is missing background.main color');
      if (!colors.text?.primary) errors.push('Theme is missing text.primary color');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
