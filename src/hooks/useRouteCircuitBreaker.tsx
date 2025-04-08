
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CircuitBreaker from '@/utils/CircuitBreaker';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * This hook resets all circuit breakers when the route changes
 * This helps prevent infinite loops when navigating between routes
 */
export function useRouteCircuitBreaker() {
  const location = useLocation();
  const logger = useLogger('RouteCircuitBreaker', LogCategory.SYSTEM);
  
  // Reset all circuit breakers on route change
  useEffect(() => {
    CircuitBreaker.resetAll();
    logger.debug('Reset all circuit breakers due to route change', {
      details: { pathname: location.pathname }
    });
  }, [location.pathname, logger]);
  
  return null;
}
