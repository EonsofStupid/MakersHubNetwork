
import { useEffect, useState, useRef } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);
  const { toast } = useToast();
  const initMessageShownRef = useRef<boolean>(false);
  const initTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Get auth state directly from localStorage to avoid circular dependencies
  const authStatus = localStorage.getItem('auth-storage') 
    ? JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.status || 'idle'
    : 'idle';
  
  const initialized = localStorage.getItem('auth-storage') 
    ? JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.initialized || false
    : false;
    
  useEffect(() => {
    // Log auth status change, but only once per render to avoid loops
    if (!initMessageShownRef.current) {
      logger.info('App initializing, auth status:', { 
        details: { status: authStatus } 
      });
      initMessageShownRef.current = true;
    }
    
    // Initialize app with small timeout to allow other processes to complete
    // Use ref for timeout to properly clean up
    initTimeoutRef.current = setTimeout(() => {
      // Only set loading to false once we have some information on auth state
      if (initialized || authStatus !== 'idle') {
        setIsLoading(false);
      } else {
        // If auth is still initializing after a timeout, render app anyway
        const renderTimeout = setTimeout(() => {
          setIsLoading(false);
        }, 2000); // Max wait time for auth
        
        return () => clearTimeout(renderTimeout);
      }
    }, 500);
    
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, [logger, authStatus, initialized]);
  
  // Reset the flag when dependencies change
  useEffect(() => {
    initMessageShownRef.current = false;
  }, [authStatus, initialized]);
  
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
