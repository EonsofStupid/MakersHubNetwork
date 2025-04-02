
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAdminPreferences } from '@/admin/store/adminPreferences.store';
import { getLogger } from '@/logging';

const logger = getLogger('AdminTheme');

export type AdminTheme = 'impulsivity' | 'cyberpunk' | 'neon' | 'minimal' | 'dark' | 'light';

interface AdminThemeContextType {
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

// Default admin theme - standardized to lowercase "impulsivity"
const DEFAULT_ADMIN_THEME: AdminTheme = 'impulsivity';

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme: storedTheme, setTheme: storeTheme } = useAdminPreferences();
  const [theme, setThemeState] = useState<AdminTheme>((storedTheme as AdminTheme) || DEFAULT_ADMIN_THEME);
  const [isDarkMode, setIsDarkMode] = useState(true); // Admin defaults to dark mode
  
  // Update theme in store when changed
  const setTheme = (newTheme: AdminTheme) => {
    logger.debug(`Setting admin theme to: ${newTheme}`);
    setThemeState(newTheme);
    storeTheme(newTheme);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-admin-theme', newTheme);
  };
  
  // Toggle between dark and light mode
  const toggleDarkMode = () => {
    logger.debug(`Toggling admin dark mode from ${isDarkMode ? 'on' : 'off'} to ${!isDarkMode ? 'on' : 'off'}`);
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('admin-light-mode', !isDarkMode);
    document.documentElement.classList.toggle('admin-dark-mode', isDarkMode);
  };
  
  // Toggle between impulsivity and minimal themes
  const toggleTheme = () => {
    setTheme(theme === DEFAULT_ADMIN_THEME ? 'minimal' : DEFAULT_ADMIN_THEME);
  };
  
  // Initialize theme from store
  useEffect(() => {
    if (storedTheme) {
      setThemeState(storedTheme as AdminTheme);
      document.documentElement.setAttribute('data-admin-theme', storedTheme);
      logger.debug(`Initialized admin theme from store: ${storedTheme}`);
    } else {
      // If no stored theme, use default and set it in the store
      setTheme(DEFAULT_ADMIN_THEME);
      logger.debug(`No stored admin theme, using default: ${DEFAULT_ADMIN_THEME}`);
    }
    
    // Apply dark mode
    document.documentElement.classList.add('admin-dark-mode');
    
    return () => {
      // Cleanup
      document.documentElement.removeAttribute('data-admin-theme');
      document.documentElement.classList.remove('admin-dark-mode', 'admin-light-mode');
    };
  }, [storedTheme]);
  
  return (
    <AdminThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      toggleTheme, 
      isDarkMode, 
      toggleDarkMode 
    }}>
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
