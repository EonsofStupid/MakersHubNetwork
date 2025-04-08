
import { useEffect, useState, useRef } from 'react';
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
  // Use ref to track if we've ever set the mounted state to true
  // This prevents toggling the state which could cause multiple renders
  const isMountedRef = useRef(false);
  const [isMounted, setIsMounted] = useState(false);
  const logger = getLogger('NoHydrationMismatch');
  
  // Use a simpler approach with useState for better reliability
  useEffect(() => {
    // Only run this effect once per component instance
    if (isMountedRef.current) return;
    
    // Mark as having run the effect
    isMountedRef.current = true;
    
    // Immediately set to mounted to prevent delays
    setIsMounted(true);
    
    // Mark hydration complete on document for global state tracking
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-hydrated', 'true');
      logger.debug('NoHydrationMismatch mounted and ready');
    }
  }, []); // No dependencies needed - run once on mount
  
  // Return null during SSR to prevent hydration mismatches
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Return fallback or nothing until client-side mounted
  if (!isMounted) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export default NoHydrationMismatch;
