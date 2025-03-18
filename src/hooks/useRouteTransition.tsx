
import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from './use-toast';

interface RouteTransitionOptions {
  onError?: (error: unknown) => void;
  timeout?: number;
}

/**
 * A hook to manage route transitions with safety mechanisms
 */
export function useRouteTransition(options: RouteTransitionOptions = {}) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionError, setTransitionError] = useState<Error | null>(null);
  const location = useLocation();
  const { toast } = useToast();
  
  // Reset error state when the location changes
  useEffect(() => {
    setTransitionError(null);
  }, [location.pathname]);
  
  // Safety timeout to prevent stuck transitions
  useEffect(() => {
    if (!isTransitioning) return;
    
    const timeout = setTimeout(() => {
      if (isTransitioning) {
        setIsTransitioning(false);
        setTransitionError(new Error("Route transition timed out"));
        toast({
          variant: "destructive",
          title: "Navigation Error",
          description: "The navigation took too long and was cancelled"
        });
      }
    }, options.timeout || 5000);
    
    return () => clearTimeout(timeout);
  }, [isTransitioning, options.timeout, toast]);
  
  // Safely start a route transition
  const startTransition = useCallback(() => {
    setIsTransitioning(true);
    setTransitionError(null);
  }, []);
  
  // Complete a route transition
  const endTransition = useCallback(() => {
    setIsTransitioning(false);
  }, []);
  
  // Handle an error during transition
  const handleTransitionError = useCallback((error: unknown) => {
    setIsTransitioning(false);
    const errorObj = error instanceof Error ? error : new Error("Navigation failed");
    setTransitionError(errorObj);
    
    toast({
      variant: "destructive",
      title: "Navigation Error",
      description: errorObj.message || "Failed to navigate to the requested page"
    });
    
    if (options.onError) {
      options.onError(error);
    }
  }, [options, toast]);
  
  return {
    isTransitioning,
    transitionError,
    startTransition,
    endTransition,
    handleTransitionError
  };
}
