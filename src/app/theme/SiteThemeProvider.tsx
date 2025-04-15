
import React, { createContext, useContext, useMemo } from "react";
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

export function SiteThemeProvider({ children }: SiteThemeProviderProps) {
  const log = useLogger("SiteThemeProvider", LogCategory.THEME);
  const themeStore = useThemeStore();
  
  const contextValue = useMemo<SiteThemeContextType>(() => ({
    theme: themeStore.theme,
    isLoaded: themeStore.isLoaded,
    variables: themeStore.variables,
    componentStyles: themeStore.componentTokens,
    animations: themeStore.animations,
    themeError: themeStore.error ? new Error(themeStore.error) : null
  }), [
    themeStore.theme,
    themeStore.isLoaded,
    themeStore.variables,
    themeStore.componentTokens,
    themeStore.animations,
    themeStore.error
  ]);

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
