
import { useEffect } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export interface RedirectOptions {
  to: string;
  allowRoles?: string[];
  redirectAuthenticated?: boolean;
  redirectUnauthenticated?: boolean;
}

/**
 * Hook to handle redirects based on authentication state
 */
export function useAuthRedirect(options: RedirectOptions) {
  const { to, allowRoles, redirectAuthenticated = false, redirectUnauthenticated = true } = options;
  const { roles, status } = useAuthState();
  const navigate = useNavigate();
  const location = useLocation();
  const logger = useLogger('useAuthRedirect', LogCategory.AUTH);
  
  useEffect(() => {
    // Wait until auth is not in loading state
    if (status === 'loading' || status === 'idle') {
      return;
    }
    
    const isAuthenticated = status === 'authenticated';
    
    // Handle role-based access
    const hasRequiredRole = allowRoles 
      ? roles.some(role => allowRoles.includes(role))
      : true;
    
    const shouldRedirect = 
      (isAuthenticated && redirectAuthenticated) ||
      (!isAuthenticated && redirectUnauthenticated) ||
      (isAuthenticated && !hasRequiredRole);
      
    if (shouldRedirect) {
      logger.info(`Redirecting to ${to}`, {
        details: {
          from: location.pathname,
          to,
          isAuthenticated,
          hasRequiredRole
        }
      });
      
      // Use state that's compatible with TanStack Router
      navigate({ 
        to: to as any,
        state: { from: location.pathname } // Changed returnUrl to from for TanStack compatibility
      });
    }
  }, [status, roles, navigate, to, allowRoles, redirectAuthenticated, redirectUnauthenticated, location.pathname, logger]);
}
