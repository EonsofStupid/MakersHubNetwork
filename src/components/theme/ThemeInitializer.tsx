
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
  
  // Initialize theme on component mount
  useEffect(() => {
    // Skip if already initialized or loading
    if (isInitialized || isLoading || initAttempted.current) {
      return;
    }
    
    const initializeTheme = async () => {
      try {
        initAttempted.current = true;
        logger.info('Initializing theme system', { 
          details: { defaultTheme } 
        });
        
        // Clear any previous errors
        setInitError(null);
        
        // Attempt to set the theme
        await setTheme(defaultTheme);
        
        // Mark as initialized only if successful
        setIsInitialized(true);
        
        logger.info('Theme system initialized successfully', { 
          success: true,
          theme: defaultTheme
        } as ThemeLogDetails);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        const errorObj = e instanceof Error ? e : new Error(errorMessage);
        
        setInitError(errorObj);
        
        logger.error('Failed to initialize theme system', { 
          errorMessage,
          details: { themeId: defaultTheme }
        } as ThemeLogDetails);
        
        // Try to load a fallback theme silently
        try {
          await setTheme('fallback-theme');
          logger.warn('Using fallback theme after initialization error', { 
            originalTheme: defaultTheme 
          } as ThemeLogDetails);
          
          // Still mark as initialized so the app can proceed
          setIsInitialized(true);
        } catch (fallbackError) {
          logger.error('Fallback theme also failed', {
            errorMessage: String(fallbackError)
          } as ThemeLogDetails);
          
          // As a last resort, we'll just let the app continue
          // even without properly initialized theme - the CSS fallbacks
          // in SiteThemeProvider will be used
          setIsInitialized(true);
        }
      }
    };
    
    initializeTheme();
  }, [defaultTheme, isInitialized, isLoading, setTheme, logger]);
  
  // Handle retry logic
  const handleRetry = async () => {
    try {
      logger.info('Retrying theme initialization', { 
        details: { defaultTheme }
      });
      
      initAttempted.current = false;
      await setTheme(defaultTheme);
      
      setIsInitialized(true);
      setInitError(null);
      
      logger.info('Theme system successfully initialized on retry', { 
        theme: defaultTheme 
      } as ThemeLogDetails);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      const errorObj = e instanceof Error ? e : new Error(errorMessage);
      
      setInitError(errorObj);
      
      logger.error('Failed to retry theme initialization', { 
        errorMessage 
      } as ThemeLogDetails);
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
      }, 3000); // 3 second timeout
      
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
