
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { useThemeVariables, ThemeVariables } from '@/hooks/useThemeVariables';
import { DynamicKeyframes } from './DynamicKeyframes';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

// Create context
const SiteThemeContext = createContext<{
  variables: ThemeVariables;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  componentStyles: Record<string, any>;
  animations: Record<string, any>;
  isLoaded: boolean;
}>({
  variables: {} as ThemeVariables,
  isDarkMode: true,
  toggleDarkMode: () => {},
  componentStyles: {},
  animations: {},
  isLoaded: false,
});

// Custom hook to use the theme context
export const useSiteTheme = () => useContext(SiteThemeContext);

interface SiteThemeProviderProps {
  children: React.ReactNode;
  isInitializing?: boolean;
}

export function SiteThemeProvider({ children, isInitializing = false }: SiteThemeProviderProps) {
  const { currentTheme, isLoading, setTheme } = useThemeStore();
  const variables = useThemeVariables(currentTheme);
  const logger = useLogger('ThemeProvider', LogCategory.UI);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Get UI theme mode from localStorage or default to dark
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(
    localStorage.getItem('theme-mode') === 'light' ? false : true
  );
  
  // Load theme on mount - but only if no theme is already loaded and we're not in initialization phase
  useEffect(() => {
    if (!currentTheme && !isLoading && !isInitializing) {
      logger.info('Loading default theme');
      setTheme('default').catch(err => {
        logger.error('Failed to load default theme', { details: err });
      });
    }
  }, [currentTheme, isLoading, isInitializing, setTheme, logger]);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme-mode', newMode ? 'dark' : 'light');
  };

  // Get component styles from theme
  const componentStyles = useMemo(() => {
    if (!currentTheme || !currentTheme.component_tokens) {
      return {};
    }

    const styles: Record<string, any> = {};
    
    // Convert component tokens array to a map of component name -> styles
    currentTheme.component_tokens.forEach((component) => {
      styles[component.component_name] = component.styles;
    });
    
    return styles;
  }, [currentTheme]);
  
  // Get animations from theme
  const animations = useMemo(() => {
    if (!currentTheme || !currentTheme.design_tokens?.animation?.keyframes) {
      return {};
    }
    
    return currentTheme.design_tokens.animation.keyframes;
  }, [currentTheme]);

  // Mark theme as loaded when everything is ready
  useEffect(() => {
    if (!isLoading && currentTheme) {
      setTimeout(() => {
        setIsLoaded(true);
        logger.info('Theme loaded successfully', { 
          details: { 
            themeName: currentTheme.name,
            hasAnimations: Boolean(animations && Object.keys(animations).length > 0),
            hasComponentStyles: Boolean(componentStyles && Object.keys(componentStyles).length > 0)
          } 
        });
      }, 100);
    }
  }, [isLoading, currentTheme, animations, componentStyles, logger]);

  // Apply CSS variables when the theme changes
  useEffect(() => {
    if (isLoading || !currentTheme) return;
    
    const rootElement = document.documentElement;
    
    // Apply the CSS variables
    rootElement.style.setProperty('--site-background', variables.background);
    rootElement.style.setProperty('--site-foreground', variables.foreground);
    rootElement.style.setProperty('--site-card', variables.card);
    rootElement.style.setProperty('--site-card-foreground', variables.cardForeground);
    rootElement.style.setProperty('--site-primary', variables.primary);
    rootElement.style.setProperty('--site-primary-foreground', variables.primaryForeground);
    rootElement.style.setProperty('--site-secondary', variables.secondary);
    rootElement.style.setProperty('--site-secondary-foreground', variables.secondaryForeground);
    rootElement.style.setProperty('--site-muted', variables.muted);
    rootElement.style.setProperty('--site-muted-foreground', variables.mutedForeground);
    rootElement.style.setProperty('--site-accent', variables.accent);
    rootElement.style.setProperty('--site-accent-foreground', variables.accentForeground);
    rootElement.style.setProperty('--site-destructive', variables.destructive);
    rootElement.style.setProperty('--site-destructive-foreground', variables.destructiveForeground);
    rootElement.style.setProperty('--site-border', variables.border);
    rootElement.style.setProperty('--site-input', variables.input);
    rootElement.style.setProperty('--site-ring', variables.ring);
    
    // Apply effect colors
    rootElement.style.setProperty('--site-effect-color', variables.effectColor);
    rootElement.style.setProperty('--site-effect-secondary', variables.effectSecondary);
    rootElement.style.setProperty('--site-effect-tertiary', variables.effectTertiary);
    
    // Apply timing values
    rootElement.style.setProperty('--site-transition-fast', variables.transitionFast);
    rootElement.style.setProperty('--site-transition-normal', variables.transitionNormal);
    rootElement.style.setProperty('--site-transition-slow', variables.transitionSlow);
    rootElement.style.setProperty('--site-animation-fast', variables.animationFast);
    rootElement.style.setProperty('--site-animation-normal', variables.animationNormal);
    rootElement.style.setProperty('--site-animation-slow', variables.animationSlow);
    
    // Apply radius values
    rootElement.style.setProperty('--site-radius-sm', variables.radiusSm);
    rootElement.style.setProperty('--site-radius-md', variables.radiusMd);
    rootElement.style.setProperty('--site-radius-lg', variables.radiusLg);
    rootElement.style.setProperty('--site-radius-full', variables.radiusFull);
    
    // Apply dark/light mode class
    if (isDarkMode) {
      rootElement.classList.add('dark');
      rootElement.classList.remove('light');
    } else {
      rootElement.classList.add('light');
      rootElement.classList.remove('dark');
    }
    
  }, [variables, isLoading, isDarkMode, currentTheme]);
  
  // Create the theme context value
  const contextValue = {
    variables, 
    isDarkMode, 
    toggleDarkMode, 
    componentStyles, 
    animations,
    isLoaded
  };

  // Always render the children; let individual components handle loading states
  return (
    <SiteThemeContext.Provider value={contextValue}>
      {children}
    </SiteThemeContext.Provider>
  );
}
