
import { useEffect, useState } from 'react';

/**
 * Hook to detect if the current device is mobile-sized
 * @param breakpoint Mobile breakpoint in pixels (default: 768)
 * @returns Boolean indicating if viewport is mobile-sized
 */
export function useMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  useEffect(() => {
    // Set initial value
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Check immediately
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [breakpoint]);
  
  return isMobile;
}

// Default export for compatibility
export default useMobile;
