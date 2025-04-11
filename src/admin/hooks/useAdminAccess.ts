
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authBridge } from '@/bridges/AuthBridge';
import { useLogger } from '@/shared/hooks/use-logger';
import { LogCategory } from '@/logging/types';
import { UserRole } from '@/shared/types/auth.types';

interface AdminAccessOptions {
  redirectTo?: string;
  requiredRoles?: UserRole | UserRole[];
}

export function useAdminAccess(options: AdminAccessOptions = {}) {
  const { redirectTo = '/admin/unauthorized', requiredRoles = ['admin', 'super_admin'] } = options;
  const navigate = useNavigate();
  const location = useLocation();
  const logger = useLogger('useAdminAccess', LogCategory.ADMIN);
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First check if user is authenticated
        if (!authBridge.status.isAuthenticated) {
          logger.warn('User not authenticated, redirecting to login');
          navigate('/auth/login', { state: { from: location } });
          return;
        }

        // Check for required roles
        const hasRequiredRole = authBridge.hasRole(requiredRoles as UserRole | UserRole[]);
        
        if (!hasRequiredRole) {
          logger.warn('User does not have required role(s)', { 
            requiredRoles, 
            userRoles: authBridge.user?.profile?.roles 
          });
          navigate(redirectTo);
          return;
        }

        // User has the required role
        setIsAuthorized(true);
        logger.info('User authorized for admin access');
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error checking admin access');
        logger.error('Error checking admin access', { error: error.message });
        setError(error);
        navigate(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [location.pathname, navigate, redirectTo, requiredRoles, logger, location]);

  return { isAuthorized, isLoading, error };
}
