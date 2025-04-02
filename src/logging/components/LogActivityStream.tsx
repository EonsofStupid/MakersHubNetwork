
import React, { useEffect, useState, useRef } from 'react';
import { LogCategory, LogEntry, LogLevel } from '../types';
import { memoryTransport } from '../transports/memory.transport';
import { safelyRenderNode } from '../utils/react';
import { LOG_LEVEL_NAMES, isLogLevelAtLeast } from '../constants/log-level';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LogActivityStreamProps {
  maxEntries?: number;
  autoScroll?: boolean;
  level?: LogLevel;
  categories?: LogCategory[];
  showSource?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function LogActivityStream({
  maxEntries = 50,
  autoScroll = true,
  level = LogLevel.INFO,
  categories,
  showSource = false,
  className,
  style
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
      
      filteredLogs = filteredLogs.slice(0, maxEntries);
      
      setLogs(filteredLogs);
    };
    
    updateLogs();
    
    const interval = setInterval(updateLogs, 1000);
    
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
      case LogLevel.SUCCESS:
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
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
      style={style}
    >
      {logs.length === 0 ? (
        <div className="flex items-center justify-center h-full text-[var(--impulse-text-secondary)] italic p-4">
          No logs to display
        </div>
      ) : (
        <div className="p-1">
          {logs.map((log) => {
            // Pre-render the message with type safety
            const messageContent = safelyRenderNode(log.message);
            
            return (
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
                    {LOG_LEVEL_NAMES[log.level]}
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
                    {messageContent}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ScrollArea>
  );
}
