
import { useEffect, useState } from 'react';
import { ensureDefaultTheme, getThemeByName, DEFAULT_THEME_NAME } from '@/utils/themeInitializer';
import { useThemeStore } from '@/stores/theme/store';
import { useToast } from '@/hooks/use-toast';
import { DynamicKeyframes } from './DynamicKeyframes';
import { SiteThemeProvider } from './SiteThemeProvider';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { isError, isValidUUID } from '@/logging/utils/type-guards';
import { safeDetails } from '@/logging/utils/safeDetails';

interface ThemeInitializerProps {
  children: React.ReactNode;
}

// Use the standardized theme name from the utils file
const FALLBACK_TIMEOUT = 1000; // 1 second fallback timeout

export function ThemeInitializer({ children }: ThemeInitializerProps) {
  // State tracking for better debugging and resilience
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
        details: safeDetails({
          errorMessage: themeStoreError.message,
          isInitialized,
          initializationAttempted,
          attempts: failedAttempts
        })
      });
      
      // Short fallback timer for rapid recovery
      const timer = setTimeout(() => {
        logger.info('Forcing initialization after theme store error', { 
          details: safeDetails(themeStoreError) 
        });
        setIsInitialized(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [themeStoreError, isInitialized, initializationAttempted, failedAttempts, logger]);

  // Main theme initialization logic
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
        
        // First try loading the Impulsivity theme by name
        let themeId: string | null = null;
        
        try {
          themeId = await getThemeByName(DEFAULT_THEME_NAME);
          logger.info(`Attempting to load ${DEFAULT_THEME_NAME} theme`, { details: { themeId }});
        } catch (err) {
          logger.warn(`Error loading ${DEFAULT_THEME_NAME} theme by name, trying default theme`, { 
            details: safeDetails(err)
          });
          
          // Fallback to default theme if Impulsivity not found
          try {
            themeId = await ensureDefaultTheme();
          } catch (defaultErr) {
            logger.warn('Error ensuring default theme, continuing with fallback', { 
              details: safeDetails(defaultErr)
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
              details: safeDetails(setThemeError)
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
          details: safeDetails(error)
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

  // Render immediately with fallback styling - no loading screens
  return (
    <SiteThemeProvider fallbackToDefault={true}>
      <DynamicKeyframes />
      {children}
    </SiteThemeProvider>
  );
}
