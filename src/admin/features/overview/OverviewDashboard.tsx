
import React from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { useAuthStore } from '@/auth/store/auth.store';

export function OverviewDashboard() {
  const logger = useLogger('OverviewDashboard', LogCategory.ADMIN);
  const user = useAuthStore(state => state.user);
  const roles = useAuthStore(state => state.roles);

  React.useEffect(() => {
    logger.info('Admin Overview Dashboard mounted', {
      details: { roles }
    });
  }, [logger, roles]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Click to access user management tools</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Manage site content and media</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Click to access content management</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Configure system settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Click to access settings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Current User</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Roles:</strong> {roles.join(', ')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
