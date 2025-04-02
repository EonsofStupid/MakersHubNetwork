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

// Helper function to convert hex to HSL
function hexToHSL(hex: string): string | null {
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Check if the hex is valid
  if (!/^([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    return null;
  }
  
  // Convert to RGB first
  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16) / 255;
    g = parseInt(hex[1] + hex[1], 16) / 255;
    b = parseInt(hex[2] + hex[2], 16) / 255;
  } else {
    r = parseInt(hex.substring(0, 2), 16) / 255;
    g = parseInt(hex.substring(2, 4), 16) / 255;
    b = parseInt(hex.substring(4, 6), 16) / 255;
  }
  
  // Find max and min values to determine saturation
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  // Calculate lightness
  const l = (max + min) / 2;
  
  // Calculate saturation
  let s = 0;
  if (max !== min) {
    s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
  }
  
  // Calculate hue
  let h = 0;
  if (max !== min) {
    if (max === r) {
      h = (g - b) / (max - min) + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / (max - min) + 2;
    } else {
      h = (r - g) / (max - min) + 4;
    }
    h /= 6;
  }
  
  // Convert to the format tailwind expects
  const hDeg = Math.round(h * 360);
  const sPercent = Math.round(s * 100);
  const lPercent = Math.round(l * 100);
  
  return `${hDeg} ${sPercent}% ${lPercent}%`;
}

const SiteThemeContext = createContext<{
  variables: ThemeVariables;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  componentStyles: Record<string, any>;
  animations: Record<string, any>;
}>({
  variables: defaultThemeVariables,
  isDarkMode: true,
  toggleDarkMode: () => {},
  componentStyles: {},
  animations: {},
});

export const useSiteTheme = () => useContext(SiteThemeContext);

interface SiteThemeProviderProps {
  children: React.ReactNode;
  fallbackToDefault?: boolean;
}

export function SiteThemeProvider({ children, fallbackToDefault = false }: SiteThemeProviderProps) {
  const { currentTheme, isLoading } = useThemeStore();
  const logger = useLogger('SiteThemeProvider', LogCategory.UI);
  
  // Always start with default variables, then override when theme is loaded
  const variables = useThemeVariables(currentTheme) || defaultThemeVariables;
  
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(
    localStorage.getItem('theme-mode') === 'light' ? false : true
  );
  
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme-mode', newMode ? 'dark' : 'light');
    logger.info(`Theme mode changed to ${newMode ? 'dark' : 'light'}`);
  };

  // Extract and normalize component styles from theme with fallbacks
  const componentStyles = useMemo(() => {
    if (!currentTheme) {
      return {};
    }

    try {
      // Check if component_tokens is available and is an array
      if (!currentTheme.component_tokens || !Array.isArray(currentTheme.component_tokens)) {
        logger.warn('Theme component_tokens missing or invalid', { 
          details: { 
            hasComponentTokens: Boolean(currentTheme.component_tokens),
            type: typeof currentTheme.component_tokens
          } 
        });
        return {};
      }
      
      // Process component tokens into a lookup object
      const styles: Record<string, any> = {};
      currentTheme.component_tokens.forEach((component) => {
        if (component && component.component_name) {
          styles[component.component_name] = component.styles || {};
        }
      });
      
      return styles;
    } catch (error) {
      logger.error('Error processing component styles', { details: safeDetails(error) });
      return {};
    }
  }, [currentTheme, logger]);
  
  // Extract animations with fallbacks
  const animations = useMemo(() => {
    if (!currentTheme || !currentTheme.design_tokens?.animation?.keyframes) {
      return {};
    }
    
    try {
      return currentTheme.design_tokens.animation.keyframes || {};
    } catch (error) {
      logger.error('Error processing animations', { details: safeDetails(error) });
      return {};
    }
  }, [currentTheme, logger]);

  // Apply theme variables to CSS - with immediate fallback application
  useEffect(() => {
    // Use fallback variables if theme is loading or not available
    const themeVars = fallbackToDefault || isLoading || !currentTheme
      ? defaultThemeVariables 
      : variables;
      
    const rootElement = document.documentElement;
    
    try {
      // Apply fallback hex values first for immediate styling
      rootElement.style.setProperty('--background', themeVars.background);
      rootElement.style.setProperty('--foreground', themeVars.foreground);
      rootElement.style.setProperty('--card', themeVars.card);
      rootElement.style.setProperty('--card-foreground', themeVars.cardForeground);
      rootElement.style.setProperty('--popover', themeVars.card);
      rootElement.style.setProperty('--popover-foreground', themeVars.cardForeground);
      rootElement.style.setProperty('--primary', themeVars.primary);
      rootElement.style.setProperty('--primary-foreground', themeVars.primaryForeground);
      rootElement.style.setProperty('--secondary', themeVars.secondary);
      rootElement.style.setProperty('--secondary-foreground', themeVars.secondaryForeground);
      rootElement.style.setProperty('--muted', themeVars.muted);
      rootElement.style.setProperty('--muted-foreground', themeVars.mutedForeground);
      rootElement.style.setProperty('--accent', themeVars.accent);
      rootElement.style.setProperty('--accent-foreground', themeVars.accentForeground);
      rootElement.style.setProperty('--destructive', themeVars.destructive);
      rootElement.style.setProperty('--destructive-foreground', themeVars.destructiveForeground);
      rootElement.style.setProperty('--border', themeVars.border);
      rootElement.style.setProperty('--input', themeVars.input);
      rootElement.style.setProperty('--ring', themeVars.ring);
      
      // Apply fallback hex values to site variables
      rootElement.style.setProperty('--fallback-background', themeVars.background);
      rootElement.style.setProperty('--fallback-foreground', themeVars.foreground);
      rootElement.style.setProperty('--fallback-card', themeVars.card);
      rootElement.style.setProperty('--fallback-card-foreground', themeVars.cardForeground);
      rootElement.style.setProperty('--fallback-primary', themeVars.primary);
      rootElement.style.setProperty('--fallback-primary-foreground', themeVars.primaryForeground);
      rootElement.style.setProperty('--fallback-secondary', themeVars.secondary);
      rootElement.style.setProperty('--fallback-secondary-foreground', themeVars.secondaryForeground);
      rootElement.style.setProperty('--fallback-muted', themeVars.muted);
      rootElement.style.setProperty('--fallback-muted-foreground', themeVars.mutedForeground);
      rootElement.style.setProperty('--fallback-accent', themeVars.accent);
      rootElement.style.setProperty('--fallback-accent-foreground', themeVars.accentForeground);
      rootElement.style.setProperty('--fallback-destructive', themeVars.destructive);
      rootElement.style.setProperty('--fallback-destructive-foreground', themeVars.destructiveForeground);
      rootElement.style.setProperty('--fallback-border', themeVars.border);
      rootElement.style.setProperty('--fallback-input', themeVars.input);
      rootElement.style.setProperty('--fallback-ring', themeVars.ring);
      
      // Also set Impulse theme variables for compatibility
      rootElement.style.setProperty('--impulse-bg-main', themeVars.background);
      rootElement.style.setProperty('--impulse-text-primary', themeVars.foreground);
      rootElement.style.setProperty('--impulse-primary', themeVars.primary);
      rootElement.style.setProperty('--impulse-secondary', themeVars.secondary);
      rootElement.style.setProperty('--impulse-border-normal', themeVars.border);
      
      // Then apply the HSL variables
      const backgroundHSL = hexToHSL(themeVars.background);
      const foregroundHSL = hexToHSL(themeVars.foreground);
      const cardHSL = hexToHSL(themeVars.card);
      const cardForegroundHSL = hexToHSL(themeVars.cardForeground);
      const primaryHSL = hexToHSL(themeVars.primary);
      const primaryForegroundHSL = hexToHSL(themeVars.primaryForeground);
      const secondaryHSL = hexToHSL(themeVars.secondary);
      const secondaryForegroundHSL = hexToHSL(themeVars.secondaryForeground);
      const mutedHSL = hexToHSL(themeVars.muted);
      const mutedForegroundHSL = hexToHSL(themeVars.mutedForeground);
      const accentHSL = hexToHSL(themeVars.accent);
      const accentForegroundHSL = hexToHSL(themeVars.accentForeground);
      const destructiveHSL = hexToHSL(themeVars.destructive);
      const destructiveForegroundHSL = hexToHSL(themeVars.destructiveForeground);
      const borderHSL = hexToHSL(themeVars.border);
      const inputHSL = hexToHSL(themeVars.input);
      const ringHSL = hexToHSL(themeVars.ring);
      
      if (backgroundHSL) rootElement.style.setProperty('--site-background', backgroundHSL);
      if (foregroundHSL) rootElement.style.setProperty('--site-foreground', foregroundHSL);
      if (cardHSL) rootElement.style.setProperty('--site-card', cardHSL);
      if (cardForegroundHSL) rootElement.style.setProperty('--site-card-foreground', cardForegroundHSL);
      if (primaryHSL) rootElement.style.setProperty('--site-primary', primaryHSL);
      if (primaryForegroundHSL) rootElement.style.setProperty('--site-primary-foreground', primaryForegroundHSL);
      if (secondaryHSL) rootElement.style.setProperty('--site-secondary', secondaryHSL);
      if (secondaryForegroundHSL) rootElement.style.setProperty('--site-secondary-foreground', secondaryForegroundHSL);
      if (mutedHSL) rootElement.style.setProperty('--site-muted', mutedHSL);
      if (mutedForegroundHSL) rootElement.style.setProperty('--site-muted-foreground', mutedForegroundHSL);
      if (accentHSL) rootElement.style.setProperty('--site-accent', accentHSL);
      if (accentForegroundHSL) rootElement.style.setProperty('--site-accent-foreground', accentForegroundHSL);
      if (destructiveHSL) rootElement.style.setProperty('--site-destructive', destructiveHSL);
      if (destructiveForegroundHSL) rootElement.style.setProperty('--site-destructive-foreground', destructiveForegroundHSL);
      if (borderHSL) rootElement.style.setProperty('--site-border', borderHSL);
      if (inputHSL) rootElement.style.setProperty('--site-input', inputHSL);
      if (ringHSL) rootElement.style.setProperty('--site-ring', ringHSL);
      
      // Effect colors
      rootElement.style.setProperty('--site-effect-color', themeVars.effectColor);
      rootElement.style.setProperty('--site-effect-secondary', themeVars.effectSecondary);
      rootElement.style.setProperty('--site-effect-tertiary', themeVars.effectTertiary);
      
      // Timing values
      rootElement.style.setProperty('--site-transition-fast', themeVars.transitionFast);
      rootElement.style.setProperty('--site-transition-normal', themeVars.transitionNormal);
      rootElement.style.setProperty('--site-transition-slow', themeVars.transitionSlow);
      rootElement.style.setProperty('--site-animation-fast', themeVars.animationFast);
      rootElement.style.setProperty('--site-animation-normal', themeVars.animationNormal);
      rootElement.style.setProperty('--site-animation-slow', themeVars.animationSlow);
      
      // Radius values
      rootElement.style.setProperty('--site-radius-sm', themeVars.radiusSm);
      rootElement.style.setProperty('--site-radius-md', themeVars.radiusMd);
      rootElement.style.setProperty('--site-radius-lg', themeVars.radiusLg);
      rootElement.style.setProperty('--site-radius-full', themeVars.radiusFull);
      
      // Apply dark/light mode
      if (isDarkMode) {
        rootElement.classList.add('dark');
        rootElement.classList.remove('light');
      } else {
        rootElement.classList.add('light');
        rootElement.classList.remove('dark');
      }
      
      logger.debug('Applied theme CSS variables');
    } catch (error) {
      logger.error('Error applying CSS variables', { details: safeDetails(error) });
    }
  }, [variables, isLoading, isDarkMode, fallbackToDefault, logger, currentTheme]);
  
  return (
    <SiteThemeContext.Provider value={{ 
      variables, 
      isDarkMode, 
      toggleDarkMode, 
      componentStyles, 
      animations 
    }}>
      {children}
    </SiteThemeContext.Provider>
  );
}
