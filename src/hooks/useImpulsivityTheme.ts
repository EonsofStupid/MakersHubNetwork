
import { useEffect } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { useAdminStore } from '@/admin/store/admin.store';
import { syncImpulsivityTheme } from '@/utils/themeSync';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Hook to apply and synchronize the Impulsivity theme across the application
 */
export function useImpulsivityTheme() {
  const { themeTokens, setThemeTokens } = useThemeStore();
  const adminStore = useAdminStore();
  const { toast } = useToast();
  const logger = useLogger('ImpulsivityTheme', LogCategory.UI);
  
  // Apply the Impulsivity theme to the main site
  const applyToMainSite = async () => {
    try {
      // Set the CSS variables directly for immediate effect
      const rootElement = document.documentElement;
      
      // Apply the Impulsivity theme colors
      rootElement.style.setProperty('--site-primary', '186 100% 50%'); // #00F0FF in HSL
      rootElement.style.setProperty('--site-secondary', '334 100% 59%'); // #FF2D6E in HSL
      rootElement.style.setProperty('--site-effect-color', '#00F0FF');
      rootElement.style.setProperty('--site-effect-secondary', '#FF2D6E');
      rootElement.style.setProperty('--site-effect-tertiary', '#8B5CF6');
      
      // Update the theme tokens in the store
      setThemeTokens({
        ...themeTokens,
        colors: {
          ...(themeTokens?.colors || {}),
          primary: '#00F0FF',
          secondary: '#FF2D6E',
        },
        effects: {
          ...(themeTokens?.effects || {}),
          primary: '#00F0FF',
          secondary: '#FF2D6E',
          tertiary: '#8B5CF6',
        }
      });
      
      logger.info('Applied Impulsivity theme to main site');
      return true;
    } catch (error) {
      logger.error('Error applying Impulsivity theme to main site', { details: error });
      return false;
    }
  };
  
  // Apply the Impulsivity theme to the admin panel
  const applyToAdmin = async () => {
    try {
      // Update admin theme variables
      const adminRootElement = document.querySelector('.impulse-admin-root');
      if (adminRootElement) {
        adminRootElement.setAttribute('style', `
          --impulse-primary: #00F0FF;
          --impulse-secondary: #FF2D6E;
          --impulse-bg-main: #121218;
          --impulse-bg-overlay: rgba(22, 24, 29, 0.85);
          --impulse-bg-card: rgba(28, 30, 38, 0.7);
          --impulse-text-primary: #F6F6F7;
          --impulse-text-secondary: rgba(255, 255, 255, 0.7);
          --impulse-text-accent: #00F0FF;
          --impulse-border-normal: rgba(0, 240, 255, 0.2);
          --impulse-border-hover: rgba(0, 240, 255, 0.4);
          --impulse-border-active: rgba(0, 240, 255, 0.6);
          --impulse-glow-primary: 0 0 15px rgba(0, 240, 255, 0.7);
          --impulse-glow-secondary: 0 0 15px rgba(255, 45, 110, 0.7);
        `);
      }
      
      logger.info('Applied Impulsivity theme to admin panel');
      return true;
    } catch (error) {
      logger.error('Error applying Impulsivity theme to admin panel', { details: error });
      return false;
    }
  };
  
  // Sync theme to database
  const syncToDatabase = async () => {
    try {
      const result = await syncImpulsivityTheme();
      
      if (result) {
        logger.info('Successfully synced Impulsivity theme to database');
      } else {
        logger.error('Failed to sync Impulsivity theme to database');
      }
      
      return result;
    } catch (error) {
      logger.error('Error syncing Impulsivity theme to database', { details: error });
      return false;
    }
  };
  
  // Apply theme everywhere
  const applyTheme = async () => {
    const mainSiteResult = await applyToMainSite();
    const adminResult = await applyToAdmin();
    const dbResult = await syncToDatabase();
    
    if (mainSiteResult && adminResult && dbResult) {
      toast({
        title: "Impulsivity Theme Applied",
        description: "The theme has been successfully applied across the entire application.",
      });
      return true;
    } else {
      toast({
        title: "Theme Application Incomplete",
        description: "Some parts of the theme could not be applied.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return {
    applyTheme,
    applyToMainSite,
    applyToAdmin,
    syncToDatabase,
  };
}
