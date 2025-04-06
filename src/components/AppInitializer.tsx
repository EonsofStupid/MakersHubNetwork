
import { useEffect, useState, useRef } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);
  const initMessageShownRef = useRef<boolean>(false);
  
  useEffect(() => {
    // Log status changes, but only once per render to avoid loops
    if (!initMessageShownRef.current) {
      logger.info('App initializing');
      initMessageShownRef.current = true;
    }
  }, [logger]);
  
  // Skip loading screen and always render children to avoid blocking the app
  // This ensures the site loads immediately with fallback styling
  return <>{children}</>;
}
