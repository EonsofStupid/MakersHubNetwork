
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useThemeStore } from '@/stores/theme/store';
import { LogLevel } from '@/logging/types';
import { useLogger } from '@/logging/hooks/useLogger';
import { ErrorBoundary } from '@/ui/core/error-boundary';
import { ThemeLoadingState } from '@/ui/theme/info/ThemeLoadingState';
import { ThemeErrorState } from '@/ui/theme/info/ThemeErrorState';

interface ThemeInitializerProps {
  children: React.ReactNode;
}

export function ThemeInitializer({ children }: ThemeInitializerProps) {
  const { pathname } = useLocation();
  const { loadTheme, theme, isLoading, error } = useThemeStore();
  const logger = useLogger('ThemeInitializer');
  const [isThemeAvailable, setIsThemeAvailable] = useState<boolean>(false);

  // Load the theme when the component mounts
  useEffect(() => {
    logger.info('Initializing theme', { pathname });
    
    async function initTheme() {
      try {
        await loadTheme();
        setIsThemeAvailable(true);
        logger.info('Theme loaded successfully');
      } catch (err) {
        logger.error('Failed to load theme', { error: err }, LogLevel.ERROR);
        setIsThemeAvailable(false);
      }
    }
    
    initTheme();
  }, [loadTheme, logger, pathname]);

  // Show loading state
  if (isLoading) {
    return <ThemeLoadingState />;
  }

  // Show error state if there's an error
  if (error || !theme) {
    return <ThemeErrorState error={error} />;
  }

  // Render children when theme is available
  return (
    <ErrorBoundary>
      {isThemeAvailable ? (
        children
      ) : (
        <ThemeLoadingState message="Applying theme..." subMessage="This won't take long" />
      )}
    </ErrorBoundary>
  );
}
