
import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/auth/types/auth.types';

interface RequirePermissionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  roles: UserRole[];
  requireAll?: boolean;
}

/**
 * Component that renders children only if user has required roles
 */
const RequirePermission: React.FC<RequirePermissionProps> = ({
  children,
  fallback = null,
  roles,
  requireAll = false
}) => {
  const { roles: userRoles } = useAuth();
  
  // Check if user has required roles
  const hasPermission = requireAll
    ? roles.every(role => userRoles.includes(role))
    : roles.some(role => userRoles.includes(role));
    
  // Render children if user has permission, otherwise fallback
  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

export default RequirePermission;
