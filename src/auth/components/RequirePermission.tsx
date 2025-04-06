
import React from 'react';
import { Navigate, useLocation, Outlet } from '@tanstack/react-router';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { UserRole, ADMIN_ROLES, hasRequiredRole } from '@/auth/types/userRoles';
import { createSearchParams } from '@/router/searchParams';

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
  allowedRoles = ADMIN_ROLES,
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
  const hasRequiredRole = roles.some(role => allowedRoles.includes(role as UserRole));
  
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
    
    // Use proper TanStack Router navigation pattern with type-safe search params
    return (
      <Navigate 
        to={redirectTo}
        search={createSearchParams({ from: location.pathname })}
        replace={true}
      />
    );
  }
  
  return <>{children || <Outlet />}</>;
};
