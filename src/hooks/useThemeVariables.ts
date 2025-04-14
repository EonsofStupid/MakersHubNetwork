
import { useState, useEffect } from 'react';
import { useThemeStore } from '@/shared/stores/theme/store';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

/**
 * Hook to access theme variables, with fallback for missing values
 */
export function useThemeVariables() {
  const themeStore = useThemeStore();
  const variables = themeStore.variables || {};
  const activeTheme = themeStore.themes.find(t => t.id === themeStore.activeThemeId);
  const logger = useLogger('useThemeVariables', LogCategory.THEME);
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    if (variables && Object.keys(variables).length > 0) {
      setLoaded(true);
    } else if (activeTheme?.variables) {
      setLoaded(true);
    }
  }, [variables, activeTheme]);

  /**
   * Get a CSS variable with fallbacks
   */
  const getVar = (name: string, fallback?: string): string => {
    try {
      if (variables && variables[name]) {
        return variables[name];
      }
      
      if (activeTheme?.variables && name in activeTheme.variables) {
        return activeTheme.variables[name] || fallback || '';
      }
      
      // Try getting from CSS if not found in theme store
      const cssVarValue = getComputedStyle(document.documentElement)
        .getPropertyValue(`--${name}`).trim();
        
      if (cssVarValue) {
        return cssVarValue;
      }
    } catch (e) {
      logger.debug(`Error retrieving theme variable ${name}`, { error: e });
    }
    
    return fallback || '';
  };

  return { getVar, variables, loaded };
}
