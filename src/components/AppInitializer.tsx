
import { useEffect, useState, useRef } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useSiteTheme } from '@/components/theme/SiteThemeProvider';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);
  const { isLoaded: themeLoaded } = useSiteTheme();
  
  useEffect(() => {
    logger.info('App initializing, theme loaded:', { 
      details: { themeLoaded }
    });
  }, [logger, themeLoaded]);
  
  // We don't wait for auth initialization - we render immediately
  return <>{children}</>;
}
