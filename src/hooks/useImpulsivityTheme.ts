import { useState } from 'react';
import { useThemeStore } from '@/stores/theme/themeStore';
import { syncImpulsivityTheme } from '@/utils/themeSync';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Hook to apply and synchronize the Impulsivity theme across the application
 */
export function useImpulsivityTheme() {
  const { currentTheme, tokens } = useThemeStore();
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
        // Apply CSS variables properly with type safety
        rootElement.style.setProperty('--site-primary', tokens.primary || '186 100% 50%');
        rootElement.style.setProperty('--site-secondary', tokens.secondary || '334 100% 59%');
        rootElement.style.setProperty('--site-effect-color', tokens.effectPrimary || '#00F0FF');
        rootElement.style.setProperty('--site-effect-secondary', tokens.effectSecondary || '#FF2D6E');
        rootElement.style.setProperty('--site-effect-tertiary', tokens.effectTertiary || '#8B5CF6');
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
      
      logger.info('Applied Impulsivity theme to main site', { 
        details: {
          success: true,
          mainSite: true
        },
        category: LogCategory.UI
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Error applying Impulsivity theme to main site', { 
        details: { 
          error: true, 
          errorMessage,
          mainSite: false 
        },
        category: LogCategory.UI
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
        // Create a CSS style string with all variables
        const cssVars = `
          --impulse-primary: ${tokens.effectPrimary || '#00F0FF'};
          --impulse-secondary: ${tokens.effectSecondary || '#FF2D6E'};
          --impulse-bg-main: #121218;
          --impulse-bg-overlay: rgba(22, 24, 29, 0.85);
          --impulse-bg-card: rgba(28, 30, 38, 0.7);
          --impulse-text-primary: #F6F6F7;
          --impulse-text-secondary: rgba(255, 255, 255, 0.7);
          --impulse-text-accent: ${tokens.effectPrimary || '#00F0FF'};
          --impulse-border-normal: rgba(0, 240, 255, 0.2);
          --impulse-border-hover: rgba(0, 240, 255, 0.4);
          --impulse-border-active: rgba(0, 240, 255, 0.6);
          --impulse-glow-primary: 0 0 15px rgba(0, 240, 255, 0.7);
          --impulse-glow-secondary: 0 0 15px rgba(255, 45, 110, 0.7);
        `;
        
        // Apply all CSS variables at once
        adminRootElement.setAttribute('style', cssVars);
        
        logger.info('Applied Impulsivity theme to admin panel', { 
          details: {
            success: true,
            admin: true 
          },
          category: LogCategory.UI 
        });
        return true;
      } else {
        logger.warn('Admin panel root element not found, skipping theme application', {
          category: LogCategory.UI
        });
        return true; // Not a critical failure
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Error applying Impulsivity theme to admin panel', { 
        details: { 
          error: true, 
          errorMessage,
          admin: false 
        },
        category: LogCategory.UI
      });
      return false;
    }
  };
  
  // Sync theme to database
  const syncToDatabase = async () => {
    try {
      setSyncInProgress(true);
      logger.info('Starting theme sync to database', {
        category: LogCategory.UI
      });
      
      const result = await syncImpulsivityTheme();
      
      if (result) {
        logger.info('Successfully synced Impulsivity theme to database', { 
          details: {
            success: true,
            database: true
          },
          category: LogCategory.UI
        });
      } else {
        logger.error('Failed to sync Impulsivity theme to database', { 
          details: {
            error: true, 
            success: false,
            database: false
          },
          category: LogCategory.UI
        });
      }
      
      setSyncInProgress(false);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Error syncing Impulsivity theme to database', { 
        details: { 
          error: true, 
          errorMessage,
          database: false
        },
        category: LogCategory.UI
      });
      
      setSyncInProgress(false);
      return false;
    }
  };
  
  // Apply theme everywhere
  const applyTheme = async () => {
    if (syncInProgress) {
      logger.warn('Theme sync already in progress, skipping', {
        category: LogCategory.UI
      });
      return false;
    }
    
    logger.info('Beginning full Impulsivity theme application', {
      category: LogCategory.UI
    });
    
    const mainSiteResult = await applyToMainSite();
    const adminResult = await applyToAdmin();
    const dbResult = await syncToDatabase();
    
    if (mainSiteResult && adminResult && dbResult) {
      toast({
        title: "Impulsivity Theme Applied",
        description: "The theme has been successfully applied across the entire application.",
      });
      
      logger.info('Impulsivity theme fully applied', { 
        details: {
          success: true,
          mainSite: true, 
          admin: true, 
          database: true
        },
        category: LogCategory.UI
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
        details: {
          warning: true,
          success: false,
          mainSite: mainSiteResult, 
          admin: adminResult, 
          database: dbResult
        },
        category: LogCategory.UI
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
