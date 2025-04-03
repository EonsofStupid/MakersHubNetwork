
import React, { createContext, useContext, useEffect } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

interface SiteThemeContextProps {
  componentStyles: Record<string, any>;
  isLoading: boolean;
  error: Error | null;
}

const SiteThemeContext = createContext<SiteThemeContextProps>({
  componentStyles: {},
  isLoading: true,
  error: null
});

interface SiteThemeProviderProps {
  children: React.ReactNode;
  fallbackToDefault?: boolean;
}

export function SiteThemeProvider({ children, fallbackToDefault = false }: SiteThemeProviderProps) {
  const { currentTheme, siteComponents, isLoading, error, loadSiteComponents } = useThemeStore();
  const logger = getLogger('SiteThemeProvider', { category: LogCategory.THEME as string });
  
  // Load site components if not already loaded
  useEffect(() => {
    if (!siteComponents || siteComponents.length === 0) {
      logger.debug('No site components loaded, fetching from API');
      loadSiteComponents().catch(err => {
        logger.error('Error loading site components', { 
          category: LogCategory.THEME,
          details: safeDetails(err) 
        });
      });
    }
  }, [siteComponents, loadSiteComponents, logger]);
  
  // Convert component array to record indexed by component name
  const componentStyles = React.useMemo(() => {
    const styles: Record<string, any> = {};
    
    if (Array.isArray(siteComponents)) {
      siteComponents.forEach(component => {
        if (component && component.component_name && component.styles) {
          styles[component.component_name] = component.styles;
        }
      });
    }
    
    return styles;
  }, [siteComponents]);
  
  return (
    <SiteThemeContext.Provider value={{ 
      componentStyles, 
      isLoading, 
      error 
    }}>
      {children}
    </SiteThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export function useSiteTheme() {
  return useContext(SiteThemeContext);
}
