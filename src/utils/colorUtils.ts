
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const logger = getLogger('ColorUtils', { category: LogCategory.THEME });

/**
 * Convert a hex color to RGB components
 */
export function hexToRgb(hex: string): { r: number, g: number, b: number } {
  if (!hex) return { r: 0, g: 0, b: 0 };
  
  try {
    // Remove the hash if it exists
    hex = hex.replace(/^#/, '');
    
    // Handle rgba format
    if (hex.startsWith('rgba')) {
      const rgba = hex.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)/);
      if (rgba) {
        return {
          r: parseInt(rgba[1], 10),
          g: parseInt(rgba[2], 10),
          b: parseInt(rgba[3], 10)
        };
      }
      return { r: 0, g: 0, b: 0 };
    }
    
    // Handle rgb format
    if (hex.startsWith('rgb')) {
      const rgb = hex.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
      if (rgb) {
        return {
          r: parseInt(rgb[1], 10),
          g: parseInt(rgb[2], 10),
          b: parseInt(rgb[3], 10)
        };
      }
      return { r: 0, g: 0, b: 0 };
    }
    
    // Parse hex formats
    // Handle shorthand hex (#RGB)
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16)
      };
    }
    
    // Handle standard hex (#RRGGBB)
    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      };
    }
    
    // Log an error and return black as fallback
    logger.warn(`Invalid color format: ${hex}`);
    return { r: 0, g: 0, b: 0 };
  } catch (error) {
    logger.error('Error parsing color', { details: { hex, error } });
    return { r: 0, g: 0, b: 0 };
  }
}

/**
 * Convert RGB to HSL string format for CSS variables (tailwind format)
 */
export function hexToHSL(hex: string | undefined | null): string {
  if (!hex) return '0 0% 0%'; // Black as fallback
  
  try {
    const { r, g, b } = hexToRgb(hex);
    
    // Convert RGB to HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case rNorm:
          h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
          break;
        case gNorm:
          h = (bNorm - rNorm) / d + 2;
          break;
        case bNorm:
          h = (rNorm - gNorm) / d + 4;
          break;
      }
      
      h = h * 60;
    }
    
    // Format as "H S% L%" for Tailwind CSS
    return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  } catch (error) {
    logger.error('Error converting hex to HSL', { details: { hex, error } });
    return '0 0% 0%'; // Black as fallback
  }
}

/**
 * Convert hex to RGB string (format: "r, g, b")
 */
export function hexToRgbString(hex: string | undefined | null): string {
  if (!hex) return '0, 0, 0';
  
  try {
    const rgb = hexToRgb(hex);
    return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  } catch (error) {
    logger.error('Error converting hex to RGB string', { details: { hex, error } });
    return '0, 0, 0';
  }
}

/**
 * Create a rgba color string from hex and opacity
 */
export function hexToRgba(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * Lighten a hex color by a percentage
 */
export function lightenColor(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  
  const amount = Math.round(2.55 * percent);
  
  const newR = Math.min(255, r + amount);
  const newG = Math.min(255, g + amount);
  const newB = Math.min(255, b + amount);
  
  return rgbToHex({ r: newR, g: newG, b: newB });
}

/**
 * Darken a hex color by a percentage
 */
export function darkenColor(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  
  const amount = Math.round(2.55 * percent);
  
  const newR = Math.max(0, r - amount);
  const newG = Math.max(0, g - amount);
  const newB = Math.max(0, b - amount);
  
  return rgbToHex({ r: newR, g: newG, b: newB });
}

/**
 * Convert RGB components to hex color
 */
export function rgbToHex({ r, g, b }: { r: number, g: number, b: number }): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Check if a color is dark (for determining contrasting text color)
 */
export function isColorDark(hex: string): boolean {
  if (!hex) return true; // Default to dark if no color provided
  
  try {
    const { r, g, b } = hexToRgb(hex);
    
    // Calculate perceived brightness according to YIQ formula
    // This gives better results than average or simple luminance
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Colors with brightness < 128 are considered dark
    return brightness < 128;
  } catch (error) {
    logger.error('Error checking if color is dark', { details: { hex, error } });
    return true; // Default to dark if there's an error
  }
}

/**
 * Get a contrasting text color (black or white) based on background
 */
export function getContrastColor(bgHex: string): string {
  return isColorDark(bgHex) ? '#FFFFFF' : '#000000';
}

/**
 * Convert HSL values to hex color
 */
export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
