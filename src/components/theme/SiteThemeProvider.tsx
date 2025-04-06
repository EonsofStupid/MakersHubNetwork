
import React, { createContext, useContext, useEffect, useMemo, useState, useRef } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { useThemeVariables, ThemeVariables } from '@/hooks/useThemeVariables';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { DynamicKeyframes } from './DynamicKeyframes';

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
  const { currentTheme, isLoading } = useThemeStore();
  const variables = useThemeVariables(currentTheme);
  const logger = useLogger('SiteThemeProvider', LogCategory.UI);
  const [isLoaded, setIsLoaded] = useState(false);
  const cssVarsApplied = useRef(false);
  
  // Get UI theme mode from localStorage or default to dark
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    localStorage.getItem('theme-mode') !== 'light'
  );
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme-mode', newMode ? 'dark' : 'light');
  };

  // Get component styles from theme - memoized to prevent unnecessary recalculations
  const componentStyles = useMemo(() => {
    if (!currentTheme || !Array.isArray(currentTheme.component_tokens)) {
      logger.debug('No component styles found in theme', { 
        error: true,
        details: { reason: 'No component tokens found in theme' },
        category: LogCategory.UI 
      });
      return {};
    }

    try {
      const styles: Record<string, any> = {};
      
      // Convert component tokens array to a map of component name -> styles
      currentTheme.component_tokens.forEach((component) => {
        if (component && typeof component.component_name === 'string' && component.styles) {
          styles[component.component_name] = component.styles;
        }
      });
      
      return styles;
    } catch (error) {
      logger.error('Error processing component styles', { 
        error: true,
        details: { errorMessage: error instanceof Error ? error.message : String(error) },
        category: LogCategory.UI
      });
      return {};
    }
  }, [currentTheme, logger]);
  
  // Get animations from theme - memoized to prevent unnecessary recalculations
  const animations = useMemo(() => {
    const defaultAnimations = {}; // Safe fallback
    
    if (!currentTheme?.design_tokens?.animation?.keyframes) {
      return defaultAnimations;
    }
    
    try {
      const themeAnimations = currentTheme.design_tokens.animation.keyframes;
      return themeAnimations || defaultAnimations;
    } catch (error) {
      logger.error('Error processing animations', { 
        error: true,
        details: { errorMessage: error instanceof Error ? error.message : String(error) },
        category: LogCategory.UI
      });
      return defaultAnimations;
    }
  }, [currentTheme, logger]);

  // Mark theme as loaded when everything is ready
  useEffect(() => {
    if (!isLoading && currentTheme && !isInitializing && !isLoaded) {
      // Small delay to ensure CSS variables are applied
      const timer = setTimeout(() => {
        setIsLoaded(true);
        logger.info('Theme loaded successfully', { 
          success: true,
          details: {
            themeName: currentTheme.name,
            hasAnimations: Boolean(animations && Object.keys(animations).length > 0),
            hasComponentStyles: Boolean(componentStyles && Object.keys(componentStyles).length > 0)
          },
          category: LogCategory.UI
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, currentTheme, animations, componentStyles, logger, isInitializing, isLoaded]);

  // Apply CSS variables when the theme changes - using refs to prevent multiple applications
  useEffect(() => {
    if (cssVarsApplied.current) return;
    
    // Always apply our CSS variables even if theme is loading or missing
    // This ensures the UI always has some styles
    const rootElement = document.documentElement;
    
    try {
      // Apply the CSS variables
      rootElement.style.setProperty('--site-background', variables.background || '');
      rootElement.style.setProperty('--site-foreground', variables.foreground || '');
      rootElement.style.setProperty('--site-card', variables.card || '');
      rootElement.style.setProperty('--site-card-foreground', variables.cardForeground || '');
      rootElement.style.setProperty('--site-primary', variables.primary || '');
      rootElement.style.setProperty('--site-primary-foreground', variables.primaryForeground || '');
      rootElement.style.setProperty('--site-secondary', variables.secondary || '');
      rootElement.style.setProperty('--site-secondary-foreground', variables.secondaryForeground || '');
      rootElement.style.setProperty('--site-muted', variables.muted || '');
      rootElement.style.setProperty('--site-muted-foreground', variables.mutedForeground || '');
      rootElement.style.setProperty('--site-accent', variables.accent || '');
      rootElement.style.setProperty('--site-accent-foreground', variables.accentForeground || '');
      rootElement.style.setProperty('--site-destructive', variables.destructive || '');
      rootElement.style.setProperty('--site-destructive-foreground', variables.destructiveForeground || '');
      rootElement.style.setProperty('--site-border', variables.border || '');
      rootElement.style.setProperty('--site-input', variables.input || '');
      rootElement.style.setProperty('--site-ring', variables.ring || '');
      
      // Apply effect colors
      rootElement.style.setProperty('--site-effect-color', variables.effectColor || '');
      rootElement.style.setProperty('--site-effect-secondary', variables.effectSecondary || '');
      rootElement.style.setProperty('--site-effect-tertiary', variables.effectTertiary || '');
      
      // Apply timing values
      rootElement.style.setProperty('--site-transition-fast', variables.transitionFast || '');
      rootElement.style.setProperty('--site-transition-normal', variables.transitionNormal || '');
      rootElement.style.setProperty('--site-transition-slow', variables.transitionSlow || '');
      rootElement.style.setProperty('--site-animation-fast', variables.animationFast || '');
      rootElement.style.setProperty('--site-animation-normal', variables.animationNormal || '');
      rootElement.style.setProperty('--site-animation-slow', variables.animationSlow || '');
      
      // Apply radius values
      rootElement.style.setProperty('--site-radius-sm', variables.radiusSm || '');
      rootElement.style.setProperty('--site-radius-md', variables.radiusMd || '');
      rootElement.style.setProperty('--site-radius-lg', variables.radiusLg || '');
      rootElement.style.setProperty('--site-radius-full', variables.radiusFull || '');
      
      cssVarsApplied.current = true;
      
      logger.debug('Applied theme CSS variables', { 
        success: true,
        details: { themeName: currentTheme?.name || 'default' },
        category: LogCategory.UI
      });
    } catch (error) {
      logger.error('Failed to apply CSS variables', { 
        error: true,
        details: { errorMessage: error instanceof Error ? error.message : String(error) },
        category: LogCategory.UI
      });
    }
  }, [variables, currentTheme, logger]);
  
  // Apply dark/light mode class - separate effect to prevent unnecessary re-renders
  useEffect(() => {
    const rootElement = document.documentElement;
    
    if (isDarkMode) {
      rootElement.classList.add('dark');
      rootElement.classList.remove('light');
    } else {
      rootElement.classList.add('light');
      rootElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // Create the theme context value - memoized to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    variables, 
    isDarkMode, 
    toggleDarkMode, 
    componentStyles, 
    animations,
    isLoaded
  }), [variables, isDarkMode, componentStyles, animations, isLoaded]);

  // Always render the children; let individual components handle loading states
  return (
    <SiteThemeContext.Provider value={contextValue}>
      <DynamicKeyframes />
      {children}
    </SiteThemeContext.Provider>
  );
}
