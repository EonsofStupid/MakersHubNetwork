
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ColorUtils', { category: LogCategory.THEME });

/**
 * Check if a color is dark based on its luminance
 */
export function isColorDark(color: string): boolean {
  try {
    // Extract RGB values
    let r: number;
    let g: number;
    let b: number;
    
    // Handle different color formats
    if (color.startsWith('#')) {
      // Hex format
      const hex = color.slice(1);
      
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      } else {
        // Invalid hex, assume dark
        return true;
      }
    } else if (color.startsWith('rgba')) {
      // RGBA format
      const match = color.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*[\d.]+\s*\)/);
      if (match) {
        r = parseInt(match[1], 10);
        g = parseInt(match[2], 10);
        b = parseInt(match[3], 10);
      } else {
        // Invalid rgba, assume dark
        return true;
      }
    } else if (color.startsWith('rgb')) {
      // RGB format
      const match = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
      if (match) {
        r = parseInt(match[1], 10);
        g = parseInt(match[2], 10);
        b = parseInt(match[3], 10);
      } else {
        // Invalid rgb, assume dark
        return true;
      }
    } else {
      // Unknown format, assume dark
      return true;
    }
    
    // Calculate luminance using the formula for relative luminance
    // https://www.w3.org/TR/WCAG20/#relativeluminancedef
    
    const sRGB = [r / 255, g / 255, b / 255];
    const rgb = sRGB.map(val => {
      if (val <= 0.03928) {
        return val / 12.92;
      }
      return Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    const luminance = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    
    // Theme is considered dark if luminance is below 0.5
    return luminance < 0.5;
  } catch (error) {
    logger.error('Error determining if color is dark', { details: safeDetails(error) });
    // Default to dark if error
    return true;
  }
}

/**
 * Convert hex color to HSL string for CSS variables
 */
export function hexToHSL(hex: string): string {
  try {
    // Default colors if parsing fails
    if (!hex || typeof hex !== 'string') {
      return 'hsl(0, 0%, 0%)';
    }
    
    // Handle different formats
    let r: number;
    let g: number;
    let b: number;
    
    if (hex.startsWith('#')) {
      const cleanHex = hex.slice(1);
      
      if (cleanHex.length === 3) {
        r = parseInt(cleanHex[0] + cleanHex[0], 16);
        g = parseInt(cleanHex[1] + cleanHex[1], 16);
        b = parseInt(cleanHex[2] + cleanHex[2], 16);
      } else if (cleanHex.length === 6) {
        r = parseInt(cleanHex.slice(0, 2), 16);
        g = parseInt(cleanHex.slice(2, 4), 16);
        b = parseInt(cleanHex.slice(4, 6), 16);
      } else {
        // Invalid hex, return black
        return 'hsl(0, 0%, 0%)';
      }
    } else if (hex.startsWith('rgb')) {
      const match = hex.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/);
      if (match) {
        r = parseInt(match[1], 10);
        g = parseInt(match[2], 10);
        b = parseInt(match[3], 10);
      } else {
        // Invalid rgb, return black
        return 'hsl(0, 0%, 0%)';
      }
    } else {
      // Unknown format, return black
      return 'hsl(0, 0%, 0%)';
    }
    
    // Convert RGB to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      
      h *= 60;
    }
    
    // Round values
    h = Math.round(h);
    s = Math.round(s * 100);
    const lightness = Math.round(l * 100);
    
    return `${h} ${s}% ${lightness}%`;
  } catch (error) {
    logger.error('Error converting hex to HSL', { details: safeDetails(error) });
    return 'hsl(0, 0%, 0%)';
  }
}

/**
 * Convert hex color to RGB string for CSS variables
 */
export function hexToRgbString(hex: string): string {
  try {
    if (!hex || typeof hex !== 'string') {
      return '0, 0, 0';
    }
    
    let r: number;
    let g: number;
    let b: number;
    
    if (hex.startsWith('#')) {
      const cleanHex = hex.slice(1);
      
      if (cleanHex.length === 3) {
        r = parseInt(cleanHex[0] + cleanHex[0], 16);
        g = parseInt(cleanHex[1] + cleanHex[1], 16);
        b = parseInt(cleanHex[2] + cleanHex[2], 16);
      } else if (cleanHex.length === 6) {
        r = parseInt(cleanHex.slice(0, 2), 16);
        g = parseInt(cleanHex.slice(2, 4), 16);
        b = parseInt(cleanHex.slice(4, 6), 16);
      } else {
        return '0, 0, 0';
      }
    } else if (hex.startsWith('rgb')) {
      const match = hex.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/);
      if (match) {
        r = parseInt(match[1], 10);
        g = parseInt(match[2], 10);
        b = parseInt(match[3], 10);
      } else {
        return '0, 0, 0';
      }
    } else {
      return '0, 0, 0';
    }
    
    return `${r}, ${g}, ${b}`;
  } catch (error) {
    logger.error('Error converting hex to RGB string', { details: safeDetails(error) });
    return '0, 0, 0';
  }
}
