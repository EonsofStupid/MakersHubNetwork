
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const logger = getLogger('ColorUtils', { category: LogCategory.THEME });

/**
 * Validate if a string is a valid color
 */
export function validateColor(color: string): boolean {
  if (!color || typeof color !== 'string') {
    return false;
  }

  try {
    // Test with CSS syntax
    const s = new Option().style;
    s.color = color;
    return s.color !== '';
  } catch (e) {
    logger.warn('Error validating color', { 
      details: { color, error: e instanceof Error ? e.message : String(e) } 
    });
    return false;
  }
}

/**
 * Convert hex color to RGB string format
 * @param hex Hex color string like #RRGGBB or #RGB
 * @returns RGB components as "r, g, b" string
 */
export function hexToRgbString(hex: string): string {
  if (!hex || typeof hex !== 'string') {
    return '0, 0, 0'; // Default black
  }

  try {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Convert 3-digit hex to 6-digits
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    // Parse hex values
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    // Validate the result
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      logger.warn(`Invalid hex color: ${hex}, returning default`);
      return '0, 0, 0'; // Default black on error
    }

    return `${r}, ${g}, ${b}`;
  } catch (error) {
    logger.warn('Error converting hex to RGB', { 
      details: { hex, error: error instanceof Error ? error.message : String(error) }
    });
    return '0, 0, 0'; // Default black on error
  }
}

/**
 * Convert RGB values to hex string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  try {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  } catch (error) {
    logger.warn('Error converting RGB to hex', { 
      details: { r, g, b, error: error instanceof Error ? error.message : String(error) }
    });
    return '#000000'; // Default black
  }
}

/**
 * Parse color string (hex, rgb, rgba, named color) into RGB components
 * Returns an object with r, g, b properties
 */
export function parseColor(colorString: string): {r: number, g: number, b: number} | null {
  if (!colorString || typeof colorString !== 'string') {
    return null;
  }
  
  try {
    // Handle hex colors
    if (colorString.startsWith('#')) {
      const rgb = hexToRgbString(colorString).split(',').map(s => parseInt(s.trim()));
      return { r: rgb[0], g: rgb[1], b: rgb[2] };
    }
    
    // Handle rgb(r,g,b) or rgba(r,g,b,a)
    if (colorString.startsWith('rgb')) {
      const match = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
      if (match) {
        return {
          r: parseInt(match[1]),
          g: parseInt(match[2]),
          b: parseInt(match[3])
        };
      }
    }
    
    // For other colors, use the browser to parse
    const tempEl = document.createElement('div');
    tempEl.style.color = colorString;
    document.body.appendChild(tempEl);
    const computedColor = getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);
    
    // Parse the computed color
    const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3])
      };
    }
  } catch (error) {
    logger.warn('Error parsing color', { 
      details: { colorString, error: error instanceof Error ? error.message : String(error) }
    });
  }
  
  return null;
}

/**
 * Determine if a color is light or dark
 * Returns true for light colors, false for dark colors
 */
export function isLightColor(colorString: string): boolean {
  try {
    const color = parseColor(colorString);
    if (!color) return false;
    
    // Calculate luminance using the formula for perceived brightness
    // See: https://www.w3.org/TR/WCAG20/#relativeluminancedef
    const luminance = (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;
    
    // Threshold for light/dark determination (0.5 is middle, adjust as needed)
    return luminance > 0.5;
  } catch (error) {
    logger.warn('Error determining color brightness', { 
      details: { colorString, error: error instanceof Error ? error.message : String(error) }
    });
    return false; // Default to dark
  }
}

/**
 * Calculate a contrasting text color (black or white) for a given background color
 */
export function getContrastColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
}
