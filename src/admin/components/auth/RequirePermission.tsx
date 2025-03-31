import { useAdminPermissions } from '@/admin/hooks/useAdminPermissions';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminPermissionValue } from '@/admin/constants/permissions';

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
  const { hasPermission } = useAdminPermissions();

  // If no permission required or has permission, render children
  if (!permission || hasPermission(permission)) {
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
