
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('ColorUtils', { category: LogCategory.THEME as string });

/**
 * Validates and ensures a string is a valid hex color
 * If invalid, returns the fallback color
 */
export function ensureHexColor(value: any, fallback: string = '#12121A'): string {
  if (typeof value !== 'string') {
    logger.warn('Non-string value provided to ensureHexColor', { 
      details: { value, type: typeof value } 
    });
    return fallback;
  }
  
  // Trim the value
  const trimmed = value.trim();
  
  // Check for valid hex format: #RGB or #RRGGBB
  const hexRegex = /^#([A-Fa-f0-9]{3}){1,2}$/;
  if (!hexRegex.test(trimmed)) {
    logger.warn('Invalid hex color format', { details: { value: trimmed } });
    return fallback;
  }
  
  return trimmed;
}

/**
 * Converts a hex color to an RGB array
 */
export function hexToRgb(hex: string): [number, number, number] {
  // Ensure valid hex color
  hex = ensureHexColor(hex);
  
  try {
    // Remove the hash
    let color = hex.substring(1);
    
    // Convert 3-digit hex to 6-digit
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    
    // Convert to RGB values
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    
    return [r, g, b];
  } catch (error) {
    logger.error('Error converting hex to RGB', { details: safeDetails(error) });
    return [0, 0, 0]; // Black as fallback
  }
}

/**
 * Converts a hex color to an RGB string (for CSS)
 */
export function hexToRgbString(hex: string): string {
  try {
    const [r, g, b] = hexToRgb(hex);
    return `${r}, ${g}, ${b}`;
  } catch (error) {
    logger.error('Error converting hex to RGB string', { details: safeDetails(error) });
    return '0, 0, 0'; // Black as fallback
  }
}

/**
 * Converts a hex color to an HSL string (for CSS)
 */
export function hexToHSL(hex: string): string {
  try {
    // Ensure valid hex color
    hex = ensureHexColor(hex);
    
    const [r, g, b] = hexToRgb(hex);
    
    // Convert RGB to HSL
    const rNormalized = r / 255;
    const gNormalized = g / 255;
    const bNormalized = b / 255;
    
    const max = Math.max(rNormalized, gNormalized, bNormalized);
    const min = Math.min(rNormalized, gNormalized, bNormalized);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case rNormalized:
          h = (gNormalized - bNormalized) / d + (gNormalized < bNormalized ? 6 : 0);
          break;
        case gNormalized:
          h = (bNormalized - rNormalized) / d + 2;
          break;
        case bNormalized:
          h = (rNormalized - gNormalized) / d + 4;
          break;
      }
      
      h /= 6;
    }
    
    // Convert to degrees and percentages
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    const lPercent = Math.round(l * 100);
    
    return `${h} ${s}% ${lPercent}%`;
  } catch (error) {
    logger.error('Error converting hex to HSL', { details: safeDetails(error) });
    return '224 10% 9%'; // Default dark background as fallback
  }
}

/**
 * Determines if a color is dark or light
 * @returns true if the color is dark, false if it's light
 */
export function isColorDark(hex: string): boolean {
  try {
    // Ensure valid hex color
    hex = ensureHexColor(hex);
    
    const [r, g, b] = hexToRgb(hex);
    
    // Calculate perceived brightness using the YIQ formula
    // This formula accounts for human perception of colors
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    // YIQ < 128 is considered dark
    return yiq < 128;
  } catch (error) {
    logger.error('Error determining if color is dark', { details: safeDetails(error) });
    return true; // Default to dark mode on error
  }
}

/**
 * Adjusts a color's lightness
 * @param hex Hex color
 * @param amount Amount to adjust (-100 to 100)
 */
export function adjustColorLightness(hex: string, amount: number): string {
  try {
    // Ensure valid hex color
    hex = ensureHexColor(hex);
    
    // Parse the HSL value
    const hslString = hexToHSL(hex);
    const [h, s, l] = hslString.split(' ').map(part => parseInt(part));
    
    // Adjust lightness
    let newL = l + amount;
    newL = Math.min(Math.max(newL, 0), 100); // Clamp between 0-100
    
    return `${h} ${s} ${newL}%`;
  } catch (error) {
    logger.error('Error adjusting color lightness', { details: safeDetails(error) });
    return hexToHSL(hex); // Return original color on error
  }
}

/**
 * Creates a color palette from a base color
 */
export function generateColorPalette(baseColor: string): Record<string, string> {
  try {
    // Ensure valid hex color
    baseColor = ensureHexColor(baseColor);
    
    return {
      50: adjustColorLightness(baseColor, 45),
      100: adjustColorLightness(baseColor, 40),
      200: adjustColorLightness(baseColor, 30),
      300: adjustColorLightness(baseColor, 20),
      400: adjustColorLightness(baseColor, 10),
      500: hexToHSL(baseColor), // Base color
      600: adjustColorLightness(baseColor, -10),
      700: adjustColorLightness(baseColor, -20),
      800: adjustColorLightness(baseColor, -30),
      900: adjustColorLightness(baseColor, -40),
      950: adjustColorLightness(baseColor, -45),
    };
  } catch (error) {
    logger.error('Error generating color palette', { details: safeDetails(error) });
    
    // Return fallback palette
    const fallbackBase = hexToHSL('#00F0FF');
    return {
      50: '183 100% 95%',
      100: '183 100% 90%',
      200: '183 100% 80%',
      300: '183 100% 70%',
      400: '183 100% 60%',
      500: fallbackBase,
      600: '183 100% 40%',
      700: '183 100% 30%',
      800: '183 100% 20%',
      900: '183 100% 10%',
      950: '183 100% 5%',
    };
  }
}
