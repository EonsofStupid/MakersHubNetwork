
import React from 'react';
import { PageLayout } from '@/admin/components/layouts/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardOverview } from '@/admin/components/dashboard/DashboardOverview';
import { MetricsPanel } from '@/admin/components/dashboard/MetricsPanel';
import { ActivityFeed } from '@/admin/components/dashboard/ActivityFeed';
import { PermissionChecker, AdminPermissionValue } from '@/admin/components/auth/PermissionChecker';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default function Dashboard() {
  return (
    <PageLayout
      title="Admin Dashboard"
      description="Administrative dashboard and key metrics for your platform."
    >
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <div className="mt-4 space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <DashboardOverview />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium">System Health</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>CPU Usage</span>
                      <span>32%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory</span>
                      <span>2.7 GB / 8 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Disk</span>
                      <span>78% Free</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium">Quick Actions</h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  <button className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors">
                    Generate Report
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors">
                    System Backup
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors">
                    Clear Cache
                  </button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="metrics">
            <PermissionChecker permission={AdminPermissionValue.ViewMetrics}>
              <MetricsPanel />
            </PermissionChecker>
          </TabsContent>

          <TabsContent value="activity">
            <PermissionChecker permission={AdminPermissionValue.ViewActivity}>
              <ActivityFeed />
            </PermissionChecker>
          </TabsContent>
        </div>
      </Tabs>
    </PageLayout>
  );
}
