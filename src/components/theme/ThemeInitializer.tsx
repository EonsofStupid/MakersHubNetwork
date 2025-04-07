
import { useEffect, useState, useRef } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { ThemeContext } from '@/types/theme';
import { parseThemeContext } from '@/types/themeContext';
import { DynamicKeyframes } from './DynamicKeyframes';
import { ThemeTokens } from '@/theme/tokenSchema';

interface ThemeInitializerProps {
  children: React.ReactNode;
  themeContext?: ThemeContext;
  applyImmediately?: boolean;
  fallbackTheme?: Partial<ThemeTokens>;
}

export function ThemeInitializer({
  children,
  themeContext = 'site',
  applyImmediately = true,
  fallbackTheme
}: ThemeInitializerProps) {
  const logger = useLogger('ThemeInitializer', LogCategory.SYSTEM);
  const [isInitialized, setIsInitialized] = useState(false);
  const initAttempted = useRef(false);
  const { loadTheme, loadStatus } = useThemeStore();
  
  // Load theme on component mount - only once with re-attempt protection
  useEffect(() => {
    if (initAttempted.current) {
      return;
    }
    
    const initializeTheme = async () => {
      try {
        initAttempted.current = true;
        logger.info('Initializing theme system', { 
          details: { context: themeContext } 
        });
        
        // Load theme asynchronously
        await loadTheme(themeContext);
        
        logger.info('Theme system initialized');
        setIsInitialized(true);
      } catch (error) {
        logger.error('Failed to initialize theme', { 
          details: { 
            error: error instanceof Error ? error.message : String(error) 
          }
        });
        
        // Set as initialized even on error to avoid blocking UI
        setIsInitialized(true);
      }
    };
    
    // Initialize without blocking rendering
    initializeTheme();
  }, [logger, loadTheme, themeContext]);
  
  // Apply immediate fallback styles to prevent flash of unstyled content
  useEffect(() => {
    if (!fallbackTheme) return;
    
    const root = document.documentElement;
    
    // Apply critical CSS variables immediately
    if (fallbackTheme.primary) root.style.setProperty('--primary', fallbackTheme.primary);
    if (fallbackTheme.secondary) root.style.setProperty('--secondary', fallbackTheme.secondary);
    if (fallbackTheme.background) root.style.setProperty('--background', fallbackTheme.background);
    if (fallbackTheme.foreground) root.style.setProperty('--foreground', fallbackTheme.foreground);
  }, [fallbackTheme]); // Empty dependency array to run only once
  
  return (
    <>
      <DynamicKeyframes />
      {children}
    </>
  );
}
