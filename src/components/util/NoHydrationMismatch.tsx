import { useEffect, useState } from 'react';

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
  
  useEffect(() => {
    // Use requestAnimationFrame to ensure we're fully hydrated
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    
    return () => cancelAnimationFrame(frame);
  }, []);
  
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
