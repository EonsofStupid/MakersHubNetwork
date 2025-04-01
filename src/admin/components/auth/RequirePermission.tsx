import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminPermissionValue } from '@/admin/constants/permissions';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';
import { useAdminPermissions } from '@/admin/hooks/useAdminPermissions';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

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
  const { hasAdminAccess, isAuthenticated } = useAdminAccess();
  const { hasPermission } = useAdminPermissions();
  const logger = useLogger("RequirePermission", LogCategory.ADMIN);

  useEffect(() => {
    logger.info("Checking permission", { 
      details: { 
        permission,
        hasAdminAccess,
        isAuthenticated,
        permissionGranted: hasPermission(permission)
      } 
    });
  }, [permission, hasAdminAccess, isAuthenticated, hasPermission, logger]);

  // First check if user is authenticated
  if (!isAuthenticated) {
    logger.info("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Then check if user has admin access at all
  if (!hasAdminAccess) {
    logger.info("User doesn't have admin access, redirecting to unauthorized");
    return <Navigate to={fallbackPath} replace />;
  }

  // Finally check specific permission
  if (!permission || hasPermission(permission)) {
    logger.info("Permission granted", { details: { permission } });
    // If readonly is true, wrap children with readonly context
    if (readonly) {
      // Here you could wrap with a context provider that indicates readonly mode
      // For now, we'll just pass the children through
      return <>{children}</>;
    }
    return <>{children}</>;
  }
  
  // Otherwise redirect to unauthorized page
  logger.info("Permission denied, redirecting to unauthorized", { details: { permission } });
  return <Navigate to={fallbackPath} replace />;
};
