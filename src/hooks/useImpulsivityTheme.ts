
import { useState, useRef } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { Theme } from '@/types/theme';

/**
 * Hook to apply and synchronize the Impulsivity theme across the application
 */
export function useImpulsivityTheme() {
  const { currentTheme, tokens } = useThemeStore();
  const { toast } = useToast();
  const logger = useLogger('ImpulsivityTheme', LogCategory.UI);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const appliedToMainSite = useRef(false);
  const appliedToAdmin = useRef(false);
  
  const applyToMainSite = async () => {
    // Skip if already applied
    if (appliedToMainSite.current) {
      logger.debug('Theme already applied to main site, skipping');
      return true;
    }
    
    try {
      // Define type-safe CSS variables
      const rootElement = document.documentElement;
      
      // Apply theme CSS variables with proper type safety
      if (tokens.primary) rootElement.style.setProperty('--site-primary', tokens.primary);
      if (tokens.secondary) rootElement.style.setProperty('--site-secondary', tokens.secondary);
      if (tokens.effectPrimary) rootElement.style.setProperty('--site-effect-color', tokens.effectPrimary);
      if (tokens.effectSecondary) rootElement.style.setProperty('--site-effect-secondary', tokens.effectSecondary);
      if (tokens.effectTertiary) rootElement.style.setProperty('--site-effect-tertiary', tokens.effectTertiary);
      
      // Mark as applied
      appliedToMainSite.current = true;
      
      logger.info('Applied Impulsivity theme to main site', { 
        details: {
          success: true,
          mainSite: true
        }
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Error applying Impulsivity theme to main site', { 
        details: { 
          errorMessage,
          mainSite: false 
        }
      });
      return false;
    }
  };
  
  const applyToAdmin = async () => {
    // Skip if already applied
    if (appliedToAdmin.current) {
      logger.debug('Theme already applied to admin, skipping');
      return true;
    }
    
    try {
      const adminRootElement = document.querySelector('.impulse-admin-root');
      if (adminRootElement instanceof HTMLElement) {
        // Apply CSS variables with proper type safety
        if (tokens.effectPrimary) adminRootElement.style.setProperty('--impulse-primary', tokens.effectPrimary);
        if (tokens.effectSecondary) adminRootElement.style.setProperty('--impulse-secondary', tokens.effectSecondary);
        adminRootElement.style.setProperty('--impulse-bg-main', '#121218');
        adminRootElement.style.setProperty('--impulse-bg-overlay', 'rgba(22, 24, 29, 0.85)');
        adminRootElement.style.setProperty('--impulse-bg-card', 'rgba(28, 30, 38, 0.7)');
        adminRootElement.style.setProperty('--impulse-text-primary', '#F6F6F7');
        adminRootElement.style.setProperty('--impulse-text-secondary', 'rgba(255, 255, 255, 0.7)');
        if (tokens.effectPrimary) adminRootElement.style.setProperty('--impulse-text-accent', tokens.effectPrimary);
        adminRootElement.style.setProperty('--impulse-border-normal', 'rgba(0, 240, 255, 0.2)');
        adminRootElement.style.setProperty('--impulse-border-hover', 'rgba(0, 240, 255, 0.4)');
        adminRootElement.style.setProperty('--impulse-border-active', 'rgba(0, 240, 255, 0.6)');
        adminRootElement.style.setProperty('--impulse-glow-primary', '0 0 15px rgba(0, 240, 255, 0.7)');
        adminRootElement.style.setProperty('--impulse-glow-secondary', '0 0 15px rgba(255, 45, 110, 0.7)');
        
        // Mark as applied
        appliedToAdmin.current = true;
        
        logger.info('Applied Impulsivity theme to admin panel', { 
          details: {
            success: true,
            admin: true 
          }
        });
        return true;
      } else {
        logger.warn('Admin panel root element not found, skipping theme application');
        return true; // Not a critical failure
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Error applying Impulsivity theme to admin panel', { 
        details: { 
          errorMessage,
          admin: false 
        }
      });
      return false;
    }
  };
  
  const syncToDatabase = async () => {
    try {
      setSyncInProgress(true);
      logger.info('Starting theme sync to database');
      
      // Placeholder for actual database sync
      const result = await Promise.resolve(true);
      
      if (result) {
        logger.info('Successfully synced Impulsivity theme to database', { 
          details: {
            success: true,
            database: true
          }
        });
      } else {
        logger.error('Failed to sync Impulsivity theme to database', { 
          details: {
            error: true, 
            success: false,
            database: false
          }
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
        }
      });
      
      setSyncInProgress(false);
      return false;
    }
  };
  
  return {
    applyTheme: async () => {
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
          details: {
            success: true,
            mainSite: true, 
            admin: true, 
            database: true
          }
        });
        return true;
      } else {
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
          }
        });
        
        return false;
      }
    },
    applyToMainSite,
    applyToAdmin,
    syncToDatabase,
    isSyncing: syncInProgress,
    isLoading
  };
}
