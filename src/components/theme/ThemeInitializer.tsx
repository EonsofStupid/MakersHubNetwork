
import { useEffect, useState, useRef } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useThemeRoutingContext } from '@/hooks/useThemeRoutingContext';
import { DynamicKeyframes } from './DynamicKeyframes';

interface ThemeInitializerProps {
  children: React.ReactNode;
}

export function ThemeInitializer({ children }: ThemeInitializerProps) {
  const logger = useLogger('ThemeInitializer', LogCategory.SYSTEM);
  const [isInitialized, setIsInitialized] = useState(false);
  const initAttempted = useRef(false);
  const { loadTheme, loadStatus } = useThemeStore();
  const { themeContext } = useThemeRoutingContext();
  
  // Load theme on component mount - only once with re-attempt protection
  useEffect(() => {
    if (initAttempted.current) {
      return;
    }
    
    const initializeTheme = async () => {
      try {
        initAttempted.current = true;
        logger.info('Initializing theme system', { details: { context: themeContext } });
        
        // Load theme asynchronously
        await loadTheme(themeContext);
        
        logger.info('Theme system initialized');
        setIsInitialized(true);
      } catch (error) {
        logger.error('Failed to initialize theme', { 
          details: { error: error instanceof Error ? error.message : String(error) }
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
    const root = document.documentElement;
    
    // Apply critical CSS variables immediately
    root.style.setProperty('--primary', '186 100% 50%');
    root.style.setProperty('--secondary', '334 100% 59%');
    root.style.setProperty('--background', '228 47% 8%');
    root.style.setProperty('--foreground', '210 40% 98%');
  }, []); // Empty dependency array to run only once
  
  return (
    <>
      <DynamicKeyframes />
      {children}
    </>
  );
}
