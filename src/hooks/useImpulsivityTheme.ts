
import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { syncImpulsivityTheme } from '@/utils/themeSync';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { Theme, DesignTokensStructure, ThemeContext } from '@/types/theme';

/**
 * Hook to apply and synchronize the Impulsivity theme across the application
 */
export function useImpulsivityTheme() {
  const { currentTheme, setTheme, isLoading } = useThemeStore();
  const { toast } = useToast();
  const logger = useLogger('ImpulsivityTheme', LogCategory.UI);
  const [syncInProgress, setSyncInProgress] = useState(false);
  
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
      
      // Update the theme in the store if needed
      if (currentTheme) {
        // Create updated design tokens
        const updatedDesignTokens: DesignTokensStructure = {
          ...(currentTheme.design_tokens || {}),
          colors: {
            ...(currentTheme.design_tokens?.colors || {}),
            primary: '#00F0FF',
            secondary: '#FF2D6E',
          },
          effects: {
            ...(currentTheme.design_tokens?.effects || {}),
            shadows: currentTheme.design_tokens?.effects?.shadows || {},
            blurs: currentTheme.design_tokens?.effects?.blurs || {},
            gradients: currentTheme.design_tokens?.effects?.gradients || {},
            primary: '#00F0FF',
            secondary: '#FF2D6E',
            tertiary: '#8B5CF6',
          }
        };
        
        // Update theme with the new design tokens
        const updatedTheme: Theme = {
          ...currentTheme,
          design_tokens: updatedDesignTokens
        };
        
        // Log what we're trying to do
        logger.info('Updating theme design tokens with Impulsivity colors');
        
        // Use the setTheme function from the store to update the theme
        if (currentTheme.id) {
          await setTheme(currentTheme.id);
        }
      }
      
      logger.info('Applied Impulsivity theme to main site', { 
        success: true 
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Error applying Impulsivity theme to main site', { 
        error: true, 
        errorMessage 
      });
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
        
        logger.info('Applied Impulsivity theme to admin panel', { 
          success: true 
        });
        return true;
      } else {
        logger.warn('Admin panel root element not found, skipping theme application');
        return true; // Not a critical failure
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Error applying Impulsivity theme to admin panel', { 
        error: true, 
        errorMessage 
      });
      return false;
    }
  };
  
  // Sync theme to database
  const syncToDatabase = async () => {
    try {
      setSyncInProgress(true);
      logger.info('Starting theme sync to database');
      
      const result = await syncImpulsivityTheme();
      
      if (result) {
        logger.info('Successfully synced Impulsivity theme to database', { 
          success: true 
        });
      } else {
        logger.error('Failed to sync Impulsivity theme to database', { 
          error: true, 
          success: false 
        });
      }
      
      setSyncInProgress(false);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Error syncing Impulsivity theme to database', { 
        error: true, 
        errorMessage 
      });
      
      setSyncInProgress(false);
      return false;
    }
  };
  
  // Apply theme everywhere
  const applyTheme = async () => {
    if (syncInProgress) {
      logger.warn('Theme sync already in progress, skipping');
      return false;
    }
    
    logger.info('Beginning full Impulsivity theme application');
    
    const mainSiteResult = await applyToMainSite();
    const adminResult = await applyToAdmin();
    const dbResult = await syncToDatabase();
    
    if (mainSiteResult && adminResult && dbResult) {
      toast({
        title: "Impulsivity Theme Applied",
        description: "The theme has been successfully applied across the entire application.",
      });
      
      logger.info('Impulsivity theme fully applied', {
        success: true,
        mainSite: mainSiteResult, 
        admin: adminResult, 
        database: dbResult
      });
      return true;
    } else {
      // Show toast with partial success message
      const failedComponents = [];
      if (!mainSiteResult) failedComponents.push('main site');
      if (!adminResult) failedComponents.push('admin panel');
      if (!dbResult) failedComponents.push('database');
      
      toast({
        title: "Theme Application Incomplete",
        description: `Could not apply theme to: ${failedComponents.join(', ')}`,
        variant: "destructive",
      });
      
      logger.warn('Impulsivity theme partially applied', {
        warning: true,
        success: false,
        mainSite: mainSiteResult, 
        admin: adminResult, 
        database: dbResult
      });
      
      return false;
    }
  };
  
  return {
    applyTheme,
    applyToMainSite,
    applyToAdmin,
    syncToDatabase,
    isSyncing: syncInProgress,
    isLoading
  };
}
