
import React, { createContext, useContext, useMemo, useEffect, useState } from "react";
import { Theme, ThemeComponent } from "@/shared/types/theme/theme.types";
import { useThemeStore } from "@/shared/stores/theme/store";
import { useLogger } from "@/logging/hooks/use-logger";
import { LogLevel, LogCategory } from "@/shared/types/shared.types";

export interface SiteThemeContextType {
  theme: Theme | null;
  isLoaded: boolean;
  componentStyles: Record<string, Record<string, string>> | null;
  animations: Record<string, string> | null;
  variables: Record<string, string> | null;
  themeError: Error | null;
}

const SiteThemeContext = createContext<SiteThemeContextType | null>(null);

interface SiteThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
}

export function SiteThemeProvider({ 
  children, 
  defaultTheme = "impulsivity" 
}: SiteThemeProviderProps) {
  const log = useLogger("SiteThemeProvider", LogCategory.THEME);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [themeError, setThemeError] = useState<Error | null>(null);
  const [componentStyles, setComponentStyles] = useState<Record<string, Record<string, string>> | null>(null);
  const [animations, setAnimations] = useState<Record<string, string> | null>(null);
  const [cssVariables, setCssVariables] = useState<Record<string, string> | null>(null);

  const themeStore = useThemeStore();

  useEffect(() => {
    log.info("Initializing theme system", { themeName: defaultTheme });
    
    try {
      themeStore.fetchThemes();
    } catch (error) {
      log.error("Error loading themes", { 
        error: error instanceof Error ? error.message : String(error)
      });
      setThemeError(error instanceof Error ? error : new Error("Failed to load themes"));
    }
  }, [defaultTheme, log]);

  useEffect(() => {
    if (themeStore.themes?.length > 0 && !themeStore.activeThemeId) {
      const themeToUse = themeStore.themes.find(t => t.id === defaultTheme) || themeStore.themes[0];
      themeStore.setActiveTheme(themeToUse.id);
      log.info(`Setting active theme: ${themeToUse.name} (${themeToUse.id})`);
    }
  }, [themeStore.themes, themeStore.activeThemeId, defaultTheme, log]);

  useEffect(() => {
    if (themeStore.activeThemeId && themeStore.themes?.length > 0) {
      const activeTheme = themeStore.themes.find(t => t.id === themeStore.activeThemeId);
      if (activeTheme) {
        setTheme(activeTheme);
        setCssVariables(activeTheme.variables);
        setComponentStyles(
          activeTheme.components?.reduce((acc, comp: ThemeComponent) => {
            acc[comp.component_name] = comp.styles;
            return acc;
          }, {} as Record<string, Record<string, string>>) || null
        );
        setIsLoaded(true);
      }
    }
  }, [themeStore.activeThemeId, themeStore.themes]);

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

export function useSiteTheme() {
  const context = useContext(SiteThemeContext);
  if (!context) {
    throw new Error("useSiteTheme must be used within a SiteThemeProvider");
  }
  return context;
}
