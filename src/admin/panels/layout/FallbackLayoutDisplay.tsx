
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { RBACBridge } from '@/rbac/bridge';
import { Permission } from '@/shared/types';

interface FallbackLayoutDisplayProps {
  layoutId?: string;
  fallbackContent?: React.ReactNode;
}

/**
 * Fallback component when a layout cannot be loaded
 */
export const FallbackLayoutDisplay: React.FC<FallbackLayoutDisplayProps> = ({
  layoutId,
  fallbackContent
}) => {
  // For admin users, show debug info, otherwise show a simple fallback
  const isAdmin = RBACBridge.hasPermission('admin:edit' as Permission);
  
  if (!isAdmin) {
    return (
      <div className="p-4">
        {fallbackContent || (
          <Card>
            <CardHeader>
              <CardTitle>Layout Not Available</CardTitle>
            </CardHeader>
            <CardContent>
              <p>The requested layout could not be loaded.</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <Card className="border-dashed border-2 border-amber-500">
      <CardHeader className="bg-amber-50 dark:bg-amber-900/20">
        <CardTitle className="text-amber-700 dark:text-amber-400">Layout Error</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <p className="mb-4">The layout could not be loaded. This message is only visible to admins.</p>
        
        {layoutId && (
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded font-mono text-sm">
            <p>Layout ID: {layoutId}</p>
          </div>
        )}
        
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          <p>Possible reasons:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Layout does not exist in the database</li>
            <li>Layout JSON is invalid or corrupted</li>
            <li>Required components are missing</li>
            <li>Version mismatch between layout and components</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
