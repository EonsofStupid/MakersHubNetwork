
import React, { useEffect, useState } from 'react';
import { LogEntry, LogLevel, LogCategory } from '@/shared/types/shared.types';
import { format } from 'date-fns';
import { logger } from '@/logging';
import { Badge } from '@/shared/ui/badge';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { memoryTransport } from '@/logging/transports/memory-transport';

interface LogActivityStreamProps {
  maxEntries?: number;
  minLevel?: LogLevel;
  categories?: LogCategory[];
  title?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  showTimestamp?: boolean;
  showLevel?: boolean;
  showCategory?: boolean;
  onEntryClick?: (entry: LogEntry) => void;
  className?: string;
}

const LOG_LEVEL_COLORS = {
  debug: 'bg-gray-500',
  info: 'bg-blue-500',
  warn: 'bg-yellow-500',
  error: 'bg-red-500'
};

const LOG_CATEGORY_COLORS = {
  [LogCategory.AUTH]: 'bg-purple-500',
  [LogCategory.API]: 'bg-emerald-500',
  [LogCategory.SYSTEM]: 'bg-gray-700',
  [LogCategory.STORE]: 'bg-indigo-500',
  [LogCategory.UI]: 'bg-pink-500',
  [LogCategory.THEME]: 'bg-amber-500',
  [LogCategory.NETWORK]: 'bg-cyan-500',
  [LogCategory.DEFAULT]: 'bg-slate-500',
};

export const LogActivityStream: React.FC<LogActivityStreamProps> = ({
  maxEntries = 100,
  minLevel = 'debug',
  categories,
  title = 'Activity Log',
  autoRefresh = true,
  refreshInterval = 2000,
  showTimestamp = true,
  showLevel = true,
  showCategory = true,
  onEntryClick,
  className = ''
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Initial load and refresh logs
  useEffect(() => {
    const loadLogs = async () => {
      try {
        // Get logs from memory transport
        const entries = await memoryTransport.query({
          level: minLevel,
          category: categories && categories.length === 1 ? categories[0] : undefined,
        });
        
        // Filter by categories if multiple
        let filteredEntries = entries;
        if (categories && categories.length > 1) {
          filteredEntries = entries.filter(entry => 
            categories.includes(entry.category as LogCategory)
          );
        }
        
        // Limit entries
        setLogs(filteredEntries.slice(0, maxEntries));
      } catch (error) {
        console.error('Error loading logs:', error);
      }
    };

    // Load logs immediately
    loadLogs();

    // Set up auto-refresh
    let intervalId: number | undefined;
    if (autoRefresh) {
      intervalId = window.setInterval(loadLogs, refreshInterval);
    }

    // Clean up
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [maxEntries, minLevel, categories, autoRefresh, refreshInterval]);

  // Format timestamp
  const formatTime = (timestamp: number) => {
    try {
      return format(new Date(timestamp), 'HH:mm:ss');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className={`border rounded-md overflow-hidden ${className}`}>
      <div className="bg-muted px-4 py-2 font-medium border-b">
        {title}
      </div>
      
      <ScrollArea className="h-[300px]">
        {logs.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No log entries to display.
          </div>
        ) : (
          <ul className="divide-y">
            {logs.map((entry) => (
              <li 
                key={entry.id} 
                className="px-4 py-2 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onEntryClick && onEntryClick(entry)}
              >
                <div className="flex items-center gap-2">
                  {showLevel && (
                    <Badge 
                      variant="outline" 
                      className={`${LOG_LEVEL_COLORS[entry.level]} text-white text-xs`}
                    >
                      {entry.level}
                    </Badge>
                  )}
                  
                  {showCategory && (
                    <Badge 
                      variant="outline" 
                      className={`${LOG_CATEGORY_COLORS[entry.category] || 'bg-gray-500'} text-white text-xs`}
                    >
                      {entry.category}
                    </Badge>
                  )}
                  
                  {showTimestamp && (
                    <span className="text-xs text-muted-foreground">
                      {formatTime(entry.timestamp)}
                    </span>
                  )}
                </div>
                
                <div className="mt-1 text-sm">{entry.message}</div>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
};
