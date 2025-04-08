
import { useEffect, useRef, useState } from 'react';
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
  const [isMounted, setIsMounted] = useState(false);
  const logger = getLogger('NoHydrationMismatch');
  
  // Use a simpler approach with useState for better reliability
  useEffect(() => {
    // Set timeout to ensure hydration is complete
    const timer = setTimeout(() => {
      setIsMounted(true);
      
      // Mark hydration complete on document for global state tracking
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-hydrated', 'true');
        logger.debug('NoHydrationMismatch mounted and ready');
      }
    }, 50);
    
    // Only log once on initial mount
    logger.debug('NoHydrationMismatch initializing');
    
    return () => {
      clearTimeout(timer);
    };
  }, []); // Empty deps array ensures this only runs once
  
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
