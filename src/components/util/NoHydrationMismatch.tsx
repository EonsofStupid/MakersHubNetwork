
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
  
  // Use ref instead of state to prevent re-renders
  useEffect(() => {
    // Use a timeout to ensure we're fully hydrated
    const timer = setTimeout(() => {
      isMountedRef.current = true;
      // Force re-render after setting the ref
      forceUpdate();
    }, 50);
    
    // Helper function to force a re-render
    function forceUpdate() {
      const event = new Event('forceUpdateNoHydration');
      window.dispatchEvent(event);
    }
    
    // Only log once on mount
    logger.debug('NoHydrationMismatch mounting');
    
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
