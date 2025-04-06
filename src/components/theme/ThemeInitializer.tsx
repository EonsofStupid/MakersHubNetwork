
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
    const rootElement = document.documentElement;
    rootElement.style.setProperty('--site-primary', '186 100% 50%'); // #00F0FF in HSL  
    rootElement.style.setProperty('--site-secondary', '334 100% 59%'); // #FF2D6E in HSL
    rootElement.style.setProperty('--site-effect-color', '#00F0FF');
    rootElement.style.setProperty('--site-effect-secondary', '#FF2D6E');
    rootElement.style.setProperty('--site-background', '#080F1E');
    rootElement.style.setProperty('--site-foreground', '#F9FAFB');
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
        
        // Try to load a fallback theme silently
        try {
          await setTheme('fallback-theme');
          
          const fallbackDetails: ThemeLogDetails = { 
            originalTheme: defaultTheme 
          };
          
          logger.warn('Using fallback theme after initialization error', fallbackDetails);
          
          // Still mark as initialized so the app can proceed
          setIsInitialized(true);
        } catch (fallbackError) {
          logger.error('Fallback theme also failed', {
            errorMessage: String(fallbackError)
          } as ThemeLogDetails);
          
          // As a last resort, we'll just let the app continue
          // even without properly initialized theme - the CSS fallbacks
          // will be used
          setIsInitialized(true);
        }
      }
    };
    
    initializeTheme();
  }, [defaultTheme, isInitialized, isLoading, setTheme, logger]);
  
  // Handle retry logic
  const handleRetry = async () => {
    try {
      const retryDetails: ThemeLogDetails = { 
        details: { defaultTheme }
      };
      
      logger.info('Retrying theme initialization', retryDetails);
      
      initAttempted.current = false;
      await setTheme(defaultTheme);
      
      setIsInitialized(true);
      setInitError(null);
      
      const successDetails: ThemeLogDetails = { 
        theme: defaultTheme 
      };
      
      logger.info('Theme system successfully initialized on retry', successDetails);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      const errorObj = e instanceof Error ? e : new Error(errorMessage);
      
      setInitError(errorObj);
      
      const errorDetails: ThemeLogDetails = { 
        errorMessage 
      };
      
      logger.error('Failed to retry theme initialization', errorDetails);
    }
  };
  
  // Show loading state during initialization, but with a timeout
  // to prevent hanging indefinitely
  useEffect(() => {
    if (isLoading && !isInitialized) {
      // If loading takes too long, force continue anyway
      const timer = setTimeout(() => {
        if (!isInitialized) {
          logger.warn('Theme initialization timeout, continuing with default styles');
          setIsInitialized(true);
        }
      }, 2000); // 2 second timeout (reduced from 3)
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isInitialized, logger]);
  
  // If there's an initialization error or store error, show error state
  if (initError || error) {
    return (
      <ThemeErrorState 
        error={initError || error || new Error('Unknown theme initialization error')}
        onRetry={handleRetry}
      />
    );
  }
  
  // Show loading state while initializing, but only briefly
  if (isLoading && !isInitialized) {
    return <ThemeLoadingState />;
  }
  
  return (
    <SiteThemeProvider isInitializing={isLoading || !isInitialized}>
      <ImpulsivityInit autoApply={true}>
        {children}
      </ImpulsivityInit>
    </SiteThemeProvider>
  );
}
