
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useThemeStore } from "@/stores/theme/store";

type SiteThemeContextType = {
  componentStyles: Record<string, any> | null;
  variables: Record<string, string>;
  animations: Record<string, any> | null;
  isLoaded: boolean;
};

const defaultThemeContext: SiteThemeContextType = {
  componentStyles: null,
  variables: {},
  animations: null,
  isLoaded: false,
};

const SiteThemeContext = createContext<SiteThemeContextType>(defaultThemeContext);

export const useSiteTheme = () => useContext(SiteThemeContext);

interface SiteThemeProviderProps {
  children: ReactNode;
}

export const SiteThemeProvider: React.FC<SiteThemeProviderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [componentStyles, setComponentStyles] = useState<Record<string, any> | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [animations, setAnimations] = useState<Record<string, any> | null>(null);
  const themeStore = useThemeStore();
  
  useEffect(() => {
    // Initialize theme styles and variables from the store
    if (themeStore?.themeTokens) {
      // Changed to check individual properties safely
      const tokensObj = Array.isArray(themeStore.themeTokens) && themeStore.themeTokens.length > 0
        ? themeStore.themeTokens[0] || {}
        : {};
        
      setComponentStyles(tokensObj.components || {});
      setVariables(tokensObj.variables || {});
      setAnimations(tokensObj.animations || {});
      setIsLoaded(true);
    }
  }, [themeStore?.themeTokens]);

  return (
    <SiteThemeContext.Provider value={{ componentStyles, variables, animations, isLoaded }}>
      {children}
    </SiteThemeContext.Provider>
  );
};
