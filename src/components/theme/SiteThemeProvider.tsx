
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

// Helper function to convert hex color to HSL string
function hexToHSL(hex: string): string {
  try {
    // Default fallback
    if (!hex || typeof hex !== 'string') return '228 47% 8%';
    
    // Convert hex to RGB
    const rgb = hexToRgb(hex);
    if (!rgb) return '228 47% 8%';
    
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
      // This ensures the CSS variables are correctly set for Tailwind and other utilities
      
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
      
      // Also set the actual colors as fallback
      document.documentElement.style.setProperty('--fallback-background', variables.background);
      document.documentElement.style.setProperty('--fallback-foreground', variables.foreground);
      document.documentElement.style.setProperty('--fallback-card', variables.card);
      document.documentElement.style.setProperty('--fallback-card-foreground', variables.cardForeground);
      document.documentElement.style.setProperty('--fallback-primary', variables.primary);
      document.documentElement.style.setProperty('--fallback-primary-foreground', variables.primaryForeground);
      document.documentElement.style.setProperty('--fallback-secondary', variables.secondary);
      document.documentElement.style.setProperty('--fallback-secondary-foreground', variables.secondaryForeground);
      document.documentElement.style.setProperty('--fallback-muted', variables.muted);
      document.documentElement.style.setProperty('--fallback-muted-foreground', variables.mutedForeground);
      document.documentElement.style.setProperty('--fallback-accent', variables.accent);
      document.documentElement.style.setProperty('--fallback-accent-foreground', variables.accentForeground);
      document.documentElement.style.setProperty('--fallback-destructive', variables.destructive);
      document.documentElement.style.setProperty('--fallback-destructive-foreground', variables.destructiveForeground);
      document.documentElement.style.setProperty('--fallback-border', variables.border);
      document.documentElement.style.setProperty('--fallback-input', variables.input);
      document.documentElement.style.setProperty('--fallback-ring', variables.ring);
      
      // Set site-specific effect colors
      document.documentElement.style.setProperty('--site-effect-color', variables.primary);
      document.documentElement.style.setProperty('--site-effect-secondary', variables.secondary);
      document.documentElement.style.setProperty('--site-effect-tertiary', variables.effectTertiary);
      
      // Set transition and animation durations
      document.documentElement.style.setProperty('--site-transition-fast', variables.transitionFast);
      document.documentElement.style.setProperty('--site-transition-normal', variables.transitionNormal);
      document.documentElement.style.setProperty('--site-transition-slow', variables.transitionSlow);
      document.documentElement.style.setProperty('--site-animation-fast', variables.animationFast);
      document.documentElement.style.setProperty('--site-animation-normal', variables.animationNormal);
      document.documentElement.style.setProperty('--site-animation-slow', variables.animationSlow);
      
      // Set border radius values
      document.documentElement.style.setProperty('--site-radius-sm', variables.radiusSm);
      document.documentElement.style.setProperty('--site-radius-md', variables.radiusMd);
      document.documentElement.style.setProperty('--site-radius-lg', variables.radiusLg);
      document.documentElement.style.setProperty('--site-radius-full', variables.radiusFull);
      document.documentElement.style.setProperty('--radius', variables.radiusMd);
      
      // Add a data attribute to indicate theme loaded status
      document.documentElement.setAttribute('data-theme-loaded', 'true');
      
      logger.debug('Applied site theme variables to document');
    } catch (error) {
      logger.error('Error applying site theme variables', {
        details: safeDetails(error)
      });
    }
  }, [variables, currentTheme, logger]);
  
  return (
    <ThemeContext.Provider value={{ variables, isDark, componentStyles }}>
      {children}
    </ThemeContext.Provider>
  );
}
