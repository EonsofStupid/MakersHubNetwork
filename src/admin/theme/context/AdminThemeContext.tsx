
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ImpulseTheme, defaultImpulseTokens } from '../../types/impulse.types';
import { themeRegistry } from '../ThemeRegistry';
import { applyThemeToDocument } from '../utils/themeApplicator';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

interface AdminThemeContextProps {
  theme: ImpulseTheme;
  setTheme: (updates: Partial<ImpulseTheme>) => void;
  isDirty: boolean;
  isLoading: boolean;
  error: Error | null;
  saveTheme: () => Promise<void>;
  resetTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextProps>({
  theme: defaultImpulseTokens,
  setTheme: () => {},
  isDirty: false,
  isLoading: false,
  error: null,
  saveTheme: async () => {},
  resetTheme: () => {}
});

export const AdminThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ImpulseTheme>(defaultImpulseTokens);
  const [originalTheme, setOriginalTheme] = useState<ImpulseTheme>(defaultImpulseTokens);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const logger = getLogger('AdminThemeContext', { category: LogCategory.THEME });
  
  // Initialize theme from registry
  useEffect(() => {
    try {
      const defaultTheme = themeRegistry.getTheme('default');
      if (defaultTheme) {
        setThemeState(defaultTheme);
        setOriginalTheme(defaultTheme);
        
        // Apply theme to document
        applyThemeToDocument(defaultTheme);
        logger.debug('Initial theme applied from AdminThemeContext');
      } else {
        logger.warn('Default theme not found in registry, using fallback');
      }
    } catch (err) {
      logger.error('Failed to initialize admin theme context', {
        details: safeDetails(err)
      });
      setError(err instanceof Error ? err : new Error('Failed to initialize theme'));
    }
  }, [logger]);
  
  // Handle theme updates
  const setTheme = (updates: Partial<ImpulseTheme>) => {
    setThemeState(prevTheme => {
      // Create deep merged theme
      const newTheme = deepMerge(prevTheme, updates);
      
      // Apply theme to document
      try {
        applyThemeToDocument(newTheme);
      } catch (err) {
        logger.error('Failed to apply theme', {
          details: safeDetails(err)
        });
      }
      
      // Check if theme has changed
      setIsDirty(!themeEquals(newTheme, originalTheme));
      
      return newTheme;
    });
  };
  
  // Save theme
  const saveTheme = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Save to registry
      themeRegistry.registerTheme(theme.id, theme);
      
      // Update original theme
      setOriginalTheme({...theme});
      setIsDirty(false);
      logger.info('Theme saved successfully');
      
      // In a real app, this would save to backend
      return Promise.resolve();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to save theme');
      setError(error);
      logger.error('Failed to save theme', {
        details: safeDetails(err)
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset theme
  const resetTheme = () => {
    setThemeState(originalTheme);
    applyThemeToDocument(originalTheme);
    setIsDirty(false);
    logger.info('Theme reset to original state');
  };
  
  return (
    <AdminThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        isDirty, 
        isLoading, 
        error, 
        saveTheme,
        resetTheme 
      }}
    >
      {children}
    </AdminThemeContext.Provider>
  );
};

// Helper to deep merge objects
function deepMerge(target: any, source: any): any {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

// Helper to compare themes
function themeEquals(theme1: ImpulseTheme, theme2: ImpulseTheme): boolean {
  return JSON.stringify(theme1) === JSON.stringify(theme2);
}

// Export hook for using the theme context
export function useAdminTheme() {
  return useContext(AdminThemeContext);
}
