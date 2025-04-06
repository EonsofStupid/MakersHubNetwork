
import { useEffect, useState, useRef } from 'react';
import { useThemeStore } from '@/stores/theme/themeStore';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { ThemeContext } from '@/types/theme';
import { DynamicKeyframes } from './DynamicKeyframes';

interface ThemeInitializerProps {
  children: React.ReactNode;
  context?: ThemeContext;
  applyImmediately?: boolean;
  fallbackTheme?: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
  };
}

export function ThemeInitializer({ 
  children, 
  context = 'app', 
  applyImmediately = true,
  fallbackTheme
}: ThemeInitializerProps) {
  const { loadTheme, loadStatus } = useThemeStore();
  const logger = useLogger('ThemeInitializer', LogCategory.UI);
  const initAttempted = useRef(false);
  const [isReady, setIsReady] = useState(false);
  
  // Apply immediate fallback styles to prevent flash of unstyled content
  useEffect(() => {
    if (applyImmediately) {
      const root = document.documentElement;
      
      // Apply critical CSS variables immediately
      root.style.setProperty('--primary', fallbackTheme?.primary || '186 100% 50%');
      root.style.setProperty('--secondary', fallbackTheme?.secondary || '334 100% 59%');
      root.style.setProperty('--background', fallbackTheme?.background || '228 47% 8%');
      root.style.setProperty('--foreground', fallbackTheme?.foreground || '210 40% 98%');
      
      // Set ready immediately to prevent blocking rendering
      setIsReady(true);
    }
  }, [applyImmediately, fallbackTheme]);
  
  // Load theme on component mount - only once
  useEffect(() => {
    // Skip if already initialized or loading or loadTheme is not defined
    if (initAttempted.current || !loadTheme) {
      return;
    }
    
    const initializeTheme = async () => {
      try {
        initAttempted.current = true;
        logger.info('Initializing theme system', { details: { context } });
        
        // Load theme asynchronously without blocking
        loadTheme(context).catch(err => {
          logger.error('Error loading theme:', err);
        });
        
        // Set ready state after theme loads
        if (!applyImmediately) {
          setIsReady(true);
        }
        
        logger.info('Theme system initialized');
      } catch (error) {
        logger.error('Failed to initialize theme', { 
          details: { error: error instanceof Error ? error.message : String(error) }
        });
        
        // Set ready even on error to avoid blocking UI
        if (!applyImmediately) {
          setIsReady(true);
        }
      }
    };
    
    // Initialize without blocking rendering
    initializeTheme();
  }, [context, loadTheme, logger, applyImmediately]);
  
  // Prevent rendering until theme is ready if applyImmediately is false
  if (!isReady) {
    return null;
  }
  
  return (
    <>
      <DynamicKeyframes />
      {children}
    </>
  );
}
