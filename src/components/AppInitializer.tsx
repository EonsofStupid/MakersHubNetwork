
import { useEffect, useState, useRef } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/auth/store/auth.store';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);
  const { toast } = useToast();
  const initMessageShownRef = useRef<boolean>(false);
  
  // Only access the status and error from auth store, do not trigger initialization here
  const { status, error, initialized } = useAuthStore(state => ({
    status: state.status,
    error: state.error,
    initialized: state.initialized,
  }));
  
  useEffect(() => {
    // Log auth status change, but only once per render to avoid loops
    if (!initMessageShownRef.current) {
      logger.info('App initializing, auth status:', { 
        details: { status } 
      });
      initMessageShownRef.current = true;
    }
    
    // Initialize app with small timeout to allow other processes to complete
    const timer = setTimeout(() => {
      if (error) {
        logger.error('Auth initialization error:', { details: error });
        toast({
          title: 'Authentication Error',
          description: 'There was a problem loading your authentication state.',
          variant: 'destructive',
        });
      }
      
      // Don't set loading to false until auth is initialized
      if (initialized || status !== 'idle') {
        setIsLoading(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [logger, status, error, toast, initialized]);
  
  // Reset the flag when dependencies change
  useEffect(() => {
    initMessageShownRef.current = false;
  }, [status, error, initialized]);
  
  // Show minimal loading state while app is initializing
  if (isLoading) {
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
