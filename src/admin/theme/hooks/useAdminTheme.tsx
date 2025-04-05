
import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { ComponentTokens, Theme } from '@/types/theme';
import { useToast } from '@/hooks/use-toast';

export function useAdminTheme() {
  const { currentTheme, adminComponents, loadAdminComponents, isLoading } = useThemeStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Load admin components when needed
  useEffect(() => {
    loadAdminComponents();
  }, [loadAdminComponents]);
  
  // Mock saving function - would need to be replaced with actual API call
  const saveTheme = async (updates: Partial<Theme>) => {
    try {
      toast({
        title: "Theme saved",
        description: "The admin theme has been updated successfully."
      });
      return true;
    } catch (error) {
      toast({
        title: "Error saving theme",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
      return false;
    }
  };
  
  return {
    currentTheme,
    adminComponents,
    isLoading,
    isEditing,
    setIsEditing,
    saveTheme
  };
}
