
import { useEffect, useRef } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useThemeStore } from '@/stores/theme/themeStore';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);
  const initMessageShownRef = useRef<boolean>(false);
  const { loadStatus } = useThemeStore();
  
  useEffect(() => {
    // Log status changes, but only once per render to avoid loops
    if (!initMessageShownRef.current) {
      const themeStatus = loadStatus === 'loaded' ? 'with theme loaded' : 
                          loadStatus === 'loading' ? 'with theme loading' : 
                          'without theme';
                          
      logger.info(`App initializing ${themeStatus}`);
      initMessageShownRef.current = true;
    }
  }, [logger, loadStatus]);
  
  // Skip loading screen and always render children to avoid blocking the app
  // This ensures the site loads immediately with fallback styling
  return <>{children}</>;
}
