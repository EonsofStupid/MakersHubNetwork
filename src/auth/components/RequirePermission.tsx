
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from '../hooks/useAuthState';
import { hasPermission } from '../rbac/enforce';
import { PermissionValue } from '../permissions';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

interface RequirePermissionProps {
  children: React.ReactNode;
  permission: PermissionValue;
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
  const { roles, isLoading } = useAuthState();
  const logger = getLogger();
  
  // Show loading state while permissions are being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="h-6 w-6 border-t-2 border-primary animate-spin rounded-full" />
      </div>
    );
  }
  
  // Check permission
  const allowed = hasPermission(roles, permission);
  
  // Log permission check
  logger.info(`Permission check for ${permission}`, {
    category: LogCategory.AUTH,
    source: "RequirePermission",
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
