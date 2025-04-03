
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { ImpulseTheme } from '../../types/impulse.types';
import { safeGet } from './safeThemeAccess';

const logger = getLogger('ThemeUtils', { category: LogCategory.THEME });

/**
 * Get a property from a theme with safe fallback
 */
export function getThemeProperty<T>(
  theme: ImpulseTheme | null | undefined,
  path: string,
  defaultValue: T
): T {
  return safeGet<T>(theme, path, defaultValue);
}

/**
 * Create an RGB string from a hex color
 */
export function hexToRgb(hex: string): { r: number, g: number, b: number } {
  if (!hex) return { r: 0, g: 0, b: 0 };
  
  // Remove the hash if it exists
  hex = hex.replace(/^#/, '');
  
  // Handle rgb or rgba format
  if (hex.startsWith('rgb')) {
    const components = hex.match(/\d+/g);
    if (components && components.length >= 3) {
      return {
        r: parseInt(components[0], 10),
        g: parseInt(components[1], 10),
        b: parseInt(components[2], 10)
      };
    }
  }
  
  // Parse hex format
  const shorthandRegex = /^([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  
  if (!result) {
    logger.warn(`Invalid hex color: ${hex}, returning black`);
    return { r: 0, g: 0, b: 0 };
  }
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

/**
 * Create a rgba color string from hex and opacity
 */
export function hexToRgba(hex: string, opacity: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Convert a color to RGB string format (r, g, b)
 */
export function toRgbString(color: string): string {
  const { r, g, b } = hexToRgb(color);
  return `${r}, ${g}, ${b}`;
}

/**
 * Get a CSS compatible color value, supporting various formats
 */
export function getCssColor(
  theme: ImpulseTheme | null | undefined,
  path: string,
  defaultColor: string,
  format: 'hex' | 'rgb' | 'rgba' = 'hex',
  opacity?: number
): string {
  const color = getThemeProperty(theme, path, defaultColor);
  
  if (format === 'hex') {
    return color;
  } else if (format === 'rgb') {
    const { r, g, b } = hexToRgb(color);
    return `rgb(${r}, ${g}, ${b})`;
  } else if (format === 'rgba' && typeof opacity === 'number') {
    return hexToRgba(color, opacity);
  }
  
  return color;
}

/**
 * Generates standardized utility classes for theme elements
 */
export function generateUtilityClasses(
  theme: ImpulseTheme | null | undefined
): Record<string, string> {
  if (!theme) return {};
  
  const primary = getThemeProperty(theme, 'colors.primary', '#00F0FF');
  const secondary = getThemeProperty(theme, 'colors.secondary', '#FF2D6E');
  
  return {
    button: `
      rounded-md px-4 py-2 
      bg-transparent border border-[${hexToRgba(primary, 0.5)}] 
      text-[${primary}] 
      transition-all duration-300 
      hover:border-[${hexToRgba(primary, 0.8)}]
      hover:bg-[${hexToRgba(primary, 0.1)}]
      hover:shadow-[0_0_15px_${hexToRgba(primary, 0.4)}]
      active:transform active:scale-95
    `,
    card: `
      rounded-lg border border-[${hexToRgba(primary, 0.2)}]
      bg-[rgba(28,32,42,0.7)] backdrop-blur-sm
      transition-all duration-300
      hover:border-[${hexToRgba(primary, 0.4)}]
      hover:shadow-[0_0_20px_${hexToRgba(primary, 0.2)}]
    `,
    input: `
      rounded-md px-3 py-2
      bg-[rgba(0,0,0,0.2)] 
      border border-[${hexToRgba(primary, 0.3)}]
      text-white
      placeholder:text-white/40
      focus:border-[${hexToRgba(primary, 0.8)}]
      focus:ring-1 focus:ring-[${hexToRgba(primary, 0.5)}]
      transition-all duration-300
    `,
    textGradient: `
      bg-gradient-to-r from-[${primary}] to-[${secondary}]
      bg-clip-text text-transparent
    `,
    glassPanel: `
      rounded-xl border border-white/10
      bg-black/30 backdrop-blur-xl
      shadow-[0_8px_32px_rgba(0,0,0,0.2)]
    `
  };
}
