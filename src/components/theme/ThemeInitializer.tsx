
import { useEffect, useState } from 'react';
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
  
  // Initialize theme on component mount
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const logDetails: ThemeLogDetails = { defaultTheme };
        logger.info('Initializing theme system', logDetails);
        
        // Clear any previous errors
        setInitError(null);
        
        // Attempt to set the theme
        await setTheme(defaultTheme);
        
        // Mark as initialized only if successful
        setIsInitialized(true);
        
        const successLogDetails: ThemeLogDetails = {
          success: true,
          theme: defaultTheme
        };
        logger.info('Theme system initialized successfully', successLogDetails);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        const errorObj = e instanceof Error ? e : new Error(errorMessage);
        
        setInitError(errorObj);
        
        const errorLogDetails: ThemeLogDetails = {
          errorMessage,
          themeId: defaultTheme
        };
        logger.error('Failed to initialize theme system', errorLogDetails);
        
        // Try to load a fallback theme silently
        try {
          await setTheme('fallback-theme');
          const fallbackLogDetails: ThemeLogDetails = { 
            originalTheme: defaultTheme 
          };
          logger.warn('Using fallback theme after initialization error', fallbackLogDetails);
        } catch (fallbackError) {
          const fallbackErrorDetails: ThemeLogDetails = {
            errorMessage: String(fallbackError)
          };
          logger.error('Fallback theme also failed', fallbackErrorDetails);
        }
      }
    };
    
    if (!isInitialized && !isLoading) {
      initializeTheme();
    }
  }, [defaultTheme, isInitialized, isLoading, logger, setTheme]);
  
  // Handle retry logic
  const handleRetry = async () => {
    try {
      const logDetails: ThemeLogDetails = { defaultTheme };
      logger.info('Retrying theme initialization', logDetails);
      
      await setTheme(defaultTheme);
      
      setIsInitialized(true);
      setInitError(null);
      
      const successLogDetails: ThemeLogDetails = { theme: defaultTheme };
      logger.info('Theme system successfully initialized on retry', successLogDetails);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      const errorObj = e instanceof Error ? e : new Error(errorMessage);
      
      setInitError(errorObj);
      
      const errorLogDetails: ThemeLogDetails = { errorMessage };
      logger.error('Failed to retry theme initialization', errorLogDetails);
    }
  };
  
  // If there's an initialization error or store error, show error state
  if (initError || error) {
    return (
      <ThemeErrorState 
        error={initError || error || new Error('Unknown theme initialization error')}
        onRetry={handleRetry}
      />
    );
  }
  
  // Show loading state while initializing
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
