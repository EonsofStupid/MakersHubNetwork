
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const logger = getLogger('colorUtils', { category: LogCategory.THEME });

/**
 * Convert hex color to RGB format
 * @param hex Hex color (e.g. #FF0000)
 * @returns RGB string (e.g. "255, 0, 0")
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  try {
    // Default fallback
    if (!hex || typeof hex !== 'string') {
      return { r: 0, g: 240, b: 255 }; // Default cyan
    }
    
    // Handle different hex formats
    let cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    
    // Handle shorthand hex (#RGB)
    if (cleanHex.length === 3) {
      cleanHex = cleanHex
        .split('')
        .map(char => char + char)
        .join('');
    }
    
    // Convert to RGB
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      logger.warn(`Invalid hex color: ${hex}, using fallback`);
      return { r: 0, g: 240, b: 255 }; // Default cyan
    }
    
    return { r, g, b };
  } catch (error) {
    logger.error(`Error converting hex to RGB: ${hex}`, {
      details: { error }
    });
    return { r: 0, g: 240, b: 255 }; // Default cyan on error
  }
}

/**
 * Convert hex color to RGB string format for CSS variables
 * @param hex Hex color (e.g. #FF0000)
 * @returns RGB string (e.g. "255, 0, 0")
 */
export function hexToRgbString(hex: string): string {
  const rgb = hexToRgb(hex);
  return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '0, 240, 255'; // Default cyan on error
}

/**
 * Get contrasting text color (black or white) for a background color
 * @param hexColor Background color in hex
 * @returns '#FFFFFF' or '#000000' depending on contrast
 */
export function getContrastColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  
  if (!rgb) return '#FFFFFF'; // Default to white on error
  
  // Calculate perceived brightness using the formula:
  // (R * 0.299 + G * 0.587 + B * 0.114)
  // If value > 186, use black text; otherwise, use white
  const brightness = (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114);
  
  return brightness > 186 ? '#000000' : '#FFFFFF';
}

/**
 * Adjust color lightness
 * @param hex Hex color
 * @param percent Percentage to lighten (positive) or darken (negative)
 * @returns Modified hex color
 */
export function adjustColorLightness(hex: string, percent: number): string {
  try {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    
    // Convert to HSL
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
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
      
      h /= 6;
    }
    
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    const lightness = Math.round(l * 100);
    
    // Adjust lightness
    const newLightness = Math.max(0, Math.min(100, lightness + percent));
    
    // Convert back to RGB and then to hex
    return hslToHex(h, s, newLightness);
  } catch (error) {
    logger.error(`Error adjusting color lightness: ${hex}`, {
      details: { error, percent }
    });
    return hex; // Return original color on error
  }
}

/**
 * Convert HSL to hex
 */
function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
