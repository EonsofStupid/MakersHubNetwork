import { useAdminPermissions } from '@/admin/hooks/useAdminPermissions';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminPermissionValue } from '@/admin/constants/permissions';
import { useAdminAccess } from '@/hooks/useAdminAccess';

interface RequirePermissionProps {
  permission: AdminPermissionValue;
  children: ReactNode;
  fallbackPath?: string;
  readonly?: boolean;
}

export const RequirePermission = ({ 
  permission, 
  children, 
  fallbackPath = "/admin/unauthorized",
  readonly = false 
}: RequirePermissionProps) => {
  const { checkPermission, hasAdminAccess } = useAdminAccess();

  // First check if user has admin access at all
  if (!hasAdminAccess) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Then check specific permission
  if (!permission || checkPermission(permission)) {
    // If readonly is true, wrap children with readonly context
    if (readonly) {
      // Here you could wrap with a context provider that indicates readonly mode
      // For now, we'll just pass the children through
      return <>{children}</>;
    }
    return <>{children}</>;
  }
  
  // Otherwise redirect to unauthorized page
  return <Navigate to={fallbackPath} replace />;
};
