
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authBridge } from '@/bridges/AuthBridge';
import { UserRole } from '@/shared/types/user';

interface AdminAccessOptions {
  redirectTo?: string;
  requiredRoles?: UserRole | UserRole[];
}

export function useAdminAccess(options: AdminAccessOptions = {}) {
  const { redirectTo = '/admin/unauthorized', requiredRoles = ['admin', 'superadmin'] } = options;
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First check if user is authenticated
        const authenticated = authBridge.status.isAuthenticated;
        setIsAuthenticated(authenticated);
        
        if (!authenticated) {
          navigate('/auth/login', { state: { from: location } });
          return;
        }

        // Check for required roles
        const hasRequiredRole = authBridge.hasRole(requiredRoles);
        setHasAdminAccess(hasRequiredRole);
        
        if (!hasRequiredRole) {
          navigate(redirectTo);
          return;
        }

        // User has the required role
        setIsAuthorized(true);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error checking admin access');
        setError(error);
        navigate(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [location.pathname, navigate, redirectTo, requiredRoles, location]);

  return { isAuthorized, isLoading, error, hasAdminAccess, isAuthenticated };
}
