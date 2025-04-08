
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { ThemeContext } from '@/types/theme';
import { useThemeStore } from '@/stores/theme/store';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import NoHydrationMismatch from '../util/NoHydrationMismatch';
import { ThemeLoadingState } from './info/ThemeLoadingState';
import { ThemeErrorState } from './info/ThemeErrorState';
import { safeSSR, isBrowser } from '@/lib/utils/safeSSR';

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

export function ThemeInitializer({ 
  children, 
  themeContext = 'site', 
  applyImmediately = true,
  fallbackTheme
}: ThemeInitializerProps) {
  const { loadTheme, loadStatus, error, currentTheme } = useThemeStore();
  const initAttemptedRef = useRef(false);
  const themeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [appliedFallback, setAppliedFallback] = useState(false);

  // Apply fallback theme immediately if provided
  useEffect(() => {
    if (!isBrowser() || !fallbackTheme || !applyImmediately || appliedFallback) {
      return;
    }
    
    try {
      const root = document.documentElement;
      Object.entries(fallbackTheme).forEach(([key, value]) => {
        if (value) {
          root.style.setProperty(`--site-${key}`, value);
        }
      });
      setAppliedFallback(true);
      logger.info('Applied fallback theme');
    } catch (err) {
      logger.error('Failed to apply fallback theme', { 
        details: { error: err instanceof Error ? err.message : String(err) }
      });
    }
  }, [fallbackTheme, applyImmediately, appliedFallback]);

  // Initialize theme loading with timeout protection
  useEffect(() => {
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
      }
    }, 3000); // 3 second timeout

    // Load theme from store
    loadTheme(themeContext).catch(err => {
      logger.error('Failed to load theme', { 
        details: { error: err instanceof Error ? err.message : String(err) }
      });
    });

    return () => {
      if (themeTimeoutRef.current) {
        clearTimeout(themeTimeoutRef.current);
      }
    };
  }, [themeContext, loadTheme]);

  // Handle retry loading
  const handleRetryLoading = () => {
    loadTheme(themeContext).catch(err => {
      logger.error('Failed to retry theme loading', { 
        details: { error: err instanceof Error ? err.message : String(err) }
      });
    });
  };

  // Don't use hydration protection for SSR-safe components
  if (loadStatus === 'error' && error) {
    return <ThemeErrorState error={error} onRetry={handleRetryLoading} />;
  }

  // Only show loading state if theme is loading and we don't have a theme yet
  // This prevents unnecessary flashing of loading state
  if (loadStatus === 'loading' && !currentTheme && !appliedFallback) {
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
