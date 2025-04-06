import { useState } from 'react';
import { useThemeStore } from '@/stores/theme/themeStore';
import { syncImpulsivityTheme } from '@/utils/themeSync';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface ThemeCssVars {
  [key: string]: string;
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
      const cssVars: ThemeCssVars = {
        '--site-primary': tokens.primary || '186 100% 50%',
        '--site-secondary': tokens.secondary || '334 100% 59%',
        '--site-effect-color': tokens.effectPrimary || '#00F0FF',
        '--site-effect-secondary': tokens.effectSecondary || '#FF2D6E',
        '--site-effect-tertiary': tokens.effectTertiary || '#8B5CF6'
      };
      
      const rootElement = document.documentElement;
      Object.entries(cssVars).forEach(([key, value]) => {
        rootElement.style.setProperty(key, value);
      });
      
      if (currentTheme) {
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
  
  const applyToAdmin = async () => {
    try {
      const adminRootElement = document.querySelector('.impulse-admin-root');
      if (adminRootElement) {
        const cssVars: Record<string, string> = {
          '--impulse-primary': tokens.effectPrimary || '#00F0FF',
          '--impulse-secondary': tokens.effectSecondary || '#FF2D6E',
          '--impulse-bg-main': '#121218',
          '--impulse-bg-overlay': 'rgba(22, 24, 29, 0.85)',
          '--impulse-bg-card': 'rgba(28, 30, 38, 0.7)',
          '--impulse-text-primary': '#F6F6F7',
          '--impulse-text-secondary': 'rgba(255, 255, 255, 0.7)',
          '--impulse-text-accent': tokens.effectPrimary || '#00F0FF',
          '--impulse-border-normal': 'rgba(0, 240, 255, 0.2)',
          '--impulse-border-hover': 'rgba(0, 240, 255, 0.4)',
          '--impulse-border-active': 'rgba(0, 240, 255, 0.6)',
          '--impulse-glow-primary': '0 0 15px rgba(0, 240, 255, 0.7)',
          '--impulse-glow-secondary': '0 0 15px rgba(255, 45, 110, 0.7)'
        };
        
        Object.entries(cssVars).forEach(([key, value]: [string, string]) => {
          (adminRootElement as HTMLElement).style.setProperty(key, value);
        });
        
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
