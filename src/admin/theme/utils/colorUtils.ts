
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const logger = getLogger('ColorUtils', { category: LogCategory.THEME as string });

/**
 * Convert hex color to RGB components
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Default fallback for invalid input
  if (!hex || typeof hex !== 'string') {
    logger.warn('Invalid hex color provided', { details: { hex } });
    return { r: 0, g: 0, b: 0 };
  }
  
  // Remove hash if present
  hex = hex.replace(/^#/, '');
  
  // Handle shorthand hex
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  // Parse hex values
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    logger.warn('Invalid hex color format', { details: { hex } });
    return { r: 0, g: 0, b: 0 };
  }
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

/**
 * Convert hex color to RGB string (e.g., "255, 0, 0")
 */
export function hexToRgbString(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '0, 0, 0';
  return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
}

/**
 * Convert hex color to HSL string for Tailwind CSS variables
 */
export function hexToHSL(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '0 0% 0%';
  
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
  
  // Convert to degrees, percentage, percentage
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lightness = Math.round(l * 100);
  
  return `${h} ${s}% ${lightness}%`;
}

/**
 * Check if a color is considered dark
 */
export function isColorDark(color: string): boolean {
  if (!color) return true;
  
  const rgb = hexToRgb(color);
  if (!rgb) return true;
  
  // Calculate perceived brightness using the formula:
  // (0.299*R + 0.587*G + 0.114*B)
  const brightness = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  
  // Brightness < 0.5 is considered dark
  return brightness < 0.5;
}

/**
 * Lighten a hex color by a percentage
 */
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = 1 + percent / 100;
  
  return rgbToHex({
    r: Math.min(255, Math.round(rgb.r * factor)),
    g: Math.min(255, Math.round(rgb.g * factor)),
    b: Math.min(255, Math.round(rgb.b * factor))
  });
}

/**
 * Darken a hex color by a percentage
 */
export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = 1 - percent / 100;
  
  return rgbToHex({
    r: Math.max(0, Math.round(rgb.r * factor)),
    g: Math.max(0, Math.round(rgb.g * factor)),
    b: Math.max(0, Math.round(rgb.b * factor))
  });
}

/**
 * Convert RGB components to hex color
 */
export function rgbToHex(rgb: { r: number; g: number; b: number }): string {
  const toHex = (value: number) => {
    const hex = Math.min(255, Math.max(0, value)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}
