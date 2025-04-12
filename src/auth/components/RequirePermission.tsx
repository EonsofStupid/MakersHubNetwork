
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { UserRole } from '@/shared/types';

interface RequirePermissionProps {
  children: ReactNode;
  permission: string;
  redirectTo?: string;
  fallback?: ReactNode;
  roles?: UserRole[];
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({
  children,
  permission,
  redirectTo = '/',
  fallback,
  roles,
}) => {
  const { status, hasRole } = useAuthStore();
  const { isLoading } = status;

  // If auth is still loading, show loading indicator
  if (isLoading) {
    return <div>Loading permission check...</div>;
  }

  // Check if user has specific roles
  if (roles && roles.length > 0) {
    const hasRequiredRole = hasRole(roles);
    if (!hasRequiredRole) {
      if (fallback) {
        return <>{fallback}</>;
      }
      return <Navigate to={redirectTo} replace />;
    }
  }

  // For now, we're using roles as proxy for permissions
  // In a more sophisticated system, we'd check against actual permissions
  const permissionMap: Record<string, string[]> = {
    'view_admin_panel': ['admin', 'superadmin', 'moderator'],
    'manage_users': ['admin', 'superadmin'],
    'manage_content': ['admin', 'superadmin', 'moderator'],
    'manage_settings': ['admin', 'superadmin'],
    'system_critical': ['superadmin'],
  };

  const requiredRoles = permissionMap[permission] || ['superadmin'];
  const hasPermission = hasRole(requiredRoles);

  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
