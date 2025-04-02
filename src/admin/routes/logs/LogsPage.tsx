
import React, { useState } from 'react';
import { LogsDashboard } from '@/admin/components/dashboard/LogsDashboard';
import { LogActivityStream } from '@/logging/components/LogActivityStream';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogLevel } from '@/logging';
import { CyberCard } from '@/admin/components/ui/CyberCard';

export function LogsPage() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--impulse-text-primary)]">
        System Logs
      </h1>
      
      <p className="text-[var(--impulse-text-secondary)]">
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
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <LogsDashboard />
        </TabsContent>
        
        <TabsContent value="live" className="space-y-4">
          <CyberCard title="Live Log Stream" className="p-4">
            <p className="text-[var(--impulse-text-secondary)] mb-4">
              Showing most recent logs in real-time. Auto-scrolling is enabled.
            </p>
            <LogActivityStream 
              maxEntries={100}
              autoScroll={true}
              level={LogLevel.DEBUG}
              style={{ height: '70vh' }}
              className="bg-[var(--impulse-bg-overlay)]/30"
            />
          </CyberCard>
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          <CyberCard title="All System Logs" className="p-4">
            <p className="text-[var(--impulse-text-secondary)] mb-4">
              Showing all logs stored in memory. Filter by category or level using the dashboard.
            </p>
            <LogActivityStream 
              maxEntries={1000}
              autoScroll={false}
              level={LogLevel.DEBUG}
              style={{ height: '70vh' }}
              className="bg-[var(--impulse-bg-overlay)]/30"
            />
          </CyberCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Default export for React.lazy loading
export default LogsPage;
