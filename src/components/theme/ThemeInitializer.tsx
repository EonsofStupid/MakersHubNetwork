
import React, { ReactNode, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { ThemeContext } from '@/types/theme';
import { useThemeStore } from '@/stores/theme/store';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import NoHydrationMismatch from '../util/NoHydrationMismatch';
import { ThemeLoadingState } from './info/ThemeLoadingState';
import { ThemeErrorState } from './info/ThemeErrorState';
import { safeSSR, isBrowser } from '@/lib/utils/safeSSR';
import CircuitBreaker from '@/lib/utils/CircuitBreaker';

interface ThemeInitializerProps {
  children: ReactNode;
  themeContext?: ThemeContext;
  applyImmediately?: boolean;
  fallbackTheme?: {
    primary?: string;
    secondary?: string;
    background?: string;
    foreground?: string;
    [key: string]: string | undefined;
  };
}

const logger = getLogger('ThemeInitializer');

// Default fallback theme to always have something to show
const defaultFallbackTheme = {
  primary: '186 100% 50%',
  secondary: '334 100% 59%',
  background: '228 47% 8%',
  foreground: '210 40% 98%',
  effectColor: '#00F0FF',
  effectSecondary: '#FF2D6E',
  effectTertiary: '#8B5CF6',
};

export function ThemeInitializer({ 
  children, 
  themeContext = 'site', 
  applyImmediately = true,
  fallbackTheme = defaultFallbackTheme
}: ThemeInitializerProps) {
  // Initialize circuit breaker to prevent infinite loops
  CircuitBreaker.init('ThemeInitializer-effect', 5, 1000);
  
  // Use a stable selector to prevent recreation on each render
  const themeState = useMemo(() => {
    return (state: ReturnType<typeof useThemeStore.getState>) => ({
      loadTheme: state.loadTheme,
      loadStatus: state.loadStatus,
      error: state.error,
      currentTheme: state.currentTheme
    });
  }, []);
  
  const { loadTheme, loadStatus, error, currentTheme } = useThemeStore(themeState);
  
  const initAttemptedRef = useRef(false);
  const themeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [appliedFallback, setAppliedFallback] = useState(false);
  const [initializationComplete, setInitializationComplete] = useState(false);

  // Apply fallback theme immediately to ensure something is always visible
  useEffect(() => {
    if (!isBrowser() || appliedFallback) {
      return;
    }
    
    try {
      // Apply fallback theme immediately
      const root = document.documentElement;
      
      // Use our combined fallback theme with any user provided values
      const finalFallback = { ...defaultFallbackTheme, ...fallbackTheme };
      
      Object.entries(finalFallback).forEach(([key, value]) => {
        if (value) {
          root.style.setProperty(`--site-${key}`, value);
        }
      });
      
      // Also set standard CSS variables
      root.style.setProperty('--primary', finalFallback.primary || defaultFallbackTheme.primary);
      root.style.setProperty('--secondary', finalFallback.secondary || defaultFallbackTheme.secondary);
      
      setAppliedFallback(true);
      logger.info('Applied fallback theme');
    } catch (err) {
      logger.error('Failed to apply fallback theme', { 
        details: { error: err instanceof Error ? err.message : String(err) }
      });
    }
  }, [fallbackTheme, appliedFallback]);

  // Memoize the theme load function to prevent excessive re-renders
  const loadThemeSafely = useCallback(() => {
    return async () => {
      try {
        if (typeof loadTheme === 'function') {
          await loadTheme(themeContext);
        }
        setInitializationComplete(true);
      } catch (err) {
        logger.error('Theme load error handled safely', { 
          details: { error: err instanceof Error ? err.message : String(err) }
        });
        setInitializationComplete(true); // Still mark as complete to prevent blocking UI
      }
    };
  }, [loadTheme, themeContext, logger]);

  // Initialize theme loading with timeout protection - only once
  useEffect(() => {
    // Check if we're caught in an infinite loop
    if (CircuitBreaker.isTripped('ThemeInitializer-effect')) {
      logger.warn('Breaking potential infinite loop in ThemeInitializer');
      setInitializationComplete(true); // Force to complete to avoid blocking UI
      return;
    }
    
    // Increment counter for circuit breaker
    CircuitBreaker.count('ThemeInitializer-effect');
    
    // Skip if already initialized
    if (initAttemptedRef.current) {
      return;
    }
    
    initAttemptedRef.current = true;
    logger.info('Initializing theme', { details: { context: themeContext } });

    // Set up timeout to enforce maximum loading time
    themeTimeoutRef.current = setTimeout(() => {
      if (loadStatus === 'loading') {
        logger.warn('Theme loading timeout reached, continuing with fallback', {
          details: { themeContext }
        });
        setInitializationComplete(true); // Continue with or without theme
      }
    }, 3000); // 3 second timeout

    // Load theme from store - wrapped in setTimeout to break potential cycles
    setTimeout(() => {
      loadThemeSafely()();
    }, 0);

    return () => {
      if (themeTimeoutRef.current) {
        clearTimeout(themeTimeoutRef.current);
      }
    };
  }, [themeContext, loadThemeSafely, loadStatus]);

  // Handle retry loading
  const handleRetryLoading = () => {
    loadThemeSafely()();
  };

  // Always use the fallback theme to ensure something is visible
  useEffect(() => {
    if (!appliedFallback && loadStatus === 'error') {
      // Apply fallback theme if there's an error
      try {
        const root = document.documentElement;
        Object.entries(defaultFallbackTheme).forEach(([key, value]) => {
          if (value) {
            root.style.setProperty(`--site-${key}`, value);
          }
        });
      } catch (err) {
        logger.error('Failed to apply error fallback theme', { 
          details: { error: err instanceof Error ? err.message : String(err) }
        });
      }
    }
  }, [loadStatus, appliedFallback]);

  // If we have a fallback applied or initialization is complete, don't block rendering
  if ((appliedFallback || initializationComplete) && loadStatus !== 'loading') {
    return <>{children}</>;
  }

  // Show error state if there's an error
  if (loadStatus === 'error' && error) {
    return <ThemeErrorState error={error} onRetry={handleRetryLoading} />;
  }

  // Only show loading state if theme is loading and we don't have a theme yet
  // This prevents unnecessary flashing of loading state
  if (loadStatus === 'loading' && !currentTheme && !appliedFallback && !initializationComplete) {
    return <ThemeLoadingState />;
  }

  // Use NoHydrationMismatch for the children to prevent hydration issues
  return (
    <NoHydrationMismatch
      fallback={<ThemeLoadingState message="Preparing interface..." />}
    >
      {children}
    </NoHydrationMismatch>
  );
}
