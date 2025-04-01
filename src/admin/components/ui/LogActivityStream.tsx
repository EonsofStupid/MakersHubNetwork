import React, { useEffect, useRef, useState } from 'react';
import { LogCategory, LogEntry, memoryTransport } from '@/logging';
import { LogLevel } from '@/logging/constants/log-level';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LOG_LEVEL_MAP } from '@/logging/utils/map-log-level';
import { isLogLevelAtLeast } from '@/logging/constants/log-level';
import { safelyRenderNode } from '@/shared/utils/react-utils';

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
  
  useEffect(() => {
    const updateLogs = () => {
      const allLogs = memoryTransport.getLogs();
      
      let filteredLogs = allLogs.filter(log => 
        isLogLevelAtLeast(log.level, level)
      );
      
      if (categories && categories.length > 0) {
        filteredLogs = filteredLogs.filter(log => 
          categories.includes(log.category as LogCategory)
        );
      }
      
      filteredLogs = filteredLogs.slice(-maxEntries);
      
      setLogs(filteredLogs);
    };
    
    updateLogs();
    
    const interval = setInterval(updateLogs, 2000);
    
    return () => {
      clearInterval(interval);
    };
  }, [level, categories, maxEntries]);
  
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);
  
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
  
  const getLevelName = (level: LogLevel): string => {
    return LOG_LEVEL_MAP[level] || "UNKNOWN";
  };
  
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
                  {getLevelName(log.level)}
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
                  {safelyRenderNode(log.message)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}
