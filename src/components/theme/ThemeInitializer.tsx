import React, { useEffect } from 'react';
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
  const { loadTheme, isLoading, currentTheme } = useThemeStore();
  const logger = useLogger('ThemeInitializer', LogCategory.UI);
  
  // Load theme on mount
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        // Check if theme is already loaded
        const savedTheme = safeSSR(() => localStorage.getItem('theme-mode'), null);
        if (savedTheme) {
          logger.debug('Theme already loaded', {
            details: { theme: savedTheme }
          });
          return;
        }
        
        // Load theme
        await loadTheme();
        logger.debug('Theme loaded successfully');
      } catch (error) {
        logger.error('Failed to load theme', {
          details: { 
            error: error instanceof Error ? error.message : String(error)
          }
        });
      }
    };
    
    initializeTheme();
  }, [loadTheme, logger]);
  
  // Apply immediate fallback styles while theme is loading
  useEffect(() => {
    if (isLoading) {
      document.documentElement.classList.add('theme-loading');
    } else {
      document.documentElement.classList.remove('theme-loading');
    }
  }, [isLoading]);
  
  // Wrap children in NoHydrationMismatch to prevent hydration issues
  return <NoHydrationMismatch>{children}</NoHydrationMismatch>;
}
