
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAdminPreferences } from '@/admin/store/adminPreferences.store';

type Theme = 'impulse' | 'cyberpunk' | 'neon' | 'minimal' | 'dark' | 'light';

interface AdminThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme: storedTheme, setTheme: storeTheme } = useAdminPreferences();
  const [theme, setThemeState] = useState<Theme>((storedTheme as Theme) || 'impulse');
  
  // Update theme in store when changed
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    storeTheme(newTheme);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-admin-theme', newTheme);
  };
  
  // Toggle between impulse and minimal themes
  const toggleTheme = () => {
    setTheme(theme === 'impulse' ? 'minimal' : 'impulse');
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
