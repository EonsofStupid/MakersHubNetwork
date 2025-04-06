
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/auth/types/auth.types';

export interface RedirectOptions {
  to: string;
  ifAuthenticated?: boolean;
  ifRole?: UserRole | UserRole[];
  replace?: boolean;
}

/**
 * Hook for redirecting users based on auth state
 */
export function useAuthRedirect(options: RedirectOptions) {
  const { isAuthenticated, roles, status } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Don't redirect if still loading
    if (status === 'loading' || status === 'idle') return;
    
    const shouldRedirect = () => {
      // Redirect if we care about authentication status and it matches
      if (options.ifAuthenticated !== undefined && options.ifAuthenticated === isAuthenticated) {
        return true;
      }
      
      // Redirect if we care about specific roles and user has them
      if (options.ifRole) {
        // Convert to array if string
        const requiredRoles = Array.isArray(options.ifRole) 
          ? options.ifRole 
          : [options.ifRole];
          
        // Check if user has any of the required roles
        const hasRole = requiredRoles.some(role => roles.includes(role));
        if (hasRole) return true;
      }
      
      return false;
    };
    
    // Perform redirect if conditions are met
    if (shouldRedirect()) {
      navigate(options.to, { replace: options.replace });
    }
  }, [isAuthenticated, roles, status, options, navigate]);
}
