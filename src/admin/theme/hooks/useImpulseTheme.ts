
import { useState, useEffect } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { defaultImpulseTokens } from '../impulse/tokens';
import { ImpulseTheme } from '../../types/impulse.types';
import { useToast } from '@/hooks/use-toast';
import { deepMerge } from '../utils/themeUtils';
import { DEFAULT_THEME_NAME } from '@/utils/themeInitializer';

/**
 * Hook for managing the Impulsivity theme
 * Provides functionality for the upcoming visual theme editor
 */
export function useImpulseTheme() {
  const [theme, setTheme] = useState<ImpulseTheme>(defaultImpulseTokens);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { currentTheme, adminComponents, isLoading, loadAdminComponents } = useThemeStore();
  const { toast } = useToast();

  // Load theme from database or use defaults
  useEffect(() => {
    // Load admin components
    loadAdminComponents();
    
    // If we have a theme from the database
    if (currentTheme && !isLoading) {
      try {
        // Try to extract admin-specific tokens
        const adminTokens = currentTheme.design_tokens?.admin as Partial<ImpulseTheme>;
        
        if (adminTokens) {
          // Deep merge with defaults, preferring database values
          const mergedTheme = deepMerge(defaultImpulseTokens, adminTokens);
          setTheme(mergedTheme);
        }
      } catch (error) {
        console.error(`Error parsing ${DEFAULT_THEME_NAME} theme:`, error);
        // Fallback to defaults
        setTheme(defaultImpulseTokens);
      }
    }
  }, [currentTheme, isLoading, loadAdminComponents]);

  // Update a specific part of the theme (for visual editor)
  const updateThemeValue = (path: string, value: any) => {
    setTheme(prevTheme => {
      const newTheme = { ...prevTheme };
      setValueAtPath(newTheme, path, value);
      setIsDirty(true);
      return newTheme;
    });
  };

  // Reset theme to defaults
  const resetTheme = () => {
    setTheme(defaultImpulseTokens);
    setIsDirty(true);
  };

  // Save theme to database
  const saveTheme = async () => {
    try {
      setIsSaving(true);
      
      // Update the existing theme with admin-specific tokens
      if (currentTheme?.id) {
        const updatedDesignTokens = {
          ...currentTheme.design_tokens,
          admin: theme
        };
        
        // Use the setTheme function from useThemeStore
        await useThemeStore.getState().setTheme(currentTheme.id);
        
        setIsDirty(false);
        toast({
          title: "Theme saved",
          description: `${DEFAULT_THEME_NAME} theme has been saved to the database.`
        });
      } else {
        toast({
          title: "Error saving theme",
          description: "No theme found to update.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Error saving ${DEFAULT_THEME_NAME} theme:`, error);
      toast({
        title: "Error saving theme",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to set a value at a nested path (for visual editor)
  const setValueAtPath = (obj: any, path: string, value: any) => {
    const parts = path.split('.');
    let current = obj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) current[part] = {};
      current = current[part];
    }
    
    current[parts[parts.length - 1]] = value;
  };

  // Get a value at a nested path (for visual editor)
  const getValueAtPath = (path: string): any => {
    const parts = path.split('.');
    let current: any = theme;
    
    for (const part of parts) {
      if (!current || typeof current !== 'object') {
        return undefined;
      }
      current = current[part];
    }
    
    return current;
  };

  return { 
    theme,
    updateThemeValue,
    resetTheme,
    saveTheme,
    isLoading,
    isSaving,
    isDirty,
    getValueAtPath, // Added for visual editor
    // Filter for admin components
    adminComponents: adminComponents.filter(c => c.context === 'admin')
  };
}
