
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
      // Ensure themeTokens is an array with at least one item
      const tokensObj = Array.isArray(themeStore.themeTokens) && themeStore.themeTokens.length > 0
        ? themeStore.themeTokens[0] || {}
        : {};
        
      // Safely access components property
      if (tokensObj && typeof tokensObj === 'object' && 'components' in tokensObj) {
        setComponentStyles(tokensObj.components || {});
      }
      
      // Safely access variables property
      if (tokensObj && typeof tokensObj === 'object' && 'variables' in tokensObj) {
        // Use type assertion to ensure proper type
        const vars = tokensObj.variables || {};
        setVariables(vars as Record<string, string>);
      }
      
      // Safely access animations property
      if (tokensObj && typeof tokensObj === 'object' && 'animations' in tokensObj) {
        setAnimations(tokensObj.animations || {});
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
