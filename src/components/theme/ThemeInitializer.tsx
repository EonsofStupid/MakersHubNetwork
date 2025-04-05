
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
  const logger = useLogger('ThemeInitializer', LogCategory.UI);
  
  // Initialize theme on component mount
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        logger.info('Initializing theme system', {
          details: { defaultTheme }
        });
        await setTheme(defaultTheme);
        setIsInitialized(true);
        logger.info('Theme system initialized successfully', {
          details: { success: true }
        });
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        logger.error('Failed to initialize theme system', { 
          details: { errorMessage }
        });
      }
    };
    
    if (!isInitialized && !isLoading) {
      initializeTheme();
    }
  }, [defaultTheme, isInitialized, isLoading, logger, setTheme]);
  
  // Load the Impulsivity theme by default - its animations override when needed
  const handleRetry = async () => {
    try {
      logger.info('Retrying theme initialization', {
        details: { defaultTheme }
      });
      await setTheme(defaultTheme);
      setIsInitialized(true);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      logger.error('Failed to retry theme initialization', {
        details: { errorMessage }
      });
    }
  };
  
  if (error) {
    return (
      <ThemeErrorState 
        error={error} 
        onRetry={handleRetry}
      />
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
