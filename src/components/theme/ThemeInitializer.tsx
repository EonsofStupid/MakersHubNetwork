import React, { useEffect, useRef, useState } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { NoHydrationMismatch } from '@/components/util/NoHydrationMismatch';
import { safeSSR } from '@/lib/utils/safeSSR';

/**
 * Component that initializes the theme on mount
 * Ensures theme is loaded and applied before rendering children
 */
export function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const { loadTheme, isLoading } = useThemeStore();
  const logger = useLogger('ThemeInitializer', LogCategory.UI);
  const isInitialized = useRef(false);
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
    // Mark document as hydrated
    document.documentElement.setAttribute('data-hydrated', 'true');
  }, []);
  
  // Load theme on mount
  useEffect(() => {
    // Only run on client side
    if (!isClient) return;
    
    const initializeTheme = async () => {
      // Skip if already initialized
      if (isInitialized.current) {
        return;
      }

      try {
        // Check if theme is already loaded in localStorage
        const savedTheme = safeSSR(() => localStorage.getItem('theme-mode'), null);
        if (savedTheme) {
          logger.debug('Theme already loaded', {
            details: { theme: savedTheme }
          });
          isInitialized.current = true;
          return;
        }
        
        // Load theme
        await loadTheme();
        logger.debug('Theme loaded successfully');
        isInitialized.current = true;
      } catch (error) {
        logger.error('Failed to load theme', {
          details: { 
            error: error instanceof Error ? error.message : String(error)
          }
        });
      }
    };
    
    initializeTheme();
  }, [loadTheme, logger, isClient]);
  
  // Apply immediate fallback styles while theme is loading
  useEffect(() => {
    if (!isClient) return;
    
    if (isLoading) {
      document.documentElement.classList.add('theme-loading');
    } else {
      document.documentElement.classList.remove('theme-loading');
    }
  }, [isLoading, isClient]);
  
  // During SSR, render a minimal placeholder to prevent hydration mismatch
  if (!isClient) {
    return <div className="theme-loading-placeholder" />;
  }
  
  // On client, wrap children in NoHydrationMismatch to prevent hydration issues
  return <NoHydrationMismatch>{children}</NoHydrationMismatch>;
}
