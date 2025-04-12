
// This provider component handles the global theming for the site
// It applies CSS variables and provides theme context to components

import React, { createContext, useMemo, useEffect, useState } from "react";
import { Theme, ComponentTokens } from "@/shared/types/shared.types";
import { useThemeStore } from "@/stores/theme/store";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/shared/types/shared.types";
import { ThemeLogDetails } from "@/shared/types/theme";

export interface SiteThemeContextType {
  theme: Theme | null;
  isLoaded: boolean;
  componentStyles: Record<string, Record<string, string>> | null;
  animations: Record<string, string> | null;
  variables: Record<string, string> | null;
  themeError: Error | null;
}

// Create the context
export const SiteThemeContext = createContext<SiteThemeContextType | null>(null);

interface SiteThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
}

export function SiteThemeProvider({ children, defaultTheme = 'default' }: SiteThemeProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [appliedTheme, setAppliedTheme] = useState<Theme | null>(null);
  const [cssVariables, setCssVariables] = useState<Record<string, string>>({});
  const [componentStyles, setComponentStyles] = useState<Record<string, Record<string, string>> | null>(null);
  const [animations, setAnimations] = useState<Record<string, string> | null>(null);

  const state = useThemeStore();
  const logger = useLogger('SiteThemeProvider', LogCategory.UI);

  // Apply theme when it changes
  useEffect(() => {
    const applyTheme = async () => {
      try {
        // Log that theme application is starting
        logger.info('Applying site theme', { 
          details: { 
            themeName: state.theme?.name || defaultTheme 
          } as ThemeLogDetails 
        });
        
        if (!state.theme) {
          setIsLoaded(true);
          return;
        }

        // Store the theme in state
        setAppliedTheme(state.theme);

        // Extract CSS variables from theme tokens
        const variables: Record<string, string> = {};
        
        // Process theme tokens into CSS variables
        if (state.theme.tokens) {
          Object.entries(state.theme.tokens).forEach(([key, token]) => {
            if (token.type === 'color' || token.type === 'gradient') {
              variables[`--${key}`] = token.value;
            } 
            else if (token.type === 'animation') {
              // For animations, we might need to define keyframes
              if (token.keyframes) {
                const keyframesName = `${key}-keyframes`;
                const cssKeyframes = `@keyframes ${keyframesName} {
                  ${token.keyframes}
                }`;
                
                // Append the keyframes to a style element
                appendKeyframesToStylesheet(keyframesName, cssKeyframes);
                
                // Store animation name in variables
                variables[`--${key}`] = keyframesName;
              }
            }
            else {
              // For other types (spacing, shadow, etc.)
              variables[`--${key}`] = token.value;
            }
          });
        }
        
        // Process component styles
        if (state.theme.components) {
          const styles: Record<string, Record<string, string>> = {};
          
          Object.entries(state.theme.components).forEach(([componentName, componentTokens]) => {
            styles[componentName] = componentTokens.styles;
          });
          
          setComponentStyles(styles);
        }
        
        // Process animations separately for easier access
        const extractedAnimations: Record<string, string> = {};
        
        // Extract all animation/transition tokens
        Object.entries(state.theme.tokens || {}).forEach(([key, token]) => {
          if (token.type === 'animation' || key.startsWith('animation') || key.startsWith('transition')) {
            extractedAnimations[key] = token.value;
          }
        });
        
        setAnimations(extractedAnimations);
        
        // Apply CSS variables to the document root
        const rootElement = document.documentElement;
        Object.entries(variables).forEach(([variable, value]) => {
          rootElement.style.setProperty(variable, value);
        });
        
        // Apply common shadcn variables
        rootElement.style.setProperty('--background', variables['--site-background'] || '#ffffff');
        rootElement.style.setProperty('--foreground', variables['--site-foreground'] || '#0f172a');
        rootElement.style.setProperty('--card', variables['--site-card'] || '#ffffff');
        rootElement.style.setProperty('--card-foreground', variables['--site-card-foreground'] || '#0f172a');
        rootElement.style.setProperty('--popover', variables['--site-popover'] || '#ffffff');
        rootElement.style.setProperty('--popover-foreground', variables['--site-popover-foreground'] || '#0f172a');
        rootElement.style.setProperty('--primary', variables['--site-primary'] || '#0f172a');
        rootElement.style.setProperty('--primary-foreground', variables['--site-primary-foreground'] || '#ffffff');
        rootElement.style.setProperty('--secondary', variables['--site-secondary'] || '#f1f5f9');
        rootElement.style.setProperty('--secondary-foreground', variables['--site-secondary-foreground'] || '#0f172a');
        rootElement.style.setProperty('--muted', variables['--site-muted'] || '#f1f5f9');
        rootElement.style.setProperty('--muted-foreground', variables['--site-muted-foreground'] || '#64748b');
        rootElement.style.setProperty('--accent', variables['--site-accent'] || '#f1f5f9');
        rootElement.style.setProperty('--accent-foreground', variables['--site-accent-foreground'] || '#0f172a');
        rootElement.style.setProperty('--destructive', variables['--site-destructive'] || '#ef4444');
        rootElement.style.setProperty('--destructive-foreground', variables['--site-destructive-foreground'] || '#ffffff');
        rootElement.style.setProperty('--border', variables['--site-border'] || '#e2e8f0');
        rootElement.style.setProperty('--input', variables['--site-input'] || '#e2e8f0');
        rootElement.style.setProperty('--ring', variables['--site-ring'] || '#cbd5e1');
        
        // Apply additional custom variables
        rootElement.style.setProperty('--radius', variables['--site-radius'] || '0.5rem');
        rootElement.style.setProperty('--effect-color', variables['--site-effect-color'] || '#00F0FF');
        rootElement.style.setProperty('--effect-secondary', variables['--site-effect-secondary'] || '#FF2D6E');
        rootElement.style.setProperty('--effect-tertiary', variables['--site-effect-tertiary'] || '#FFFF00');
        
        // Animation/transition timing variables
        rootElement.style.setProperty('--transition-fast', variables['--site-transition-fast'] || '0.15s');
        rootElement.style.setProperty('--transition-normal', variables['--site-transition-normal'] || '0.3s');
        rootElement.style.setProperty('--transition-slow', variables['--site-transition-slow'] || '0.5s');
        rootElement.style.setProperty('--animation-fast', variables['--site-animation-fast'] || '0.5s');
        rootElement.style.setProperty('--animation-normal', variables['--site-animation-normal'] || '1s');
        rootElement.style.setProperty('--animation-slow', variables['--site-animation-slow'] || '2s');
        
        // Border radius variables
        rootElement.style.setProperty('--radius-sm', variables['--site-radius-sm'] || '0.25rem');
        rootElement.style.setProperty('--radius-md', variables['--site-radius-md'] || '0.5rem');
        rootElement.style.setProperty('--radius-lg', variables['--site-radius-lg'] || '0.75rem');
        rootElement.style.setProperty('--radius-full', variables['--site-radius-full'] || '9999px');
        
        // Store the CSS variables for later use
        setCssVariables(variables);
        
        // Mark theme as loaded
        setIsLoaded(true);
        setError(null);
        
        logger.info('Theme applied successfully', { 
          details: { 
            theme: state.theme.name, 
            cssVarsCount: Object.keys(variables).length 
          } as ThemeLogDetails 
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to apply theme'));
        setIsLoaded(true); // Still mark as loaded to prevent blocking the UI
        
        logger.error('Failed to apply theme', { 
          details: { 
            error: err instanceof Error ? err.message : String(err)
          } as ThemeLogDetails 
        });
      }
    };

    applyTheme();
  }, [state.theme, defaultTheme, logger]);

  // Helper to append keyframes to a stylesheet
  const appendKeyframesToStylesheet = (name: string, css: string) => {
    let styleElement = document.getElementById('theme-keyframes');
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'theme-keyframes';
      document.head.appendChild(styleElement);
    }
    
    // Check if keyframes already exists
    if (styleElement.textContent?.includes(`@keyframes ${name}`)) {
      return;
    }
    
    styleElement.textContent += css;
  };

  // Create the context value
  const contextValue = useMemo(() => ({
    theme: appliedTheme,
    isLoaded,
    componentStyles,
    animations,
    variables: cssVariables,
    themeError: error
  }), [appliedTheme, isLoaded, componentStyles, animations, cssVariables, error]);

  return (
    <SiteThemeContext.Provider value={contextValue}>
      {children}
    </SiteThemeContext.Provider>
  );
}
