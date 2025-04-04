
import React, { useEffect, useState } from 'react';
import { LogEntry, LogLevel } from '../types';
import { memoryTransport } from '../transports/memory.transport';
import { formatDistanceToNow } from 'date-fns';

interface LogActivityStreamProps {
  limit?: number;
  filter?: (entry: LogEntry) => boolean;
  className?: string;
  showHeader?: boolean;
  showTimestamp?: boolean;
  showCategory?: boolean;
  minLevel?: LogLevel;
}

export const LogActivityStream: React.FC<LogActivityStreamProps> = ({
  limit = 10,
  filter,
  className = '',
  showHeader = true,
  showTimestamp = true,
  showCategory = true,
  minLevel = LogLevel.INFO
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    // Get initial logs
    if (memoryTransport?.getLogs) {
      const initialLogs = memoryTransport.getLogs(limit, (entry) => {
        // Apply minimum level filter
        if (entry.level < minLevel) return false;
        
        // Apply custom filter if provided
        if (filter && !filter(entry)) return false;
        
        return true;
      });
      
      setLogs(initialLogs || []);
    }
    
    // Subscribe to new logs
    const handleNewLog = (entry: LogEntry) => {
      if (entry.level >= minLevel && (!filter || filter(entry))) {
        setLogs((current) => {
          const updated = [entry, ...current].slice(0, limit);
          return updated;
        });
      }
    };
    
    const unsubscribe = memoryTransport?.subscribe ? 
      memoryTransport.subscribe(handleNewLog) : 
      () => {};
    
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [limit, filter, minLevel]);

  if (logs.length === 0) {
    return (
      <div className={`text-center text-gray-500 p-4 ${className}`}>
        No log activity to show
      </div>
    );
  }

  const getLevelClass = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return 'text-red-500';
      case LogLevel.WARN:
        return 'text-amber-500';
      case LogLevel.INFO:
        return 'text-blue-500';
      case LogLevel.SUCCESS:
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className={`overflow-hidden rounded-lg ${className}`}>
      {showHeader && (
        <div className="bg-muted px-4 py-3 border-b border-border">
          <h3 className="text-sm font-medium">Recent Activity</h3>
        </div>
      )}
      <ul className="divide-y divide-border">
        {logs.map((log) => {
          const timestamp = typeof log.timestamp === 'string' 
            ? new Date(log.timestamp) 
            : log.timestamp;
          
          const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });
          
          return (
            <li key={log.id} className="px-4 py-2 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <span className={`text-sm font-medium ${getLevelClass(log.level)}`}>
                  {log.message}
                </span>
                {showTimestamp && (
                  <span className="text-xs text-muted-foreground ml-2">
                    {timeAgo}
                  </span>
                )}
              </div>
              {showCategory && log.category && (
                <div className="mt-1">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                    {log.category}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
