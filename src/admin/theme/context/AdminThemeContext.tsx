
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAdminPreferences } from '@/admin/store/adminPreferences.store';
import { getLogger } from '@/logging';
import { defaultImpulseTokens } from '../impulse/tokens';
import { applyThemeToDocument } from '../utils/themeUtils';

const logger = getLogger('AdminTheme');

// Standardized theme name
export const DEFAULT_THEME_NAME = 'impulsivity';
export type AdminTheme = 'impulsivity' | 'cyberpunk' | 'neon' | 'minimal' | 'dark' | 'light';

interface AdminThemeContextType {
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isInitialized: boolean;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme: storedTheme, setTheme: storeTheme } = useAdminPreferences();
  const [theme, setThemeState] = useState<AdminTheme>((storedTheme as AdminTheme) || DEFAULT_THEME_NAME);
  const [isDarkMode, setIsDarkMode] = useState(true); // Admin defaults to dark mode
  const [isInitialized, setIsInitialized] = useState(false);
  
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
    setTheme(theme === DEFAULT_THEME_NAME ? 'minimal' : DEFAULT_THEME_NAME);
  };
  
  // Initialize theme from store or apply default
  useEffect(() => {
    // Always apply default tokens first for immediate styling
    applyThemeToDocument(defaultImpulseTokens);
    
    // Then apply stored theme if available
    if (storedTheme) {
      // Normalize theme name to lowercase for consistency
      const normalizedTheme = String(storedTheme).toLowerCase() as AdminTheme;
      setThemeState(normalizedTheme);
      document.documentElement.setAttribute('data-admin-theme', normalizedTheme);
      logger.debug(`Initialized admin theme from store: ${normalizedTheme}`);
    } else {
      // If no stored theme, use default and set it in the store
      setTheme(DEFAULT_THEME_NAME);
      logger.debug(`No stored admin theme, using default: ${DEFAULT_THEME_NAME}`);
    }
    
    // Apply dark mode by default
    document.documentElement.classList.add('admin-dark-mode');
    
    // Mark as initialized after a brief delay to allow DOM updates
    const timer = setTimeout(() => setIsInitialized(true), 100);
    
    return () => {
      // Cleanup
      clearTimeout(timer);
      document.documentElement.removeAttribute('data-admin-theme');
      document.documentElement.classList.remove('admin-dark-mode', 'admin-light-mode');
    };
  }, [storedTheme, setTheme]);
  
  return (
    <AdminThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      toggleTheme, 
      isDarkMode, 
      toggleDarkMode,
      isInitialized
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
