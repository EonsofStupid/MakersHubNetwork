
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
import { isError } from '@/logging/utils/type-guards';

interface ThemeInitializerProps {
  children: React.ReactNode;
}

export function ThemeInitializer({ children }: ThemeInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationAttempted, setInitializationAttempted] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);
  const { setTheme, isLoading, error: themeStoreError } = useThemeStore();
  const { toast } = useToast();
  const logger = useLogger('ThemeInitializer', LogCategory.SYSTEM);

  // Shorter timeout for theme store error - fallback faster to default theme
  useEffect(() => {
    if (themeStoreError && !isInitialized && initializationAttempted) {
      const timer = setTimeout(() => {
        logger.error('Forcing initialization after theme store error', { 
          details: { 
            error: themeStoreError.message,
            fallback: 'Using default theme due to persistent error'
          } 
        });
        setIsInitialized(true);
        toast({
          title: 'Theme Recovery',
          description: 'Using default theme styling due to theme loading issue',
          variant: "default", // Use default instead of "warning" to ensure valid type
        });
      }, 3000); // Reduced to 3 seconds from 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [themeStoreError, isInitialized, initializationAttempted, logger, toast]);

  useEffect(() => {
    let isMounted = true;
    let initializationTimeout: NodeJS.Timeout;
    
    async function initialize() {
      if (initializationAttempted) return;
      
      try {
        logger.info('Starting theme initialization');
        setInitializationAttempted(true);
        
        // Safety timeout - don't let theme initialization block the app forever
        // Reduced timeout for better user experience
        initializationTimeout = setTimeout(() => {
          if (isMounted && !isInitialized) {
            logger.warn('Theme initialization timed out, continuing with default theme');
            setIsInitialized(true);
            toast({
              title: 'Theme Warning',
              description: 'Theme initialization timed out. Using default styling.',
              variant: "default",
            });
          }
        }, 7000); // Reduced to 7 seconds from 10 seconds
        
        // First, ensure the default theme exists in the database
        const themeId = await ensureDefaultTheme();
        
        if (!isMounted) return;
        
        if (themeId) {
          // Then sync CSS using the ensureDefaultTheme's built-in sync capability
          try {
            await setTheme(themeId);
            logger.info('Theme initialized successfully', { details: { themeId } });
          
            if (isMounted) {
              setIsInitialized(true);
            }
          } catch (setThemeError) {
            logger.error('Error setting theme', { 
              details: {
                error: isError(setThemeError) ? setThemeError.message : 'Unknown error',
                themeId
              }
            });
            
            if (isMounted) {
              // Continue with default styles even with a setTheme error
              setIsInitialized(true);
              toast({
                title: 'Theme Warning',
                description: 'Error applying theme styles. Using default styling.',
                variant: "default",
              });
            }
          }
        } else {
          logger.warn('Failed to initialize theme, falling back to default styles');
          
          if (isMounted) {
            toast({
              title: 'Theme Warning',
              description: 'Could not find or create theme. Using default styling.',
              variant: "default",
            });
            // Continue with default styles even without a theme
            setIsInitialized(true);
          }
        }
      } catch (error) {
        const err = isError(error) ? error : new Error('Unknown theme initialization error');
        logger.error('Error initializing theme', { 
          details: {
            message: err.message,
            stack: err.stack,
            name: err.name,
          }
        });
        
        if (isMounted) {
          setInitError(err);
          toast({
            title: 'Theme Error',
            description: err.message,
            variant: "default",
          });
          // Continue with default styles even with an error
          setIsInitialized(true);
        }
      }
    }
    
    initialize();
    
    return () => {
      isMounted = false;
      clearTimeout(initializationTimeout);
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
