
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';
import { defaultImpulseTokens } from '@/admin/theme/impulse/tokens';

const logger = getLogger('ThemeValidation', { category: LogCategory.THEME });

/**
 * Validates that theme CSS variables are properly set on the document
 */
export function validateThemeVariables(): boolean {
  try {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Check critical CSS variables
    const criticalVariables = [
      '--background',
      '--foreground',
      '--primary',
      '--secondary',
      '--card',
      '--muted',
      '--accent',
      '--destructive',
      '--site-effect-color',
      '--color-primary'
    ];
    
    // Count how many variables are properly set
    let validVariables = 0;
    const missingVariables: string[] = [];
    
    criticalVariables.forEach(variable => {
      const value = computedStyle.getPropertyValue(variable).trim();
      if (value && value !== 'initial' && value !== 'inherit' && value !== 'unset') {
        validVariables++;
      } else {
        missingVariables.push(variable);
      }
    });
    
    const ratio = validVariables / criticalVariables.length;
    
    if (ratio < 1) {
      logger.warn(`Theme variables not fully applied. ${validVariables}/${criticalVariables.length} variables set.`, {
        details: { missingVariables }
      });
      return false;
    }
    
    logger.info('Theme variables validated successfully');
    return true;
  } catch (error) {
    logger.error('Error validating theme variables', { details: safeDetails(error) });
    return false;
  }
}

/**
 * Apply emergency fallback styling when theme fails to load
 */
export function applyEmergencyFallback(): void {
  try {
    logger.warn('Applying emergency fallback styling');
    
    const root = document.documentElement;
    
    // Apply critical colors directly from default tokens
    const bgColor = defaultImpulseTokens.colors?.background?.main || '#12121A';
    const textColor = defaultImpulseTokens.colors?.text?.primary || '#F6F6F7';
    const primaryColor = defaultImpulseTokens.colors?.primary || '#00F0FF';
    const secondaryColor = defaultImpulseTokens.colors?.secondary || '#FF2D6E';
    
    // Set basic colors
    root.style.setProperty('--background', '224 10% 9%'); // HSL equivalent of #12121A
    root.style.setProperty('--foreground', '220 6% 97%'); // HSL equivalent of #F6F6F7
    root.style.setProperty('--primary', '183 100% 50%'); // HSL equivalent of #00F0FF
    root.style.setProperty('--primary-foreground', '220 6% 97%');
    root.style.setProperty('--secondary', '341 100% 59%'); // HSL equivalent of #FF2D6E
    root.style.setProperty('--secondary-foreground', '220 6% 97%');
    root.style.setProperty('--muted', '224 16% 14%');
    root.style.setProperty('--muted-foreground', '222 14% 67%');
    root.style.setProperty('--accent', '224 32% 14%');
    root.style.setProperty('--accent-foreground', '220 6% 97%');
    root.style.setProperty('--destructive', '0 84% 60%');
    root.style.setProperty('--destructive-foreground', '220 6% 97%');
    root.style.setProperty('--card', '223 24% 14%');
    root.style.setProperty('--card-foreground', '220 6% 97%');
    root.style.setProperty('--border', '224 32% 14%');
    root.style.setProperty('--input', '224 32% 14%');
    root.style.setProperty('--ring', '223 19% 18%');
    
    // Apply direct RGB colors for effects
    root.style.setProperty('--site-effect-color', primaryColor);
    root.style.setProperty('--site-effect-secondary', secondaryColor);
    root.style.setProperty('--color-primary', '0, 240, 255');
    root.style.setProperty('--color-secondary', '255, 45, 110');
    
    // Apply transition speed variables
    root.style.setProperty('--transition-fast', '150ms');
    root.style.setProperty('--transition-normal', '300ms');
    root.style.setProperty('--transition-slow', '500ms');
    
    // Apply animation variables
    root.style.setProperty('--animation-fast', '1s');
    root.style.setProperty('--animation-normal', '2s');
    root.style.setProperty('--animation-slow', '3s');
    
    // Apply radius variables
    root.style.setProperty('--radius-sm', '0.25rem');
    root.style.setProperty('--radius-md', '0.5rem');
    root.style.setProperty('--radius-lg', '0.75rem');
    root.style.setProperty('--radius-full', '9999px');
    
    // Set direct background and color properties
    document.documentElement.style.backgroundColor = bgColor;
    document.documentElement.style.color = textColor;
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;
    
    // Set dark mode
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    
    // Add data attribute for tracking
    document.documentElement.setAttribute('data-theme-status', 'emergency-fallback');
    
    logger.info('Emergency fallback styling applied');
  } catch (error) {
    logger.error('Failed to apply emergency fallback styling', { details: safeDetails(error) });
  }
}

/**
 * Log the current theme state for debugging
 */
export function logThemeState(): void {
  try {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    const themeStatus = {
      isDarkMode: root.classList.contains('dark'),
      attributeStatus: root.getAttribute('data-theme-status'),
      attributeId: root.getAttribute('data-theme-id'),
      cssVariables: {
        background: computedStyle.getPropertyValue('--background').trim(),
        foreground: computedStyle.getPropertyValue('--foreground').trim(),
        primary: computedStyle.getPropertyValue('--primary').trim(),
        secondary: computedStyle.getPropertyValue('--secondary').trim(),
        card: computedStyle.getPropertyValue('--card').trim(),
        effectColor: computedStyle.getPropertyValue('--site-effect-color').trim(),
        colorPrimary: computedStyle.getPropertyValue('--color-primary').trim()
      }
    };
    
    logger.debug('Current theme state', { details: themeStatus });
  } catch (error) {
    logger.error('Error logging theme state', { details: safeDetails(error) });
  }
}

/**
 * Asserts that a theme is applied and returns true if applied
 */
export function assertThemeApplied(): boolean {
  try {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Check if critical variables are set
    const background = computedStyle.getPropertyValue('--background').trim();
    const primary = computedStyle.getPropertyValue('--primary').trim();
    const effectColor = computedStyle.getPropertyValue('--site-effect-color').trim();
    
    const isApplied = Boolean(background && primary && effectColor);
    
    if (!isApplied) {
      logger.warn('Theme not fully applied', {
        details: {
          background,
          primary,
          effectColor
        }
      });
    }
    
    return isApplied;
  } catch (error) {
    logger.error('Error asserting theme application', { details: safeDetails(error) });
    return false;
  }
}
