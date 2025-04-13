
import React, { useState, useEffect } from 'react';
import { LogLevel, LogEntry } from '@/shared/types/shared.types';
import { memoryTransport } from '@/logging/transports/memory-transport';
import { Check, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface LogActivityStreamProps {
  maxEntries?: number;
  height?: string;
  showTimestamp?: boolean;
  showSource?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  filter?: {
    level?: LogLevel;
    category?: string;
    search?: string;
  }
}

export function LogActivityStream({
  maxEntries = 50,
  height = "300px",
  showTimestamp = true,
  showSource = false,
  autoRefresh = true,
  refreshInterval = 5000,
  filter
}: LogActivityStreamProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  useEffect(() => {
    // Initial load
    updateLogs();
    
    // Set up auto-refresh if enabled
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(updateLogs, refreshInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, filter]);
  
  const updateLogs = () => {
    // Get filtered logs
    let filteredLogs = filter 
      ? memoryTransport.getFilteredLogs(filter)
      : memoryTransport.getLogs();
    
    // Apply max entries limit
    filteredLogs = filteredLogs.slice(0, maxEntries);
    
    setLogs(filteredLogs);
  };
  
  // Function to get icon for log level
  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case LogLevel.INFO:
        return <Info className="h-4 w-4 text-blue-500" />;
      case LogLevel.WARN:
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case LogLevel.ERROR:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case LogLevel.CRITICAL:
        return <X className="h-4 w-4 text-red-700" />;
      case LogLevel.DEBUG:
      default:
        return <Check className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Function to format timestamp
  const formatTimestamp = (timestamp: number | string) => {
    const date = typeof timestamp === 'number' 
      ? new Date(timestamp)
      : new Date(timestamp);
    
    return date.toLocaleTimeString();
  };
  
  return (
    <div 
      className="bg-background border border-border/30 rounded-md overflow-auto" 
      style={{ height, maxHeight: height }}
    >
      {logs.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground p-4">
          No logs available
        </div>
      ) : (
        <div className="divide-y divide-border/20">
          {logs.map((log) => (
            <div 
              key={log.id} 
              className={`p-2 text-sm hover:bg-muted/30 transition-colors ${
                log.level === LogLevel.ERROR || log.level === LogLevel.CRITICAL
                  ? 'bg-red-500/5'
                  : log.level === LogLevel.WARN
                  ? 'bg-amber-500/5'
                  : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">
                  {getLevelIcon(log.level)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {showTimestamp && (
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    )}
                    
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                      {log.category}
                    </span>
                    
                    {showSource && log.source && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-secondary/10 text-secondary">
                        {log.source}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-1 break-words">
                    {log.message}
                  </div>
                  
                  {log.details && Object.keys(log.details).length > 0 && (
                    <details className="mt-1">
                      <summary className="text-xs text-muted-foreground cursor-pointer">Details</summary>
                      <pre className="mt-1 p-2 bg-muted/30 rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
