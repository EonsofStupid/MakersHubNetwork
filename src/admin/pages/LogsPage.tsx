
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogsDashboard } from '@/admin/components/dashboard/LogsDashboard';
import { LogActivityStream } from '@/admin/components/ui/LogActivityStream';
import { CyberCard } from '@/admin/components/ui/CyberCard';
import { LogCategory } from '@/logging';
import { LogLevel } from '@/logging/constants/log-level';

export function LogsPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-[var(--impulse-text-primary)]">
        Logging System
      </h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="activity">Activity Stream</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <LogsDashboard />
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <CyberCard title="System Logs" className="p-4">
                <LogActivityStream 
                  height="400px"
                  level={LogLevel.INFO}
                  categories={[LogCategory.SYSTEM]}
                  showSource={true}
                />
              </CyberCard>
            </div>
            
            <div className="lg:col-span-3">
              <CyberCard title="All Activity" className="p-4">
                <LogActivityStream 
                  height="400px"
                  level={LogLevel.DEBUG}
                  showSource={true}
                />
              </CyberCard>
            </div>
            
            <div className="lg:col-span-2">
              <CyberCard title="Errors & Warnings" className="p-4">
                <LogActivityStream 
                  height="300px"
                  level={LogLevel.WARN}
                  showSource={true}
                />
              </CyberCard>
            </div>
            
            <div className="lg:col-span-2">
              <CyberCard title="Network Activity" className="p-4">
                <LogActivityStream 
                  height="300px"
                  level={LogLevel.INFO}
                  categories={[LogCategory.NETWORK]}
                  showSource={true}
                />
              </CyberCard>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <CyberCard title="Logging Configuration" className="p-4">
            <p className="text-[var(--impulse-text-secondary)] mb-4">
              Logging settings can be configured programmatically through the LoggerService.
            </p>
            
            <pre className="bg-[var(--impulse-bg-overlay)] p-4 rounded-md text-xs overflow-x-auto">
              {`// Example of updating logging configuration
import { getLogger } from '@/logging';
import { LogLevel } from '@/logging/constants/log-level';

const logger = getLogger();
logger.updateConfig({
  minLevel: LogLevel.DEBUG,
  bufferSize: 20,
  flushInterval: 10000,
});`}
            </pre>
          </CyberCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default LogsPage;
