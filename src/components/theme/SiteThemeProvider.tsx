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
  
  // Check if theme is dark
  const isDark = useMemo(() => {
    // Basic check - we could do more sophisticated brightness analysis
    if (variables.background.startsWith('#')) {
      // For hex, check if first two chars after # are low values
      const hex = variables.background.substring(1);
      const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
      const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
      const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
      
      // Calculate relative luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance < 0.5;
    }
    
    // For RGB/A, we would need to parse it
    // For simplicity, assume dark theme for now
    return true;
  }, [variables.background]);
  
  // Apply theme CSS variables
  useEffect(() => {
    try {
      // Convert to Impulse theme format for standardized application
      const impulseTheme = {
        id: 'site-theme',
        name: currentTheme?.name || 'Site Theme',
        colors: {
          primary: variables.primary,
          secondary: variables.secondary,
          accent: variables.accent,
          background: {
            main: variables.background,
            overlay: variables.muted,
            card: variables.card,
            alt: variables.accent
          },
          text: {
            primary: variables.foreground,
            secondary: variables.mutedForeground,
            accent: variables.primary,
            muted: variables.mutedForeground
          },
          borders: {
            normal: variables.border,
            hover: variables.ring,
            active: variables.primary,
            focus: variables.ring
          },
          status: {
            success: '#10B981',
            warning: '#F59E0B',
            error: variables.destructive,
            info: '#3B82F6'
          }
        },
        effects: {
          glow: {
            primary: `0 0 15px ${variables.primary}`,
            secondary: `0 0 15px ${variables.secondary}`,
            hover: `0 0 20px ${variables.primary}`
          },
          gradients: {
            primary: `linear-gradient(90deg, ${variables.primary}, ${variables.effectSecondary})`,
            secondary: `linear-gradient(90deg, ${variables.secondary}, ${variables.effectTertiary})`,
            accent: `linear-gradient(90deg, ${variables.accent}, ${variables.effectSecondary})`
          },
          shadows: {
            small: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
            medium: '0 4px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3)',
            large: '0 10px 25px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.22)',
            inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.15)'
          }
        },
        animation: {
          duration: {
            fast: variables.transitionFast,
            normal: variables.transitionNormal,
            slow: variables.transitionSlow
          },
          curves: {
            bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
            spring: 'cubic-bezier(0.43, 0.13, 0.23, 0.96)',
            linear: 'linear'
          },
          keyframes: {
            fade: `
              @keyframes fade {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `,
            pulse: `
              @keyframes pulse {
                0%, 100% { opacity: 0.8; }
                50% { opacity: 0.4; }
              }
            `,
            glow: `
              @keyframes glow {
                0%, 100% { box-shadow: 0 0 5px ${variables.primary}; }
                50% { box-shadow: 0 0 20px ${variables.primary}; }
              }
            `,
            slide: `
              @keyframes slide {
                from { transform: translateY(10px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
            `
          }
        },
        components: {
          panel: {
            radius: variables.radiusLg,
            padding: '1.5rem',
            background: variables.card
          },
          button: {
            radius: variables.radiusMd,
            padding: '0.5rem 1rem',
            transition: `all ${variables.transitionNormal} ease`
          },
          tooltip: {
            radius: variables.radiusSm,
            padding: '0.5rem',
            background: 'rgba(0, 0, 0, 0.8)'
          },
          input: {
            radius: variables.radiusMd,
            padding: '0.5rem 0.75rem',
            background: variables.input
          }
        },
        typography: {
          fonts: {
            body: 'Inter, system-ui, sans-serif',
            heading: 'Inter, system-ui, sans-serif',
            monospace: 'Consolas, monospace'
          },
          sizes: {
            xs: variables.radiusSm,
            sm: variables.radiusMd,
            base: variables.radiusLg,
            md: variables.radiusLg, // Added md size to match usage
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem'
          },
          lineHeights: {
            tight: '1.25',
            normal: '1.5',
            loose: '1.75'
          }
        }
      };
      
      // Register the theme with our registry
      themeRegistry.registerTheme('site-theme', impulseTheme);
      
      // Apply the theme using our standardized utility
      applyThemeToDocument('site-theme');
      
      // Set additional CSS variables for Tailwind theme system
      document.documentElement.style.setProperty('--impulse-theme-applied', 'true');
      
      logger.debug('Theme applied successfully from SiteThemeProvider');
    } catch (err) {
      logger.error('Error applying theme in SiteThemeProvider', {
        details: safeDetails(err)
      });
    }
  }, [variables, currentTheme, logger]);
  
  return (
    <ThemeContext.Provider value={{ variables, isDark, componentStyles }}>
      {children}
    </ThemeContext.Provider>
  );
}
