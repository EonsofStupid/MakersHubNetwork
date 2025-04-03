
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { useThemeVariables, ThemeVariables } from '@/hooks/useThemeVariables';
import { defaultImpulseTokens } from '@/admin/theme/impulse/tokens';
import { themeRegistry } from '@/admin/theme/ThemeRegistry';
import { applyThemeToDocument, hexToRgbString } from '@/admin/theme/utils/themeApplicator';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';
import { getThemeProperty } from '@/admin/theme/utils/themeUtils';

// Default theme variables for immediate fallback styling
const defaultThemeVariables: ThemeVariables = {
  background: getThemeProperty(defaultImpulseTokens, 'colors.background.main', '#12121A'),
  foreground: getThemeProperty(defaultImpulseTokens, 'colors.text.primary', '#F6F6F7'),
  card: getThemeProperty(defaultImpulseTokens, 'colors.background.card', 'rgba(28, 32, 42, 0.7)'),
  cardForeground: getThemeProperty(defaultImpulseTokens, 'colors.text.primary', '#F6F6F7'),
  primary: defaultImpulseTokens.colors?.primary || '#00F0FF',
  primaryForeground: getThemeProperty(defaultImpulseTokens, 'colors.text.primary', '#F6F6F7'),
  secondary: defaultImpulseTokens.colors?.secondary || '#FF2D6E',
  secondaryForeground: getThemeProperty(defaultImpulseTokens, 'colors.text.primary', '#F6F6F7'),
  muted: getThemeProperty(defaultImpulseTokens, 'colors.text.secondary', 'rgba(255, 255, 255, 0.7)'),
  mutedForeground: getThemeProperty(defaultImpulseTokens, 'colors.text.muted', 'rgba(255, 255, 255, 0.5)'),
  accent: defaultImpulseTokens.colors?.accent || defaultImpulseTokens.colors?.secondary || '#FF2D6E',
  accentForeground: getThemeProperty(defaultImpulseTokens, 'colors.text.primary', '#F6F6F7'),
  destructive: getThemeProperty(defaultImpulseTokens, 'colors.status.error', '#EF4444'),
  destructiveForeground: getThemeProperty(defaultImpulseTokens, 'colors.text.primary', '#F6F6F7'),
  border: getThemeProperty(defaultImpulseTokens, 'colors.borders.normal', 'rgba(0, 240, 255, 0.2)'),
  input: getThemeProperty(defaultImpulseTokens, 'colors.background.overlay', 'rgba(22, 22, 26, 0.5)'),
  ring: getThemeProperty(defaultImpulseTokens, 'colors.borders.hover', 'rgba(0, 240, 255, 0.4)'),
  effectColor: defaultImpulseTokens.colors?.primary || '#00F0FF',
  effectSecondary: defaultImpulseTokens.colors?.secondary || '#FF2D6E',
  effectTertiary: '#8B5CF6',
  transitionFast: getThemeProperty(defaultImpulseTokens, 'animation.duration.fast', '150ms'),
  transitionNormal: getThemeProperty(defaultImpulseTokens, 'animation.duration.normal', '300ms'),
  transitionSlow: getThemeProperty(defaultImpulseTokens, 'animation.duration.slow', '500ms'),
  animationFast: '1s',
  animationNormal: '2s',
  animationSlow: '3s',
  radiusSm: '0.25rem',
  radiusMd: '0.5rem',
  radiusLg: '0.75rem',
  radiusFull: '9999px'
};

// Theme context value type
type ThemeContextValue = {
  variables: ThemeVariables;
  isDark: boolean;
  componentStyles?: Record<string, any>;
};

// Create context with default values
const ThemeContext = createContext<ThemeContextValue>({
  variables: defaultThemeVariables,
  isDark: true
});

// Hook to use theme context
export const useSiteTheme = () => useContext(ThemeContext);

// SiteThemeProvider props
interface SiteThemeProviderProps {
  children: React.ReactNode;
  fallbackToDefault?: boolean;
}

// Helper function to convert hex color to HSL string with robust error handling
function hexToHSL(hex: string): string {
  try {
    // Default fallback HSL value - HARDCODED
    const DEFAULT_HSL = '228 47% 8%'; // Dark background fallback
    const DEFAULT_PRIMARY_HSL = '186 100% 50%'; // Cyan
    const DEFAULT_SECONDARY_HSL = '334 100% 59%'; // Pink
    
    // Handle empty or invalid inputs
    if (!hex || typeof hex !== 'string') return DEFAULT_HSL;
    
    // Color-specific fallbacks
    if (hex.toLowerCase() === '#00f0ff') return '186 100% 50%'; // Primary cyan
    if (hex.toLowerCase() === '#ff2d6e') return '334 100% 59%'; // Secondary pink
    if (hex.toLowerCase() === '#8b5cf6') return '260 86% 66%'; // Tertiary purple
    if (hex.toLowerCase() === '#12121a') return '240 18% 9%';  // Dark background
    if (hex.toLowerCase() === '#f6f6f7') return '240 10% 96%'; // Light foreground
    
    // Handle rgba format (common in our theme)
    if (hex.startsWith('rgba')) {
      const rgbaMatch = hex.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)/);
      if (rgbaMatch) {
        const [_, rs, gs, bs, as] = rgbaMatch;
        const r = parseInt(rs) / 255;
        const g = parseInt(gs) / 255;
        const b = parseInt(bs) / 255;
        
        // Convert to HSL using the same algorithm below
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
        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);
        
        return `${h} ${s}% ${l}%`;
      }
      
      // If regex failed, return default
      return DEFAULT_HSL;
    }
    
    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const formattedHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
      
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };
    
    const rgb = hexToRgb(hex);
    if (!rgb) {
      console.warn(`Invalid hex color: ${hex}, using fallback`);
      return DEFAULT_HSL;
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
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return `${h} ${s}% ${l}%`;
  } catch (error) {
    console.error('Error converting hex to HSL:', error);
    return '228 47% 8%'; // Fallback
  }
}

export function SiteThemeProvider({ 
  children,
  fallbackToDefault = false
}: SiteThemeProviderProps) {
  const { currentTheme, themeComponents, isLoading } = useThemeStore();
  const themeVariables = useThemeVariables(currentTheme);
  const logger = getLogger('SiteThemeProvider', { category: LogCategory.THEME });
  
  // Determine if we should use fallback variables
  const variables = useMemo(() => {
    if (!currentTheme && fallbackToDefault) {
      logger.debug('Using fallback theme variables');
      return defaultThemeVariables;
    }
    return themeVariables;
  }, [currentTheme, fallbackToDefault, themeVariables, logger]);
  
  // Extract component styles from theme components
  const componentStyles = useMemo(() => {
    const styles: Record<string, any> = {};
    
    if (themeComponents && themeComponents.length > 0) {
      themeComponents.forEach((component) => {
        if (component.component_name && component.styles) {
          styles[component.component_name] = component.styles;
        }
      });
    }
    
    return Object.keys(styles).length > 0 ? styles : undefined;
  }, [themeComponents]);
  
  // Check if theme is dark - with robust type checking to fix the error
  const isDark = useMemo(() => {
    try {
      // Make sure background is a string and has startsWith method
      const bgColor = typeof variables.background === 'string' ? variables.background : '#12121A';
      
      // Basic check - we could do more sophisticated brightness analysis
      if (bgColor.startsWith('#')) {
        // For hex, check if first two chars after # are low values
        const hex = bgColor.substring(1);
        const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
        const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
        const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
        
        // Calculate relative luminance
        // Dark mode is determined by luminance < 0.5
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance < 0.5;
      }
      
      // For non-hex values (like rgba), assume dark if it contains low values
      if (bgColor.includes('rgba') || bgColor.includes('rgb')) {
        const rgbMatch = bgColor.match(/\d+/g);
        if (rgbMatch && rgbMatch.length >= 3) {
          const [r, g, b] = rgbMatch.map(Number);
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          return luminance < 0.5;
        }
      }
      
      // Default to dark if we can't determine
      return true;
    } catch (error) {
      console.error('Error determining theme brightness:', error);
      // Default to dark theme if there's any error
      return true;
    }
  }, [variables.background]);
  
  // Set CSS variables when theme changes
  useEffect(() => {
    try {
      // Apply CSS variables for Tailwind and for custom theming needs
      const root = document.documentElement;
      
      // Apply background and text colors
      root.style.setProperty('--background', hexToHSL(variables.background || '#12121A'));
      root.style.setProperty('--foreground', hexToHSL(variables.foreground || '#F6F6F7'));
      
      // Card colors
      root.style.setProperty('--card', hexToHSL(variables.card || 'rgba(28, 32, 42, 0.7)'));
      root.style.setProperty('--card-foreground', hexToHSL(variables.cardForeground || '#F6F6F7'));
      
      // Primary colors
      root.style.setProperty('--primary', hexToHSL(variables.primary || '#00F0FF'));
      root.style.setProperty('--primary-foreground', hexToHSL(variables.primaryForeground || '#F6F6F7'));
      
      // Secondary colors
      root.style.setProperty('--secondary', hexToHSL(variables.secondary || '#FF2D6E'));
      root.style.setProperty('--secondary-foreground', hexToHSL(variables.secondaryForeground || '#F6F6F7'));
      
      // Muted colors
      root.style.setProperty('--muted', hexToHSL(variables.muted || 'rgba(255, 255, 255, 0.7)'));
      root.style.setProperty('--muted-foreground', hexToHSL(variables.mutedForeground || 'rgba(255, 255, 255, 0.5)'));
      
      // Accent colors
      root.style.setProperty('--accent', hexToHSL(variables.accent || '#8B5CF6'));
      root.style.setProperty('--accent-foreground', hexToHSL(variables.accentForeground || '#F6F6F7'));
      
      // Destructive colors
      root.style.setProperty('--destructive', hexToHSL(variables.destructive || '#EF4444'));
      root.style.setProperty('--destructive-foreground', hexToHSL(variables.destructiveForeground || '#F6F6F7'));
      
      // Border, input, ring
      root.style.setProperty('--border', hexToHSL(variables.border || 'rgba(0, 240, 255, 0.2)'));
      root.style.setProperty('--input', hexToHSL(variables.input || 'rgba(22, 22, 26, 0.5)'));
      root.style.setProperty('--ring', hexToHSL(variables.ring || 'rgba(0, 240, 255, 0.4)'));
      
      // CSS variables for our effect system
      root.style.setProperty('--site-effect-color', variables.effectColor || '#00F0FF');
      root.style.setProperty('--site-effect-secondary', variables.effectSecondary || '#FF2D6E');
      root.style.setProperty('--site-effect-tertiary', variables.effectTertiary || '#8B5CF6');
      
      // RGB values for overlays
      root.style.setProperty('--color-primary', hexToRgbString(variables.primary || '#00F0FF'));
      root.style.setProperty('--color-secondary', hexToRgbString(variables.secondary || '#FF2D6E'));
      
      // Transition durations
      root.style.setProperty('--transition-fast', variables.transitionFast || '150ms');
      root.style.setProperty('--transition-normal', variables.transitionNormal || '300ms');
      root.style.setProperty('--transition-slow', variables.transitionSlow || '500ms');
      
      // Animation durations
      root.style.setProperty('--animation-fast', variables.animationFast || '1s');
      root.style.setProperty('--animation-normal', variables.animationNormal || '2s');
      root.style.setProperty('--animation-slow', variables.animationSlow || '3s');
      
      // Border radius
      root.style.setProperty('--radius-sm', variables.radiusSm || '0.25rem');
      root.style.setProperty('--radius-md', variables.radiusMd || '0.5rem');
      root.style.setProperty('--radius-lg', variables.radiusLg || '0.75rem');
      root.style.setProperty('--radius-full', variables.radiusFull || '9999px');
      
      // Apply light/dark mode
      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
      
      logger.debug('Applied theme CSS variables', { 
        category: LogCategory.THEME,
        details: { isDark, themeName: currentTheme?.name || 'default' } 
      });
    } catch (error) {
      logger.error('Error applying CSS variables', { 
        category: LogCategory.THEME, 
        details: safeDetails(error)
      });
    }
  }, [variables, isDark, currentTheme, logger]);
  
  const contextValue = useMemo(() => ({
    variables,
    isDark,
    componentStyles
  }), [variables, isDark, componentStyles]);
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
