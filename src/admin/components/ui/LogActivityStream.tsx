
import React, { useEffect, useState } from 'react';
import { LogLevel } from '@/logging/types';
import { LogCategory, LogEntry } from '@/logging/types';
import { useLogger } from '@/hooks/use-logger';
import { getLogger } from '@/logging';
import { Card } from '@/components/ui/card';
import { memoryTransport } from '@/logging/config';

interface LogActivityStreamProps {
  height?: string;
  level?: LogLevel;
  categories?: LogCategory[];
  maxEntries?: number;
  showSource?: boolean;
  showTimestamp?: boolean;
  onLogClick?: (log: LogEntry) => void;
}

export function LogActivityStream({
  height = '300px',
  level = LogLevel.INFO,
  categories,
  maxEntries = 50,
  showSource = false,
  showTimestamp = true,
  onLogClick
}: LogActivityStreamProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logger = useLogger('LogActivityStream', LogCategory.ADMIN);
  
  useEffect(() => {
    // Initialize with current logs from memory transport
    try {
      const initialLogs = memoryTransport.getEntries({
        level,
        categories,
        limit: maxEntries
      });
      
      setLogs(initialLogs);
    } catch (error) {
      logger.error('Failed to get initial logs', { details: { error } });
    }
    
    // Set up interval to refresh logs
    const intervalId = setInterval(() => {
      try {
        const updatedLogs = memoryTransport.getEntries({
          level,
          categories,
          limit: maxEntries
        });
        
        setLogs(updatedLogs);
      } catch (error) {
        // Silently fail on interval
      }
    }, 2000);
    
    logger.debug('LogActivityStream initialized', {
      details: {
        level,
        categories
      }
    });
    
    return () => {
      clearInterval(intervalId);
    };
  }, [level, categories, maxEntries, logger]);
  
  if (logs.length === 0) {
    return (
      <Card className="flex items-center justify-center p-6 text-muted-foreground text-sm" style={{ height }}>
        No log entries match the current filters
      </Card>
    );
  }
  
  return (
    <div className="overflow-auto border rounded-md" style={{ height }}>
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-background border-b">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Level</th>
            <th className="px-4 py-2 text-left font-medium">Category</th>
            {showSource && <th className="px-4 py-2 text-left font-medium">Source</th>}
            {showTimestamp && <th className="px-4 py-2 text-left font-medium">Time</th>}
            <th className="px-4 py-2 text-left font-medium">Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr 
              key={log.id} 
              className="border-b hover:bg-muted/50 cursor-pointer"
              onClick={() => onLogClick?.(log)}
            >
              <td className="px-4 py-2">
                <LogLevelBadge level={log.level} />
              </td>
              <td className="px-4 py-2">{log.category}</td>
              {showSource && <td className="px-4 py-2">{log.source || '-'}</td>}
              {showTimestamp && (
                <td className="px-4 py-2 text-xs tabular-nums">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </td>
              )}
              <td className="px-4 py-2 max-w-[300px] truncate">
                {typeof log.message === 'string' ? log.message : '[Complex Message]'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LogLevelBadge({ level }: { level: LogLevel }) {
  const colors: Record<string, string> = {
    [LogLevel.DEBUG]: 'bg-gray-100 text-gray-800',
    [LogLevel.INFO]: 'bg-blue-100 text-blue-800',
    [LogLevel.SUCCESS]: 'bg-green-100 text-green-800',
    [LogLevel.WARN]: 'bg-yellow-100 text-yellow-800',
    [LogLevel.ERROR]: 'bg-red-100 text-red-800',
    [LogLevel.CRITICAL]: 'bg-red-200 text-red-900',
    [LogLevel.TRACE]: 'bg-gray-100 text-gray-700',
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level] || colors[LogLevel.INFO]}`}>
      {level}
    </span>
  );
}
