
import React, { useEffect, useState } from 'react';
import { LogEntry, memoryTransport } from '@/logging';
import { LogLevel } from '@/logging/constants/log-level';
import { LogCategory } from '@/shared/types/shared.types';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export interface LogActivityStreamProps {
  level?: LogLevel;
  categories?: LogCategory[];
  maxEntries?: number;
  showSource?: boolean;
  height?: string; // Added height prop
}

export function LogActivityStream({
  level,
  categories,
  maxEntries = 100,
  showSource = false,
  height = '300px' // Default height
}: LogActivityStreamProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  useEffect(() => {
    // Get initial logs
    const updateLogs = () => {
      let filteredLogs = memoryTransport.getLogs();
      
      // Filter by level if specified
      if (level) {
        filteredLogs = filteredLogs.filter(log => log.level === level);
      }
      
      // Filter by categories if specified
      if (categories && categories.length > 0) {
        filteredLogs = filteredLogs.filter(log => {
          if (!log.category) return false;
          return categories.includes(log.category);
        });
      }
      
      // Limit the number of entries
      filteredLogs = filteredLogs.slice(0, maxEntries);
      
      setLogs(filteredLogs);
    };
    
    updateLogs();
    
    // Update every 2 seconds
    const interval = setInterval(updateLogs, 2000);
    
    return () => {
      clearInterval(interval);
    };
  }, [level, categories, maxEntries]);
  
  const getLevelColor = (logLevel: LogLevel): string => {
    switch (logLevel) {
      case LogLevel.DEBUG:
        return 'text-gray-500 dark:text-gray-400';
      case LogLevel.INFO:
        return 'text-blue-500 dark:text-blue-400';
      case LogLevel.WARN:
        return 'text-yellow-500 dark:text-yellow-300';
      case LogLevel.ERROR:
        return 'text-red-500 dark:text-red-400';
      case LogLevel.CRITICAL:
        return 'text-red-700 dark:text-red-300';
      case LogLevel.SUCCESS:
        return 'text-green-500 dark:text-green-400';
      case LogLevel.TRACE:
        return 'text-purple-500 dark:text-purple-400';
      case LogLevel.FATAL:
        return 'text-white bg-red-600 dark:bg-red-800 px-1 rounded';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };
  
  const getCategoryColor = (category: LogCategory | undefined): string => {
    if (!category) return 'text-gray-500';
    
    switch (category) {
      case LogCategory.SYSTEM:
        return 'text-violet-500 dark:text-violet-400';
      case LogCategory.AUTH:
        return 'text-blue-500 dark:text-blue-400';
      case LogCategory.ADMIN:
        return 'text-amber-500 dark:text-amber-400';
      case LogCategory.UI:
        return 'text-green-500 dark:text-green-400';
      case LogCategory.NETWORK:
        return 'text-cyan-500 dark:text-cyan-400';
      case LogCategory.STORE:
        return 'text-purple-500 dark:text-purple-400';
      case LogCategory.CHAT:
        return 'text-pink-500 dark:text-pink-400';
      case LogCategory.DEFAULT:
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };
  
  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return 'unknown time';
    }
  };
  
  return (
    <div 
      className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md overflow-auto"
      style={{ height }}
    >
      {logs.length > 0 ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {logs.map((log, index) => (
            <div 
              key={index} 
              className={cn(
                "p-2 text-sm font-mono",
                log.level === LogLevel.ERROR || log.level === LogLevel.CRITICAL || log.level === LogLevel.FATAL
                  ? "bg-red-50 dark:bg-red-900/20" 
                  : log.level === LogLevel.WARN
                    ? "bg-yellow-50 dark:bg-yellow-900/20"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
              )}
            >
              <div className="flex items-start gap-2">
                <span className={getLevelColor(log.level)}>
                  [{log.level.toUpperCase()}]
                </span>
                
                {showSource && (
                  <>
                    <span className={getCategoryColor(log.category)}>
                      {log.category || 'default'}
                    </span>
                    <span className="text-gray-500">
                      {log.source ? `[${log.source}]` : ''}
                    </span>
                  </>
                )}
                
                <span className="flex-1">{log.message}</span>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatTime(log.timestamp)}
                </span>
              </div>
              
              {log.details && Object.keys(log.details).length > 0 && (
                <div className="ml-4 mt-1 text-xs text-gray-600 dark:text-gray-400">
                  {JSON.stringify(log.details, null, 2)}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          No logs to display
        </div>
      )}
    </div>
  );
}
