import { useEffect, useState } from 'react';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

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
  
  // Log component lifecycle
  logger.debug('NoHydrationMismatch rendering', {
    details: {
      isMounted,
      hasWindow: typeof window !== 'undefined',
      hasDocument: typeof document !== 'undefined',
      documentReadyState: typeof document !== 'undefined' ? document.readyState : 'undefined',
      isHydrated: typeof document !== 'undefined' ? document.documentElement.hasAttribute('data-hydrated') : false,
      timestamp: new Date().toISOString()
    }
  });
  
  useEffect(() => {
    logger.debug('NoHydrationMismatch mounting', {
      details: {
        timestamp: new Date().toISOString(),
        hasWindow: typeof window !== 'undefined',
        hasDocument: typeof document !== 'undefined'
      }
    });
    
    // Use a timeout to ensure we're fully hydrated
    const timer = setTimeout(() => {
      logger.debug('NoHydrationMismatch setting isMounted to true', {
        details: {
          timestamp: new Date().toISOString(),
          documentReadyState: document.readyState,
          isHydrated: document.documentElement.hasAttribute('data-hydrated')
        }
      });
      
      setIsMounted(true);
    }, 50); // Slightly longer timeout for better hydration
    
    return () => {
      logger.debug('NoHydrationMismatch cleanup', {
        details: { timestamp: new Date().toISOString() }
      });
      clearTimeout(timer);
    };
  }, [logger]);
  
  // Return null during SSR to prevent hydration mismatches
  if (typeof window === 'undefined') {
    logger.debug('NoHydrationMismatch SSR rendering (returning null)', {
      details: { timestamp: new Date().toISOString() }
    });
    return null;
  }
  
  // Return fallback or nothing until client-side mounted
  if (!isMounted) {
    logger.debug('NoHydrationMismatch pre-mount rendering (returning fallback)', {
      details: { 
        hasFallback: !!fallback,
        timestamp: new Date().toISOString()
      }
    });
    return <>{fallback}</>;
  }
  
  logger.debug('NoHydrationMismatch fully mounted (rendering children)', {
    details: { timestamp: new Date().toISOString() }
  });
  
  return <>{children}</>;
};

export default NoHydrationMismatch;
