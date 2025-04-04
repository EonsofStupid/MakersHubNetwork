
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { defaultImpulseTokens, ImpulseTheme } from '@/admin/types/impulse.types';
import { themeToImpulseTheme } from '@/admin/theme/utils/modelTransformers';
import { applyThemeToDocument } from '@/admin/theme/utils/themeApplicator';
import { safeDetails } from '@/logging/utils/safeDetails';

interface AdminThemeContextValue {
  theme: ImpulseTheme;
  isLoading: boolean;
  error: Error | null;
}

const AdminThemeContext = createContext<AdminThemeContextValue>({
  theme: defaultImpulseTokens,
  isLoading: false,
  error: null
});

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const logger = getLogger('AdminThemeContext', { category: LogCategory.THEME });
  const { currentTheme, isLoading, error, hydrateTheme } = useThemeStore();
  const [adminTheme, setAdminTheme] = useState<ImpulseTheme>(defaultImpulseTokens);
  
  // Initialize theme from store
  useEffect(() => {
    if (!currentTheme) {
      logger.debug('No current theme in store, hydrating');
      hydrateTheme().catch(err => {
        logger.error('Failed to hydrate theme', { details: safeDetails(err) });
      });
    }
  }, [currentTheme, hydrateTheme, logger]);
  
  // Update admin theme when store theme changes
  useEffect(() => {
    if (currentTheme) {
      try {
        const impulseTheme = themeToImpulseTheme(currentTheme);
        setAdminTheme(impulseTheme);
        
        // Apply theme to document
        applyThemeToDocument(impulseTheme);
        logger.debug('Applied admin theme from current theme', { 
          details: { themeId: currentTheme.id } 
        });
      } catch (err) {
        logger.error('Error creating admin theme from current theme', { 
          details: safeDetails(err) 
        });
        
        // Apply default theme in case of error
        applyThemeToDocument(defaultImpulseTokens);
      }
    }
  }, [currentTheme, logger]);
  
  // Apply initial theme even if store doesn't have one yet
  useEffect(() => {
    if (!currentTheme) {
      try {
        applyThemeToDocument(defaultImpulseTokens);
        logger.debug('Applied default admin theme');
      } catch (err) {
        logger.error('Error applying default admin theme', { 
          details: safeDetails(err) 
        });
      }
    }
  }, [currentTheme, logger]);

  const contextValue: AdminThemeContextValue = {
    theme: adminTheme,
    isLoading,
    error
  };

  return (
    <AdminThemeContext.Provider value={contextValue}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}
