
import React, { createContext, useContext, useMemo, useEffect, useState } from "react";
import { Theme, ThemeToken, ThemeComponent, LogLevel, LogCategory, ThemeLogDetails, TokenWithKeyframes } from "@/shared/types/shared.types";
import { useThemeStore } from "@/shared/stores/theme/store";
import { useLogger } from "@/logging/hooks/use-logger";
import { logger } from "@/logging/logger.service";

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

export function SiteThemeProvider({ children, defaultTheme = "impulsivity" }: SiteThemeProviderProps) {
  const log = useLogger("SiteThemeProvider", LogCategory.THEME);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [themeError, setThemeError] = useState<Error | null>(null);
  const [componentStyles, setComponentStyles] = useState<Record<string, Record<string, string>> | null>(null);
  const [animations, setAnimations] = useState<Record<string, string> | null>(null);
  const [cssVariables, setCssVariables] = useState<Record<string, string> | null>(null);

  const { 
    themes, 
    activeThemeId, 
    setActiveTheme,
    isLoading,
    loadThemes
  } = useThemeStore();

  // Load themes on mount
  useEffect(() => {
    log.info("Initializing theme system", { themeName: defaultTheme });
    
    try {
      loadThemes();
    } catch (error) {
      log.error("Error loading themes", { 
        error: error instanceof Error ? error.message : String(error)
      });
      
      setThemeError(error instanceof Error ? error : new Error("Failed to load themes"));
    }
  }, [loadThemes, defaultTheme, log]);

  // Set active theme
  useEffect(() => {
    if (themes.length > 0 && !activeThemeId) {
      // Find the default theme or use the first one
      const themeToUse = themes.find(t => t.id === defaultTheme) || themes[0];
      setActiveTheme(themeToUse.id);
      log.info(`Setting active theme: ${themeToUse.name} (${themeToUse.id})`);
    }
  }, [themes, activeThemeId, defaultTheme, setActiveTheme, log]);

  // Update theme state when active theme changes
  useEffect(() => {
    if (activeThemeId && themes.length > 0) {
      const activeTheme = themes.find(t => t.id === activeThemeId);
      if (activeTheme) {
        setTheme(activeTheme);
        
        // Process tokens if available
        if (activeTheme.tokens?.length) {
          // Extract CSS variables
          const variables: Record<string, string> = {};
          const cssAnimations: Record<string, string> = {};
          
          activeTheme.tokens.forEach(token => {
            if (token.type === 'css') {
              variables[token.name || token.token_name] = token.value || token.token_value;
            } else if (token.type === 'animation' && 'keyframes' in token) {
              cssAnimations[token.name || token.token_name] = token.keyframes;
            }
          });
          
          setCssVariables(variables);
          setAnimations(cssAnimations);
          
          log.debug("Theme tokens processed", { 
            tokenCount: activeTheme.tokens.length,
            variableCount: Object.keys(variables).length,
            animationCount: Object.keys(cssAnimations).length
          });
        }
        
        // Process component styles if available
        if (activeTheme.components?.length) {
          const styles: Record<string, Record<string, string>> = {};
          
          activeTheme.components.forEach(component => {
            const componentName = component.component_name || component.name || '';
            if (componentName) {
              styles[componentName] = component.styles || component.tokens || {};
            }
          });
          
          setComponentStyles(styles);
          log.debug("Component styles processed", { 
            componentCount: activeTheme.components.length 
          });
        }
        
        setIsLoaded(true);
      }
    }
  }, [activeThemeId, themes, log]);

  // Apply CSS variables to document root
  useEffect(() => {
    if (cssVariables && isLoaded) {
      try {
        const root = document.documentElement;
        
        // Apply CSS variables
        Object.entries(cssVariables).forEach(([key, value]) => {
          root.style.setProperty(`--${key}`, value);
        });
        
        // Log success
        logger.log(LogLevel.INFO, LogCategory.THEME, "Theme CSS variables applied", {
          theme: activeThemeId,
          cssVarsCount: Object.keys(cssVariables).length
        } as ThemeLogDetails);
        
      } catch (error) {
        // Log error
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.log(LogLevel.ERROR, LogCategory.THEME, "Failed to apply theme CSS variables", {
          errorMessage,
          error: true
        } as ThemeLogDetails);
        
        setThemeError(error instanceof Error ? error : new Error("Failed to apply CSS variables"));
      }
    }
  }, [cssVariables, isLoaded, activeThemeId]);

  // Apply animations to style tag
  useEffect(() => {
    if (animations && isLoaded) {
      try {
        // Create or update style tag
        let styleTag = document.getElementById("theme-animations");
        if (!styleTag) {
          styleTag = document.createElement("style");
          styleTag.id = "theme-animations";
          document.head.appendChild(styleTag);
        }
        
        // Combine animations into CSS
        const animationsCSS = Object.entries(animations)
          .map(([name, keyframesValue]) => `@keyframes ${name} { ${keyframesValue} }`)
          .join("\n");
        
        styleTag.textContent = animationsCSS;
        
        log.debug("Theme animations applied", { count: Object.keys(animations).length });
        
      } catch (error) {
        log.error("Failed to apply theme animations", { 
          error: error instanceof Error ? error.message : String(error)
        });
        setThemeError(error instanceof Error ? error : new Error("Failed to apply animations"));
      }
    }
  }, [animations, isLoaded, log]);

  // Prepare context value
  const contextValue = useMemo<SiteThemeContextType>(() => ({
    theme,
    isLoaded,
    componentStyles,
    animations,
    variables: cssVariables,
    themeError,
  }), [theme, isLoaded, componentStyles, animations, cssVariables, themeError]);

  return (
    <SiteThemeContext.Provider value={contextValue}>
      {children}
    </SiteThemeContext.Provider>
  );
}

// Hook to use the theme context
export function useSiteTheme() {
  const context = useContext(SiteThemeContext);
  if (!context) {
    throw new Error("useSiteTheme must be used within a SiteThemeProvider");
  }
  return context;
}
