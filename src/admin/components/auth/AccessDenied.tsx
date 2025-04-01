
import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { PermissionValue } from '@/auth/permissions';

interface AccessDeniedProps {
  permission?: PermissionValue;
}

export function AccessDenied({ permission }: AccessDeniedProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <ShieldAlert className="h-12 w-12 text-destructive" />
      <h3 className="text-lg font-semibold">Access Denied</h3>
      <p className="text-muted-foreground max-w-md">
        You don't have permission to access this content.
        {permission && (
          <span className="block mt-2 text-sm">
            Required permission: <code className="bg-muted p-1 rounded text-xs">{permission}</code>
          </span>
        )}
      </p>
    </div>
  );
}
