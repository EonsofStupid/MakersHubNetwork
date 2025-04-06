
import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/theme/themeStore';
import { syncImpulsivityTheme } from '@/utils/themeSync';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { Theme, ThemeContext, ThemeLogDetails } from '@/types/theme';

/**
 * Hook to apply and synchronize the Impulsivity theme across the application
 */
export function useImpulsivityTheme() {
  const { currentTheme } = useThemeStore();
  const { toast } = useToast();
  const logger = useLogger('ImpulsivityTheme', LogCategory.UI);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Apply the Impulsivity theme to the main site
  const applyToMainSite = async () => {
    try {
      // Set the CSS variables directly for immediate effect
      const rootElement = document.documentElement;
      
      // Apply the Impulsivity theme colors
      if (rootElement) {
        rootElement.style.setProperty('--site-primary', '186 100% 50%');
        rootElement.style.setProperty('--site-secondary', '334 100% 59%');
        rootElement.style.setProperty('--site-effect-color', '#00F0FF');
        rootElement.style.setProperty('--site-effect-secondary', '#FF2D6E');
        rootElement.style.setProperty('--site-effect-tertiary', '#8B5CF6');
      }
      
      // Update the theme in the store if needed
      if (currentTheme) {
        // Create updated design tokens
        const updatedDesignTokens = {
          ...(currentTheme.design_tokens || {}),
          colors: {
            ...(currentTheme.design_tokens?.colors || {}),
            primary: '186 100% 50%',
            secondary: '334 100% 59%',
          },
          effects: {
            ...(currentTheme.design_tokens?.effects || { shadows: {}, blurs: {}, gradients: {} }),
            primary: '#00F0FF',
            secondary: '#FF2D6E',
            tertiary: '#8B5CF6',
          }
        };
        
        // Log what we're trying to do
        logger.info('Updating theme design tokens with Impulsivity colors');
      }
      
      const logDetails: ThemeLogDetails = { 
        success: true,
        mainSite: true
      };
      logger.info('Applied Impulsivity theme to main site', { details: logDetails });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const logDetails: ThemeLogDetails = { 
        error: true, 
        errorMessage,
        mainSite: false 
      };
      logger.error('Error applying Impulsivity theme to main site', { details: logDetails });
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
        
        const logDetails: ThemeLogDetails = { 
          success: true,
          admin: true 
        };
        logger.info('Applied Impulsivity theme to admin panel', { details: logDetails });
        return true;
      } else {
        logger.warn('Admin panel root element not found, skipping theme application');
        return true; // Not a critical failure
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const logDetails: ThemeLogDetails = { 
        error: true, 
        errorMessage,
        admin: false 
      };
      logger.error('Error applying Impulsivity theme to admin panel', { details: logDetails });
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
        const logDetails: ThemeLogDetails = { 
          success: true,
          database: true
        };
        logger.info('Successfully synced Impulsivity theme to database', { details: logDetails });
      } else {
        const logDetails: ThemeLogDetails = { 
          error: true, 
          success: false,
          database: false
        };
        logger.error('Failed to sync Impulsivity theme to database', { details: logDetails });
      }
      
      setSyncInProgress(false);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const logDetails: ThemeLogDetails = { 
        error: true, 
        errorMessage,
        database: false
      };
      logger.error('Error syncing Impulsivity theme to database', { details: logDetails });
      
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
      
      const logDetails: ThemeLogDetails = {
        success: true,
        mainSite: true, 
        admin: true, 
        database: true
      };
      
      logger.info('Impulsivity theme fully applied', { details: logDetails });
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
      
      const logDetails: ThemeLogDetails = {
        warning: true,
        success: false,
        mainSite: mainSiteResult, 
        admin: adminResult, 
        database: dbResult
      };
      
      logger.warn('Impulsivity theme partially applied', { details: logDetails });
      
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
