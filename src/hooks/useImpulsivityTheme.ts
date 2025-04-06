
import { useEffect, useState, useCallback } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { syncImpulsivityTheme } from '@/utils/themeSync';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { Theme, DesignTokensStructure, ThemeLogDetails } from '@/types/theme';

/**
 * Hook to apply and synchronize the Impulsivity theme across the application
 */
export function useImpulsivityTheme() {
  const { currentTheme, setTheme, isLoading } = useThemeStore();
  const { toast } = useToast();
  const logger = useLogger('ImpulsivityTheme', LogCategory.UI);
  const [syncInProgress, setSyncInProgress] = useState(false);
  
  // Apply the Impulsivity theme to the main site
  const applyToMainSite = useCallback(async () => {
    try {
      // Set the CSS variables directly for immediate effect
      const rootElement = document.documentElement;
      logger.info('Applying Impulsivity theme colors to CSS variables');
      
      // Apply the Impulsivity theme colors
      rootElement.style.setProperty('--site-primary', '186 100% 50%'); // #00F0FF in HSL
      rootElement.style.setProperty('--site-secondary', '334 100% 59%'); // #FF2D6E in HSL
      rootElement.style.setProperty('--site-effect-color', '#00F0FF');
      rootElement.style.setProperty('--site-effect-secondary', '#FF2D6E');
      rootElement.style.setProperty('--site-effect-tertiary', '#8B5CF6');
      
      // Convert to standard variables to ensure compatibility
      rootElement.style.setProperty('--background', 'hsl(228 47% 8%)'); // #080F1E in HSL
      rootElement.style.setProperty('--foreground', 'hsl(210 40% 98%)'); // #F9FAFB in HSL
      rootElement.style.setProperty('--card', 'hsl(228 47% 11%)');
      rootElement.style.setProperty('--card-foreground', 'hsl(210 40% 98%)');
      rootElement.style.setProperty('--primary', 'hsl(186 100% 50%)');
      rootElement.style.setProperty('--primary-foreground', 'hsl(210 40% 98%)');
      rootElement.style.setProperty('--secondary', 'hsl(334 100% 59%)');
      rootElement.style.setProperty('--secondary-foreground', 'hsl(210 40% 98%)');
      
      // Background colors
      rootElement.style.setProperty('--site-background', '228 47% 8%');
      rootElement.style.setProperty('--site-foreground', '210 40% 98%');
      rootElement.style.setProperty('--site-card', '228 47% 11%');
      rootElement.style.setProperty('--site-card-foreground', '210 40% 98%');
      
      // Add some fallbacks for common HSL colors
      rootElement.style.setProperty('--impulse-primary', '#00F0FF');
      rootElement.style.setProperty('--impulse-secondary', '#FF2D6E');
      rootElement.style.setProperty('--impulse-bg-main', '#121218');
      rootElement.style.setProperty('--impulse-text-primary', '#F6F6F7');
      
      // Update the theme in the store if needed
      if (currentTheme) {
        // Create updated design tokens
        const updatedDesignTokens: DesignTokensStructure = {
          ...(currentTheme.design_tokens || {}),
          colors: {
            ...(currentTheme.design_tokens?.colors || {}),
            primary: '#00F0FF',
            secondary: '#FF2D6E',
            background: '#080F1E',
            foreground: '#F9FAFB',
            card: '#0E172A',
            cardForeground: '#F9FAFB',
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
          try {
            await setTheme(currentTheme.id);
          } catch (error) {
            logger.warn('Failed to set theme in store, using direct application only', {
              errorMessage: error instanceof Error ? error.message : String(error)
            });
          }
        }
      }
      
      const logDetails: ThemeLogDetails = { 
        success: true,
        mainSite: true
      };
      logger.info('Applied Impulsivity theme to main site', logDetails);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const logDetails: ThemeLogDetails = { 
        error: true, 
        errorMessage,
        mainSite: false 
      };
      logger.error('Error applying Impulsivity theme to main site', logDetails);
      
      // Try setting emergency CSS vars directly
      try {
        const rootElement = document.documentElement;
        rootElement.style.setProperty('--site-primary', '186 100% 50%'); // #00F0FF in HSL
        rootElement.style.setProperty('--site-secondary', '334 100% 59%'); // #FF2D6E in HSL
        rootElement.style.setProperty('--site-effect-color', '#00F0FF');
        rootElement.style.setProperty('--site-effect-secondary', '#FF2D6E');
        rootElement.style.setProperty('--site-background', '#080F1E');
        rootElement.style.setProperty('--site-foreground', '#F9FAFB');
        logger.info('Set emergency fallback CSS variables');
      } catch (fallbackError) {
        logger.error('Failed to set emergency CSS variables', {
          errorMessage: fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
        });
      }
      
      return false;
    }
  }, [currentTheme, logger, setTheme]);
  
  // Apply the Impulsivity theme to the admin panel
  const applyToAdmin = useCallback(async () => {
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
        logger.info('Applied Impulsivity theme to admin panel', logDetails);
        return true;
      } else {
        // Try to find and apply to document root as a fallback
        const rootElement = document.documentElement;
        rootElement.style.setProperty('--impulse-primary', '#00F0FF');
        rootElement.style.setProperty('--impulse-secondary', '#FF2D6E');
        rootElement.style.setProperty('--impulse-bg-main', '#121218');
        rootElement.style.setProperty('--impulse-bg-overlay', 'rgba(22, 24, 29, 0.85)');
        rootElement.style.setProperty('--impulse-bg-card', 'rgba(28, 30, 38, 0.7)');
        rootElement.style.setProperty('--impulse-text-primary', '#F6F6F7');
        
        logger.warn('Admin panel root element not found, applied to document root as fallback');
        return true; // Not a critical failure
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const logDetails: ThemeLogDetails = { 
        error: true, 
        errorMessage,
        admin: false 
      };
      logger.error('Error applying Impulsivity theme to admin panel', logDetails);
      return false;
    }
  }, [logger]);
  
  // Sync theme to database
  const syncToDatabase = useCallback(async () => {
    try {
      setSyncInProgress(true);
      logger.info('Starting theme sync to database');
      
      const result = await syncImpulsivityTheme();
      
      if (result) {
        const logDetails: ThemeLogDetails = { 
          success: true,
          database: true
        };
        logger.info('Successfully synced Impulsivity theme to database', logDetails);
      } else {
        const logDetails: ThemeLogDetails = { 
          error: true, 
          success: false,
          database: false
        };
        logger.error('Failed to sync Impulsivity theme to database', logDetails);
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
      logger.error('Error syncing Impulsivity theme to database', logDetails);
      
      setSyncInProgress(false);
      return false;
    }
  }, [logger]);
  
  // Apply theme everywhere
  const applyTheme = useCallback(async () => {
    if (syncInProgress) {
      logger.warn('Theme sync already in progress, skipping');
      return false;
    }
    
    logger.info('Beginning full Impulsivity theme application');
    
    // First apply to main site (most critical)
    const mainSiteResult = await applyToMainSite();
    
    // Then apply to admin if main site succeeded
    const adminResult = await applyToAdmin();
    
    // Finally, sync to DB if it's not blocking the UI
    let dbResult = false;
    try {
      dbResult = await syncToDatabase();
    } catch (error) {
      logger.warn('Database sync failed but continuing', {
        errorMessage: error instanceof Error ? error.message : String(error)
      });
    }
    
    if (mainSiteResult) {
      toast({
        title: "Impulsivity Theme Applied",
        description: "Theme has been applied to the site" + (adminResult ? " and admin panel" : "") + 
                    (dbResult ? " and database" : ""),
      });
      
      const logDetails: ThemeLogDetails = {
        success: true,
        mainSite: mainSiteResult, 
        admin: adminResult, 
        database: dbResult
      };
      
      logger.info('Impulsivity theme applied', logDetails);
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
      
      logger.warn('Impulsivity theme partially applied', logDetails);
      
      return false;
    }
  }, [applyToAdmin, applyToMainSite, logger, syncInProgress, syncToDatabase, toast]);
  
  // Ensure immediate application on mount
  useEffect(() => {
    // Apply immediate styles on mount
    const rootElement = document.documentElement;
    rootElement.style.setProperty('--site-primary', '186 100% 50%'); // #00F0FF in HSL
    rootElement.style.setProperty('--site-secondary', '334 100% 59%'); // #FF2D6E in HSL
    rootElement.style.setProperty('--site-effect-color', '#00F0FF');
    rootElement.style.setProperty('--site-effect-secondary', '#FF2D6E');
    rootElement.style.setProperty('--site-background', '228 47% 8%');
    rootElement.style.setProperty('--site-foreground', '210 40% 98%');

    // Also set direct HSL variables for compatibility
    rootElement.style.setProperty('--background', 'hsl(228, 47%, 8%)');
    rootElement.style.setProperty('--foreground', 'hsl(210, 40%, 98%)');
    
    logger.info('Applied emergency styles on hook mount');
  }, [logger]);
  
  return {
    applyTheme,
    applyToMainSite,
    applyToAdmin,
    syncToDatabase,
    isSyncing: syncInProgress,
    isLoading
  };
}
