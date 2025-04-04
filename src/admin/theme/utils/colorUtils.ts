
/**
 * Validate a color string
 */
export function validateColor(color: string): boolean {
  // Allow hex colors
  if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
    return true;
  }
  
  // Allow rgb/rgba colors
  if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*(?:0?\.\d+|[01])\s*)?\)$/.test(color)) {
    return true;
  }
  
  // Allow hsl/hsla colors
  if (/^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*(?:0?\.\d+|[01])\s*)?\)$/.test(color)) {
    return true;
  }
  
  // Allow CSS color keywords
  const cssColorKeywords = [
    'transparent', 'black', 'silver', 'gray', 'white', 'maroon', 'red', 'purple', 
    'fuchsia', 'green', 'lime', 'olive', 'yellow', 'navy', 'blue', 'teal', 'aqua'
  ];
  
  return cssColorKeywords.includes(color.toLowerCase());
}

/**
 * Convert hex color to RGB components as string (e.g., "255, 0, 0")
 */
export function hexToRgbString(hex: string): string {
  try {
    // Default values in case conversion fails
    let r = 0, g = 0, b = 0;
    
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Handle shorthand hex (e.g., #F00)
    if (hex.length === 3) {
      r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
      g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
      b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
    } 
    // Handle full hex (e.g., #FF0000)
    else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
    // If hex doesn't match expected formats, return default
    else {
      return '0, 0, 0';
    }
    
    return `${r}, ${g}, ${b}`;
  } catch (error) {
    console.error('Error converting hex to RGB:', error);
    return '0, 0, 0';
  }
}

/**
 * Convert RGB components to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Extract RGB components from an RGB/RGBA string
 */
export function extractRgb(rgbString: string): { r: number; g: number; b: number; a?: number } {
  const match = rgbString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  
  if (!match) {
    return { r: 0, g: 0, b: 0 };
  }
  
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const a = match[4] ? parseFloat(match[4]) : undefined;
  
  return { r, g, b, a };
}

/**
 * Lighten or darken a color by a percentage
 * @param color Hex color code
 * @param percent Percentage to adjust by (-100 to 100)
 */
export function adjustColor(color: string, percent: number): string {
  if (!color.startsWith('#')) {
    return color;
  }
  
  const hex = color.replace('#', '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  r = Math.min(255, Math.max(0, Math.round(r * (1 + percent / 100))));
  g = Math.min(255, Math.max(0, Math.round(g * (1 + percent / 100))));
  b = Math.min(255, Math.max(0, Math.round(b * (1 + percent / 100))));
  
  return rgbToHex(r, g, b);
}

/**
 * Calculate luminance of a color (brightness perception)
 * Returns a value between 0 and 1 (0 is black, 1 is white)
 */
export function getLuminance(hex: string): number {
  hex = hex.replace('#', '');
  
  const rgb = {
    r: parseInt(hex.substring(0, 2), 16) / 255,
    g: parseInt(hex.substring(2, 4), 16) / 255,
    b: parseInt(hex.substring(4, 6), 16) / 255
  };
  
  // Transform RGB values for luminance calculation
  const transform = (val: number) => {
    return val <= 0.03928 
      ? val / 12.92 
      : Math.pow((val + 0.055) / 1.055, 2.4);
  };
  
  const r = transform(rgb.r);
  const g = transform(rgb.g);
  const b = transform(rgb.b);
  
  // Calculate relative luminance
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Get contrasting text color (black or white) based on background color
 */
export function getContrastColor(bgColor: string): '#000000' | '#FFFFFF' {
  const lum = getLuminance(bgColor);
  return lum > 0.5 ? '#000000' : '#FFFFFF';
}
