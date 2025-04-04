
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
import { LogCategory } from '@/constants/logLevel';
import { isValidUUID } from '@/logging/utils/type-guards';
import { safeDetails } from '@/logging/utils/safeDetails';
import { getThemeProperty } from '@/admin/theme/utils/themeUtils';
import { getThemeFromLocalStorage } from '@/stores/theme/localStorage';
import { usePerformanceLogger } from '@/hooks/use-performance-logger';
import { hexToRgbString } from '@/admin/theme/utils/colorUtils';
import {
  validateThemeVariables,
  applyEmergencyFallback,
  logThemeState,
  assertThemeApplied
} from '@/utils/ThemeValidationUtils';

const FALLBACK_TIMEOUT = 300;

interface ThemeInitializerProps {
  children: React.ReactNode;
}

export function ThemeInitializer({ children }: ThemeInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationAttemptedRef = useRef(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const fallbackAppliedRef = useRef(false);
  
  const { setTheme, isLoading, error: themeStoreError, hydrateTheme } = useThemeStore();
  const { toast } = useToast();
  const logger = getLogger('ThemeInitializer', { category: LogCategory.THEME });
  const { measure } = usePerformanceLogger('ThemeInitializer');
  
  useEffect(() => {
    measure('immediate-fallback-styling', () => {
      document.documentElement.classList.add('theme-fallback-applied');
      
      logger.debug('✔️ Applying immediate fallback styling');
      
      themeRegistry.registerTheme('default', defaultImpulseTokens);
      
      applyThemeToDocument(defaultImpulseTokens);
      logger.debug('✔️ Default impulse tokens applied via applyThemeToDocument');
      
      const bgColor = getThemeProperty(defaultImpulseTokens, 'colors.background.main', '#12121A');
      const textColor = getThemeProperty(defaultImpulseTokens, 'colors.text.primary', '#F6F6F7');
      const primaryColor = getThemeProperty(defaultImpulseTokens, 'colors.primary', '#00F0FF');
      const secondaryColor = getThemeProperty(defaultImpulseTokens, 'colors.secondary', '#FF2D6E');
      
      document.documentElement.style.backgroundColor = bgColor;
      document.documentElement.style.color = textColor;
      document.body.style.backgroundColor = bgColor;
      document.body.style.color = textColor;
      
      document.documentElement.style.setProperty('--site-effect-color', primaryColor);
      document.documentElement.style.setProperty('--site-effect-secondary', secondaryColor);
      document.documentElement.style.setProperty('--color-primary', hexToRgbString(primaryColor));
      document.documentElement.style.setProperty('--color-secondary', hexToRgbString(secondaryColor));
      document.documentElement.style.setProperty('--impulse-primary', primaryColor);
      document.documentElement.style.setProperty('--impulse-secondary', secondaryColor);
      
      document.documentElement.classList.add('impulse-theme-active');
      
      document.documentElement.setAttribute('data-theme-id', 'fallback');
      document.documentElement.setAttribute('data-theme-status', 'initializing');
      
      fallbackAppliedRef.current = true;
      logger.debug('✔️ Applied immediate fallback styling');
    });
  }, [logger, measure]);

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
      
      const timer = setTimeout(() => {
        logger.info('Forcing initialization after theme store error', { 
          details: safeDetails(themeStoreError) 
        });
        
        if (!assertThemeApplied()) {
          applyEmergencyFallback();
        }
        
        document.documentElement.setAttribute('data-theme-status', 'error-recovery');
        setIsInitialized(true);
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [themeStoreError, isInitialized, failedAttempts, logger]);

  useEffect(() => {
    let isMounted = true;
    let initializationTimeout: NodeJS.Timeout | null = null;
    
    const initialize = async () => {
      if (initializationAttemptedRef.current) return;
      
      try {
        logger.info('Starting theme initialization');
        initializationAttemptedRef.current = true;
        
        initializationTimeout = setTimeout(() => {
          if (isMounted && !isInitialized) {
            logger.warn(`Theme initialization timed out after ${FALLBACK_TIMEOUT}ms, continuing with default theme`);
            
            if (!assertThemeApplied()) {
              applyEmergencyFallback();
            }
            
            document.documentElement.setAttribute('data-theme-status', 'timeout');
            setIsInitialized(true);
          }
        }, FALLBACK_TIMEOUT);
        
        const localThemeId = getThemeFromLocalStorage();
        if (localThemeId && isValidUUID(localThemeId)) {
          logger.info('✔️ Theme found in localStorage, attempting to load', { details: { localThemeId } });
          try {
            await hydrateTheme();
            if (isMounted) {
              logger.info('Theme loaded from localStorage successfully');
              
              const isValid = validateThemeVariables();
              
              document.documentElement.setAttribute('data-theme-id', localThemeId);
              document.documentElement.setAttribute('data-theme-status', isValid ? 'localStorage-success' : 'localStorage-partial');
              
              logThemeState();
              
              setIsInitialized(true);
              return;
            }
          } catch (localErr) {
            logger.warn('Error loading theme from localStorage, trying other sources', { 
              details: safeDetails(localErr)
            });
          }
        }
        
        let themeId = await getThemeByName(DEFAULT_THEME_NAME);
        if (themeId && isValidUUID(themeId)) {
          logger.info(`✔️ Found ${DEFAULT_THEME_NAME} theme by name`, { details: { themeId }});
          
          if (isMounted) {
            try {
              await setTheme(themeId);
              logger.info(`${DEFAULT_THEME_NAME} theme applied successfully`);
              
              const isValid = validateThemeVariables();
              
              document.documentElement.setAttribute('data-theme-id', themeId);
              document.documentElement.setAttribute('data-theme-status', isValid ? 'name-success' : 'name-partial');
              
              logThemeState();
              
              setIsInitialized(true);
              return;
            } catch (err) {
              logger.warn(`Error applying ${DEFAULT_THEME_NAME} theme, trying fallback`, { 
                details: safeDetails(err)
              });
            }
          }
        }
        
        themeId = await ensureDefaultTheme();
        if (isMounted && themeId && isValidUUID(themeId)) {
          try {
            await setTheme(themeId);
            logger.info('Default theme applied successfully');
            
            const isValid = validateThemeVariables();
            
            document.documentElement.setAttribute('data-theme-id', themeId);
            document.documentElement.setAttribute('data-theme-status', isValid ? 'default-success' : 'default-partial');
            
            logThemeState();
          } catch (defaultErr) {
            logger.error('Error applying default theme, using fallback styling', {
              details: safeDetails(defaultErr)
            });
            
            applyEmergencyFallback();
            document.documentElement.setAttribute('data-theme-status', 'default-error');
          }
        } else if (!themeId) {
          logger.error("❌ No theme ID resolved - using fallback only");
          applyEmergencyFallback();
          document.documentElement.setAttribute('data-theme-status', 'no-theme-id');
        }
        
        if (isMounted) {
          assertThemeApplied();
          setIsInitialized(true);
        }
      } catch (err) {
        if (isMounted) {
          logger.error('Unhandled error in theme initialization', { details: safeDetails(err) });
          
          applyEmergencyFallback();
          document.documentElement.setAttribute('data-theme-status', 'unhandled-error');
          
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
  
  useEffect(() => {
    if (isInitialized) {
      const isThemeValid = validateThemeVariables();
      
      if (isThemeValid) {
        logger.debug('Theme initialization completed, removing fallback class');
        document.documentElement.classList.remove('theme-fallback-applied');
      } else {
        logger.warn('Theme variables not fully applied, keeping fallback class');
      }
    }
  }, [isInitialized, logger]);
  
  return (
    <SiteThemeProvider fallbackToDefault={!isInitialized || !!themeStoreError}>
      <DynamicKeyframes />
      {children}
    </SiteThemeProvider>
  );
}
