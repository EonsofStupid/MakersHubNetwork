
import { useEffect, useState } from 'react';
import { ensureDefaultTheme, getThemeByName, DEFAULT_THEME_NAME } from '@/utils/themeInitializer';
import { useThemeStore } from '@/stores/theme/store';
import { useToast } from '@/hooks/use-toast';
import { DynamicKeyframes } from './DynamicKeyframes';
import { SiteThemeProvider } from './SiteThemeProvider';
import { useLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { isError, isValidUUID } from '@/logging/utils/type-guards';
import { safeDetails } from '@/logging/utils/safeDetails';

interface ThemeInitializerProps {
  children: React.ReactNode;
}

// Much shorter fallback timeout for better UX
const FALLBACK_TIMEOUT = 200; // 200ms fallback timeout

export function ThemeInitializer({ children }: ThemeInitializerProps) {
  // State tracking for better debugging and resilience
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationAttempted, setInitializationAttempted] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  
  const { setTheme, isLoading, error: themeStoreError } = useThemeStore();
  const { toast } = useToast();
  const logger = useLogger('ThemeInitializer', LogCategory.SYSTEM);

  // Apply default styles immediately to prevent white flash
  useEffect(() => {
    // Apply fallback styles immediately
    document.documentElement.classList.add('theme-fallback-applied');
    
    // Force the browser to apply default colors immediately
    document.documentElement.style.setProperty('--background', '#12121A');
    document.documentElement.style.setProperty('--foreground', '#F6F6F7');
    document.documentElement.style.backgroundColor = '#12121A';
    document.documentElement.style.color = '#F6F6F7';
    document.body.style.backgroundColor = '#12121A';
    document.body.style.color = '#F6F6F7';
    
    // Apply scrollbar styling immediately
    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); border-radius: 3px; }
      ::-webkit-scrollbar-thumb { background: rgba(0, 240, 255, 0.2); border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: rgba(0, 240, 255, 0.4); }
      .skeleton-loader {
        background: linear-gradient(90deg, 
          rgba(255, 255, 255, 0.05) 25%, 
          rgba(255, 255, 255, 0.1) 50%, 
          rgba(255, 255, 255, 0.05) 75%
        );
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
      }
      @keyframes skeleton-loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.documentElement.classList.remove('theme-fallback-applied');
      document.head.removeChild(style);
    };
  }, []);

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
      
      // Short fallback timer for rapid recovery from errors - 100ms
      const timer = setTimeout(() => {
        logger.info('Forcing initialization after theme store error', { 
          details: safeDetails(themeStoreError) 
        });
        setIsInitialized(true);
      }, 100);
      
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
