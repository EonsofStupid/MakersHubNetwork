
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { ensureStringValue } from './themeUtils';

const logger = getLogger('ColorUtils', { category: LogCategory.THEME });

/**
 * Type guard to check if a value is a potential color object
 */
function isColorObject(obj: any): boolean {
  return obj && 
         typeof obj === 'object' && 
         !Array.isArray(obj) &&
         ('main' in obj || ('r' in obj && 'g' in obj && 'b' in obj));
}

/**
 * Type guard to check if a value is an RGB object
 */
function isRgbObject(obj: any): boolean {
  return obj && 
         typeof obj === 'object' && 
         'r' in obj && 'g' in obj && 'b' in obj &&
         typeof obj.r === 'number' && 
         typeof obj.g === 'number' && 
         typeof obj.b === 'number';
}

/**
 * Type guard to check if a value is a hex color string
 */
function isHexColorString(value: any): value is string {
  return typeof value === 'string' && /^#([0-9A-F]{3}){1,2}$/i.test(value);
}

/**
 * Type guard to check if a value is an rgb color string
 */
function isRgbColorString(value: any): value is string {
  return typeof value === 'string' && /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.test(value);
}

/**
 * Safely extract an RGB color from any value including string, objects, etc.
 * @param color A color in any format
 * @returns RGB color string or fallback
 */
export function getRgbColor(color: any, fallback: string = 'rgb(0, 0, 0)'): string {
  try {
    // Handle empty values
    if (color === null || color === undefined) {
      return fallback;
    }
    
    // Handle RGB object directly
    if (isRgbObject(color)) {
      return `rgb(${color.r}, ${color.g}, ${color.b})`;
    }
    
    // Handle color object with main property
    if (isColorObject(color) && 'main' in color) {
      return getRgbColor(color.main, fallback);
    }
    
    // Convert to string safely
    const colorStr = ensureStringValue(color);
    if (!colorStr) {
      return fallback;
    }
    
    // If already in rgb format, return as is
    if (colorStr.startsWith('rgb')) {
      return colorStr;
    }
    
    // Convert hex to rgb
    if (colorStr.startsWith('#')) {
      const rgb = hexToRgb(colorStr);
      return rgb || fallback;
    }
    
    // Handle named colors by setting on a test element and reading computed style
    try {
      const testEl = document.createElement('div');
      testEl.style.color = colorStr;
      document.body.appendChild(testEl);
      const computedColor = getComputedStyle(testEl).color || fallback;
      document.body.removeChild(testEl);
      
      return computedColor;
    } catch (domErr) {
      logger.warn('DOM approach for color conversion failed', {
        details: { input: color, error: domErr instanceof Error ? domErr.message : 'Unknown error' }
      });
      return fallback;
    }
  } catch (e) {
    logger.warn('Failed to get RGB color', {
      details: { input: color, error: e instanceof Error ? e.message : 'Unknown error' }
    });
    return fallback;
  }
}

/**
 * Convert hex color to RGB format with improved validation
 */
export function hexToRgb(hex: string): string | null {
  try {
    // Validate input
    if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
      return null;
    }
    
    const sanitizedHex = hex.trim();
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
      logger.warn('Invalid hex color length', { details: { hex } });
      return null;
    }
    
    // Validate RGB values
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      logger.warn('Invalid hex color format', { details: { hex } });
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
 * This function now has robust type handling to prevent errors
 */
export function hexToRgbString(hex: any): string {
  try {
    // Handle null/undefined cases
    if (hex === null || hex === undefined) {
      return '0, 0, 0';
    }
    
    // Handle RGB object directly
    if (isRgbObject(hex)) {
      return `${hex.r}, ${hex.g}, ${hex.b}`;
    }
    
    // Handle color object with main property
    if (isColorObject(hex) && 'main' in hex) {
      return hexToRgbString(hex.main);
    }
    
    // Convert to string if needed
    const color = typeof hex === 'string' ? hex.trim() : String(hex).trim();
    
    // Handle RGB string format: "rgb(0, 0, 0)"
    if (color.startsWith('rgb(')) {
      const matches = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (matches && matches.length >= 4) {
        return `${matches[1]}, ${matches[2]}, ${matches[3]}`;
      }
    }
    
    // Return early if not a valid hex color
    if (!color.startsWith('#')) {
      logger.debug('Not a hex color, returning default', { details: { input: hex } });
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
    
    // Validate RGB values
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      logger.warn('Invalid hex values', { details: { hex } });
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
    // Validate input
    if (!rgb || typeof rgb !== 'string') {
      return '#000000';
    }
    
    // Extract RGB values using regex
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match || match.length < 4) {
      logger.warn('Invalid rgb format', { details: { rgb } });
      return '#000000';
    }
    
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    
    // Validate RGB values
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      logger.warn('Invalid rgb values', { details: { rgb } });
      return '#000000';
    }
    
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
export function isLightColor(color: any): boolean {
  try {
    // Handle null/undefined
    if (color === null || color === undefined) {
      return false;
    }
    
    // Handle string
    const colorStr = ensureStringValue(color);
    if (!colorStr) {
      return false;
    }
    
    // Using DOM API for accurate color computation
    const el = document.createElement('div');
    el.style.color = colorStr;
    document.body.appendChild(el);
    const computedColor = getComputedStyle(el).color;
    document.body.removeChild(el);
    
    // Extract RGB values using regex
    const match = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match || match.length < 4) {
      logger.warn('Could not extract RGB values', { details: { computedColor } });
      return false;
    }
    
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      logger.warn('Invalid RGB values', { details: { r, g, b } });
      return false;
    }
    
    // Calculate relative luminance - standard formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5;
  } catch (e) {
    logger.warn('Failed to determine if color is light', {
      details: { color, error: e instanceof Error ? e.message : 'Unknown error' }
    });
    return false;
  }
}

/**
 * Validate if a string is a valid color in any format
 */
export function validateColor(colorValue: any): boolean {
  if (!colorValue) return false;
  
  try {
    // Convert to string if needed
    const color = ensureStringValue(colorValue);
    
    // Create a test element to check if the color is valid
    const testEl = document.createElement('div');
    testEl.style.color = color;
    
    return !!testEl.style.color;
  } catch (error) {
    return false;
  }
}

/**
 * Parse color string into RGB components
 */
export function parseColor(color: string): { r: number, g: number, b: number, a?: number } | null {
  try {
    if (!color || typeof color !== 'string') {
      return null;
    }
    
    // Handle hex format
    if (color.startsWith('#')) {
      const hex = color.substring(1);
      let r, g, b;
      
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      } else {
        return null;
      }
      
      return { r, g, b };
    }
    
    // Handle rgb/rgba format
    if (color.startsWith('rgb')) {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (!match) return null;
      
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      const a = match[4] ? parseFloat(match[4]) : undefined;
      
      return { r, g, b, a };
    }
    
    // For named colors, use DOM API
    const el = document.createElement('div');
    el.style.color = color;
    document.body.appendChild(el);
    const computedColor = getComputedStyle(el).color;
    document.body.removeChild(el);
    
    const match = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return null;
    
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const a = match[4] ? parseFloat(match[4]) : undefined;
    
    return { r, g, b, a };
  } catch (e) {
    logger.warn('Failed to parse color', {
      details: { color, error: e instanceof Error ? e.message : 'Unknown error' }
    });
    return null;
  }
}
