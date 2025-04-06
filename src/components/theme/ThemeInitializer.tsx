
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
  
  // Apply fallback styles immediately, don't wait for anything
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
    
    // Always apply fallback styles immediately
    applyFallbackStyles();
    
    document.documentElement.classList.add('theme-impulsivity');
    document.body.classList.add('theme-impulsivity-body');
    
    // Immediately mark as initialized to not block rendering
    setIsInitialized(true);
  }, [logger]);
  
  // Then try to load the real theme, but don't block rendering
  useEffect(() => {
    if (initAttempted.current) {
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
        
        // This won't block rendering since we're already initialized
        await setTheme(defaultTheme);
        
        const successDetails: ThemeLogDetails = { 
          success: true,
          theme: defaultTheme
        };
        
        logger.info('Theme system initialized successfully', successDetails);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        
        logger.error('Failed to initialize theme system', {
          errorMessage,
          details: { themeId: defaultTheme }
        } as ThemeLogDetails);
        
        // If theme loading fails, it's not critical since we've already applied fallback styles
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
    
    // Initialize asynchronously but don't block rendering
    initializeTheme();
  }, [defaultTheme, setTheme, logger]);
  
  // We return the children immediately, with the minimum styles
  return (
    <SiteThemeProvider isInitializing={false}>
      <ImpulsivityInit>
        {children}
      </ImpulsivityInit>
    </SiteThemeProvider>
  );
}

export default ThemeInitializer;
