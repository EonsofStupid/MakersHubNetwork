
import React from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

// Define the permission values as a proper enum
export enum AdminPermissionValue {
  ViewDashboard = "view_dashboard",
  ViewMetrics = "view_metrics",
  ViewActivity = "view_activity",
  ManageSettings = "manage_settings",
  ManageUsers = "manage_users",
  ManageRoles = "manage_roles",
  ManageBuilds = "manage_builds",
  ManageComments = "manage_comments"
}

interface PermissionCheckerProps {
  permission: AdminPermissionValue;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionChecker({ 
  permission, 
  fallback = <PermissionDenied />, 
  children 
}: PermissionCheckerProps) {
  const logger = useLogger('PermissionChecker', LogCategory.ADMIN);
  
  // For now, just mock that all permissions are granted
  // In a real app, this would check against user permissions
  const hasPermission = true;
  
  React.useEffect(() => {
    logger.debug('Checking permission', { details: { permission } });
  }, [permission, logger]);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

function PermissionDenied() {
  return (
    <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-md">
      <h3 className="text-lg font-medium text-destructive">Permission Required</h3>
      <p className="text-muted-foreground">
        You don't have permission to access this content.
      </p>
    </div>
  );
}
