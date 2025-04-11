
import React from 'react';
import { DashboardShortcuts } from '@/admin/components/dashboard/DashboardShortcuts';
import { ADMIN_PERMISSIONS } from '@/admin/constants/permissions';
import { RequirePermission } from '@/admin/components/auth/RequirePermission';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/core/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/core/tabs';

export default function DashboardPage() {
  return (
    <RequirePermission permission={ADMIN_PERMISSIONS.ADMIN_VIEW}>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <DashboardShortcuts className="mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="builds">Builds</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-2 border-b">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">U</div>
                      <div>
                        <p className="text-sm">New user registered</p>
                        <p className="text-xs text-muted-foreground">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-2 border-b">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">B</div>
                      <div>
                        <p className="text-sm">Build submitted for approval</p>
                        <p className="text-xs text-muted-foreground">10 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-2 border-b">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">C</div>
                      <div>
                        <p className="text-sm">Content updated</p>
                        <p className="text-xs text-muted-foreground">30 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="builds" className="p-4">
                  <div className="text-center py-8 text-muted-foreground">
                    No recent build activity to display
                  </div>
                </TabsContent>
                <TabsContent value="users" className="p-4">
                  <div className="text-center py-8 text-muted-foreground">
                    No recent user activity to display
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Users Online</h3>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Active Builds</h3>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Pending Reviews</h3>
                    <p className="text-2xl font-bold">5</p>
                  </div>
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">System Load</h3>
                    <p className="text-2xl font-bold">28%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequirePermission>
  );
}

