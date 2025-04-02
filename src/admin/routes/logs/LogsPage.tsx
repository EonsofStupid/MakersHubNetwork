import React, { useState, lazy, Suspense } from 'react';
import { LogsDashboard } from '@/admin/components/dashboard/LogsDashboard';
import { LogActivityStream } from '@/logging/components/LogActivityStream';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogLevel } from '@/logging';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Avoid circular dependencies by using dynamic import
const PerformanceMetrics = lazy(() => import('@/admin/dashboard/PerformanceMetrics'));

export function LogsPage() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        System Logs
      </h1>
      
      <p className="text-muted-foreground">
        View and analyze system logs for troubleshooting and monitoring.
      </p>
      
      <Tabs
        defaultValue="dashboard"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="live">Live Stream</TabsTrigger>
          <TabsTrigger value="all">All Logs</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <LogsDashboard />
        </TabsContent>
        
        <TabsContent value="live" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Log Stream</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Showing most recent logs in real-time. Auto-scrolling is enabled.
              </p>
              <LogActivityStream 
                maxEntries={100}
                autoScroll={true}
                level={LogLevel.DEBUG}
                style={{ height: '70vh' }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All System Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Showing all logs stored in memory. Filter by category or level using the dashboard.
              </p>
              <LogActivityStream 
                maxEntries={1000}
                autoScroll={false}
                level={LogLevel.DEBUG}
                style={{ height: '70vh' }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Suspense fallback={<div>Loading performance metrics...</div>}>
                  <PerformanceMetrics />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Default export for React.lazy loading
export default LogsPage;
