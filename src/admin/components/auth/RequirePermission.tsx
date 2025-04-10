
import React from 'react';

interface RequirePermissionProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// RequirePermission that doesn't actually check permissions
export function RequirePermission({ 
  children 
}: RequirePermissionProps) {
  // Always render the children, no permission checks
  return <>{children}</>;
}
