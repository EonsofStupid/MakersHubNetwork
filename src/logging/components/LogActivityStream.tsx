import React, { useEffect, useState, useRef } from 'react';
import { LogCategory, LogEntry, LogLevel } from '../types';
import { memoryTransport } from '../transports/memory.transport';
import { safelyRenderNode } from '../utils/react';
import { getLogLevelColorClass, getLogItemClass, getLogLevelName, isLogLevelAtLeast } from '../constants/log-level';
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
      
      filteredLogs = filteredLogs.slice(-maxEntries);
      
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
                  <span className={cn("flex-shrink-0", getLogLevelColorClass(log.level))}>
                    {getLogLevelName(log.level)}
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
                
                {log.details && Object.keys(log.details).length > 0 && (
                  <details className="mt-1 ml-4">
                    <summary className="cursor-pointer text-[10px] text-[var(--impulse-text-secondary)]">
                      Details
                    </summary>
                    <pre className="text-[10px] mt-1 p-1 bg-[var(--impulse-bg-overlay)]/20 rounded overflow-x-auto">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      )}
    </ScrollArea>
  );
}
