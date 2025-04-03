
import { useAdminTheme } from './useAdminTheme';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

export interface ThemeColorUtils {
  // Primary color utilities
  primary: string;
  primaryRgb: string;
  primaryHsl: string;
  primaryForeground: string;
  
  // Secondary color utilities
  secondary: string;
  secondaryRgb: string;
  secondaryHsl: string;
  secondaryForeground: string;
  
  // Background color utilities
  background: string;
  backgroundRgb: string;
  backgroundHsl: string;
  foreground: string;
  
  // Get any color with consistent formats
  getColor: (key: string, fallback?: string) => string;
  getRgbColor: (key: string, fallback?: string) => string;
  getHslColor: (key: string, fallback?: string) => string;
  
  // Check if a color is dark
  isColorDark: (color: string) => boolean;
}

/**
 * Hook to access theme colors in a standardized way
 * This prevents inconsistencies in how colors are accessed across the application
 */
export function useThemeColors(): ThemeColorUtils {
  const { impulseTheme, componentStyles } = useAdminTheme();
  const logger = getLogger('useThemeColors', { category: LogCategory.THEME });
  
  // Helper to safely access theme properties
  const getThemeProperty = (path: string, fallback: string = '#000000'): string => {
    try {
      if (!impulseTheme || typeof impulseTheme !== 'object') {
        return fallback;
      }
      
      const parts = path.split('.');
      let value: any = impulseTheme;
      
      for (const part of parts) {
        if (value === undefined || value === null) {
          return fallback;
        }
        value = value[part];
      }
      
      return typeof value === 'string' ? value : fallback;
    } catch (error) {
      logger.warn(`Error getting theme property: ${path}`, { 
        details: { error: error instanceof Error ? error.message : String(error) } 
      });
      return fallback;
    }
  };
  
  // Convert hex to RGB string (e.g., "255, 255, 255")
  const hexToRgbString = (hex: string): string => {
    try {
      // Default RGB value if conversion fails
      const defaultRgb = '0, 0, 0';
      
      // Return default for invalid hex
      if (!hex || typeof hex !== 'string') {
        return defaultRgb;
      }
      
      // Remove # if present
      const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
      
      // Handle shorthand hex (e.g., #FFF)
      const fullHex = cleanHex.length === 3 
        ? cleanHex.split('').map(c => c + c).join('')
        : cleanHex;
      
      // Invalid hex length
      if (fullHex.length !== 6) {
        return defaultRgb;
      }
      
      // Convert to RGB
      const r = parseInt(fullHex.slice(0, 2), 16);
      const g = parseInt(fullHex.slice(2, 4), 16);
      const b = parseInt(fullHex.slice(4, 6), 16);
      
      // Check for valid conversion
      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        return defaultRgb;
      }
      
      return `${r}, ${g}, ${b}`;
    } catch (error) {
      logger.warn('Error converting hex to RGB string', { 
        details: { 
          hex,
          error: error instanceof Error ? error.message : String(error) 
        } 
      });
      return '0, 0, 0';
    }
  };
  
  // Convert hex to HSL string (e.g., "240 10% 50%")
  const hexToHslString = (hex: string): string => {
    try {
      // Default HSL value if conversion fails
      const defaultHsl = '0 0% 0%';
      
      // Return default for invalid hex
      if (!hex || typeof hex !== 'string') {
        return defaultHsl;
      }
      
      // Remove # if present
      const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
      
      // Handle shorthand hex (e.g., #FFF)
      const fullHex = cleanHex.length === 3 
        ? cleanHex.split('').map(c => c + c).join('')
        : cleanHex;
      
      // Invalid hex length
      if (fullHex.length !== 6) {
        return defaultHsl;
      }
      
      // Convert to RGB
      const r = parseInt(fullHex.slice(0, 2), 16) / 255;
      const g = parseInt(fullHex.slice(2, 4), 16) / 255;
      const b = parseInt(fullHex.slice(4, 6), 16) / 255;
      
      // Check for valid conversion
      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        return defaultHsl;
      }
      
      // Find min and max RGB values
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;
      
      // Calculate HSL values
      let h = 0;
      let s = 0;
      let l = (max + min) / 2;
      
      if (delta !== 0) {
        s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
        
        if (max === r) {
          h = (g - b) / delta + (g < b ? 6 : 0);
        } else if (max === g) {
          h = (b - r) / delta + 2;
        } else {
          h = (r - g) / delta + 4;
        }
        
        h *= 60;
      }
      
      // Round values
      h = Math.round(h);
      s = Math.round(s * 100);
      l = Math.round(l * 100);
      
      return `${h} ${s}% ${l}%`;
    } catch (error) {
      logger.warn('Error converting hex to HSL string', { 
        details: { 
          hex,
          error: error instanceof Error ? error.message : String(error) 
        } 
      });
      return '0 0% 0%';
    }
  };
  
  // Check if a color is dark
  const isColorDark = (color: string): boolean => {
    try {
      if (!color || typeof color !== 'string') {
        return true; // Default to dark
      }
      
      // Remove # if present
      const hex = color.startsWith('#') ? color.slice(1) : color;
      
      // Handle shorthand hex (e.g., #FFF)
      const fullHex = hex.length === 3 
        ? hex.split('').map(c => c + c).join('')
        : hex;
      
      // Convert to RGB
      const r = parseInt(fullHex.slice(0, 2), 16);
      const g = parseInt(fullHex.slice(2, 4), 16);
      const b = parseInt(fullHex.slice(4, 6), 16);
      
      // Check for valid conversion
      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        return true; // Default to dark
      }
      
      // Calculate perceived brightness using YIQ formula
      // This better approximates how humans perceive brightness
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      
      // YIQ threshold for dark/light is 128
      return yiq < 128;
    } catch (error) {
      logger.warn('Error determining if color is dark', { 
        details: { 
          color,
          error: error instanceof Error ? error.message : String(error) 
        } 
      });
      return true; // Default to dark
    }
  };
  
  // Get primary colors
  const primary = getThemeProperty('colors.primary', '#00F0FF');
  const primaryRgb = hexToRgbString(primary);
  const primaryHsl = hexToHslString(primary);
  const primaryForeground = getThemeProperty('colors.text.primary', '#F6F6F7');
  
  // Get secondary colors
  const secondary = getThemeProperty('colors.secondary', '#FF2D6E');
  const secondaryRgb = hexToRgbString(secondary);
  const secondaryHsl = hexToHslString(secondary);
  const secondaryForeground = getThemeProperty('colors.text.primary', '#F6F6F7');
  
  // Get background colors
  const background = getThemeProperty('colors.background.main', '#12121A');
  const backgroundRgb = hexToRgbString(background);
  const backgroundHsl = hexToHslString(background);
  const foreground = getThemeProperty('colors.text.primary', '#F6F6F7');
  
  // Getter functions for consistent color access
  const getColor = (key: string, fallback?: string): string => {
    return getThemeProperty(key, fallback || '#000000');
  };
  
  const getRgbColor = (key: string, fallback?: string): string => {
    const color = getThemeProperty(key, fallback || '#000000');
    return hexToRgbString(color);
  };
  
  const getHslColor = (key: string, fallback?: string): string => {
    const color = getThemeProperty(key, fallback || '#000000');
    return hexToHslString(color);
  };
  
  return {
    // Primary colors
    primary,
    primaryRgb,
    primaryHsl,
    primaryForeground,
    
    // Secondary colors
    secondary,
    secondaryRgb,
    secondaryHsl,
    secondaryForeground,
    
    // Background colors
    background,
    backgroundRgb,
    backgroundHsl,
    foreground,
    
    // Color getters
    getColor,
    getRgbColor,
    getHslColor,
    
    // Utilities
    isColorDark
  };
}
