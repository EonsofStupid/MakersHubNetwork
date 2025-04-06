
import { useEffect, useState, useRef } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { Skeleton } from './ui/skeleton';
import { useSiteTheme } from '@/components/theme/SiteThemeProvider';
import { useAuthState } from '@/auth/hooks/useAuthState';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const [isAppReady, setIsAppReady] = useState(false);
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);
  const initMessageShownRef = useRef<boolean>(false);
  const maxWaitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Get theme and auth loading status
  const { isLoaded: themeLoaded } = useSiteTheme();
  const { initialized: authInitialized, status: authStatus } = useAuthState();
  
  useEffect(() => {
    // Log status changes, but only once per render to avoid loops
    if (!initMessageShownRef.current) {
      logger.info('App initializing, auth status:', { 
        details: { status: authStatus, themeLoaded, authInitialized }
      });
      initMessageShownRef.current = true;
    }
    
    // Clear any existing timeouts
    if (maxWaitTimeoutRef.current) {
      clearTimeout(maxWaitTimeoutRef.current);
    }
    
    // If theme is loaded, we can render the app regardless of auth state
    if (themeLoaded) {
      logger.info('All systems initialized, rendering application');
      setIsAppReady(true);
      return;
    }
    
    // Set a maximum wait time for initialization
    // This prevents app from being stuck in loading state forever
    maxWaitTimeoutRef.current = setTimeout(() => {
      logger.warn('Rendering app with incomplete initialization', {
        details: { themeLoaded, authStatus, authInitialized }
      });
      setIsAppReady(true);
    }, 1500); // Reduced max wait time
    
    return () => {
      if (maxWaitTimeoutRef.current) {
        clearTimeout(maxWaitTimeoutRef.current);
      }
    };
  }, [logger, authStatus, authInitialized, themeLoaded]);
  
  // Reset the flag when dependencies change
  useEffect(() => {
    initMessageShownRef.current = false;
  }, [authStatus, authInitialized, themeLoaded]);
  
  // Skip loading screen and always render children to avoid blocking the app
  // This ensures the site loads immediately with fallback styling
  return <>{children}</>;
}
