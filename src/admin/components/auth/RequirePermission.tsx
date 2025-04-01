import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminPermissions } from '@/admin/hooks/useAdminPermissions';
import { AdminPermissionValue } from '@/admin/constants/permissions';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface RequirePermissionProps {
  children: React.ReactNode;
  permission: AdminPermissionValue;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Component that checks if the current user has the required permission
 * and either renders the children or redirects/renders fallback
 */
export function RequirePermission({
  children,
  permission,
  fallback,
  redirectTo = '/admin/unauthorized'
}: RequirePermissionProps) {
  const { hasPermission, isLoading } = useAdminPermissions();
  const logger = useLogger("RequirePermission", LogCategory.ADMIN);
  
  // Show loading state while permissions are being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="h-6 w-6 border-t-2 border-primary animate-spin rounded-full" />
      </div>
    );
  }
  
  // Check permission
  const allowed = hasPermission(permission);
  
  // Log permission check
  logger.info(`Permission check for ${permission}`, {
    details: { 
      permission,
      allowed,
      redirectTo: !allowed ? redirectTo : null 
    }
  });
  
  // If permission check fails
  if (!allowed) {
    // Return fallback if provided
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Otherwise redirect
    return <Navigate to={redirectTo} replace />;
  }
  
  // Render children if permission check passes
  return <>{children}</>;
}
