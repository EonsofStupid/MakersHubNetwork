
import { useEffect, useState, useRef } from 'react';
import { ensureDefaultTheme, getThemeByName, DEFAULT_THEME_NAME } from '@/utils/themeInitializer';
import { useThemeStore } from '@/stores/theme/store';
import { useToast } from '@/hooks/use-toast';
import { DynamicKeyframes } from './DynamicKeyframes';
import { SiteThemeProvider } from './SiteThemeProvider';
import { themeRegistry } from '@/admin/theme/ThemeRegistry';
import { defaultImpulseTokens } from '@/admin/theme/impulse/tokens';
import { applyThemeToDocument } from '@/admin/theme/utils/themeApplicator';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { isError, isValidUUID } from '@/logging/utils/type-guards';
import { safeDetails } from '@/logging/utils/safeDetails';
import { getThemeProperty } from '@/admin/theme/utils/themeUtils';

interface ThemeInitializerProps {
  children: React.ReactNode;
}

// Much shorter fallback timeout for better UX
const FALLBACK_TIMEOUT = 500; // 500ms fallback timeout

export function ThemeInitializer({ children }: ThemeInitializerProps) {
  // State tracking for better debugging and resilience
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationAttemptedRef = useRef(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  
  const { setTheme, isLoading, error: themeStoreError } = useThemeStore();
  const { toast } = useToast();
  const logger = getLogger('ThemeInitializer', { category: LogCategory.THEME });
  
  // Apply default styles immediately to prevent white flash
  useEffect(() => {
    // Apply fallback styles immediately
    document.documentElement.classList.add('theme-fallback-applied');
    
    // Register the default theme with our registry
    themeRegistry.registerTheme('default', defaultImpulseTokens);
    
    // Apply the default theme immediately
    applyThemeToDocument('default');
    
    // Force the browser to apply default colors immediately
    document.documentElement.style.backgroundColor = getThemeProperty(defaultImpulseTokens, 'colors.background.main', '#12121A');
    document.documentElement.style.color = getThemeProperty(defaultImpulseTokens, 'colors.text.primary', '#F6F6F7');
    document.body.style.backgroundColor = getThemeProperty(defaultImpulseTokens, 'colors.background.main', '#12121A');
    document.body.style.color = getThemeProperty(defaultImpulseTokens, 'colors.text.primary', '#F6F6F7');
    
    logger.debug('Applied immediate fallback styling');
    
    return () => {
      document.documentElement.classList.remove('theme-fallback-applied');
    };
  }, [logger]);

  // Fallback faster when a theme store error is detected
  useEffect(() => {
    if (themeStoreError && !isInitialized && initializationAttemptedRef.current) {
      logger.warn('Theme store error detected, forcing fallback', {
        details: safeDetails({
          errorMessage: themeStoreError.message,
          isInitialized,
          initializationAttempted: initializationAttemptedRef.current,
          attempts: failedAttempts
        })
      });
      
      // Short fallback timer for rapid recovery from errors - 100ms
      const timer = setTimeout(() => {
        logger.info('Forcing initialization after theme store error', { 
          details: safeDetails(themeStoreError) 
        });
        setIsInitialized(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [themeStoreError, isInitialized, failedAttempts, logger]);

  // Main theme initialization logic
  useEffect(() => {
    let isMounted = true;
    let initializationTimeout: NodeJS.Timeout | null = null;
    
    async function initialize() {
      if (initializationAttemptedRef.current) return;
      
      try {
        logger.info('Starting theme initialization');
        initializationAttemptedRef.current = true;
        
        // Global safety timeout - don't block the app for more than specified time
        initializationTimeout = setTimeout(() => {
          if (isMounted && !isInitialized) {
            logger.warn(`Theme initialization timed out after ${FALLBACK_TIMEOUT}ms, continuing with default theme`);
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
          
          // Set a separate timeout just for the DB fetch to prevent UI blocking - 300ms
          const fetchTimeout = setTimeout(() => {
            if (isMounted && !isInitialized) {
              logger.warn('Theme fetch timed out, continuing with fallbacks');
              setIsInitialized(true);
            }
          }, 300);
          
          try {
            await setTheme(themeId);
            clearTimeout(fetchTimeout);
            
            if (isMounted) {
              logger.info('Theme loaded successfully, initializing UI');
              setIsInitialized(true);
            }
          } catch (err) {
            if (isMounted) {
              setFailedAttempts((prev) => prev + 1);
              logger.error('Error setting theme', { details: safeDetails(err) });
              setIsInitialized(true);
              
              // Only show error toast for real errors, not timeouts
              if (isError(err)) {
                toast({
                  title: 'Theme Error',
                  description: 'Failed to load theme. Using default styling.',
                  variant: 'destructive',
                });
              }
            }
          }
        } else {
          // No valid theme ID, initialize with defaults
          if (isMounted) {
            logger.warn('No valid theme ID found, using fallback styling');
            setIsInitialized(true);
          }
        }
      } catch (err) {
        if (isMounted) {
          logger.error('Unhandled error in theme initialization', { details: safeDetails(err) });
          setIsInitialized(true);
          setFailedAttempts((prev) => prev + 1);
          
          // Only show error toast for real errors, not timeouts
          if (isError(err)) {
            toast({
              title: 'Theme Error',
              description: 'An unexpected error occurred. Using default styling.',
              variant: 'destructive',
            });
          }
        }
      } finally {
        if (initializationTimeout) {
          clearTimeout(initializationTimeout);
        }
      }
    }
    
    initialize();
    
    return () => {
      isMounted = false;
      if (initializationTimeout) {
        clearTimeout(initializationTimeout);
      }
    };
  }, [setTheme, toast, logger]);
  
  return (
    <SiteThemeProvider fallbackToDefault={!isInitialized || !!themeStoreError}>
      {/* Add dynamic keyframes for theme-based animations */}
      <DynamicKeyframes />
      {children}
    </SiteThemeProvider>
  );
}
