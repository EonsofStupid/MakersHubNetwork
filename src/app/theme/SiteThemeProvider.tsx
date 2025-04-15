
import React, { createContext, useContext, useMemo, useCallback } from "react";
import { Theme, ThemeVariables } from "@/shared/types/theme.types";
import { useThemeStore } from "@/shared/stores/theme/store";
import { useLogger } from "@/logging/hooks/use-logger";
import { LogCategory } from "@/shared/types/shared.types";

export interface SiteThemeContextType {
  theme: Theme | null;
  isLoaded: boolean;
  variables: ThemeVariables;
  componentStyles?: Record<string, Record<string, string>>;
  animations?: Record<string, string>;
  themeError: Error | null;
}

const SiteThemeContext = createContext<SiteThemeContextType | null>(null);

interface SiteThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
}

export function SiteThemeProvider({ 
  children, 
  defaultTheme = "default" 
}: SiteThemeProviderProps) {
  const log = useLogger("SiteThemeProvider", LogCategory.THEME);
  const themeStore = useThemeStore();
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<SiteThemeContextType>(() => ({
    theme: themeStore.theme,
    isLoaded: themeStore.isLoaded,
    variables: themeStore.variables,
    componentStyles: themeStore.componentStyles,
    animations: themeStore.animations,
    themeError: themeStore.error
  }), [
    themeStore.theme,
    themeStore.isLoaded,
    themeStore.variables,
    themeStore.componentStyles,
    themeStore.animations,
    themeStore.error
  ]);

  // Theme system is managed by SystemInitializer now
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
