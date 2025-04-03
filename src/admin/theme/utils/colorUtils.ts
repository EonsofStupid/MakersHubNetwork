
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ColorUtils', LogCategory.THEME);

/**
 * Safely converts a hex color to RGB string for CSS variables
 * Handles any input type gracefully with robust error handling
 */
export function hexToRgbString(hex?: unknown): string {
  if (!hex) return '0, 0, 0';
  
  try {
    // Handle non-string inputs
    if (typeof hex !== 'string') {
      logger.warn(`Invalid hex value, expected string but got ${typeof hex}`);
      return '0, 0, 0';
    }
    
    // Handle RGB/RGBA format
    if (hex.startsWith('rgb')) {
      const matches = hex.match(/\d+/g);
      if (matches && matches.length >= 3) {
        return `${matches[0]}, ${matches[1]}, ${matches[2]}`;
      }
      return '0, 0, 0';
    }
    
    // Handle shorthand hex
    let color = hex.replace('#', '');
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    
    // Handle standard hex
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    
    // Handle invalid values
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      logger.warn(`Invalid hex color format: ${hex}`);
      return '0, 0, 0';
    }
    
    return `${r}, ${g}, ${b}`;
  } catch (error) {
    logger.error('Error processing color', { details: safeDetails({ color: hex, error }) });
    return '0, 0, 0';
  }
}

/**
 * Safely converts a hex color to HSL string for CSS variables
 * Handles any input type gracefully with robust error handling
 */
export function hexToHSL(hex: unknown): string {
  try {
    // Default fallback HSL value - HARDCODED
    const DEFAULT_HSL = '228 47% 8%'; // Dark background fallback
    
    // Handle empty or invalid inputs
    if (!hex || typeof hex !== 'string') {
      logger.warn(`Invalid hex value for HSL conversion: ${typeof hex}`, { 
        details: { value: hex }
      });
      return DEFAULT_HSL;
    }
    
    // Color-specific fallbacks
    if (hex.toLowerCase() === '#00f0ff') return '186 100% 50%'; // Primary cyan
    if (hex.toLowerCase() === '#ff2d6e') return '334 100% 59%'; // Secondary pink
    if (hex.toLowerCase() === '#8b5cf6') return '260 86% 66%'; // Tertiary purple
    if (hex.toLowerCase() === '#12121a') return '240 18% 9%';  // Dark background
    if (hex.toLowerCase() === '#f6f6f7') return '240 10% 96%'; // Light foreground
    
    // Handle rgba format (common in our theme)
    if (hex.startsWith('rgba')) {
      const rgbaMatch = hex.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)/);
      if (rgbaMatch) {
        const [_, rs, gs, bs, as] = rgbaMatch;
        const r = parseInt(rs) / 255;
        const g = parseInt(gs) / 255;
        const b = parseInt(bs) / 255;
        
        // Convert to HSL using the same algorithm below
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        
        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          
          h /= 6;
        }
        
        // Convert to the format needed by Tailwind HSL variables
        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);
        
        return `${h} ${s}% ${l}%`;
      }
      
      // If regex failed, return default
      return DEFAULT_HSL;
    }
    
    // Handle RGB format
    if (hex.startsWith('rgb')) {
      const rgbMatch = hex.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
      if (rgbMatch) {
        const [_, rs, gs, bs] = rgbMatch;
        const r = parseInt(rs) / 255;
        const g = parseInt(gs) / 255;
        const b = parseInt(bs) / 255;
        
        // Convert to HSL using the same algorithm
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        
        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          
          h /= 6;
        }
        
        // Convert to the format needed by Tailwind HSL variables
        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);
        
        return `${h} ${s}% ${l}%`;
      }
      
      return DEFAULT_HSL;
    }
    
    // Make sure we have a hex value
    if (!hex.startsWith('#')) {
      logger.warn(`Invalid hex format: ${hex}`);
      return DEFAULT_HSL;
    }
    
    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const formattedHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
      
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };
    
    const rgb = hexToRgb(hex);
    if (!rgb) {
      logger.warn(`Invalid hex color: ${hex}, using fallback`);
      return DEFAULT_HSL;
    }
    
    // Convert RGB to HSL
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    // Convert to the format needed by Tailwind HSL variables
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return `${h} ${s}% ${l}%`;
  } catch (error) {
    logger.error('Error converting hex to HSL:', { details: safeDetails(error) });
    return '228 47% 8%'; // Fallback
  }
}

/**
 * Determines if a color is dark based on its perceived brightness
 */
export function isColorDark(color: unknown): boolean {
  try {
    // Default to dark if we can't determine
    if (!color || typeof color !== 'string') return true;
    
    // For hex values
    if (color.startsWith('#')) {
      const hex = color.substring(1);
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance < 0.5;
    }
    
    // For rgb values
    if (color.startsWith('rgb')) {
      const rgbMatch = color.match(/\d+/g);
      if (rgbMatch && rgbMatch.length >= 3) {
        const [r, g, b] = rgbMatch.map(Number);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance < 0.5;
      }
    }
    
    // Default to dark for any other format
    return true;
  } catch (error) {
    logger.error('Error determining color brightness:', { details: safeDetails(error) });
    return true; // Default to dark on error
  }
}
