
import { useEffect, useState, useRef } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { ImpulsivityInit } from './ImpulsivityInit';
import { SiteThemeProvider } from './SiteThemeProvider';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { ThemeLogDetails } from '@/types/theme';

interface ThemeInitializerProps {
  children: React.ReactNode;
  defaultTheme?: string;
}

export function ThemeInitializer({ children, defaultTheme = 'Impulsivity' }: ThemeInitializerProps) {
  const { setTheme } = useThemeStore();
  const [isInitialized, setIsInitialized] = useState(false);
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
    
    // Mark as initialized to avoid blocking app rendering
    setIsInitialized(true);
  }, []);
  
  // Initialize theme on component mount
  useEffect(() => {
    // Skip if already initialized or loading
    if (initAttempted.current) {
      return;
    }
    
    const initializeTheme = async () => {
      try {
        initAttempted.current = true;
        
        logger.info('Initializing theme system', { 
          details: { defaultTheme } 
        } as ThemeLogDetails);
        
        // Attempt to set the theme - don't wait, let it run in background
        setTheme(defaultTheme)
          .then(() => logger.info('Theme loaded successfully'))
          .catch(e => logger.warn('Theme load error:', { 
            errorMessage: e instanceof Error ? e.message : String(e) 
          } as ThemeLogDetails));
        
        logger.info('Theme system initialization started');
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        
        logger.error('Failed to initialize theme system', { 
          errorMessage,
          details: { themeId: defaultTheme }
        } as ThemeLogDetails);
        
        // Try to load a fallback theme silently
        try {
          setTheme('fallback-theme')
            .catch(() => logger.warn('Fallback theme also failed'));
          
          logger.warn('Using fallback theme after initialization error', { 
            originalTheme: defaultTheme 
          } as ThemeLogDetails);
        } catch (fallbackError) {
          logger.error('Fallback theme also failed', {
            errorMessage: String(fallbackError)
          } as ThemeLogDetails);
        }
      }
    };
    
    initializeTheme();
  }, [defaultTheme, setTheme, logger]);
  
  // Skip error states and just render children with fallback styles
  return (
    <SiteThemeProvider isInitializing={false}>
      <ImpulsivityInit autoApply={true} priority={true}>
        {children}
      </ImpulsivityInit>
    </SiteThemeProvider>
  );
}
