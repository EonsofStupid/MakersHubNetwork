
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CircuitBreaker from '@/utils/CircuitBreaker';
import { getLogger } from '@/logging';

const logger = getLogger('useRouteCircuitBreaker');

/**
 * This hook resets circuit breakers when routes change to prevent
 * false positives from previous routes
 */
export function useRouteCircuitBreaker() {
  const location = useLocation();
  
  useEffect(() => {
    // Reset specific circuit breakers on route changes
    const resetBreakers = ['ThemeInitializer-effect', 'SiteThemeProvider-cssVars'];
    
    resetBreakers.forEach(breaker => {
      CircuitBreaker.reset(breaker);
    });
    
    logger.debug('Reset circuit breakers on route change', { 
      details: { pathname: location.pathname }
    });
  }, [location.pathname]);
  
  return null;
}
