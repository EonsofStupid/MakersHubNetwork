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
  
  useEffect(() => {
    const applyFallbackStyles = () => {
      try {
        const rootElement = document.documentElement;
        
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
        
        logger.info('Applied fallback styles in ThemeInitializer');
      } catch (error) {
        logger.error('Failed to apply fallback styles', {
          errorMessage: error instanceof Error ? error.message : String(error)
        });
      }
    };
    
    applyFallbackStyles();
    
    document.documentElement.classList.add('theme-impulsivity');
    document.body.classList.add('theme-impulsivity-body');
  }, [logger]);
  
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
        
        await setTheme(defaultTheme);
        
        setIsInitialized(true);
        
        const successDetails: ThemeLogDetails = { 
          success: true,
          theme: defaultTheme
        };
        
        logger.info('Theme system initialized successfully', successDetails);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        const errorObj = e instanceof Error ? e : new Error(errorMessage);
        
        logger.error('Failed to initialize theme system', {
          errorMessage,
          details: { themeId: defaultTheme }
        } as ThemeLogDetails);
        
        setInitError(errorObj);
        
        setIsInitialized(true);
        
        const rootElement = document.documentElement;
        rootElement.style.setProperty('--site-primary', '186 100% 50%');
        rootElement.style.setProperty('--site-secondary', '334 100% 59%');
        rootElement.style.setProperty('--site-effect-color', '#00F0FF');
        rootElement.style.setProperty('--site-effect-secondary', '#FF2D6E');
        rootElement.style.setProperty('--site-background', '228 47% 8%');
        rootElement.style.setProperty('--site-foreground', '210 40% 98%');
        
        try {
          await setTheme('fallback-theme');
          
          const fallbackDetails: ThemeLogDetails = { 
            originalTheme: defaultTheme 
          };
          
          logger.warn('Using fallback theme after initialization error', fallbackDetails);
        } catch (fallbackError) {
          logger.error('Fallback theme also failed', {
            errorMessage: String(fallbackError)
          } as ThemeLogDetails);
        }
      }
    };
    
    initializeTheme();
  }, [defaultTheme, isInitialized, setTheme, logger]);
  
  const handleRetry = async () => {
    try {
      initAttempted.current = false;
      setIsInitialized(false);
      
      const retryDetails: ThemeLogDetails = { 
        details: { defaultTheme }
      };
      
      logger.info('Retrying theme initialization', retryDetails);
      
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
      setIsInitialized(true);
      
      const errorDetails: ThemeLogDetails = { 
        errorMessage 
      };
      
      logger.error('Failed to retry theme initialization', errorDetails);
    }
  };
  
  useEffect(() => {
    if (isLoading && !isInitialized) {
      const timer = setTimeout(() => {
        if (!isInitialized) {
          logger.warn('Theme initialization timeout, continuing with default styles');
          setIsInitialized(true);
          
          const rootElement = document.documentElement;
          rootElement.style.setProperty('--site-primary', '186 100% 50%');
          rootElement.style.setProperty('--site-secondary', '334 100% 59%');
          rootElement.style.setProperty('--site-effect-color', '#00F0FF');
          rootElement.style.setProperty('--site-background', '228 47% 8%');
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isInitialized, logger]);
  
  if ((initError || error) && !isInitialized) {
    return (
      <ThemeErrorState 
        error={initError || error || new Error('Unknown theme initialization error')}
        onRetry={handleRetry}
      />
    );
  }
  
  if (isLoading && !isInitialized) {
    return <ThemeLoadingState />;
  }
  
  return (
    <SiteThemeProvider isInitializing={isLoading || !isInitialized}>
      <ImpulsivityInit>
        {children}
      </ImpulsivityInit>
    </SiteThemeProvider>
  );
}

export default ThemeInitializer;
