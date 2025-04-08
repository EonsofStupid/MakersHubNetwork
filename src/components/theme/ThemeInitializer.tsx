
import React, { ReactNode, useEffect, useRef } from 'react';
import { ThemeContext } from '@/types/theme';
import { useThemeStore } from '@/stores/theme/store';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import NoHydrationMismatch from '../util/NoHydrationMismatch';
import { ThemeLoadingState } from './info/ThemeLoadingState';
import { ThemeErrorState } from './info/ThemeErrorState';

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

  // Initialize theme loading
  useEffect(() => {
    // Skip if already initialized
    if (initAttemptedRef.current) {
      return;
    }
    
    initAttemptedRef.current = true;
    logger.info('Initializing theme', { details: { context: themeContext } });

    // Apply fallback theme immediately if provided
    if (fallbackTheme && applyImmediately) {
      try {
        const root = document.documentElement;
        Object.entries(fallbackTheme).forEach(([key, value]) => {
          if (value) {
            root.style.setProperty(`--site-${key}`, value);
          }
        });
        logger.info('Applied fallback theme');
      } catch (err) {
        logger.error('Failed to apply fallback theme', { 
          details: { error: err instanceof Error ? err.message : String(err) }
        });
      }
    }

    // Load theme from store
    loadTheme(themeContext).catch(err => {
      logger.error('Failed to load theme', { 
        details: { error: err instanceof Error ? err.message : String(err) }
      });
    });
  }, [themeContext, loadTheme, fallbackTheme, applyImmediately]);

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

  if (loadStatus === 'loading' && !currentTheme) {
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
