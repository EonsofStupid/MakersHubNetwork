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
  
  // Log component lifecycle
  logger.debug('ThemeInitializer rendering', {
    details: {
      isClient,
      isInitialized: isInitialized.current,
      isLoading,
      hasWindow: typeof window !== 'undefined',
      hasDocument: typeof document !== 'undefined',
      documentReadyState: typeof document !== 'undefined' ? document.readyState : 'undefined',
      isHydrated: typeof document !== 'undefined' ? document.documentElement.hasAttribute('data-hydrated') : false
    }
  });
  
  // Set isClient to true when component mounts
  useEffect(() => {
    logger.debug('ThemeInitializer mounting on client', {
      details: {
        timestamp: new Date().toISOString(),
        hasWindow: typeof window !== 'undefined',
        hasDocument: typeof document !== 'undefined'
      }
    });
    
    setIsClient(true);
    
    // Mark document as hydrated
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-hydrated', 'true');
      logger.debug('Document marked as hydrated', {
        details: {
          timestamp: new Date().toISOString(),
          documentReadyState: document.readyState
        }
      });
    }
  }, [logger]);
  
  // Load theme on mount
  useEffect(() => {
    // Only run on client side
    if (!isClient) {
      logger.debug('Skipping theme initialization (not on client)', {
        details: { isClient }
      });
      return;
    }
    
    const initializeTheme = async () => {
      // Skip if already initialized
      if (isInitialized.current) {
        logger.debug('Theme already initialized, skipping', {
          details: { isInitialized: isInitialized.current }
        });
        return;
      }

      try {
        logger.debug('Starting theme initialization', {
          details: {
            timestamp: new Date().toISOString(),
            hasLocalStorage: typeof localStorage !== 'undefined'
          }
        });
        
        // Check if theme is already loaded in localStorage
        const savedTheme = safeSSR(() => localStorage.getItem('theme-mode'), null);
        logger.debug('Checked localStorage for theme', {
          details: { 
            hasSavedTheme: !!savedTheme,
            savedTheme
          }
        });
        
        if (savedTheme) {
          logger.debug('Theme already loaded from localStorage', {
            details: { theme: savedTheme }
          });
          isInitialized.current = true;
          return;
        }
        
        // Load theme
        logger.debug('Loading theme from store', {
          details: { timestamp: new Date().toISOString() }
        });
        
        await loadTheme();
        logger.debug('Theme loaded successfully', {
          details: { 
            timestamp: new Date().toISOString(),
            isInitialized: true
          }
        });
        isInitialized.current = true;
      } catch (error) {
        logger.error('Failed to load theme', {
          details: { 
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
          }
        });
      }
    };
    
    initializeTheme();
  }, [loadTheme, logger, isClient]);
  
  // Apply immediate fallback styles while theme is loading
  useEffect(() => {
    if (!isClient) {
      logger.debug('Skipping style application (not on client)', {
        details: { isClient }
      });
      return;
    }
    
    logger.debug('Applying theme loading styles', {
      details: { 
        isLoading,
        timestamp: new Date().toISOString()
      }
    });
    
    if (isLoading) {
      document.documentElement.classList.add('theme-loading');
    } else {
      document.documentElement.classList.remove('theme-loading');
    }
  }, [isLoading, isClient, logger]);
  
  // During SSR, render a minimal placeholder to prevent hydration mismatch
  if (!isClient) {
    logger.debug('Rendering SSR placeholder', {
      details: { 
        isClient,
        timestamp: new Date().toISOString()
      }
    });
    return <div className="theme-loading-placeholder" />;
  }
  
  // On client, wrap children in NoHydrationMismatch to prevent hydration issues
  logger.debug('Rendering client-side content with NoHydrationMismatch', {
    details: { 
      isClient,
      isInitialized: isInitialized.current,
      timestamp: new Date().toISOString()
    }
  });
  
  return <NoHydrationMismatch>{children}</NoHydrationMismatch>;
}
