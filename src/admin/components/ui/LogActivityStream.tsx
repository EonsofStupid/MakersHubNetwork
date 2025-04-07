
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogEntry, LogLevel, LogCategory } from '@/logging/types';
import { getLogger } from '@/logging';
import { Badge } from '@/components/ui/badge';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { renderUnknownAsNode } from '@/shared/rendering';
import { memoryTransport } from '@/logging/transports/memory-transport';

interface LogActivityStreamProps {
  maxItems?: number;
  title?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  height?: string;
  level?: LogLevel;
  categories?: LogCategory[];
  showSource?: boolean;
}

export const LogActivityStream: React.FC<LogActivityStreamProps> = ({ 
  maxItems = 5, 
  title = "Recent Activity",
  autoRefresh = true,
  refreshInterval = 10000,
  height = "300px",
  level,
  categories,
  showSource = false
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      // Get recent logs and filter them if needed
      let allLogs = memoryTransport.getLogs();
      
      // Filter by level if specified
      if (level) {
        allLogs = allLogs.filter(log => {
          // For warn level, include error and critical too
          if (level === LogLevel.WARN) {
            return [LogLevel.WARN, LogLevel.ERROR, LogLevel.CRITICAL].includes(log.level as LogLevel);
          }
          // For debug level, include all
          else if (level === LogLevel.DEBUG) {
            return true;
          }
          // For info level, include info and success
          else if (level === LogLevel.INFO) {
            return [LogLevel.INFO, LogLevel.SUCCESS].includes(log.level as LogLevel);
          }
          return log.level === level;
        });
      }
      
      // Filter by category if specified
      if (categories && categories.length > 0) {
        allLogs = allLogs.filter(log => categories.includes(log.category as LogCategory));
      }
      
      // Limit to maxItems
      setLogs(allLogs.slice(0, maxItems));
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLogs();
    
    // Set up interval to refresh logs if autoRefresh is enabled
    let interval: NodeJS.Timeout | undefined;
    if (autoRefresh) {
      interval = setInterval(fetchLogs, refreshInterval);
    }
    
    // Subscribe to memory transport for real-time updates
    const unsubscribe = memoryTransport.subscribe(() => {
      if (autoRefresh) fetchLogs();
    });
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
      unsubscribe();
    };
  }, [autoRefresh, refreshInterval, level, categories?.toString(), maxItems]);
  
  // Level to color mapping
  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'debug': return 'bg-gray-500';
      case 'info': return 'bg-blue-500';
      case 'warn': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'critical': return 'bg-purple-500';
      case 'success': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button variant="outline" size="sm" onClick={fetchLogs} disabled={isLoading}>
          <RotateCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4" style={{ maxHeight: height, overflowY: 'auto' }}>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent activity
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="flex flex-col space-y-1 pb-3 border-b last:border-b-0">
                <div className="flex justify-between items-center">
                  <Badge className={getLevelColor(log.level)}>{log.level}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {log.timestamp instanceof Date 
                      ? log.timestamp.toLocaleTimeString() 
                      : new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="font-medium">{renderUnknownAsNode(log.message)}</div>
                {showSource && (
                  <div className="text-xs text-muted-foreground">
                    {log.category} • {log.source || 'system'}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
