
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { useThemeVariables, ThemeVariables } from '@/hooks/useThemeVariables';
import { defaultImpulseTokens } from '@/admin/theme/impulse/tokens';
import { themeRegistry } from '@/admin/theme/ThemeRegistry';
import { applyThemeToDocument, hexToRgb } from '@/admin/theme/utils/themeApplicator';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
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
        }
      };
      
      // Register the theme with our registry
      themeRegistry.registerTheme('site-theme', impulseTheme as any);
      
      // Apply the theme using our standardized utility
      applyThemeToDocument('site-theme');
      
      // DIRECT CSS VARIABLE APPLICATION for important theme variables
      // HARD-CODED FALLBACKS throughout for maximum resilience
      
      // Set CSS root variables with hardcoded fallbacks
      const setThemeVar = (name: string, value: string, fallback: string) => {
        document.documentElement.style.setProperty(name, value || fallback);
      };
      
      // Convert hex to HSL format for Tailwind CSS variables
      document.documentElement.style.setProperty('--site-background', hexToHSL(variables.background));
      document.documentElement.style.setProperty('--site-foreground', hexToHSL(variables.foreground));
      document.documentElement.style.setProperty('--site-card', hexToHSL(variables.card));
      document.documentElement.style.setProperty('--site-card-foreground', hexToHSL(variables.cardForeground));
      document.documentElement.style.setProperty('--site-primary', hexToHSL(variables.primary));
      document.documentElement.style.setProperty('--site-primary-foreground', hexToHSL(variables.primaryForeground));
      document.documentElement.style.setProperty('--site-secondary', hexToHSL(variables.secondary));
      document.documentElement.style.setProperty('--site-secondary-foreground', hexToHSL(variables.secondaryForeground));
      document.documentElement.style.setProperty('--site-muted', hexToHSL(variables.muted));
      document.documentElement.style.setProperty('--site-muted-foreground', hexToHSL(variables.mutedForeground));
      document.documentElement.style.setProperty('--site-accent', hexToHSL(variables.accent));
      document.documentElement.style.setProperty('--site-accent-foreground', hexToHSL(variables.accentForeground));
      document.documentElement.style.setProperty('--site-destructive', hexToHSL(variables.destructive));
      document.documentElement.style.setProperty('--site-destructive-foreground', hexToHSL(variables.destructiveForeground));
      document.documentElement.style.setProperty('--site-border', hexToHSL(variables.border));
      document.documentElement.style.setProperty('--site-input', hexToHSL(variables.input));
      document.documentElement.style.setProperty('--site-ring', hexToHSL(variables.ring));
      
      // Also set the actual colors as fallback - DIRECT hex values
      setThemeVar('--fallback-background', variables.background, '#12121A');
      setThemeVar('--fallback-foreground', variables.foreground, '#F6F6F7');
      setThemeVar('--fallback-card', variables.card, 'rgba(28, 32, 42, 0.7)');
      setThemeVar('--fallback-card-foreground', variables.cardForeground, '#F6F6F7');
      setThemeVar('--fallback-primary', variables.primary, '#00F0FF');
      setThemeVar('--fallback-primary-foreground', variables.primaryForeground, '#F6F6F7');
      setThemeVar('--fallback-secondary', variables.secondary, '#FF2D6E');
      setThemeVar('--fallback-secondary-foreground', variables.secondaryForeground, '#F6F6F7');
      setThemeVar('--fallback-muted', variables.muted, 'rgba(255, 255, 255, 0.7)');
      setThemeVar('--fallback-muted-foreground', variables.mutedForeground, 'rgba(255, 255, 255, 0.5)');
      setThemeVar('--fallback-accent', variables.accent, '#8B5CF6');
      setThemeVar('--fallback-accent-foreground', variables.accentForeground, '#F6F6F7');
      setThemeVar('--fallback-destructive', variables.destructive, '#EF4444');
      setThemeVar('--fallback-destructive-foreground', variables.destructiveForeground, '#F6F6F7');
      setThemeVar('--fallback-border', variables.border, 'rgba(0, 240, 255, 0.2)');
      setThemeVar('--fallback-input', variables.input, 'rgba(22, 22, 26, 0.5)');
      setThemeVar('--fallback-ring', variables.ring, 'rgba(0, 240, 255, 0.4)');
      
      // Basic Tailwind compatibility variables
      setThemeVar('--background', `hsl(var(--site-background))`, 'hsl(240 18% 9%)');
      setThemeVar('--foreground', `hsl(var(--site-foreground))`, 'hsl(240 10% 96%)');
      setThemeVar('--card', `hsl(var(--site-card))`, 'hsl(240 18% 14%)');
      setThemeVar('--card-foreground', `hsl(var(--site-card-foreground))`, 'hsl(240 10% 96%)');
      setThemeVar('--popover', `hsl(var(--site-card))`, 'hsl(240 18% 14%)');
      setThemeVar('--popover-foreground', `hsl(var(--site-card-foreground))`, 'hsl(240 10% 96%)');
      setThemeVar('--primary', `hsl(var(--site-primary))`, 'hsl(186 100% 50%)');
      setThemeVar('--primary-foreground', `hsl(var(--site-primary-foreground))`, 'hsl(240 10% 96%)');
      setThemeVar('--secondary', `hsl(var(--site-secondary))`, 'hsl(334 100% 59%)');
      setThemeVar('--secondary-foreground', `hsl(var(--site-secondary-foreground))`, 'hsl(240 10% 96%)');
      setThemeVar('--muted', `hsl(var(--site-muted))`, 'hsl(240 18% 14%)');
      setThemeVar('--muted-foreground', `hsl(var(--site-muted-foreground))`, 'hsl(240 5% 65%)');
      setThemeVar('--accent', `hsl(var(--site-accent))`, 'hsl(260 86% 66%)');
      setThemeVar('--accent-foreground', `hsl(var(--site-accent-foreground))`, 'hsl(240 10% 96%)');
      setThemeVar('--destructive', `hsl(var(--site-destructive))`, 'hsl(0 84% 60%)');
      setThemeVar('--destructive-foreground', `hsl(var(--site-destructive-foreground))`, 'hsl(240 10% 96%)');
      setThemeVar('--border', `hsl(var(--site-border))`, 'hsl(240 18% 16%)');
      setThemeVar('--input', `hsl(var(--site-input))`, 'hsl(240 18% 14%)');
      setThemeVar('--ring', `hsl(var(--site-ring))`, 'hsl(186 100% 50% / 0.4)');
      
      // Set site-specific effect colors
      setThemeVar('--site-effect-color', variables.primary, '#00F0FF');
      setThemeVar('--site-effect-secondary', variables.secondary, '#FF2D6E');
      setThemeVar('--site-effect-tertiary', variables.effectTertiary, '#8B5CF6');
      
      // Set transition and animation durations
      setThemeVar('--site-transition-fast', variables.transitionFast, '150ms');
      setThemeVar('--site-transition-normal', variables.transitionNormal, '300ms');
      setThemeVar('--site-transition-slow', variables.transitionSlow, '500ms');
      setThemeVar('--site-animation-fast', variables.animationFast, '1s');
      setThemeVar('--site-animation-normal', variables.animationNormal, '2s');
      setThemeVar('--site-animation-slow', variables.animationSlow, '3s');
      
      // Set border radius values
      setThemeVar('--site-radius-sm', variables.radiusSm, '0.25rem');
      setThemeVar('--site-radius-md', variables.radiusMd, '0.5rem');
      setThemeVar('--site-radius-lg', variables.radiusLg, '0.75rem');
      setThemeVar('--site-radius-full', variables.radiusFull, '9999px');
      setThemeVar('--radius', variables.radiusMd, '0.5rem');
      
      // Add a data attribute to indicate theme loaded status
      document.documentElement.setAttribute('data-theme-loaded', 'true');
      
      logger.debug('Applied site theme variables to document');
    } catch (error) {
      logger.error('Error applying site theme variables', {
        details: safeDetails(error)
      });
      
      // Apply emergency fallback styles in case of theme application failure
      const emergencyFallbacks = () => {
        const doc = document.documentElement;
        doc.style.setProperty('--fallback-background', '#12121A');
        doc.style.setProperty('--fallback-foreground', '#F6F6F7');
        doc.style.setProperty('--fallback-primary', '#00F0FF');
        doc.style.setProperty('--fallback-secondary', '#FF2D6E');
        doc.style.setProperty('--effect-color', '#00F0FF');
        doc.style.setProperty('--site-effect-color', '#00F0FF');
        doc.style.setProperty('--site-effect-secondary', '#FF2D6E');
        
        // Basic body styles
        document.body.style.backgroundColor = '#12121A';
        document.body.style.color = '#F6F6F7';
        
        logger.debug('Applied emergency fallback styles after error');
      };
      
      emergencyFallbacks();
    }
  }, [variables, currentTheme, logger]);
  
  return (
    <ThemeContext.Provider value={{ variables, isDark, componentStyles }}>
      {children}
    </ThemeContext.Provider>
  );
}
