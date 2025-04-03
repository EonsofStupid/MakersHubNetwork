
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { useThemeVariables, ThemeVariables } from '@/hooks/useThemeVariables';
import { defaultImpulseTokens } from '@/admin/theme/impulse/tokens';
import { themeRegistry } from '@/admin/theme/ThemeRegistry';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';
import { getThemeProperty } from '@/admin/theme/utils/themeUtils';
import { hexToHSL, hexToRgbString, isColorDark } from '@/admin/theme/utils/colorUtils';

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
    
    if (themeComponents && Array.isArray(themeComponents) && themeComponents.length > 0) {
      themeComponents.forEach((component) => {
        if (component && 
            typeof component === 'object' && 
            component.component_name && 
            component.styles) {
          styles[component.component_name] = component.styles;
        }
      });
    }
    
    return Object.keys(styles).length > 0 ? styles : undefined;
  }, [themeComponents]);
  
  // Check if theme is dark - with robust type checking to fix the error
  const isDark = useMemo(() => {
    try {
      return isColorDark(variables.background);
    } catch (error) {
      logger.error('Error determining theme brightness:', { details: safeDetails(error) });
      // Default to dark theme if there's any error
      return true;
    }
  }, [variables.background, logger]);
  
  // Set CSS variables when theme changes
  useEffect(() => {
    try {
      // Apply CSS variables for Tailwind and for custom theming needs
      const root = document.documentElement;
      
      // Apply background and text colors
      root.style.setProperty('--background', hexToHSL(variables.background));
      root.style.setProperty('--foreground', hexToHSL(variables.foreground));
      
      // Card colors
      root.style.setProperty('--card', hexToHSL(variables.card));
      root.style.setProperty('--card-foreground', hexToHSL(variables.cardForeground));
      
      // Primary colors
      root.style.setProperty('--primary', hexToHSL(variables.primary));
      root.style.setProperty('--primary-foreground', hexToHSL(variables.primaryForeground));
      
      // Secondary colors
      root.style.setProperty('--secondary', hexToHSL(variables.secondary));
      root.style.setProperty('--secondary-foreground', hexToHSL(variables.secondaryForeground));
      
      // Muted colors
      root.style.setProperty('--muted', hexToHSL(variables.muted));
      root.style.setProperty('--muted-foreground', hexToHSL(variables.mutedForeground));
      
      // Accent colors
      root.style.setProperty('--accent', hexToHSL(variables.accent));
      root.style.setProperty('--accent-foreground', hexToHSL(variables.accentForeground));
      
      // Destructive colors
      root.style.setProperty('--destructive', hexToHSL(variables.destructive));
      root.style.setProperty('--destructive-foreground', hexToHSL(variables.destructiveForeground));
      
      // Border, input, ring
      root.style.setProperty('--border', hexToHSL(variables.border));
      root.style.setProperty('--input', hexToHSL(variables.input));
      root.style.setProperty('--ring', hexToHSL(variables.ring));
      
      // CSS variables for our effect system
      root.style.setProperty('--site-effect-color', variables.effectColor);
      root.style.setProperty('--site-effect-secondary', variables.effectSecondary);
      root.style.setProperty('--site-effect-tertiary', variables.effectTertiary);
      
      // RGB values for overlays
      root.style.setProperty('--color-primary', hexToRgbString(variables.primary));
      root.style.setProperty('--color-secondary', hexToRgbString(variables.secondary));
      
      // Transition durations
      root.style.setProperty('--transition-fast', variables.transitionFast);
      root.style.setProperty('--transition-normal', variables.transitionNormal);
      root.style.setProperty('--transition-slow', variables.transitionSlow);
      
      // Animation durations
      root.style.setProperty('--animation-fast', variables.animationFast);
      root.style.setProperty('--animation-normal', variables.animationNormal);
      root.style.setProperty('--animation-slow', variables.animationSlow);
      
      // Border radius
      root.style.setProperty('--radius-sm', variables.radiusSm);
      root.style.setProperty('--radius-md', variables.radiusMd);
      root.style.setProperty('--radius-lg', variables.radiusLg);
      root.style.setProperty('--radius-full', variables.radiusFull);
      
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
