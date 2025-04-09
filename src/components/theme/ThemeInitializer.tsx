
import { useEffect, useState, useRef } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { ImpulsivityInit } from './ImpulsivityInit';
import { SiteThemeProvider } from './SiteThemeProvider';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { ThemeLoadingState } from './info/ThemeLoadingState';
import { ThemeErrorState } from './info/ThemeErrorState';
import { ThemeLogDetails } from '@/types/theme';

interface ThemeInitializerProps {
  children: React.ReactNode;
  defaultTheme?: string;
}

export function ThemeInitializer({ children, defaultTheme = 'Impulsivity' }: ThemeInitializerProps) {
  const { setTheme, isLoading, error } = useThemeStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);
  const logger = useLogger('ThemeInitializer', LogCategory.UI);
  const initAttempted = useRef(false);
  
  // Apply fallback styles immediately to ensure something is visible
  useEffect(() => {
    const applyFallbackStyles = () => {
      const rootElement = document.documentElement;
      rootElement.style.setProperty('--site-primary', '186 100% 50%'); // #00F0FF in HSL  
      rootElement.style.setProperty('--site-secondary', '334 100% 59%'); // #FF2D6E in HSL
      rootElement.style.setProperty('--site-effect-color', '#00F0FF');
      rootElement.style.setProperty('--site-effect-secondary', '#FF2D6E');
      rootElement.style.setProperty('--site-background', '#080F1E');
      rootElement.style.setProperty('--site-foreground', '#F9FAFB');
      
      // Add additional base styling directly
      document.body.style.backgroundColor = '#080F1E';
      document.body.style.color = '#F9FAFB';
    };
    
    // Apply immediate styles
    applyFallbackStyles();
    
    // Also add a listener for DOMContentLoaded to ensure styles are applied
    const handleDOMLoaded = () => {
      applyFallbackStyles();
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handleDOMLoaded);
    } else {
      handleDOMLoaded();
    }
    
    return () => {
      document.removeEventListener('DOMContentLoaded', handleDOMLoaded);
    };
  }, []);
  
  // Initialize theme on component mount
  useEffect(() => {
    // Skip if already initialized or loading
    if (isInitialized || isLoading || initAttempted.current) {
      return;
    }
    
    const initializeTheme = async () => {
      try {
        initAttempted.current = true;
        const logDetails: ThemeLogDetails = { 
          details: { defaultTheme } 
        };
        
        logger.info('Initializing theme system', logDetails);
        
        // Clear any previous errors
        setInitError(null);
        
        // Attempt to set the theme
        await setTheme(defaultTheme);
        
        // Mark as initialized only if successful
        setIsInitialized(true);
        
        const successDetails: ThemeLogDetails = { 
          success: true,
          theme: defaultTheme
        };
        
        logger.info('Theme system initialized successfully', successDetails);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        const errorObj = e instanceof Error ? e : new Error(errorMessage);
        
        setInitError(errorObj);
        
        const errorDetails: ThemeLogDetails = { 
          errorMessage,
          details: { themeId: defaultTheme }
        };
        
        logger.error('Failed to initialize theme system', errorDetails);
        
        // Try to load a fallback theme silently - always move forward
        setIsInitialized(true);
        logger.warn('Proceeding with fallback styles after initialization error');
      }
    };
    
    initializeTheme();
    
    // Ensure we don't hang waiting for theme initialization
    const timeout = setTimeout(() => {
      if (!isInitialized) {
        setIsInitialized(true);
        logger.warn('Theme initialization timed out, continuing with fallback styles');
      }
    }, 1000); // Reduced timeout for better responsiveness
    
    return () => clearTimeout(timeout);
  }, [defaultTheme, isInitialized, isLoading, setTheme, logger]);
  
  // Handle retry logic
  const handleRetry = async () => {
    try {
      logger.info('Retrying theme initialization');
      
      initAttempted.current = false;
      await setTheme(defaultTheme);
      
      setIsInitialized(true);
      setInitError(null);
      
      logger.info('Theme system successfully initialized on retry');
    } catch (e) {
      // Continue anyway with fallback styles
      setIsInitialized(true);
      logger.error('Failed to retry theme initialization, using fallbacks');
    }
  };
  
  // Show error state but with continue option
  if (error) {
    return (
      <SiteThemeProvider isInitializing={false}>
        {children}
      </SiteThemeProvider>
    );
  }
  
  return (
    <SiteThemeProvider isInitializing={isLoading || !isInitialized}>
      <ImpulsivityInit autoApply={true}>
        {children}
      </ImpulsivityInit>
    </SiteThemeProvider>
  );
}
