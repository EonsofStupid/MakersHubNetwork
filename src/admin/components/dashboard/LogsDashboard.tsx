
import React, { useEffect, useState } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory, LogLevel, memoryTransport } from '@/logging';
import type { LogEntry } from '@/logging/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { renderUnknownAsNode } from '@/shared/utils/render';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Check, Info, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';

export function LogsDashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<LogLevel | null>(null);
  const logger = useLogger('LogsDashboard', LogCategory.ADMIN);

  useEffect(() => {
    setLogs(memoryTransport.getLogs());
    
    const subscription = memoryTransport.subscribe((entry) => {
      setLogs(prevLogs => [entry, ...prevLogs].slice(0, 100));
    });
    
    logger.info('Logs dashboard mounted');
    
    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
      logger.info('Logs dashboard unmounted');
    };
  }, [logger]);
  
  const filteredLogs = filter 
    ? logs.filter(log => log.level === filter)
    : logs;
    
  const handleClearLogs = () => {
    if (memoryTransport.clear) {
      memoryTransport.clear();
      setLogs([]);
      logger.info('Logs cleared');
    }
  };
  
  const handleRefreshLogs = () => {
    if (memoryTransport.getLogs) {
      setLogs(memoryTransport.getLogs());
      logger.info('Logs refreshed');
    }
  };
  
  const getLogIcon = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case LogLevel.WARN:
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case LogLevel.INFO:
        return <Info className="h-4 w-4 text-blue-500" />;
      case LogLevel.SUCCESS:
        return <Check className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          Recent System Logs
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleRefreshLogs}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh logs</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleClearLogs}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Clear logs</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-1 mb-2">
          <Button 
            variant={filter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(null)}
            className="text-xs h-6"
          >
            All
          </Button>
          <Button 
            variant={filter === LogLevel.ERROR ? "default" : "outline"}
            size="sm" 
            onClick={() => setFilter(LogLevel.ERROR)}
            className="text-xs h-6 text-destructive"
          >
            Errors
          </Button>
          <Button 
            variant={filter === LogLevel.WARN ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(LogLevel.WARN)}
            className="text-xs h-6 text-amber-500"
          >
            Warnings
          </Button>
          <Button 
            variant={filter === LogLevel.INFO ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(LogLevel.INFO)}
            className="text-xs h-6"
          >
            Info
          </Button>
        </div>

        <ScrollArea className="h-[300px]">
          <div className="space-y-1">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="text-xs border-b border-border py-2"
                >
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span className="font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span>[{log.category}]</span>
                    <span className="flex items-center">
                      {getLogIcon(log.level)}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="font-mono text-foreground">
                      {typeof log.message === 'string' ? log.message : renderUnknownAsNode(log.message)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No logs to display
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
