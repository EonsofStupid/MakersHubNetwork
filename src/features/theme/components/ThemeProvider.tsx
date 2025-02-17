import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';
import { ThemeContextValue } from '../types';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultThemeId?: string;
}

export const ThemeProvider = ({ children, defaultThemeId }: ThemeProviderProps) => {
  const {
    currentTheme,
    themePreference,
    isLoading,
    error,
    setTheme,
    updatePreference,
  } = useTheme();

  useEffect(() => {
    if (defaultThemeId) {
      setTheme(defaultThemeId);
    }
  }, [defaultThemeId, setTheme]);

  // Apply theme mode to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(themePreference.mode);
  }, [themePreference.mode]);

  // Apply reduced motion preference
  useEffect(() => {
    const root = window.document.documentElement;
    if (themePreference.reducedMotion) {
      root.style.setProperty('--motion-reduce', '1');
    } else {
      root.style.removeProperty('--motion-reduce');
    }
  }, [themePreference.reducedMotion]);

  // Apply high contrast preference
  useEffect(() => {
    const root = window.document.documentElement;
    if (themePreference.highContrast) {
      root.style.setProperty('--contrast-increase', '1');
    } else {
      root.style.removeProperty('--contrast-increase');
    }
  }, [themePreference.highContrast]);

  // Apply accent color
  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--accent-color', themePreference.accentColor);
  }, [themePreference.accentColor]);

  const value: ThemeContextValue = {
    currentTheme,
    themePreference,
    setTheme,
    updatePreference,
    isLoading,
    error,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 