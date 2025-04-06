
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
      try {
        const rootElement = document.documentElement;
        
        // Define base colors
        rootElement.style.setProperty('--site-primary', '186 100% 50%'); // #00F0FF in HSL  
        rootElement.style.setProperty('--site-secondary', '334 100% 59%'); // #FF2D6E in HSL
        rootElement.style.setProperty('--site-effect-color', '#00F0FF');
        rootElement.style.setProperty('--site-effect-secondary', '#FF2D6E');
        rootElement.style.setProperty('--site-background', '228 47% 8%');
        rootElement.style.setProperty('--site-foreground', '210 40% 98%');
        
        // Derive standard variables from site variables
        rootElement.style.setProperty('--background', 'hsl(228, 47%, 8%)');
        rootElement.style.setProperty('--foreground', 'hsl(210, 40%, 98%)');
        rootElement.style.setProperty('--card', 'hsl(228, 47%, 11%)');
        rootElement.style.setProperty('--card-foreground', 'hsl(210, 40%, 98%)');
        rootElement.style.setProperty('--primary', 'hsl(186, 100%, 50%)');
        rootElement.style.setProperty('--primary-foreground', 'hsl(210, 40%, 98%)');
        rootElement.style.setProperty('--secondary', 'hsl(334, 100%, 59%)');
        rootElement.style.setProperty('--secondary-foreground', 'hsl(210, 40%, 98%)');
        
        // Add direct color values as fallbacks
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
    
    // Always apply fallbacks immediately
    applyFallbackStyles();
    
    // Also set a theme class on the document
    document.documentElement.classList.add('theme-impulsivity');
    document.body.classList.add('theme-impulsivity-body');
    
  }, [logger]);
  
  // Initialize theme on component mount
  useEffect(() => {
    // Skip if already initialized or loading
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
        
        logger.error('Failed to initialize theme system', {
          errorMessage,
          details: { themeId: defaultTheme }
        } as ThemeLogDetails);
        
        // Save error but don't block app initialization
        setInitError(errorObj);
        
        // Set initialized anyway to not block the UI
        setIsInitialized(true);
        
        // Apply fallback styles directly
        const rootElement = document.documentElement;
        rootElement.style.setProperty('--site-primary', '186 100% 50%'); // #00F0FF in HSL  
        rootElement.style.setProperty('--site-secondary', '334 100% 59%'); // #FF2D6E in HSL
        rootElement.style.setProperty('--site-effect-color', '#00F0FF');
        rootElement.style.setProperty('--site-effect-secondary', '#FF2D6E');
        rootElement.style.setProperty('--site-background', '228 47% 8%');
        rootElement.style.setProperty('--site-foreground', '210 40% 98%');
        
        // Try to load a fallback theme silently
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
  
  // Handle retry logic
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
      setIsInitialized(true); // Still allow the app to continue
      
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
          
          // Apply emergency styles
          const rootElement = document.documentElement;
          rootElement.style.setProperty('--site-primary', '186 100% 50%');
          rootElement.style.setProperty('--site-secondary', '334 100% 59%');
          rootElement.style.setProperty('--site-effect-color', '#00F0FF');
          rootElement.style.setProperty('--site-background', '228 47% 8%');
        }
      }, 1500); // 1.5 second timeout (reduced further)
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isInitialized, logger]);
  
  // If there's an error but we're forcing the app to continue anyway,
  // log the error but don't show the error state to avoid blocking the app
  if ((initError || error) && !isInitialized) {
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
  
  // Continue with the app even if there were errors, using fallback styles
  return (
    <SiteThemeProvider isInitializing={isLoading || !isInitialized}>
      <ImpulsivityInit autoApply={true}>
        {children}
      </ImpulsivityInit>
    </SiteThemeProvider>
  );
}
