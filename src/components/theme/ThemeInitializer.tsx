
import { useEffect, useState } from 'react';
import { ensureDefaultTheme } from '@/utils/themeInitializer';
import { useThemeStore } from '@/stores/theme/store';
import { useToast } from '@/hooks/use-toast';
import { DynamicKeyframes } from './DynamicKeyframes';
import { SiteThemeProvider } from './SiteThemeProvider';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { ThemeLoadingState } from './info/ThemeLoadingState';
import { ThemeErrorState } from './info/ThemeErrorState';

interface ThemeInitializerProps {
  children: React.ReactNode;
}

export function ThemeInitializer({ children }: ThemeInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationAttempted, setInitializationAttempted] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);
  const { setTheme, isLoading } = useThemeStore();
  const { toast } = useToast();
  const logger = useLogger('ThemeInitializer', LogCategory.SYSTEM);

  useEffect(() => {
    let isMounted = true;
    
    async function initialize() {
      if (initializationAttempted) return;
      
      try {
        logger.info('Starting theme initialization');
        setInitializationAttempted(true);
        
        // First, ensure the default theme exists in the database
        const themeId = await ensureDefaultTheme();
        
        if (!isMounted) return;
        
        if (themeId) {
          // Then sync CSS using the ensureDefaultTheme's built-in sync capability
          await setTheme(themeId);
          logger.info('Theme initialized successfully', { details: { themeId } });
          
          if (isMounted) {
            setIsInitialized(true);
          }
        } else {
          logger.warn('Failed to initialize theme, falling back to default styles');
          
          if (isMounted) {
            toast({
              title: 'Theme Warning',
              description: 'Could not find or create theme. Using default styling.',
              variant: "destructive",
            });
            // Continue with default styles even without a theme
            setIsInitialized(true);
          }
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown theme initialization error');
        logger.error('Error initializing theme', { details: err });
        
        if (isMounted) {
          setInitError(err);
          toast({
            title: 'Theme Error',
            description: err.message,
            variant: "destructive",
          });
          // Continue with default styles even with an error
          setIsInitialized(true);
        }
      }
    }
    
    initialize();
    
    return () => {
      isMounted = false;
    };
  }, [setTheme, toast, logger, initializationAttempted]);

  // Instead of blocking the entire app while theme loads,
  // we'll continue rendering with a default theme
  return (
    <SiteThemeProvider fallbackToDefault>
      <DynamicKeyframes />
      {isInitialized ? (
        children
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          {initError ? (
            <ThemeErrorState error={initError} />
          ) : (
            <ThemeLoadingState />
          )}
        </div>
      )}
    </SiteThemeProvider>
  );
}
