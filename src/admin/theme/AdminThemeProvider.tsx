
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAdminStore } from "../store/admin.store";
import { defaultImpulseTokens } from "./impulse/tokens";
import { applyCssVars } from "./utils/themeUtils";
import { ImpulseTheme } from "../types/impulse.types";

// Create context for the admin theme
interface AdminThemeContextType {
  theme: ImpulseTheme;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDarkMode, toggleDarkMode, adminTheme } = useAdminStore();
  const [theme, setTheme] = useState<ImpulseTheme>(defaultImpulseTokens);
  
  // Apply theme on mount and when it changes
  useEffect(() => {
    // Apply CSS variables to the document root
    applyCssVars(defaultImpulseTokens, "impulse");
    
    // Add the admin theme CSS file
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/admin-theme.css';
    document.head.appendChild(link);

    // Clean up on unmount
    return () => {
      document.head.removeChild(link);
    };
  }, [adminTheme]);

  const contextValue = {
    theme,
    isDarkMode,
    toggleDarkMode
  };

  return (
    <AdminThemeContext.Provider value={contextValue}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (context === undefined) {
    throw new Error("useAdminTheme must be used within an AdminThemeProvider");
  }
  return context;
}
