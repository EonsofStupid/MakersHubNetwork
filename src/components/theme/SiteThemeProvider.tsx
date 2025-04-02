
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { useThemeVariables, ThemeVariables } from '@/hooks/useThemeVariables';
import { useLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';

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
    const themeVars = fallbackToDefault && (isLoading || !currentTheme) 
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
      
      // Then apply the HSL variables if/when available
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
