
import { getLogger } from '@/logging';

const logger = getLogger('ColorUtils');

/**
 * Convert hex color to RGB object
 */
export function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  if (!hex || typeof hex !== 'string') return null;
  
  // Default fallback
  const fallback = { r: 0, g: 0, b: 0 };
  
  // Remove any leading #
  hex = hex.replace(/^#/, '');
  
  // Handle different hex formats
  if (hex.length === 6) {
    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      };
    }
  } 
  
  // Handle shorthand hex format (#FFF)
  if (hex.length === 3) {
    const result = /^([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
    if (result) {
      return {
        r: parseInt(result[1] + result[1], 16),
        g: parseInt(result[2] + result[2], 16),
        b: parseInt(result[3] + result[3], 16)
      };
    }
  }
  
  // Handle rgba() format
  const rgbaMatch = hex.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([0-9.]+))?\s*\)/);
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1], 10),
      g: parseInt(rgbaMatch[2], 10),
      b: parseInt(rgbaMatch[3], 10)
    };
  }
  
  logger.warn(`Failed to parse color: ${hex}, using fallback`);
  return fallback;
}

/**
 * Convert hex to RGB string format (e.g., "255, 255, 255")
 */
export function hexToRgbString(hex: string): string {
  const rgb = hexToRgb(hex);
  return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '0, 0, 0';
}

/**
 * Convert hex to RGBA string
 */
export function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` : `rgba(0, 0, 0, ${alpha})`;
}

/**
 * Convert hex color to HSL string for Tailwind CSS variables
 * Format: "228 47% 8%"
 */
export function hexToHSL(hex: string): string {
  try {
    // Default fallback HSL values
    const FALLBACKS = {
      DEFAULT: '228 47% 8%', // Dark background
      PRIMARY: '186 100% 50%', // Cyan
      SECONDARY: '334 100% 59%', // Pink
      ACCENT: '260 86% 66%', // Purple
      BACKGROUND: '240 18% 9%', // Dark background
      FOREGROUND: '240 10% 96%' // Light foreground
    };
    
    // Handle empty or invalid inputs
    if (!hex || typeof hex !== 'string') return FALLBACKS.DEFAULT;
    
    // Handle preset color cases
    const lowerHex = hex.toLowerCase();
    if (lowerHex === '#00f0ff') return FALLBACKS.PRIMARY;
    if (lowerHex === '#ff2d6e') return FALLBACKS.SECONDARY;
    if (lowerHex === '#8b5cf6') return FALLBACKS.ACCENT;
    if (lowerHex === '#12121a') return FALLBACKS.BACKGROUND;
    if (lowerHex === '#f6f6f7') return FALLBACKS.FOREGROUND;
    
    // Parse rgba format
    if (hex.startsWith('rgba')) {
      const rgbaMatch = hex.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)/);
      if (rgbaMatch) {
        const [_, rs, gs, bs] = rgbaMatch;
        const r = parseInt(rs) / 255;
        const g = parseInt(gs) / 255;
        const b = parseInt(bs) / 255;
        
        // Convert to HSL
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
        const hDeg = Math.round(h * 360);
        const sPerc = Math.round(s * 100);
        const lPerc = Math.round(l * 100);
        
        return `${hDeg} ${sPerc}% ${lPerc}%`;
      }
      
      return FALLBACKS.DEFAULT;
    }
    
    // Convert hex to RGB
    const rgb = hexToRgb(hex);
    if (!rgb) {
      logger.warn(`Invalid hex color: ${hex}, using fallback`);
      return FALLBACKS.DEFAULT;
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
    const hDeg = Math.round(h * 360);
    const sPerc = Math.round(s * 100);
    const lPerc = Math.round(l * 100);
    
    return `${hDeg} ${sPerc}% ${lPerc}%`;
  } catch (error) {
    logger.error('Error converting hex to HSL', { details: { error, hex } });
    return '228 47% 8%'; // Fallback
  }
}

/**
 * Safely apply theme variable to CSS custom property
 */
export function applyThemeVariable(name: string, value: string | null | undefined, fallback: string): void {
  try {
    document.documentElement.style.setProperty(name, value || fallback);
  } catch (error) {
    logger.error(`Failed to set CSS variable ${name}`, { details: { error } });
    // Try one more time with just the fallback
    try {
      document.documentElement.style.setProperty(name, fallback);
    } catch (fallbackError) {
      // If even that fails, we can't do much more
      logger.error(`Critical failure setting CSS variable ${name}`, { details: { fallbackError } });
    }
  }
}
