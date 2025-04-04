
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { EMERGENCY_COLORS } from '@/admin/theme/constants';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ThemeValidation', { category: LogCategory.THEME });

/**
 * Validate that critical theme variables are properly set
 */
export function validateThemeVariables(): boolean {
  try {
    const root = document.documentElement;
    const criticalVars = [
      { name: '--color-primary', value: getComputedStyle(root).getPropertyValue('--color-primary').trim() },
      { name: '--color-background', value: getComputedStyle(root).getPropertyValue('--color-background').trim() },
      { name: '--color-foreground', value: getComputedStyle(root).getPropertyValue('--color-foreground').trim() }
    ];
    
    const missingVars = criticalVars.filter(v => !v.value);
    
    if (missingVars.length > 0) {
      logger.warn('Critical theme variables missing:', { 
        details: { missingVars: missingVars.map(v => v.name) } 
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
 * Apply emergency fallback for critical styling
 */
export function applyEmergencyFallback(): void {
  try {
    const root = document.documentElement;
    
    // Apply critical colors directly
    root.style.backgroundColor = '#12121A';
    root.style.color = '#F6F6F7';
    document.body.style.backgroundColor = '#12121A';
    document.body.style.color = '#F6F6F7';
    
    // Set critical CSS variables
    root.style.setProperty('--color-primary', '#00F0FF');
    root.style.setProperty('--color-secondary', '#FF2D6E');
    root.style.setProperty('--color-accent', '#8B5CF6');
    root.style.setProperty('--color-background', '#12121A');
    root.style.setProperty('--color-foreground', '#F6F6F7');
    
    // Add RGB versions
    root.style.setProperty('--color-primary-rgb', '0, 240, 255');
    root.style.setProperty('--color-secondary-rgb', '255, 45, 110');
    
    // Add emergency classes
    root.classList.add('theme-emergency');
    root.classList.add('theme-fallback-active');
    
    logger.info('Emergency fallback styling applied');
  } catch (error) {
    logger.error('Critical failure applying emergency fallback', {
      details: safeDetails(error)
    });
    console.error('Critical theme failure:', error);
  }
}

/**
 * Log the current theme state for debugging
 */
export function logThemeState(): void {
  try {
    const root = document.documentElement;
    const themeState = {
      primaryColor: getComputedStyle(root).getPropertyValue('--color-primary').trim(),
      backgroundColor: getComputedStyle(root).getPropertyValue('--color-background').trim(),
      foregroundColor: getComputedStyle(root).getPropertyValue('--color-foreground').trim(),
      themeId: root.getAttribute('data-theme-id'),
      themeStatus: root.getAttribute('data-theme-status'),
      classes: Array.from(root.classList)
    };
    
    logger.debug('Current theme state', { details: themeState });
  } catch (error) {
    logger.error('Error logging theme state', {
      details: safeDetails(error)
    });
  }
}

/**
 * Verify theme is properly applied - return true if it is, false if not
 */
export function assertThemeApplied(): boolean {
  try {
    const root = document.documentElement;
    
    // Check if critical variables are set
    const primary = getComputedStyle(root).getPropertyValue('--color-primary').trim();
    const background = getComputedStyle(root).getPropertyValue('--color-background').trim();
    
    if (!primary || !background) {
      logger.warn('Theme not properly applied, missing critical variables');
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error verifying theme application', {
      details: safeDetails(error)
    });
    return false;
  }
}

/**
 * Get color contrast ratio between two colors
 * Useful for determining if text will be readable
 */
export function getContrastRatio(color1: string, color2: string): number {
  try {
    // Create elements to compute colors
    const el1 = document.createElement('div');
    el1.style.color = color1;
    document.body.appendChild(el1);
    const computedColor1 = getComputedStyle(el1).color;
    document.body.removeChild(el1);
    
    const el2 = document.createElement('div');
    el2.style.color = color2;
    document.body.appendChild(el2);
    const computedColor2 = getComputedStyle(el2).color;
    document.body.removeChild(el2);
    
    // Extract RGB values
    const rgb1 = computedColor1.match(/\d+/g)?.map(Number) || [0, 0, 0];
    const rgb2 = computedColor2.match(/\d+/g)?.map(Number) || [0, 0, 0];
    
    // Calculate luminance
    const luminance1 = calculateLuminance(rgb1[0], rgb1[1], rgb1[2]);
    const luminance2 = calculateLuminance(rgb2[0], rgb2[1], rgb2[2]);
    
    // Calculate contrast ratio
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  } catch (error) {
    logger.error('Error calculating contrast ratio', {
      details: safeDetails(error)
    });
    return 0;
  }
}

/**
 * Calculate relative luminance of an RGB color
 * Used for contrast ratio calculation
 */
function calculateLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
