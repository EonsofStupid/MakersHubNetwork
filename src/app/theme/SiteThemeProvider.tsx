
import React, { createContext, useContext, useMemo, useEffect, useState } from "react";
import { Theme, ThemeVariables } from "@/shared/types/theme.types";
import { useThemeStore } from "@/shared/store/theme/store";
import { useLogger } from "@/logging/hooks/use-logger";
import { LogCategory } from "@/shared/types/shared.types";
import { ThemeLoadingState } from "@/shared/ui/theme/info/ThemeLoadingState";
import { ThemeErrorState } from "@/shared/ui/theme/info/ThemeErrorState";

export interface SiteThemeContextType {
  theme: Theme | null;
  isLoaded: boolean;
  variables: ThemeVariables | null;
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
  const [themeError, setThemeError] = useState<Error | null>(null);
  const themeStore = useThemeStore();

  useEffect(() => {
    const initTheme = async () => {
      try {
        log.info("Initializing theme system");
        await themeStore.fetchThemes();
        themeStore.setActiveTheme(defaultTheme);
        log.info("Theme system initialized");
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to initialize theme');
        log.error("Theme initialization failed", { error: err.message });
        setThemeError(err);
      }
    };

    initTheme();
  }, [defaultTheme, log, themeStore]);

  const contextValue = useMemo<SiteThemeContextType>(() => ({
    theme: themeStore.theme,
    isLoaded: themeStore.isLoaded,
    variables: themeStore.variables,
    themeError
  }), [themeStore.theme, themeStore.isLoaded, themeStore.variables, themeError]);

  if (themeStore.isLoading) {
    return <ThemeLoadingState />;
  }

  if (themeError) {
    return (
      <ThemeErrorState 
        error={themeError}
        onRetry={() => themeStore.fetchThemes()}
      />
    );
  }

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
