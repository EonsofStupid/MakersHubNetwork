
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { ensureStringValue } from './themeUtils';

const logger = getLogger('ColorUtils', { category: LogCategory.THEME });

/**
 * Safely extract an RGB color from any value including string, objects, etc.
 * @param color A color in any format
 * @returns RGB color string or fallback
 */
export function getRgbColor(color: any, fallback: string = 'rgb(0, 0, 0)'): string {
  try {
    // Handle the case where color might be an object with r,g,b properties
    if (color && typeof color === 'object' && 'r' in color && 'g' in color && 'b' in color) {
      return `rgb(${color.r}, ${color.g}, ${color.b})`;
    }
    
    // Convert to string safely
    const colorStr = ensureStringValue(color);
    if (!colorStr) return fallback;
    
    // If already in rgb format, return as is
    if (colorStr.startsWith('rgb')) {
      return colorStr;
    }
    
    // Convert hex to rgb
    if (colorStr.startsWith('#')) {
      return hexToRgb(colorStr) || fallback;
    }
    
    // Handle named colors by setting on a test element and reading computed style
    const testEl = document.createElement('div');
    testEl.style.color = colorStr;
    document.body.appendChild(testEl);
    const computedColor = getComputedStyle(testEl).color || fallback;
    document.body.removeChild(testEl);
    
    return computedColor;
  } catch (e) {
    logger.warn('Failed to get RGB color', {
      details: { input: color, error: e instanceof Error ? e.message : 'Unknown error' }
    });
    return fallback;
  }
}

/**
 * Convert hex color to RGB format
 */
export function hexToRgb(hex: string): string | null {
  try {
    const sanitizedHex = ensureStringValue(hex);
    if (!sanitizedHex.startsWith('#')) {
      return null;
    }
    
    let r = 0, g = 0, b = 0;
    
    // 3 digits
    if (sanitizedHex.length === 4) {
      r = parseInt(sanitizedHex[1] + sanitizedHex[1], 16);
      g = parseInt(sanitizedHex[2] + sanitizedHex[2], 16);
      b = parseInt(sanitizedHex[3] + sanitizedHex[3], 16);
    }
    // 6 digits
    else if (sanitizedHex.length === 7) {
      r = parseInt(sanitizedHex.substring(1, 3), 16);
      g = parseInt(sanitizedHex.substring(3, 5), 16);
      b = parseInt(sanitizedHex.substring(5, 7), 16);
    } else {
      return null;
    }
    
    return `rgb(${r}, ${g}, ${b})`;
  } catch (e) {
    logger.warn('Failed to convert hex to RGB', {
      details: { hex, error: e instanceof Error ? e.message : 'Unknown error' }
    });
    return null;
  }
}

/**
 * Convert hex to RGB string format for CSS variables
 */
export function hexToRgbString(hex: string): string {
  try {
    const color = ensureStringValue(hex);
    if (!color || !color.startsWith('#')) {
      return '0, 0, 0';
    }
    
    let r = 0, g = 0, b = 0;
    
    // 3 digits
    if (color.length === 4) {
      r = parseInt(color[1] + color[1], 16);
      g = parseInt(color[2] + color[2], 16);
      b = parseInt(color[3] + color[3], 16);
    }
    // 6 digits
    else if (color.length === 7) {
      r = parseInt(color.substring(1, 3), 16);
      g = parseInt(color.substring(3, 5), 16);
      b = parseInt(color.substring(5, 7), 16);
    } else {
      return '0, 0, 0';
    }
    
    return `${r}, ${g}, ${b}`;
  } catch (e) {
    logger.warn('Failed to convert hex to RGB string', {
      details: { hex, error: e instanceof Error ? e.message : 'Unknown error' }
    });
    return '0, 0, 0';
  }
}

/**
 * Convert RGB color to hex format
 */
export function rgbToHex(rgb: string): string {
  try {
    const colorStr = ensureStringValue(rgb);
    if (!colorStr.startsWith('rgb')) {
      return '#000000';
    }
    
    // Extract RGB values using regex
    const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return '#000000';
    
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  } catch (e) {
    logger.warn('Failed to convert RGB to hex', {
      details: { rgb, error: e instanceof Error ? e.message : 'Unknown error' }
    });
    return '#000000';
  }
}

/**
 * Check if a color is light or dark
 */
export function isLightColor(color: string): boolean {
  try {
    const colorStr = ensureStringValue(color);
    
    // Create a temporary element to compute the color
    const el = document.createElement('div');
    el.style.color = colorStr;
    document.body.appendChild(el);
    const computedColor = getComputedStyle(el).color;
    document.body.removeChild(el);
    
    // Extract RGB values using regex
    const match = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return false;
    
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5;
  } catch (e) {
    logger.warn('Failed to determine if color is light', {
      details: { color, error: e instanceof Error ? e.message : 'Unknown error' }
    });
    return false;
  }
}
