
import { useEffect, useRef } from 'react';
import { getLogger } from '@/logging';

interface NoHydrationMismatchProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component to prevent React hydration mismatches by only rendering children
 * after the component has been mounted on the client
 */
export const NoHydrationMismatch = ({ 
  children, 
  fallback = null 
}: NoHydrationMismatchProps) => {
  const isMountedRef = useRef(false);
  const logger = getLogger('NoHydrationMismatch');
  const forceUpdateRef = useRef(() => {});
  
  // Use ref instead of state to prevent re-renders
  useEffect(() => {
    // Set up force update mechanism that doesn't cause infinite loops
    const forceUpdateEvent = new Event('forceUpdateNoHydration');
    
    // Simple helper function to force a re-render by dispatching event
    forceUpdateRef.current = () => {
      window.dispatchEvent(forceUpdateEvent);
    };
    
    // Use a timeout to ensure we're fully hydrated
    const timer = setTimeout(() => {
      // Only set if not already mounted to prevent loops
      if (!isMountedRef.current) {
        isMountedRef.current = true;
        // Force re-render after setting the ref
        forceUpdateRef.current();
        logger.debug('NoHydrationMismatch mounted and ready');
      }
    }, 50);
    
    // Only log once on initial mount
    logger.debug('NoHydrationMismatch initializing');
    
    // Mark hydration complete on document for global state tracking
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-hydrated', 'true');
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, []); // Empty deps array ensures this only runs once
  
  // Return null during SSR to prevent hydration mismatches
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Return fallback or nothing until client-side mounted
  if (!isMountedRef.current) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export default NoHydrationMismatch;
