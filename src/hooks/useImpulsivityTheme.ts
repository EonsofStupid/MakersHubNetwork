
import { useState } from 'react';
import { useThemeStore } from '@/stores/theme/themeStore';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';
import { DesignTokensStructure } from '@/types/theme';
import { updateThemeColors, updateThemeEffects } from '@/utils/themeTokenUtils';

/**
 * Sync theme with database (implementation depends on your backend)
 */
async function syncImpulsivityTheme(): Promise<boolean> {
  // This would be implemented to sync with the database
  return Promise.resolve(true);
}

/**
 * Hook to apply and synchronize the Impulsivity theme across the application
 */
export function useImpulsivityTheme() {
  const { currentTheme, tokens } = useThemeStore();
  const { toast } = useToast();
  const logger = useLogger('ImpulsivityTheme', LogCategory.UI);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const applyToMainSite = async () => {
    try {
      // Define type-safe CSS variables
      const rootElement = document.documentElement;
      
      // Apply theme CSS variables with proper type safety
      rootElement.style.setProperty('--site-primary', tokens.primary || '186 100% 50%');
      rootElement.style.setProperty('--site-secondary', tokens.secondary || '334 100% 59%');
      rootElement.style.setProperty('--site-effect-color', tokens.effectPrimary || '#00F0FF');
      rootElement.style.setProperty('--site-effect-secondary', tokens.effectSecondary || '#FF2D6E');
      rootElement.style.setProperty('--site-effect-tertiary', tokens.effectTertiary || '#8B5CF6');
      
      if (currentTheme) {
        // Create safe default structure if needed
        const safeDesignTokens: DesignTokensStructure = currentTheme.design_tokens || {
          colors: {
            primary: '186 100% 50%',
            secondary: '334 100% 59%',
          },
          effects: {
            shadows: {},
            blurs: {},
            gradients: {},
            primary: '#00F0FF',
            secondary: '#FF2D6E',
            tertiary: '#8B5CF6'
          }
        };
        
        // Use our utility function to safely update design tokens
        const updatedDesignTokens = updateThemeColors(safeDesignTokens, {
          primary: tokens.primary || '186 100% 50%',
          secondary: tokens.secondary || '334 100% 59%',
        });
        
        const finalTokens = updateThemeEffects(updatedDesignTokens, {
          primary: tokens.effectPrimary || '#00F0FF',
          secondary: tokens.effectSecondary || '#FF2D6E',
          tertiary: tokens.effectTertiary || '#8B5CF6',
        });
        
        logger.info('Updating theme design tokens with Impulsivity colors');
      }
      
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
    try {
      const adminRootElement = document.querySelector('.impulse-admin-root');
      if (adminRootElement) {
        // Apply CSS variables with proper type safety
        (adminRootElement as HTMLElement).style.setProperty('--impulse-primary', tokens.effectPrimary || '#00F0FF');
        (adminRootElement as HTMLElement).style.setProperty('--impulse-secondary', tokens.effectSecondary || '#FF2D6E');
        (adminRootElement as HTMLElement).style.setProperty('--impulse-bg-main', '#121218');
        (adminRootElement as HTMLElement).style.setProperty('--impulse-bg-overlay', 'rgba(22, 24, 29, 0.85)');
        (adminRootElement as HTMLElement).style.setProperty('--impulse-bg-card', 'rgba(28, 30, 38, 0.7)');
        (adminRootElement as HTMLElement).style.setProperty('--impulse-text-primary', '#F6F6F7');
        (adminRootElement as HTMLElement).style.setProperty('--impulse-text-secondary', 'rgba(255, 255, 255, 0.7)');
        (adminRootElement as HTMLElement).style.setProperty('--impulse-text-accent', tokens.effectPrimary || '#00F0FF');
        (adminRootElement as HTMLElement).style.setProperty('--impulse-border-normal', 'rgba(0, 240, 255, 0.2)');
        (adminRootElement as HTMLElement).style.setProperty('--impulse-border-hover', 'rgba(0, 240, 255, 0.4)');
        (adminRootElement as HTMLElement).style.setProperty('--impulse-border-active', 'rgba(0, 240, 255, 0.6)');
        (adminRootElement as HTMLElement).style.setProperty('--impulse-glow-primary', '0 0 15px rgba(0, 240, 255, 0.7)');
        (adminRootElement as HTMLElement).style.setProperty('--impulse-glow-secondary', '0 0 15px rgba(255, 45, 110, 0.7)');
        
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
      
      const result = await syncImpulsivityTheme();
      
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
