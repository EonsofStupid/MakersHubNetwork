
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { useThemeVariables, ThemeVariables } from '@/hooks/useThemeVariables';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

// Default theme variables as fallback
const defaultThemeVariables: ThemeVariables = {
  background: '#080F1E',
  foreground: '#F9FAFB',
  card: '#0E172A',
  cardForeground: '#F9FAFB',
  primary: '#00F0FF',
  primaryForeground: '#F9FAFB',
  secondary: '#FF2D6E',
  secondaryForeground: '#F9FAFB',
  muted: '#131D35',
  mutedForeground: '#94A3B8',
  accent: '#131D35',
  accentForeground: '#F9FAFB',
  destructive: '#EF4444',
  destructiveForeground: '#F9FAFB',
  border: '#131D35',
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

// Create context
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

// Custom hook to use the theme context
export const useSiteTheme = () => useContext(SiteThemeContext);

interface SiteThemeProviderProps {
  children: React.ReactNode;
  fallbackToDefault?: boolean;
}

export function SiteThemeProvider({ children, fallbackToDefault = false }: SiteThemeProviderProps) {
  const { currentTheme, isLoading } = useThemeStore();
  const logger = useLogger('SiteThemeProvider', LogCategory.UI);
  const variables = useThemeVariables(currentTheme) || defaultThemeVariables;
  
  // Get UI theme mode from localStorage or default to dark
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(
    localStorage.getItem('theme-mode') === 'light' ? false : true
  );
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme-mode', newMode ? 'dark' : 'light');
    logger.info(`Theme mode changed to ${newMode ? 'dark' : 'light'}`);
  };

  // Get component styles from theme
  const componentStyles = useMemo(() => {
    if (!currentTheme || !currentTheme.component_tokens) {
      return {};
    }

    const styles: Record<string, any> = {};
    
    try {
      // Convert component tokens array to a map of component name -> styles
      currentTheme.component_tokens.forEach((component) => {
        if (component && component.component_name) {
          styles[component.component_name] = component.styles || {};
        }
      });
    } catch (error) {
      logger.error('Error processing component styles', { details: error });
    }
    
    return styles;
  }, [currentTheme, logger]);
  
  // Get animations from theme
  const animations = useMemo(() => {
    if (!currentTheme || !currentTheme.design_tokens?.animation?.keyframes) {
      return {};
    }
    
    try {
      return currentTheme.design_tokens.animation.keyframes || {};
    } catch (error) {
      logger.error('Error processing animations', { details: error });
      return {};
    }
  }, [currentTheme, logger]);

  // For development debugging
  useEffect(() => {
    if (import.meta.env.DEV) {
      const logThemeDetails = () => {
        if (currentTheme) {
          logger.debug('Theme loaded', { 
            details: { 
              id: currentTheme.id,
              name: currentTheme.name
            } 
          });
        } else if (!isLoading) {
          logger.debug('No theme loaded, using defaults');
        }
      };
      
      // Debounce the log to avoid excessive logging
      const timeoutId = setTimeout(logThemeDetails, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [currentTheme, isLoading, logger]);

  // Apply CSS variables when the theme changes
  useEffect(() => {
    // Use fallback if needed and specified
    const themeVars = fallbackToDefault && isLoading ? defaultThemeVariables : variables;
    const rootElement = document.documentElement;
    
    // Apply the CSS variables
    rootElement.style.setProperty('--site-background', themeVars.background);
    rootElement.style.setProperty('--site-foreground', themeVars.foreground);
    rootElement.style.setProperty('--site-card', themeVars.card);
    rootElement.style.setProperty('--site-card-foreground', themeVars.cardForeground);
    rootElement.style.setProperty('--site-primary', themeVars.primary);
    rootElement.style.setProperty('--site-primary-foreground', themeVars.primaryForeground);
    rootElement.style.setProperty('--site-secondary', themeVars.secondary);
    rootElement.style.setProperty('--site-secondary-foreground', themeVars.secondaryForeground);
    rootElement.style.setProperty('--site-muted', themeVars.muted);
    rootElement.style.setProperty('--site-muted-foreground', themeVars.mutedForeground);
    rootElement.style.setProperty('--site-accent', themeVars.accent);
    rootElement.style.setProperty('--site-accent-foreground', themeVars.accentForeground);
    rootElement.style.setProperty('--site-destructive', themeVars.destructive);
    rootElement.style.setProperty('--site-destructive-foreground', themeVars.destructiveForeground);
    rootElement.style.setProperty('--site-border', themeVars.border);
    rootElement.style.setProperty('--site-input', themeVars.input);
    rootElement.style.setProperty('--site-ring', themeVars.ring);
    
    // Apply effect colors
    rootElement.style.setProperty('--site-effect-color', themeVars.effectColor);
    rootElement.style.setProperty('--site-effect-secondary', themeVars.effectSecondary);
    rootElement.style.setProperty('--site-effect-tertiary', themeVars.effectTertiary);
    
    // Apply timing values
    rootElement.style.setProperty('--site-transition-fast', themeVars.transitionFast);
    rootElement.style.setProperty('--site-transition-normal', themeVars.transitionNormal);
    rootElement.style.setProperty('--site-transition-slow', themeVars.transitionSlow);
    rootElement.style.setProperty('--site-animation-fast', themeVars.animationFast);
    rootElement.style.setProperty('--site-animation-normal', themeVars.animationNormal);
    rootElement.style.setProperty('--site-animation-slow', themeVars.animationSlow);
    
    // Apply radius values
    rootElement.style.setProperty('--site-radius-sm', themeVars.radiusSm);
    rootElement.style.setProperty('--site-radius-md', themeVars.radiusMd);
    rootElement.style.setProperty('--site-radius-lg', themeVars.radiusLg);
    rootElement.style.setProperty('--site-radius-full', themeVars.radiusFull);
    
    // Apply dark/light mode class
    if (isDarkMode) {
      rootElement.classList.add('dark');
      rootElement.classList.remove('light');
    } else {
      rootElement.classList.add('light');
      rootElement.classList.remove('dark');
    }
    
    logger.debug('Applied theme CSS variables');
  }, [variables, isLoading, isDarkMode, fallbackToDefault, logger]);
  
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
