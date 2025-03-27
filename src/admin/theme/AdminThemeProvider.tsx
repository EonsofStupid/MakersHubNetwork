
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAdminStore } from "../store/admin.store";
import { defaultImpulseTokens } from "./impulse/tokens";
import { useThemeStore } from "@/stores/theme/store";
import { ImpulseTheme } from "../types/impulse.types";

// Theme context
interface AdminThemeContextValue {
  theme: ImpulseTheme;
  currentTheme: any; // Add this property
  setTheme: (newTheme: Partial<ImpulseTheme>) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const AdminThemeContext = createContext<AdminThemeContextValue | undefined>(undefined);

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (context === undefined) {
    throw new Error("useAdminTheme must be used within an AdminThemeProvider");
  }
  return context;
}

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const { adminTheme } = useAdminStore();
  const { adminComponents, loadAdminComponents, currentTheme } = useThemeStore();
  const [theme, setThemeState] = useState<ImpulseTheme>(defaultImpulseTokens);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Load admin components from the theme store
  useEffect(() => {
    loadAdminComponents();
  }, [loadAdminComponents]);
  
  // Update theme object when adminTheme changes
  useEffect(() => {
    // Here we would load different theme tokens based on the selected theme
    // For now we just use the default tokens
    setThemeState(defaultImpulseTokens);
  }, [adminTheme]);
  
  // Function to update theme
  const setTheme = (newTheme: Partial<ImpulseTheme>) => {
    setThemeState(prev => ({ ...prev, ...newTheme }));
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  return (
    <AdminThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      toggleDarkMode, 
      isDarkMode,
      currentTheme // Add this property from the theme store
    }}>
      {children}
    </AdminThemeContext.Provider>
  );
}
