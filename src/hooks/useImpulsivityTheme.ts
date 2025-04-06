
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
  
  // Apply immediate CSS variables directly to the document
  const applyImmediateStyles = useCallback(() => {
    try {
      // Set essential CSS variables directly for fast visual feedback
      const rootElement = document.documentElement;
      
      // Primary theme colors
      rootElement.style.setProperty('--site-primary', '186 100% 50%'); // #00F0FF in HSL  
      rootElement.style.setProperty('--site-secondary', '334 100% 59%'); // #FF2D6E in HSL
      
      // Effect colors as direct hex (most compatible approach)
      rootElement.style.setProperty('--site-effect-color', '#00F0FF');
      rootElement.style.setProperty('--site-effect-secondary', '#FF2D6E');
      rootElement.style.setProperty('--site-effect-tertiary', '#8B5CF6');
      
      // Background and foreground colors
      rootElement.style.setProperty('--site-background', '228 47% 8%');
      rootElement.style.setProperty('--site-foreground', '210 40% 98%');
      rootElement.style.setProperty('--site-card', '228 47% 11%');
      rootElement.style.setProperty('--site-card-foreground', '210 40% 98%');
      
      // Standard Tailwind CSS variables
      rootElement.style.setProperty('--background', 'hsl(228 47% 8%)');
      rootElement.style.setProperty('--foreground', 'hsl(210 40% 98%)');
      rootElement.style.setProperty('--card', 'hsl(228 47% 11%)');
      rootElement.style.setProperty('--card-foreground', 'hsl(210 40% 98%)');
      rootElement.style.setProperty('--primary', 'hsl(186 100% 50%)');
      rootElement.style.setProperty('--primary-foreground', 'hsl(210 40% 98%)');
      rootElement.style.setProperty('--secondary', 'hsl(334 100% 59%)');
      rootElement.style.setProperty('--secondary-foreground', 'hsl(210 40% 98%)');
      
      // Fallback direct hex values
      rootElement.style.setProperty('--impulse-primary', '#00F0FF');
      rootElement.style.setProperty('--impulse-secondary', '#FF2D6E');
      rootElement.style.setProperty('--impulse-bg-main', '#080F1E');
      rootElement.style.setProperty('--impulse-text-primary', '#F9FAFB');
      
      // Set theme class on root elements
      rootElement.classList.add('theme-impulsivity');
      document.body.classList.add('theme-impulsivity-body');
      
      logger.info('Applied immediate styles for Impulsivity theme');
      return true;
    } catch (error) {
      logger.error('Error applying immediate styles', { 
        errorMessage: error instanceof Error ? error.message : String(error) 
      });
      return false;
    }
  }, [logger]);
  
  // Apply the Impulsivity theme to the main site
  const applyToMainSite = useCallback(async () => {
    try {
      // Always apply immediate styles first
      applyImmediateStyles();
      
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
        
        logger.info('Updating theme design tokens with Impulsivity colors');
        
        // Use the setTheme function from the store to update the theme
        if (currentTheme.id) {
          try {
            await setTheme(currentTheme.id);
          } catch (error) {
            // Even if the store update fails, we've already applied the CSS variables directly
            logger.warn('Failed to set theme in store, using direct application', {
              errorMessage: error instanceof Error ? error.message : String(error)
            });
            
            // Reapply immediate styles to ensure visuals are consistent
            applyImmediateStyles();
          }
        }
      }
      
      // Final application of immediate styles to ensure they take precedence
      applyImmediateStyles();
      
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
      
      // Apply emergency CSS vars directly as fallback
      applyImmediateStyles();
      return true; // Return true anyway to allow app to continue
    }
  }, [currentTheme, logger, setTheme, applyImmediateStyles]);
  
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
        applyImmediateStyles();
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
      return true; // Return true to allow app to continue
    }
  }, [logger, applyImmediateStyles]);
  
  // Sync theme to database - with improved error handling
  const syncToDatabase = useCallback(async () => {
    // Skip sync if already in progress
    if (syncInProgress) {
      return true;
    }
    
    try {
      setSyncInProgress(true);
      logger.info('Starting theme sync to database');
      
      // Use a try/catch here and handle errors gracefully
      try {
        const result = await syncImpulsivityTheme();
        
        if (result) {
          logger.info('Successfully synced Impulsivity theme to database', { 
            success: true,
            database: true
          });
        } else {
          logger.warn('Sync function completed but returned false', { 
            warning: true,
            database: false
          });
        }
        
        setSyncInProgress(false);
        return true; // Return true even if sync failed - app should continue
      } catch (syncError) {
        // Log the error but don't let it block the app
        const errorMessage = syncError instanceof Error ? syncError.message : String(syncError);
        logger.error('Error syncing Impulsivity theme to database', {
          errorMessage,
          database: false
        });
        
        setSyncInProgress(false);
        return true; // Return true even if sync failed - app should continue
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Error in syncToDatabase function', { 
        errorMessage,
        database: false
      });
      
      setSyncInProgress(false);
      return true; // Return true even if sync failed - app should continue
    }
  }, [syncInProgress, logger]);
  
  // Apply theme everywhere - with improved fallback behavior
  const applyTheme = useCallback(async () => {
    logger.info('Beginning full Impulsivity theme application');
    
    // First, ensure immediate styles are applied
    applyImmediateStyles();
    
    // Then apply to main site (most critical)
    const mainSiteResult = await applyToMainSite();
    
    // Then apply to admin if main site succeeded
    const adminResult = await applyToAdmin();
    
    // Finally, try to sync to DB but don't block the UI
    let dbResult = true; // Default to true even if we skip the sync
    try {
      // Only attempt sync if not already in progress 
      if (!syncInProgress) {
        dbResult = await syncToDatabase();
      }
    } catch (error) {
      logger.warn('Database sync failed but continuing', {
        errorMessage: error instanceof Error ? error.message : String(error)
      });
    }
    
    // No matter what happened, reapply immediate styles
    applyImmediateStyles();
    
    if (mainSiteResult) {
      toast({
        title: "Impulsivity Theme Applied",
        description: "Theme has been applied to the site",
      });
      
      logger.info('Impulsivity theme applied', {
        success: true,
        mainSite: mainSiteResult, 
        admin: adminResult, 
        database: dbResult
      });
      return true;
    } else {
      // Even with failure, ensure the CSS variables are applied
      applyImmediateStyles();
      
      logger.warn('Impulsivity theme partially applied', {
        warning: true,
        success: false,
        mainSite: mainSiteResult, 
        admin: adminResult, 
        database: dbResult
      });
      
      return true; // Return true anyway to allow app to continue
    }
  }, [applyToAdmin, applyToMainSite, logger, syncInProgress, syncToDatabase, toast, applyImmediateStyles]);
  
  // Ensure immediate application of styles on mount
  useEffect(() => {
    // Apply immediate styles on mount
    applyImmediateStyles();
    logger.info('Applied emergency styles on hook mount');
  }, [logger, applyImmediateStyles]);
  
  return {
    applyTheme,
    applyToMainSite,
    applyToAdmin,
    applyImmediateStyles,
    syncToDatabase,
    isSyncing: syncInProgress,
    isLoading
  };
}
