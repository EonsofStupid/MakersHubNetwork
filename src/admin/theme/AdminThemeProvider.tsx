
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAdminPreferences } from '@/admin/store/adminPreferences.store';
import { DEFAULT_THEME_NAME } from '@/utils/themeInitializer';

type Theme = 'impulsivity' | 'cyberpunk' | 'neon' | 'minimal' | 'dark' | 'light';

interface AdminThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

// Use the lowercase version as the enum value
const DEFAULT_ADMIN_THEME: Theme = 'impulsivity';

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme: storedTheme, setTheme: storeTheme } = useAdminPreferences();
  const [theme, setThemeState] = useState<Theme>((storedTheme as Theme) || DEFAULT_ADMIN_THEME);
  
  // Update theme in store when changed
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    storeTheme(newTheme);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-admin-theme', newTheme);
  };
  
  // Toggle between impulsivity and minimal themes
  const toggleTheme = () => {
    setTheme(theme === DEFAULT_ADMIN_THEME ? 'minimal' : DEFAULT_ADMIN_THEME);
  };
  
  // Initialize theme from store
  useEffect(() => {
    if (storedTheme) {
      setThemeState(storedTheme as Theme);
      document.documentElement.setAttribute('data-admin-theme', storedTheme);
    }
  }, [storedTheme]);
  
  return (
    <AdminThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (context === undefined) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return context;
}
