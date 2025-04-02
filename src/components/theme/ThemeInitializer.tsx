
import { useEffect, useState } from 'react';
import { ensureDefaultTheme } from '@/utils/themeInitializer';
import { useThemeStore } from '@/stores/theme/store';
import { useToast } from '@/hooks/use-toast';
import { DynamicKeyframes } from './DynamicKeyframes';
import { SiteThemeProvider } from './SiteThemeProvider';
import { useLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { ThemeLoadingState } from './info/ThemeLoadingState';
import { ThemeErrorState } from './info/ThemeErrorState';
import { isError, isValidUUID } from '@/logging/utils/type-guards';

interface ThemeInitializerProps {
  children: React.ReactNode;
}

export function ThemeInitializer({ children }: ThemeInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationAttempted, setInitializationAttempted] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const { setTheme, isLoading, error: themeStoreError } = useThemeStore();
  const { toast } = useToast();
  const logger = useLogger('ThemeInitializer', LogCategory.SYSTEM);

  // Shorter timeout for theme store error - fallback faster to default theme
  useEffect(() => {
    if (themeStoreError && !isInitialized && initializationAttempted) {
      logger.warn('Theme store error detected, preparing to fallback', {
        details: {
          errorMessage: themeStoreError.message,
          isInitialized,
          initializationAttempted,
          attempts: failedAttempts
        }
      });
      
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
          variant: "default", // Changed to default for less alarmist message
        });
      }, 1000); // Reduced to 1 second for faster fallback
      
      return () => clearTimeout(timer);
    }
  }, [themeStoreError, isInitialized, initializationAttempted, failedAttempts, logger, toast]);

  useEffect(() => {
    let isMounted = true;
    let initializationTimeout: NodeJS.Timeout;
    
    async function initialize() {
      if (initializationAttempted) return;
      
      try {
        logger.info('Starting theme initialization');
        setInitializationAttempted(true);
        
        // Safety timeout - don't let theme initialization block the app forever
        initializationTimeout = setTimeout(() => {
          if (isMounted && !isInitialized) {
            logger.warn('Theme initialization timed out, continuing with default theme');
            setIsInitialized(true);
            toast({
              title: 'Theme Information',
              description: 'Using default theme styling.',
              variant: "default", // Changed to default
            });
          }
        }, 2000); // Reduced to 2 seconds for faster fallback
        
        // Try to ensure the default theme exists in the database
        // But don't block the app if this fails
        let themeId: string | null = null;
        
        try {
          themeId = await ensureDefaultTheme();
        } catch (err) {
          logger.warn('Error ensuring default theme, continuing with fallback', { 
            details: { error: isError(err) ? err.message : 'Unknown error' } 
          });
          // Continue with null themeId to trigger fallback
        }
        
        if (!isMounted) return;
        
        if (themeId && isValidUUID(themeId)) {
          logger.debug('Default theme ensured, attempting to set theme', { details: { themeId }});
          
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
              setFailedAttempts(prev => prev + 1);
              // Continue with default styles even with a setTheme error
              setIsInitialized(true);
            }
          }
        } else {
          logger.warn('Failed to initialize theme, falling back to default styles', {
            details: { 
              receivedThemeId: themeId,
              isValidUUID: themeId ? isValidUUID(themeId) : false
            }
          });
          
          if (isMounted) {
            setFailedAttempts(prev => prev + 1);
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
          setFailedAttempts(prev => prev + 1);
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
