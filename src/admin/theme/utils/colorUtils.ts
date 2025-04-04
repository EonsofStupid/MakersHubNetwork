
/**
 * Color utility functions for theme system
 */

import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const logger = getLogger('ColorUtils', { category: LogCategory.THEME });

/**
 * Convert hex color to RGB string format (e.g. "255, 0, 0")
 * @param hex - Hex color string (e.g. "#FF0000")
 * @returns RGB string in format "r, g, b" or fallback on error
 */
export function hexToRgbString(hex: string, fallback = '0, 0, 0'): string {
  try {
    // Handle invalid input gracefully
    if (!hex || typeof hex !== 'string') {
      return fallback;
    }
    
    // Normalize hex format
    let normalizedHex = hex.trim();
    if (!normalizedHex.startsWith('#')) {
      normalizedHex = '#' + normalizedHex;
    }
    
    // Convert 3-digit hex to 6-digit
    if (normalizedHex.length === 4) {
      normalizedHex = '#' + normalizedHex[1] + normalizedHex[1] + normalizedHex[2] + normalizedHex[2] + normalizedHex[3] + normalizedHex[3];
    }
    
    // Verify hex string format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(normalizedHex)) {
      logger.warn(`Invalid hex color format: ${hex}, using fallback`);
      return fallback;
    }
    
    // Extract RGB components
    const r = parseInt(normalizedHex.substring(1, 3), 16);
    const g = parseInt(normalizedHex.substring(3, 5), 16);
    const b = parseInt(normalizedHex.substring(5, 7), 16);
    
    // Validate RGB values
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return fallback;
    }
    
    return `${r}, ${g}, ${b}`;
  } catch (error) {
    logger.warn('Error converting hex to RGB', {
      details: { hex, error: error instanceof Error ? error.message : 'Unknown error' }
    });
    return fallback;
  }
}

/**
 * Convert hex color to RGBA color string
 * @param hex - Hex color string (e.g. "#FF0000")
 * @param alpha - Alpha value (0-1)
 * @returns RGBA string in format "rgba(r, g, b, a)" or fallback on error
 */
export function hexToRgba(hex: string, alpha = 1, fallback = 'rgba(0, 0, 0, 1)'): string {
  try {
    const rgbString = hexToRgbString(hex);
    if (rgbString === '0, 0, 0' && hex !== '#000000') {
      return fallback;
    }
    
    // Ensure alpha is between 0 and 1
    const safeAlpha = Math.max(0, Math.min(1, alpha));
    
    return `rgba(${rgbString}, ${safeAlpha})`;
  } catch (error) {
    logger.warn('Error converting hex to RGBA', {
      details: { hex, alpha, error: error instanceof Error ? error.message : 'Unknown error' }
    });
    return fallback;
  }
}

/**
 * Validate if a string is a valid color in any CSS color format
 */
export function validateColor(color: string): boolean {
  if (!color || typeof color !== 'string') {
    return false;
  }
  
  try {
    // Create a test element to verify the color
    const testElement = document.createElement('div');
    testElement.style.color = color;
    
    return testElement.style.color !== '';
  } catch (error) {
    return false;
  }
}

/**
 * Generate a lighter variant of a color
 */
export function lightenColor(hex: string, amount = 0.2): string {
  try {
    if (!hex || typeof hex !== 'string') {
      return hex;
    }
    
    // Convert to RGB first
    let rgbString = hexToRgbString(hex);
    let [r, g, b] = rgbString.split(',').map(c => parseInt(c.trim(), 10));
    
    // Calculate lighter values
    r = Math.min(255, Math.round(r + (255 - r) * amount));
    g = Math.min(255, Math.round(g + (255 - g) * amount));
    b = Math.min(255, Math.round(b + (255 - b) * amount));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  } catch (error) {
    logger.warn('Error lightening color', {
      details: { hex, amount, error: error instanceof Error ? error.message : 'Unknown error' }
    });
    return hex;
  }
}

/**
 * Generate a darker variant of a color
 */
export function darkenColor(hex: string, amount = 0.2): string {
  try {
    if (!hex || typeof hex !== 'string') {
      return hex;
    }
    
    // Convert to RGB first
    let rgbString = hexToRgbString(hex);
    let [r, g, b] = rgbString.split(',').map(c => parseInt(c.trim(), 10));
    
    // Calculate darker values
    r = Math.max(0, Math.round(r * (1 - amount)));
    g = Math.max(0, Math.round(g * (1 - amount)));
    b = Math.max(0, Math.round(b * (1 - amount)));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  } catch (error) {
    logger.warn('Error darkening color', {
      details: { hex, amount, error: error instanceof Error ? error.message : 'Unknown error' }
    });
    return hex;
  }
}
