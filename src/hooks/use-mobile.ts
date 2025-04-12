
import { useEffect, useState } from 'react';

/**
 * Hook to detect if the viewport is mobile size
 * @param breakpoint The breakpoint in pixels (default: 768)
 * @returns Boolean indicating if viewport is mobile size
 */
export function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Initial check
    checkMobile();
    
    // Listen for window resize
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [breakpoint]);
  
  return isMobile;
}

export default useMobile;
