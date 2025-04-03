import { useEffect, useState, useRef } from 'react';
import { ensureDefaultTheme, getThemeByName, DEFAULT_THEME_NAME } from '@/utils/themeInitializer';
import { useThemeStore } from '@/stores/theme/store';
import { useToast } from '@/hooks/use-toast';
import { DynamicKeyframes } from '@/components/theme/DynamicKeyframes';
import { SiteThemeProvider } from '@/components/theme/SiteThemeProvider';
import { themeRegistry } from '@/admin/theme/ThemeRegistry';
import { defaultImpulseTokens } from '@/admin/types/impulse.types';
import { applyThemeToDocument } from '@/admin/theme/utils/themeApplicator';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { isValidUUID } from '@/logging/utils/type-guards';
import { safeDetails } from '@/logging/utils/safeDetails';
import { getThemeFromLocalStorage } from '@/stores/theme/localStorage';
import { usePerformanceLogger } from '@/hooks/use-performance-logger';
import { hexToRgbString } from '@/utils/colorUtils';
import { 
  validateThemeVariables, 
  applyEmergencyFallback, 
  logThemeState,
  assertThemeApplied 
} from '@/utils/ThemeValidationUtils';

// Utility functions to improve resilience
const validateThemeVariables = () => {
  try {
    const root = document.documentElement;
    const hasPrimary = root.style.getPropertyValue('--primary') !== '';
    const hasBackground = root.style.getPropertyValue('--background') !== '';
    return hasPrimary && hasBackground;
  } catch (e) {
    console.error('Error validating theme variables:', e);
    return false;
  }
};

const applyEmergencyFallback = () => {
  try {
    console.warn('Applying emergency theme fallback');
    const root = document.documentElement;
    
    // Critical base fallback colors
    root.style.setProperty('--background', '228 47% 8%');
    root.style.setProperty('--foreground', '210 40% 98%');
    root.style.setProperty('--primary', '186 100% 50%');
    root.style.setProperty('--primary-foreground', '210 40% 98%');
    root.style.setProperty('--secondary', '334 100% 59%');
    
    // Direct color references
    root.style.setProperty('--color-primary', '0, 240, 255');
    root.style.setProperty('--color-secondary', '255, 45, 110');
    root.style.setProperty('--impulse-primary', '#00F0FF');
    root.style.setProperty('--impulse-secondary', '#FF2D6E');
    
    document.documentElement.classList.add('impulse-theme-active');
    document.documentElement.setAttribute('data-theme-status', 'emergency');
    
    document.body.style.background = '#12121A';
    document.body.style.color = '#F6F6F7';
  } catch (e) {
    console.error('Critical error in emergency fallback:', e);
  }
};

const logThemeState = () => {
  try {
    const root = document.documentElement;
    console.log('Theme state:', {
      '--background': root.style.getPropertyValue('--background'),
      '--foreground': root.style.getPropertyValue('--foreground'),
      '--primary': root.style.getPropertyValue('--primary'),
      '--secondary': root.style.getPropertyValue('--secondary'),
      '--color-primary': root.style.getPropertyValue('--color-primary'),
      'data-theme-id': root.getAttribute('data-theme-id'),
      'data-theme-status': root.getAttribute('data-theme-status'),
      'classes': root.className
    });
  } catch (e) {
    console.error('Error logging theme state:', e);
  }
};

const assertThemeApplied = () => {
  try {
    const root = document.documentElement;
    return root.style.getPropertyValue('--background') !== '' || 
           root.style.getPropertyValue('--color-primary') !== '';
  } catch (e) {
    console.error('Error checking theme application:', e);
    return false;
  }
};

// Much shorter fallback timeout for better UX
const FALLBACK_TIMEOUT = 300; // 300ms fallback timeout

interface ThemeInitializerProps {
  children: React.ReactNode;
}

export function ThemeInitializer({ children }: ThemeInitializerProps) {
  // State tracking for better debugging and resilience
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationAttemptedRef = useRef(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const fallbackAppliedRef = useRef(false);
  
  const { setTheme, isLoading, error: themeStoreError, hydrateTheme } = useThemeStore();
  const { toast } = useToast();
  const logger = getLogger('ThemeInitializer', { category: LogCategory.THEME });
  const { measure } = usePerformanceLogger('ThemeInitializer');
  
  // Apply default styles immediately to prevent white flash
  useEffect(() => {
    measure('immediate-fallback-styling', () => {
      // Apply fallback styles immediately
      document.documentElement.classList.add('theme-fallback-applied');
      
      logger.debug('✔️ Applying immediate fallback styling');
      
      // Register the default theme with our registry
      themeRegistry.registerTheme('default', defaultImpulseTokens);
      
      // Apply the default theme immediately
      applyThemeToDocument(defaultImpulseTokens);
      logger.debug('✔️ Default impulse tokens applied via applyThemeToDocument');
      
      // Force the browser to apply default colors immediately
      const bgColor = defaultImpulseTokens.colors?.background?.main || '#12121A';
      const textColor = defaultImpulseTokens.colors?.text?.primary || '#F6F6F7';
      const primaryColor = defaultImpulseTokens.colors?.primary || '#00F0FF';
      const secondaryColor = defaultImpulseTokens.colors?.secondary || '#FF2D6E';
      
      document.documentElement.style.backgroundColor = bgColor;
      document.documentElement.style.color = textColor;
      document.body.style.backgroundColor = bgColor;
      document.body.style.color = textColor;
      
      // Set critical CSS variables for animations and effects
      document.documentElement.style.setProperty('--site-effect-color', primaryColor);
      document.documentElement.style.setProperty('--site-effect-secondary', secondaryColor);
      document.documentElement.style.setProperty('--color-primary', hexToRgbString(primaryColor));
      document.documentElement.style.setProperty('--color-secondary', hexToRgbString(secondaryColor));
      document.documentElement.style.setProperty('--impulse-primary', primaryColor);
      document.documentElement.style.setProperty('--impulse-secondary', secondaryColor);
      
      // Apply critical theme CSS classes
      document.documentElement.classList.add('impulse-theme-active');
      
      // Add data attribute for theme tracking
      document.documentElement.setAttribute('data-theme-id', 'fallback');
      document.documentElement.setAttribute('data-theme-status', 'initializing');
      
      fallbackAppliedRef.current = true;
      logger.debug('✔️ Applied immediate fallback styling');
    });
    
    // DO NOT remove the fallback class here - that will be done after initialization
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
        
        // Verify fallback is applied before continuing
        if (!assertThemeApplied()) {
          applyEmergencyFallback();
        }
        
        document.documentElement.setAttribute('data-theme-status', 'error-recovery');
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
            
            // Verify fallback is applied before continuing
            if (!assertThemeApplied()) {
              applyEmergencyFallback();
            }
            
            document.documentElement.setAttribute('data-theme-status', 'timeout');
            setIsInitialized(true);
          }
        }, FALLBACK_TIMEOUT);
        
        // Check localStorage first - completely decoupled from auth
        const localThemeId = getThemeFromLocalStorage();
        if (localThemeId && isValidUUID(localThemeId)) {
          logger.info('✔️ Theme found in localStorage, attempting to load', { details: { localThemeId } });
          try {
            await hydrateTheme();
            if (isMounted) {
              logger.info('Theme loaded from localStorage successfully');
              
              // Validate theme variables are properly set
              const isValid = validateThemeVariables();
              
              // Set data attributes for theme tracking
              document.documentElement.setAttribute('data-theme-id', localThemeId);
              document.documentElement.setAttribute('data-theme-status', isValid ? 'localStorage-success' : 'localStorage-partial');
              
              // Log the theme state for debugging
              logThemeState();
              
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
            logger.info(`✔️ Found ${DEFAULT_THEME_NAME} theme by name`, { details: { themeId }});
            
            if (isMounted) {
              try {
                await setTheme(themeId);
                logger.info(`${DEFAULT_THEME_NAME} theme applied successfully`);
                
                // Validate theme variables are properly set
                const isValid = validateThemeVariables();
                
                // Set data attributes for theme tracking
                document.documentElement.setAttribute('data-theme-id', themeId);
                document.documentElement.setAttribute('data-theme-status', isValid ? 'name-success' : 'name-partial');
                
                // Log the theme state for debugging
                logThemeState();
                
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
              
              // Validate theme variables are properly set
              const isValid = validateThemeVariables();
              
              // Set data attributes for theme tracking
              document.documentElement.setAttribute('data-theme-id', themeId);
              document.documentElement.setAttribute('data-theme-status', isValid ? 'default-success' : 'default-partial');
              
              // Log the theme state for debugging
              logThemeState();
              
              setIsInitialized(true);
            } catch (err) {
              logger.error('Failed to apply default theme', { 
                details: safeDetails(err)
              });
              
              // Apply emergency fallback directly
              applyEmergencyFallback();
              
              document.documentElement.setAttribute('data-theme-status', 'final-fallback');
              setIsInitialized(true);
            }
          } else {
            // Apply emergency fallback if we couldn't get a theme ID
            logger.error('Failed to get a valid theme ID from any source');
            applyEmergencyFallback();
            document.documentElement.setAttribute('data-theme-status', 'no-theme-id-fallback');
            setIsInitialized(true);
          }
        } catch (defaultErr) {
          logger.error('Error ensuring default theme', { 
            details: safeDetails(defaultErr)
          });
          
          // Final emergency fallback - direct application
          applyEmergencyFallback();
          document.documentElement.setAttribute('data-theme-status', 'error-fallback');
          setIsInitialized(true);
        }
      } catch (error) {
        // Should never happen - catch all for any setup errors
        logger.error('Catastrophic theme initialization error', { 
          details: safeDetails(error)
        });
        
        // Final emergency fallback - direct application
        applyEmergencyFallback();
        document.documentElement.setAttribute('data-theme-status', 'catastrophic-error');
        setIsInitialized(true);
        
        // Increment failed attempts for debugging
        setFailedAttempts(prev => prev + 1);
      } finally {
        // Clear the safety timeout if it's still running
        if (initializationTimeout) {
          clearTimeout(initializationTimeout);
          initializationTimeout = null;
        }
      }
    };
    
    // Start initialization process
    initialize();
    
    return () => {
      isMounted = false;
      if (initializationTimeout) {
        clearTimeout(initializationTimeout);
      }
    };
  }, [setTheme, hydrateTheme, isInitialized, logger, measure]);

  // Just render the children with SiteThemeProvider
  // We've already set up all the fallbacks
  return (
    <SiteThemeProvider fallbackToDefault={!isInitialized}>
      {children}
    </SiteThemeProvider>
  );
}
