import { useAdminPermissions } from '@/admin/hooks/useAdminPermissions';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface RequirePermissionProps {
  permission: string;
  children: ReactNode;
}

export const RequirePermission = ({ permission, children }: RequirePermissionProps) => {
  const { hasPermission } = useAdminPermissions();

  // If no permission required or has permission, render children
  if (!permission || hasPermission(permission)) {
    return <>{children}</>;
  }
  
  // Otherwise redirect to unauthorized page
  return <Navigate to="/admin/unauthorized" replace />;
};
