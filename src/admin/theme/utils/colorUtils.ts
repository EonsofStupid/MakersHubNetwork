
/**
 * Convert hex color to RGB format
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Default fallback color
  if (!hex || typeof hex !== 'string') {
    return { r: 0, g: 0, b: 0 };
  }

  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Check hex format (3 or 6 digits)
  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    // Invalid hex, return black
    return { r: 0, g: 0, b: 0 };
  }

  return { r, g, b };
}

/**
 * Convert hex color to RGB string (e.g., "255, 0, 0" for red)
 * Used for CSS variables
 */
export function hexToRgbString(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "0, 0, 0";
  return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(colorA: string, colorB: string): number {
  const rgbA = hexToRgb(colorA);
  const rgbB = hexToRgb(colorB);
  
  if (!rgbA || !rgbB) return 1;
  
  const luminanceA = calculateLuminance(rgbA);
  const luminanceB = calculateLuminance(rgbB);
  
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate relative luminance of a color (for WCAG)
 */
function calculateLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;
  
  const rsrgb = r / 255;
  const gsrgb = g / 255;
  const bsrgb = b / 255;
  
  const r1 = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4);
  const g1 = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4);
  const b1 = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4);
  
  return 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
}

/**
 * Darken a color by a certain percentage
 */
export function darken(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = 1 - percent / 100;
  const r = Math.max(0, Math.round(rgb.r * factor));
  const g = Math.max(0, Math.round(rgb.g * factor));
  const b = Math.max(0, Math.round(rgb.b * factor));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Lighten a color by a certain percentage
 */
export function lighten(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = percent / 100;
  const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * factor));
  const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * factor));
  const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * factor));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
