
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeContextValue, ThemeProviderProps } from '../../types/theme';
import { ImpulseTheme } from '../../types/impulse.types';
import { useImpulsivityStore } from '../../store/impulse.store';
import { defaultImpulseTokens } from '../impulse/tokens';
import { applyThemeToDocument } from '../utils/themeUtils';
import { DEFAULT_THEME_NAME } from '@/utils/themeInitializer';
import { useToast } from '@/hooks/use-toast';
import { getLogger } from '@/logging';

// Create context with default value
const AdminThemeContext = createContext<ThemeContextValue>({
  currentTheme: null,
  isLoading: true,
  error: null,
  applyTheme: async () => {},
  updateTheme: () => {},
  saveTheme: async () => {},
  resetTheme: () => {},
  isDirty: false,
  isSaving: false
});

// Admin theme provider component
export function AdminThemeProvider({ children, defaultThemeId }: ThemeProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  const impulsivityStore = useImpulsivityStore();
  const { toast } = useToast();
  const logger = getLogger('AdminThemeProvider');
  
  // Prepare the theme object with admin-specific structure
  const currentTheme = impulsivityStore.theme ? {
    id: 'admin-impulsivity',
    name: DEFAULT_THEME_NAME,
    description: `Admin ${DEFAULT_THEME_NAME} Theme`,
    design_tokens: {},
    impulse: impulsivityStore.theme
  } : null;
  
  // Load theme when the component mounts
  useEffect(() => {
    async function initializeTheme() {
      try {
        if (!initialized) {
          setIsLoading(true);
          setError(null);
          
          // Load theme from the store
          await impulsivityStore.loadTheme();
          
          // Apply the theme to the document
          applyThemeToDocument(impulsivityStore.theme);
          
          setIsLoading(false);
          setInitialized(true);
          logger.info('Admin theme initialized successfully');
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown theme error');
        setError(error);
        setIsLoading(false);
        
        logger.error('Failed to initialize admin theme', { error });
        toast({
          title: 'Theme Error',
          description: 'Could not load the admin theme. Using fallback styling.',
          variant: 'destructive',
        });
      }
    }
    
    initializeTheme();
  }, [initialized, impulsivityStore, toast, logger]);
  
  // Apply theme updates to the document when the theme changes
  useEffect(() => {
    if (impulsivityStore.theme && initialized) {
      applyThemeToDocument(impulsivityStore.theme);
    }
  }, [impulsivityStore.theme, initialized]);
  
  // Apply theme by ID
  const applyTheme = async (themeId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Implementation depends on where themes are stored
      // For now, just apply the default tokens
      applyThemeToDocument(defaultImpulseTokens);
      
      setIsLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to apply theme');
      setError(error);
      setIsLoading(false);
      
      logger.error('Failed to apply theme', { error });
      toast({
        title: 'Theme Error',
        description: 'Could not apply the selected theme.',
        variant: 'destructive',
      });
    }
  };
  
  // Update theme with new values
  const updateTheme = (updates: Partial<ImpulseTheme>) => {
    impulsivityStore.setTheme(updates);
  };
  
  // Save theme changes
  const saveTheme = async () => {
    try {
      setIsSaving(true);
      await impulsivityStore.saveTheme();
      
      toast({
        title: 'Theme Saved',
        description: 'Theme changes have been saved successfully.',
      });
      
      setIsSaving(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to save theme');
      setError(error);
      setIsSaving(false);
      
      logger.error('Failed to save theme', { error });
      toast({
        title: 'Save Error',
        description: 'Could not save theme changes.',
        variant: 'destructive',
      });
    }
  };
  
  // Reset theme to defaults
  const resetTheme = () => {
    impulsivityStore.resetTheme();
    applyThemeToDocument(defaultImpulseTokens);
    
    toast({
      title: 'Theme Reset',
      description: 'Theme has been reset to default values.',
    });
  };
  
  const contextValue: ThemeContextValue = {
    currentTheme,
    isLoading,
    error,
    applyTheme,
    updateTheme,
    saveTheme,
    resetTheme,
    isDirty: impulsivityStore.isDirty,
    isSaving
  };
  
  return (
    <AdminThemeContext.Provider value={contextValue}>
      {children}
    </AdminThemeContext.Provider>
  );
}

// Hook for accessing theme context
export function useAdminTheme() {
  return useContext(AdminThemeContext);
}
