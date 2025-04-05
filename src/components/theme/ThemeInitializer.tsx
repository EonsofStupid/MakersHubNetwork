
import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { ImpulsivityInit } from './ImpulsivityInit';
import { SiteThemeProvider } from './SiteThemeProvider';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { ThemeLoadingState } from './info/ThemeLoadingState';
import { ThemeErrorState } from './info/ThemeErrorState';

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
          details: { 
            success: true,
            theme: defaultTheme 
          }
        });
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        
        setInitError(e instanceof Error ? e : new Error(errorMessage));
        
        logger.error('Failed to initialize theme system', { 
          details: { 
            errorMessage,
            themeId: defaultTheme
          }
        });
        
        // Try to load a fallback theme silently
        try {
          await setTheme('fallback-theme');
          logger.warn('Using fallback theme after initialization error', {
            details: { originalTheme: defaultTheme }
          });
        } catch (fallbackError) {
          logger.error('Fallback theme also failed', {
            details: { errorMessage: String(fallbackError) }
          });
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
      logger.info('Retrying theme initialization', {
        details: { defaultTheme }
      });
      
      await setTheme(defaultTheme);
      
      setIsInitialized(true);
      setInitError(null);
      
      logger.info('Theme system successfully initialized on retry', {
        details: { theme: defaultTheme }
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      
      setInitError(e instanceof Error ? e : new Error(errorMessage));
      
      logger.error('Failed to retry theme initialization', {
        details: { errorMessage }
      });
    }
  };
  
  // If there's an initialization error or store error, show error state
  if (initError || error) {
    return (
      <ThemeErrorState 
        error={initError || error} 
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
