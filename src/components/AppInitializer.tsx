
import { ReactNode, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useThemeStore } from '@/stores/theme/themeStore';
import { ThemeLoadingState } from './theme/info/ThemeLoadingState';

interface AppInitializerProps {
  children: ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const { toast } = useToast();
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);
  const [initialized, setInitialized] = useState(false);
  const { loadStatus, loadTheme } = useThemeStore();
  
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Log initialization
        logger.info('Initializing application', {
          details: { themeStatus: loadStatus }
        });
        
        // Pre-fetch the theme if not already loading
        if (loadStatus === 'idle') {
          await loadTheme('app');
        }
        
        // Mark as initialized
        setInitialized(true);
        
        // Log success
        logger.info('Application initialized successfully', {
          details: { themeLoaded: loadStatus === 'loaded' }
        });
        
      } catch (error) {
        // Log error
        logger.error('Failed to initialize application', { 
          details: { 
            error: error instanceof Error ? error.message : String(error) 
          }
        });
        
        // Show error toast
        toast({
          title: 'Initialization Failed',
          description: 'Failed to initialize application. Some features may not work properly.',
          variant: 'destructive',
        });
        
        // Still mark as initialized to avoid blocking UI
        setInitialized(true);
      }
    };
    
    // Run initialization
    initializeApp();
  }, [logger, toast, loadStatus, loadTheme]);
  
  // Show loading state if not initialized yet
  if (!initialized && loadStatus === 'loading') {
    return <ThemeLoadingState message="Starting up..." subMessage="Initializing the application" />;
  }
  
  // Always render children - we don't block rendering
  return <>{children}</>;
}
