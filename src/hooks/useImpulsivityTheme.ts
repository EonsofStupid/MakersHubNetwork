
// This file will be completely rewritten to remove any theme hydration dependencies
import { useState, useEffect, useCallback } from 'react';

// Simplified theme hook without authentication requirements
export function useImpulsivityTheme() {
  // Set default theme values directly
  const defaultTheme = {
    name: "Impulsivity",
    primaryColor: "#00f0ff",
    secondaryColor: "#ff2d6e",
    backgroundColor: "#0a0a0a",
    textColor: "#ffffff",
    accentColor: "#9333ea"
  };
  
  // State without hydration
  const [theme, setTheme] = useState(defaultTheme);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Apply theme function that returns a Promise
  const applyTheme = useCallback(async () => {
    setIsSyncing(true);
    
    try {
      const root = document.documentElement;
      
      // Apply theme variables
      root.style.setProperty('--primary', theme.primaryColor);
      root.style.setProperty('--secondary', theme.secondaryColor);
      root.style.setProperty('--background', theme.backgroundColor);
      root.style.setProperty('--foreground', theme.textColor);
      root.style.setProperty('--accent', theme.accentColor);
      
      // Set additional derived variables
      root.style.setProperty('--primary-foreground', theme.backgroundColor);
      root.style.setProperty('--secondary-foreground', theme.backgroundColor);
      
      return true; // Indicate success
    } catch (error) {
      console.error("Failed to apply theme:", error);
      return false; // Indicate failure
    } finally {
      setIsSyncing(false);
    }
  }, [theme]);
  
  // Apply theme CSS variables directly on mount
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);
  
  return {
    theme,
    setTheme,
    isLoading: false,
    error: null,
    isSyncing,
    applyTheme
  };
}
