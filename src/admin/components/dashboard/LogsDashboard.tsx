
import React, { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogCategory, LogLevel, memoryTransport } from '@/logging';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { useLogger } from '@/hooks/use-logger';

export function LogsDashboard() {
  const [logs, setLogs] = useState(memoryTransport.getLogs?.() || []);
  const [activeTab, setActiveTab] = useState<string>('level');
  const logger = useLogger('LogsDashboard', { category: LogCategory.ADMIN });
  
  // Refresh logs periodically
  useEffect(() => {
    logger.info('LogsDashboard mounted');
    
    const interval = setInterval(() => {
      if (memoryTransport.getLogs) {
        setLogs(memoryTransport.getLogs());
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [logger]);
  
  // Process log data for charts
  const levelData = React.useMemo(() => {
    const countsByLevel: Record<string, number> = {};
    
    logs.forEach(log => {
      const levelName = LogLevel[log.level];
      countsByLevel[levelName] = (countsByLevel[levelName] || 0) + 1;
    });
    
    return Object.entries(countsByLevel).map(([level, count]) => ({
      level,
      count
    }));
  }, [logs]);
  
  const categoryData = React.useMemo(() => {
    const countsByCategory: Record<string, number> = {};
    
    logs.forEach(log => {
      countsByCategory[log.category] = (countsByCategory[log.category] || 0) + 1;
    });
    
    return Object.entries(countsByCategory).map(([category, count]) => ({
      category,
      count
    }));
  }, [logs]);
  
  const clearAllLogs = () => {
    if (memoryTransport.clear) {
      memoryTransport.clear();
      setLogs([]);
      logger.info('All logs cleared');
    }
  };
  
  // Calculate some statistics
  const totalLogs = logs.length;
  const errorCount = logs.filter(log => log.level >= LogLevel.ERROR).length;
  const warningCount = logs.filter(log => log.level === LogLevel.WARN).length;
  const errorPercentage = totalLogs ? ((errorCount / totalLogs) * 100).toFixed(1) : '0';
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Logging Dashboard</h2>
          <p className="text-[var(--impulse-text-secondary)]">
            Total Logs: {totalLogs} | Errors: {errorCount} ({errorPercentage}%) | Warnings: {warningCount}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select defaultValue="hour">
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hour">Last Hour</SelectItem>
              <SelectItem value="day">Last Day</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={clearAllLogs}
            title="Clear all logs"
          >
            <Trash className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>
      
      <Tabs
        defaultValue="level"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="level">By Level</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
        </TabsList>
        
        <TabsContent value="level" className="space-y-4">
          <Card className="p-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={levelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Count" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
        
        <TabsContent value="category" className="space-y-4">
          <Card className="p-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Count" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
