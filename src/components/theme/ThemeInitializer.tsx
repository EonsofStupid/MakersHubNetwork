
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
}

export function ThemeInitializer({ 
  children, 
  context = 'app', 
  applyImmediately = true 
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
      root.style.setProperty('--primary', '#00F0FF');
      root.style.setProperty('--secondary', '#FF2D6E');
      root.style.setProperty('--background', '#080F1E');
      root.style.setProperty('--foreground', '#F9FAFB');
      
      // Set ready immediately to prevent blocking rendering
      setIsReady(true);
    }
  }, [applyImmediately]);
  
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
        
        // Load theme asynchronously
        await loadTheme(context);
        
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
