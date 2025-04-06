
import { useEffect, useState, useRef, useCallback } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { SiteThemeProvider } from './SiteThemeProvider';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { ThemeLoadingState } from './info/ThemeLoadingState';
import { ThemeErrorState } from './info/ThemeErrorState';
import { ThemeLogDetails } from '@/types/theme';
import { ensureThemeLoaded } from '@/theme/utils/themeLoader';

interface ThemeInitializerProps {
  children: React.ReactNode;
  defaultTheme?: string;
}

export function ThemeInitializer({ children, defaultTheme = 'Impulsivity' }: ThemeInitializerProps) {
  const { isLoading, error } = useThemeStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);
  const logger = useLogger('ThemeInitializer', LogCategory.UI);
  const initAttempted = useRef(false);
  
  // Apply fallback styles implementation isolated as a function to avoid dependency issues
  const applyFallbackStyles = useCallback(() => {
    try {
      const rootElement = document.documentElement;
      
      // Apply basic CSS variables immediately
      rootElement.style.setProperty('--site-primary', '186 100% 50%');
      rootElement.style.setProperty('--site-secondary', '334 100% 59%');
      rootElement.style.setProperty('--site-effect-color', '#00F0FF');
      rootElement.style.setProperty('--site-effect-secondary', '#FF2D6E');
      rootElement.style.setProperty('--site-background', '228 47% 8%');
      rootElement.style.setProperty('--site-foreground', '210 40% 98%');
      
      rootElement.style.setProperty('--background', 'hsl(228, 47%, 8%)');
      rootElement.style.setProperty('--foreground', 'hsl(210, 40%, 98%)');
      rootElement.style.setProperty('--card', 'hsl(228, 47%, 11%)');
      rootElement.style.setProperty('--card-foreground', 'hsl(210, 40%, 98%)');
      rootElement.style.setProperty('--primary', 'hsl(186, 100%, 50%)');
      rootElement.style.setProperty('--primary-foreground', 'hsl(210, 40%, 98%)');
      rootElement.style.setProperty('--secondary', 'hsl(334, 100%, 59%)');
      rootElement.style.setProperty('--secondary-foreground', 'hsl(210, 40%, 98%)');
      
      rootElement.style.setProperty('--impulse-primary', '#00F0FF');
      rootElement.style.setProperty('--impulse-secondary', '#FF2D6E');
      rootElement.style.setProperty('--impulse-bg-main', '#121218');
      
      // Apply classes for broader styling
      rootElement.classList.add('theme-impulsivity');
      document.body.classList.add('theme-impulsivity-body');
      
      logger.info('Applied fallback styles in ThemeInitializer');
      return true;
    } catch (error) {
      logger.error('Failed to apply fallback styles', {
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      return false;
    }
  }, [logger]);
  
  // Apply fallback styles immediately before any async operations
  useEffect(() => {
    applyFallbackStyles();
  }, [applyFallbackStyles]);
  
  // Initialize the theme
  useEffect(() => {
    if (isInitialized || initAttempted.current) {
      return;
    }
    
    const initializeTheme = async () => {
      try {
        initAttempted.current = true;
        const logDetails: ThemeLogDetails = { 
          details: { defaultTheme } 
        };
        
        logger.info('Initializing theme system', logDetails);
        
        setInitError(null);
        
        // Use our utility function to ensure theme is loaded
        const success = await ensureThemeLoaded(defaultTheme);
        
        setIsInitialized(true);
        
        if (success) {
          const successDetails: ThemeLogDetails = { 
            success: true,
            theme: defaultTheme
          };
          
          logger.info('Theme system initialized successfully', successDetails);
        } else {
          logger.warn('Theme system initialized with fallback', {
            theme: 'fallback'
          } as ThemeLogDetails);
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        const errorObj = e instanceof Error ? e : new Error(errorMessage);
        
        logger.error('Failed to initialize theme system', {
          errorMessage,
          details: { themeId: defaultTheme }
        } as ThemeLogDetails);
        
        setInitError(errorObj);
        
        setIsInitialized(true);
        
        // Apply fallback styles
        applyFallbackStyles();
      }
    };
    
    initializeTheme();
  }, [defaultTheme, isInitialized, logger, applyFallbackStyles]);
  
  // Handle retry
  const handleRetry = useCallback(async () => {
    try {
      initAttempted.current = false;
      setIsInitialized(false);
      
      const retryDetails: ThemeLogDetails = { 
        details: { defaultTheme }
      };
      
      logger.info('Retrying theme initialization', retryDetails);
      
      const success = await ensureThemeLoaded(defaultTheme);
      
      setIsInitialized(true);
      setInitError(null);
      
      if (success) {
        const successDetails: ThemeLogDetails = { 
          theme: defaultTheme 
        };
        
        logger.info('Theme system successfully initialized on retry', successDetails);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      const errorObj = e instanceof Error ? e : new Error(errorMessage);
      
      setInitError(errorObj);
      setIsInitialized(true);
      
      const errorDetails: ThemeLogDetails = { 
        errorMessage 
      };
      
      logger.error('Failed to retry theme initialization', errorDetails);
    }
  }, [defaultTheme, logger]);
  
  // Add timeout for loading state to prevent UI from being blocked indefinitely
  useEffect(() => {
    if (isLoading && !isInitialized) {
      const timer = setTimeout(() => {
        if (!isInitialized) {
          logger.warn('Theme initialization timeout, continuing with default styles');
          setIsInitialized(true);
          
          // Apply fallback styles
          applyFallbackStyles();
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isInitialized, logger, applyFallbackStyles]);
  
  // Error state
  if ((initError || error) && !isInitialized) {
    return (
      <ThemeErrorState 
        error={initError || error || new Error('Unknown theme initialization error')}
        onRetry={handleRetry}
      />
    );
  }
  
  // Loading state - show for a limited time only
  if (isLoading && !isInitialized) {
    return <ThemeLoadingState />;
  }
  
  // Main render - notice we're using isInitializing prop to inform SiteThemeProvider
  // about the initialization state so it can adapt accordingly
  return (
    <SiteThemeProvider isInitializing={!isInitialized}>
      {children}
    </SiteThemeProvider>
  );
}

export default ThemeInitializer;
