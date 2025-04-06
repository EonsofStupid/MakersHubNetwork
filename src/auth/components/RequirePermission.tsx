
import React from 'react';
import { Navigate, useLocation, Outlet } from '@tanstack/react-router';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { UserRole } from '@/auth/types/auth.types';

interface RequirePermissionProps {
  children?: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: UserRole;
}

/**
 * Component for protecting routes based on user permissions
 * Can be used as a wrapper or as a Route element
 */
export const RequirePermission = ({
  children,
  redirectTo = '/login',
  fallback,
  allowedRoles = ['admin', 'super_admin'],
  requiredPermission
}: RequirePermissionProps) => {
  const { roles, status } = useAuthState();
  const location = useLocation();
  const logger = useLogger('RequirePermission', LogCategory.AUTH);
  
  // Wait until auth is loaded
  if (status === 'loading' || status === 'idle') {
    return null; // Show nothing while loading
  }
  
  // Check for required roles
  const hasRequiredRole = roles.some(role => allowedRoles.includes(role));
  
  // Specific permission check (if needed)
  const hasRequiredPermission = requiredPermission
    ? roles.includes(requiredPermission)
    : true;
    
  if (!hasRequiredRole || !hasRequiredPermission) {
    logger.warn('Access denied - insufficient permissions', {
      details: {
        path: location.pathname,
        userRoles: roles,
        requiredRoles: allowedRoles,
        requiredPermission
      }
    });
    
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Use Navigate with state object compatible with TanStack Router
    return (
      <Navigate 
        to={redirectTo as any}  
        state={{ returnUrl: location.pathname }}
        replace={true}
      />
    );
  }
  
  return <>{children || <Outlet />}</>;
};
