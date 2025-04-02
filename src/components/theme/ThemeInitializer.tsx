
import { useEffect, useState } from 'react';
import { ensureDefaultTheme, getThemeByName } from '@/utils/themeInitializer';
import { useThemeStore } from '@/stores/theme/store';
import { useToast } from '@/hooks/use-toast';
import { DynamicKeyframes } from './DynamicKeyframes';
import { SiteThemeProvider } from './SiteThemeProvider';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { ThemeLoadingState } from './info/ThemeLoadingState';
import { ThemeErrorState } from './info/ThemeErrorState';
import { isError, isValidUUID } from '@/logging/utils/type-guards';

interface ThemeInitializerProps {
  children: React.ReactNode;
}

const FALLBACK_TIMEOUT = 1000; // 1 second fallback timeout
const THEME_NAME = 'Impulse'; // Consistent theme name

export function ThemeInitializer({ children }: ThemeInitializerProps) {
  // Track state in more detail for better debugging
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationAttempted, setInitializationAttempted] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  
  const { setTheme, isLoading, error: themeStoreError } = useThemeStore();
  const { toast } = useToast();
  const logger = useLogger('ThemeInitializer', LogCategory.SYSTEM);

  // Fallback faster when a theme store error is detected
  useEffect(() => {
    if (themeStoreError && !isInitialized && initializationAttempted) {
      logger.warn('Theme store error detected, forcing fallback', {
        details: {
          errorMessage: themeStoreError.message,
          isInitialized,
          initializationAttempted,
          attempts: failedAttempts
        }
      });
      
      // Very aggressive fallback timer - only 300ms
      const timer = setTimeout(() => {
        logger.info('Forcing initialization after theme store error', { 
          details: { error: themeStoreError.message }
        });
        setIsInitialized(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [themeStoreError, isInitialized, initializationAttempted, failedAttempts, logger]);

  useEffect(() => {
    let isMounted = true;
    let initializationTimeout: NodeJS.Timeout;
    
    async function initialize() {
      if (initializationAttempted) return;
      
      try {
        logger.info('Starting theme initialization');
        setInitializationAttempted(true);
        
        // Global safety timeout - don't block the app for more than 1 second
        initializationTimeout = setTimeout(() => {
          if (isMounted && !isInitialized) {
            logger.warn('Theme initialization timed out, continuing with default theme');
            setIsInitialized(true);
          }
        }, FALLBACK_TIMEOUT);
        
        // First try loading the Impulse theme by name
        let themeId: string | null = null;
        
        try {
          themeId = await getThemeByName(THEME_NAME);
          logger.info(`Attempting to load ${THEME_NAME} theme`, { details: { themeId }});
        } catch (err) {
          logger.warn(`Error loading ${THEME_NAME} theme by name, trying default theme`, { 
            details: { error: isError(err) ? err.message : 'Unknown error' } 
          });
          
          // Fallback to default theme if Impulse not found
          try {
            themeId = await ensureDefaultTheme();
          } catch (defaultErr) {
            logger.warn('Error ensuring default theme, continuing with fallback', { 
              details: { error: isError(defaultErr) ? defaultErr.message : 'Unknown error' } 
            });
            // Continue without a valid themeId - will trigger fallback
          }
        }
        
        if (!isMounted) return;
        
        if (themeId && isValidUUID(themeId)) {
          logger.debug('Theme ID found, attempting to set theme', { details: { themeId }});
          
          // Set a separate timeout just for the DB fetch
          const fetchTimeout = setTimeout(() => {
            if (isMounted && !isInitialized) {
              logger.warn('Theme fetch timed out, continuing with fallbacks');
              setIsInitialized(true);
            }
          }, 800);
          
          try {
            await setTheme(themeId);
            clearTimeout(fetchTimeout);
            
            logger.info('Theme initialized successfully', { details: { themeId } });
          
            if (isMounted) {
              setIsInitialized(true);
            }
          } catch (setThemeError) {
            clearTimeout(fetchTimeout);
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
          logger.warn('No valid theme ID received, using fallback styling', {
            details: { receivedThemeId: themeId }
          });
          
          if (isMounted) {
            setFailedAttempts(prev => prev + 1);
            // Continue with default styles
            setIsInitialized(true);
          }
        }
      } catch (error) {
        const err = isError(error) ? error : new Error('Unknown theme initialization error');
        logger.error('Error initializing theme', { 
          details: { message: err.message, stack: err.stack }
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

  // Render the app immediately with fallback styling instead of showing a loading screen
  return (
    <SiteThemeProvider fallbackToDefault={true}>
      <DynamicKeyframes />
      {children}
    </SiteThemeProvider>
  );
}
