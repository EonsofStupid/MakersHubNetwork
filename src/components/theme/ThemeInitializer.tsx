
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
import { getThemeFromLocalStorage } from '@/stores/theme/localStorage';
import { usePerformanceLogger } from '@/hooks/use-performance-logger';

interface ThemeInitializerProps {
  children: React.ReactNode;
}

// Much shorter fallback timeout for better UX
const FALLBACK_TIMEOUT = 300; // 300ms fallback timeout

export function ThemeInitializer({ children }: ThemeInitializerProps) {
  // State tracking for better debugging and resilience
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationAttemptedRef = useRef(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  
  const { setTheme, isLoading, error: themeStoreError, hydrateTheme } = useThemeStore();
  const { toast } = useToast();
  const logger = getLogger('ThemeInitializer', { category: LogCategory.THEME });
  const { measure } = usePerformanceLogger('ThemeInitializer');
  
  // Apply default styles immediately to prevent white flash
  useEffect(() => {
    measure('immediate-fallback-styling', () => {
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
    });
    
    return () => {
      document.documentElement.classList.remove('theme-fallback-applied');
    };
  }, [logger, measure]);

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
      
      // Short fallback timer for rapid recovery from errors - 50ms
      const timer = setTimeout(() => {
        logger.info('Forcing initialization after theme store error', { 
          details: safeDetails(themeStoreError) 
        });
        setIsInitialized(true);
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [themeStoreError, isInitialized, failedAttempts, logger]);

  // Main theme initialization logic
  useEffect(() => {
    let isMounted = true;
    let initializationTimeout: NodeJS.Timeout | null = null;
    
    const initialize = async () => {
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
        
        // Check localStorage first
        const localThemeId = getThemeFromLocalStorage();
        if (localThemeId && isValidUUID(localThemeId)) {
          logger.info('Theme found in localStorage, attempting to load', { details: { localThemeId } });
          try {
            await hydrateTheme();
            if (isMounted) {
              logger.info('Theme loaded from localStorage successfully');
              setIsInitialized(true);
              return;
            }
          } catch (localErr) {
            logger.warn('Error loading theme from localStorage, trying other sources', { 
              details: safeDetails(localErr)
            });
            // Continue to other methods
          }
        }
        
        // Second, try loading the Impulsivity theme by name
        try {
          const themeId = await getThemeByName(DEFAULT_THEME_NAME);
          if (themeId && isValidUUID(themeId)) {
            logger.info(`Found ${DEFAULT_THEME_NAME} theme by name`, { details: { themeId }});
            
            if (isMounted) {
              try {
                await setTheme(themeId);
                logger.info(`${DEFAULT_THEME_NAME} theme applied successfully`);
                setIsInitialized(true);
                return;
              } catch (err) {
                logger.warn(`Error applying ${DEFAULT_THEME_NAME} theme, trying fallback`, { 
                  details: safeDetails(err)
                });
                // Continue to fallback
              }
            }
          }
        } catch (nameErr) {
          logger.warn(`Error looking up ${DEFAULT_THEME_NAME} theme by name`, { 
            details: safeDetails(nameErr)
          });
          // Continue to fallback
        }
        
        // Final fallback - ensure a default theme exists and use it
        try {
          const themeId = await ensureDefaultTheme();
          if (isMounted && themeId && isValidUUID(themeId)) {
            try {
              await setTheme(themeId);
              logger.info('Default theme applied successfully');
            } catch (defaultErr) {
              logger.error('Error applying default theme, using fallback styling', {
                details: safeDetails(defaultErr)
              });
            }
          }
        } catch (fallbackErr) {
          logger.error('All theme loading attempts failed, using hardcoded fallback', {
            details: safeDetails(fallbackErr)
          });
        }
        
        // If we get here, ensure the app initializes regardless
        if (isMounted) {
          setIsInitialized(true);
        }
        
      } catch (err) {
        if (isMounted) {
          logger.error('Unhandled error in theme initialization', { details: safeDetails(err) });
          setIsInitialized(true);
          setFailedAttempts((prev) => prev + 1);
        }
      } finally {
        if (initializationTimeout) {
          clearTimeout(initializationTimeout);
        }
      }
    };
    
    initialize();
    
    return () => {
      isMounted = false;
      if (initializationTimeout) {
        clearTimeout(initializationTimeout);
      }
    };
  }, [setTheme, hydrateTheme, toast, logger, measure]);
  
  return (
    <SiteThemeProvider fallbackToDefault={!isInitialized || !!themeStoreError}>
      {/* Add dynamic keyframes for theme-based animations */}
      <DynamicKeyframes />
      {children}
    </SiteThemeProvider>
  );
}
