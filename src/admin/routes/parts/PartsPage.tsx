
import React from 'react';
import { Box } from 'lucide-react';
import { PERMISSIONS } from '@/auth/permissions';
import { RequirePermission } from '@/admin/components/auth/RequirePermission';

export default function PartsPage() {
  return (
    <RequirePermission permission={PERMISSIONS.ADMIN_VIEW}>
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6 space-x-2">
          <Box className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Parts Management</h1>
        </div>
        
        <div className="bg-card p-8 rounded-lg border text-center">
          <Box className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold mb-2">Parts Management</h2>
          <p className="text-muted-foreground mb-6">
            This section allows you to manage inventory, track part usage, and maintain part databases.
          </p>
          <div className="text-sm text-muted-foreground pb-4 border-t pt-4 mt-4">
            Coming soon in a future update
          </div>
        </div>
      </div>
    </RequirePermission>
  );
}
