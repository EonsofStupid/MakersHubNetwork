
import React, { useEffect, useRef, useState } from 'react';
import { LogCategory, LogEntry, memoryTransport } from '@/logging';
import { LogLevel } from '@/logging/constants/log-level';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { renderUnknownAsNode } from '@/shared/utils/render';
import { isLogLevelAtLeast } from '@/logging/utils/map-log-level';

interface LogActivityStreamProps {
  maxEntries?: number;
  height?: string;
  autoScroll?: boolean;
  level?: LogLevel;
  categories?: LogCategory[];
  showSource?: boolean;
  className?: string;
}

export function LogActivityStream({
  maxEntries = 50,
  height = '300px',
  autoScroll = true,
  level = LogLevel.INFO,
  categories,
  showSource = false,
  className
}: LogActivityStreamProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Update logs from memory transport
  useEffect(() => {
    const updateLogs = () => {
      // Get all logs and filter them
      const allLogs = memoryTransport.getLogs();
      
      // Filter by level
      let filteredLogs = allLogs.filter(log => 
        isLogLevelAtLeast(log.level, level)
      );
      
      // Filter by categories if specified
      if (categories && categories.length > 0) {
        filteredLogs = filteredLogs.filter(log => 
          categories.includes(log.category as LogCategory)
        );
      }
      
      // Apply limit
      filteredLogs = filteredLogs.slice(0, maxEntries);
      
      setLogs(filteredLogs);
    };
    
    // Initial update
    updateLogs();
    
    // Set up interval to update logs
    const interval = setInterval(updateLogs, 2000);
    
    return () => {
      clearInterval(interval);
    };
  }, [level, categories, maxEntries]);
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);
  
  // Get color class for log level
  const getLevelColorClass = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'text-gray-400';
      case LogLevel.INFO:
        return 'text-blue-400';
      case LogLevel.WARN:
        return 'text-yellow-400';
      case LogLevel.ERROR:
        return 'text-red-400';
      case LogLevel.CRITICAL:
        return 'text-red-600 font-bold';
      default:
        return 'text-gray-400';
    }
  };
  
  // Get log item class based on level
  const getLogItemClass = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.WARN:
        return 'border-l-2 border-l-yellow-500';
      case LogLevel.ERROR:
        return 'border-l-2 border-l-red-500';
      case LogLevel.CRITICAL:
        return 'border-l-2 border-l-red-600 bg-red-950/20';
      default:
        return '';
    }
  };
  
  // Format timestamp
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  return (
    <ScrollArea
      ref={scrollRef as any}
      className={cn(
        "font-mono text-xs bg-[var(--impulse-bg-main)]/50",
        "border border-[var(--impulse-border-normal)] rounded-md",
        className
      )}
      style={{ height }}
    >
      {logs.length === 0 ? (
        <div className="flex items-center justify-center h-full text-[var(--impulse-text-secondary)] italic p-4">
          No logs to display
        </div>
      ) : (
        <div className="p-1">
          {logs.map((log) => (
            <div 
              key={log.id}
              className={cn(
                "py-1 px-2 border-b border-[var(--impulse-border-normal)]/30",
                "hover:bg-[var(--impulse-bg-overlay)]/50",
                "transition-colors duration-150",
                getLogItemClass(log.level)
              )}
            >
              <div className="flex items-start gap-2 overflow-hidden">
                <span className={cn("flex-shrink-0", getLevelColorClass(log.level))}>
                  {log.level}
                </span>
                
                <span className="flex-shrink-0 text-gray-400">
                  {formatTime(log.timestamp)}
                </span>
                
                <Badge variant="outline" className="flex-shrink-0 py-0 h-5">
                  {log.category}
                </Badge>
                
                {showSource && log.source && (
                  <Badge variant="secondary" className="flex-shrink-0 py-0 h-5">
                    {log.source}
                  </Badge>
                )}
                
                <span className="flex-grow truncate">
                  {renderUnknownAsNode(log.message)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}
