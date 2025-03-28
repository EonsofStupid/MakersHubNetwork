
import React, { createContext, useContext, useEffect } from "react";
import { useAdminStore } from "../store/admin.store";
import { useAdminPreferences } from "../store/adminPreferences.store";
import { defaultImpulseTokens } from "./impulse/tokens";

// Theme context type
interface AdminThemeContextValue {
  isDarkMode: boolean;
  themeVariant: string;
  toggleDarkMode: () => void;
  setThemeVariant: (variant: string) => void;
}

// Create context with defaults
const AdminThemeContext = createContext<AdminThemeContextValue>({
  isDarkMode: true,
  themeVariant: "cyberpunk",
  toggleDarkMode: () => {},
  setThemeVariant: () => {}
});

// Hook to use admin theme
export const useAdminTheme = () => useContext(AdminThemeContext);

interface AdminThemeProviderProps {
  children: React.ReactNode;
}

export function AdminThemeProvider({ children }: AdminThemeProviderProps) {
  const { isDarkMode, toggleDarkMode, adminTheme, setAdminTheme } = useAdminStore();
  const { themeVariant, setThemeVariant } = useAdminPreferences();
  
  useEffect(() => {
    // Apply CSS variables for the selected theme
    const rootElement = document.documentElement;
    
    // Base theme tokens
    const tokens = defaultImpulseTokens;
    
    // Apply CSS variables based on the tokens
    Object.entries(tokens.colors).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          rootElement.style.setProperty(`--impulse-${key}-${subKey}`, subValue as string);
        });
      } else {
        rootElement.style.setProperty(`--impulse-${key}`, value as string);
      }
    });
    
    // Apply effect variables
    Object.entries(tokens.effects).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          rootElement.style.setProperty(`--impulse-${key}-${subKey}`, subValue as string);
        });
      } else {
        rootElement.style.setProperty(`--impulse-${key}`, value as string);
      }
    });
    
    // Apply animation variables
    Object.entries(tokens.animation.duration).forEach(([key, value]) => {
      rootElement.style.setProperty(`--impulse-duration-${key}`, value as string);
    });
    
    Object.entries(tokens.animation.curves).forEach(([key, value]) => {
      rootElement.style.setProperty(`--impulse-curve-${key}`, value as string);
    });
    
    // Apply theme-specific overrides based on variant
    switch (themeVariant) {
      case 'neon':
        rootElement.style.setProperty('--impulse-primary', '#FF00FF');
        rootElement.style.setProperty('--impulse-secondary', '#00FF00');
        break;
      case 'corporate':
        rootElement.style.setProperty('--impulse-primary', '#4F46E5');
        rootElement.style.setProperty('--impulse-secondary', '#F59E0B');
        break;
      default: // Cyberpunk
        // Use default tokens
        break;
    }
    
    // Add a class to the body for theme-specific CSS
    document.body.classList.add(`impulse-theme-${themeVariant}`);
    
    return () => {
      // Clean up on unmount
      document.body.classList.remove(`impulse-theme-${themeVariant}`);
    };
  }, [themeVariant, isDarkMode]);
  
  // Context value for consumers
  const contextValue = {
    isDarkMode,
    themeVariant,
    toggleDarkMode,
    setThemeVariant: (variant: string) => {
      setAdminTheme(variant);
      setThemeVariant(variant as any);
    }
  };
  
  return (
    <AdminThemeContext.Provider value={contextValue}>
      {children}
    </AdminThemeContext.Provider>
  );
}
