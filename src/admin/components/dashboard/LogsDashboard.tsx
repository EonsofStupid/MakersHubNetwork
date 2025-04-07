
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { RotateCw, XCircle } from 'lucide-react';
import { LogEntry, LogLevel } from '@/logging/types';
import { renderUnknownAsNode } from '@/shared/rendering';
import { memoryTransport } from '@/logging/transports/memory-transport';

export const LogsDashboard: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      // Get logs directly from memoryTransport
      const allLogs = memoryTransport.getLogs();
      setLogs(allLogs || []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLogs();
    
    // Set up interval to refresh logs 
    const interval = setInterval(fetchLogs, 5000);
    
    // Subscribe to memory transport for real-time updates
    const unsubscribe = memoryTransport.subscribe(() => {
      fetchLogs();
    });
    
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  // Level to color mapping
  const getLevelColor = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.DEBUG: return 'bg-gray-500';
      case LogLevel.INFO: return 'bg-blue-500';
      case LogLevel.WARN: return 'bg-yellow-500';
      case LogLevel.ERROR: return 'bg-red-500';
      case LogLevel.CRITICAL: return 'bg-purple-500';
      case LogLevel.SUCCESS: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleClearLogs = () => {
    memoryTransport.clear();
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>System Logs</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={fetchLogs} disabled={isLoading}>
            <RotateCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="text-destructive" onClick={handleClearLogs}>
            <XCircle className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[500px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[100px]">Level</TableHead>
                <TableHead className="w-[180px]">Time</TableHead>
                <TableHead className="w-[150px]">Category</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[120px]">Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Badge className={getLevelColor(log.level as LogLevel)}>
                      {log.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {log.timestamp instanceof Date 
                      ? log.timestamp.toLocaleString() 
                      : new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{log.category}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {renderUnknownAsNode(log.message)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {log.source || 'system'}
                  </TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No logs available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
