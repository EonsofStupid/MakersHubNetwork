
import React from 'react';
import { useAdminPermissions } from '@/admin/hooks/useAdminPermissions';
import { AdminPermissionValue } from '@/admin/types/permissions';
import { AccessDenied } from './AccessDenied';

interface RequirePermissionProps {
  permission: AdminPermissionValue;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequirePermission({ 
  permission, 
  children, 
  fallback 
}: RequirePermissionProps) {
  const { hasPermission, isLoading } = useAdminPermissions();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-6 w-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Check if user has the required permission
  if (!hasPermission(permission)) {
    // If fallback is provided, show it, otherwise show AccessDenied
    return fallback ? <>{fallback}</> : <AccessDenied permission={permission} />;
  }
  
  // User has permission, render children
  return <>{children}</>;
}
