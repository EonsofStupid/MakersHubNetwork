
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { useThemeVariables, ThemeVariables } from '@/hooks/useThemeVariables';
import { useLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';

// Default theme variables for immediate fallback styling
const defaultThemeVariables: ThemeVariables = {
  background: '#12121A',
  foreground: '#F6F6F7',
  card: 'rgba(28, 32, 42, 0.7)',
  cardForeground: '#F6F6F7',
  primary: '#00F0FF',
  primaryForeground: '#F6F6F7',
  secondary: '#FF2D6E',
  secondaryForeground: '#F6F6F7',
  muted: 'rgba(255, 255, 255, 0.7)',
  mutedForeground: 'rgba(255, 255, 255, 0.5)',
  accent: '#131D35',
  accentForeground: '#F6F6F7',
  destructive: '#EF4444',
  destructiveForeground: '#F6F6F7',
  border: 'rgba(0, 240, 255, 0.2)',
  input: '#131D35',
  ring: '#1E293B',
  effectColor: '#00F0FF',
  effectSecondary: '#FF2D6E',
  effectTertiary: '#8B5CF6',
  transitionFast: '150ms',
  transitionNormal: '300ms',
  transitionSlow: '500ms',
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
  const { currentTheme, isLoading } = useThemeStore();
  const themeVariables = useThemeVariables(currentTheme);
  const logger = useLogger('SiteThemeProvider', LogCategory.THEME);
  
  // Determine if we should use fallback variables
  const variables = useMemo(() => {
    if (!currentTheme && fallbackToDefault) {
      logger.debug('Using fallback theme variables');
      return defaultThemeVariables;
    }
    return themeVariables;
  }, [currentTheme, fallbackToDefault, themeVariables, logger]);
  
  // Apply theme CSS variables
  useEffect(() => {
    try {
      const root = document.documentElement;
      
      // Apply basic theme
      root.style.setProperty('--background', variables.background);
      root.style.setProperty('--foreground', variables.foreground);
      root.style.setProperty('--card', variables.card);
      root.style.setProperty('--card-foreground', variables.cardForeground);
      root.style.setProperty('--primary', variables.primary);
      root.style.setProperty('--primary-foreground', variables.primaryForeground);
      root.style.setProperty('--secondary', variables.secondary);
      root.style.setProperty('--secondary-foreground', variables.secondaryForeground);
      root.style.setProperty('--muted', variables.muted);
      root.style.setProperty('--muted-foreground', variables.mutedForeground);
      root.style.setProperty('--accent', variables.accent);
      root.style.setProperty('--accent-foreground', variables.accentForeground);
      root.style.setProperty('--destructive', variables.destructive);
      root.style.setProperty('--destructive-foreground', variables.destructiveForeground);
      root.style.setProperty('--border', variables.border);
      root.style.setProperty('--input', variables.input);
      root.style.setProperty('--ring', variables.ring);
      
      // Apply effect colors
      root.style.setProperty('--effect-color', variables.effectColor);
      root.style.setProperty('--effect-secondary', variables.effectSecondary);
      root.style.setProperty('--effect-tertiary', variables.effectTertiary);
      
      // Apply timing variables
      root.style.setProperty('--transition-fast', variables.transitionFast);
      root.style.setProperty('--transition-normal', variables.transitionNormal);
      root.style.setProperty('--transition-slow', variables.transitionSlow);
      root.style.setProperty('--animation-fast', variables.animationFast);
      root.style.setProperty('--animation-normal', variables.animationNormal);
      root.style.setProperty('--animation-slow', variables.animationSlow);
      
      // Apply radius variables
      root.style.setProperty('--radius-sm', variables.radiusSm);
      root.style.setProperty('--radius-md', variables.radiusMd);
      root.style.setProperty('--radius-lg', variables.radiusLg);
      root.style.setProperty('--radius-full', variables.radiusFull);
      root.style.setProperty('--radius', variables.radiusMd);
      
      // Apply site-specific variables
      root.style.setProperty('--site-effect-color', variables.effectColor);
      root.style.setProperty('--site-effect-secondary', variables.effectSecondary);
      root.style.setProperty('--site-effect-tertiary', variables.effectTertiary);
      
      logger.debug('Applied theme variables to document');
    } catch (error) {
      logger.error('Error applying theme variables', {
        details: safeDetails(error)
      });
    }
  }, [variables, logger]);
  
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
  
  return (
    <ThemeContext.Provider value={{ variables, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
