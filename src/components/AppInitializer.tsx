
import { useEffect, useState, useRef } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useSiteTheme } from '@/components/theme/SiteThemeProvider';
import { useAuthState } from '@/auth/hooks/useAuthState';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const [isAppReady, setIsAppReady] = useState(false);
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);
  const { toast } = useToast();
  const initMessageShownRef = useRef<boolean>(false);
  const initTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxWaitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleCountRef = useRef<number>(0);
  
  // Get theme loading status
  const { isLoaded: themeLoaded } = useSiteTheme();
  
  // Get auth state directly from auth store
  const { initialized: authInitialized, status: authStatus } = useAuthState();
  
  useEffect(() => {
    // Detect potential infinite initialization loops
    cycleCountRef.current += 1;
    if (cycleCountRef.current > 10) {
      logger.warn('Possible initialization cycle detected', {
        details: { cycleCount: cycleCountRef.current, themeLoaded, authStatus, authInitialized }
      });
    }
    
    // Log status changes, but only once per render to avoid loops
    if (!initMessageShownRef.current) {
      logger.info('App initializing, auth status:', { 
        details: { status: authStatus, themeLoaded, authInitialized }
      });
      initMessageShownRef.current = true;
    }
    
    // Clear any existing timeouts
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
    }
    
    if (maxWaitTimeoutRef.current) {
      clearTimeout(maxWaitTimeoutRef.current);
    }
    
    // If theme is loaded and auth is initialized, we can render the app
    if (themeLoaded && authInitialized) {
      logger.info('All systems initialized, rendering application');
      setIsAppReady(true);
      return;
    }
    
    // If theme is loaded but auth isn't initialized yet, wait a bit longer
    if (themeLoaded && !authInitialized) {
      initTimeoutRef.current = setTimeout(() => {
        logger.info('Auth initialization still in progress...');
      }, 500);
      
      // Set a maximum wait time for auth initialization
      maxWaitTimeoutRef.current = setTimeout(() => {
        logger.warn('Rendering app with incomplete initialization', {
          details: { themeLoaded, authStatus, authInitialized }
        });
        setIsAppReady(true);
      }, 3000); // Max wait time increased to 3s
    }
    
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      if (maxWaitTimeoutRef.current) {
        clearTimeout(maxWaitTimeoutRef.current);
      }
    };
  }, [logger, authStatus, authInitialized, themeLoaded]);
  
  // Reset the flag when dependencies change
  useEffect(() => {
    initMessageShownRef.current = false;
  }, [authStatus, authInitialized, themeLoaded]);
  
  // Show minimal loading state while app is initializing
  if (!isAppReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl px-4">
          {/* Navbar skeleton */}
          <div className="flex items-center justify-between mb-12">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
          
          {/* Content skeletons */}
          <div className="space-y-8">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-40 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}
