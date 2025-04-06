
import { useEffect, useState } from 'react';
import { useImpulsivityTheme } from '@/hooks/useImpulsivityTheme';
import { useToast } from '@/hooks/use-toast';
import { useThemeStore } from '@/stores/theme/store';
import { setImpulsivityAsDefault, syncAnimations } from '@/utils/themeSync';
import { landingComponentTokens, adminComponentTokens } from '@/theme/componentTokens/landingComponents';

interface ImpulsivityThemeInitializerProps {
  children: React.ReactNode;
}

/**
 * Component that initializes and ensures Impulsivity theme is properly applied
 * across the entire application
 */
export function ImpulsivityThemeInitializer({ children }: ImpulsivityThemeInitializerProps) {
  const { applyTheme, isSyncing } = useImpulsivityTheme();
  const { toast } = useToast();
  const { currentTheme } = useThemeStore();
  const [initialized, setInitialized] = useState(false);

  // Initialize Impulsivity theme on component mount
  useEffect(() => {
    const initializeTheme = async () => {
      if (initialized || isSyncing) return;

      try {
        // Apply the theme to both site and admin
        const result = await applyTheme();
        
        if (result) {
          // Set Impulsivity as default theme
          await setImpulsivityAsDefault();
          
          // Sync animations to database
          await syncAnimations();
          
          // Sync component tokens (in a real implementation, this would be done through an API)
          
          setInitialized(true);
        }
      } catch (error) {
        toast({
          title: "Theme Initialization Error",
          description: error instanceof Error ? error.message : "Failed to initialize theme",
          variant: "destructive"
        });
      }
    };
    
    // Initialize theme asynchronously
    initializeTheme();
  }, [applyTheme, toast, isSyncing, initialized, currentTheme]);
  
  // The initializer is just a container, it doesn't render anything additional
  return <>{children}</>;
}
