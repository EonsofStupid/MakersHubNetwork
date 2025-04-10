
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useThemeStore } from "@/stores/theme/store";

type SiteThemeContextType = {
  componentStyles: Record<string, any> | null;
  variables: Record<string, string>;
  animations: Record<string, any> | null;
  isLoaded: boolean;
  isInitializing?: boolean;
};

const defaultThemeContext: SiteThemeContextType = {
  componentStyles: null,
  variables: {},
  animations: null,
  isLoaded: false,
  isInitializing: false,
};

const SiteThemeContext = createContext<SiteThemeContextType>(defaultThemeContext);

export const useSiteTheme = () => useContext(SiteThemeContext);

interface SiteThemeProviderProps {
  children: ReactNode;
  isInitializing?: boolean;
}

export const SiteThemeProvider: React.FC<SiteThemeProviderProps> = ({ 
  children,
  isInitializing = false
}) => {
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
        
      if (tokensObj.components) {
        setComponentStyles(tokensObj.components);
      }
      
      if (tokensObj.variables) {
        setVariables(tokensObj.variables);
      }
      
      if (tokensObj.animations) {
        setAnimations(tokensObj.animations);
      }
      
      setIsLoaded(true);
    }
  }, [themeStore?.themeTokens]);

  return (
    <SiteThemeContext.Provider value={{ 
      componentStyles, 
      variables, 
      animations, 
      isLoaded,
      isInitializing 
    }}>
      {children}
    </SiteThemeContext.Provider>
  );
};
