
import React, { useEffect, useRef, useState } from 'react';
import { LogCategory, LogEntry, LogLevel, memoryTransport } from '@/logging';
import { cn } from '@/lib/utils';

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
      // Use the new getFilteredLogs method with our filtering options
      const filteredLogs = memoryTransport.getFilteredLogs({
        level,
        category: categories?.length === 1 ? categories[0] : undefined,
        limit: maxEntries
      });
      
      // If we have multiple categories, filter further
      const finalLogs = categories && categories.length > 1
        ? filteredLogs.filter(log => categories.includes(log.category as LogCategory))
        : filteredLogs;
      
      setLogs(finalLogs);
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
  
  return (
    <div 
      ref={scrollRef}
      className={cn(
        "overflow-auto font-mono text-xs bg-[var(--impulse-bg-main)]/50",
        "border border-[var(--impulse-border-normal)] rounded-md",
        "electric-border",
        className
      )}
      style={{ height }}
    >
      {logs.length === 0 ? (
        <div className="flex items-center justify-center h-full text-[var(--impulse-text-secondary)] italic">
          No logs to display
        </div>
      ) : (
        <div className="p-1">
          {logs.map((log) => (
            <div 
              key={log.id}
              className={cn(
                "py-1 px-2 border-b border-[var(--impulse-border-normal)]/30",
                "hover:bg-[var(--impulse-bg-overlay)]",
                "transition-colors duration-150",
                getLogItemClass(log.level)
              )}
            >
              <div className="flex items-start">
                <span className="inline-block w-14 text-[var(--impulse-text-secondary)]">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                
                <span className={cn("inline-block w-20", getLogCategoryClass(log.category as LogCategory))}>
                  {log.category}
                </span>
                
                {showSource && log.source && (
                  <span className="inline-block w-24 truncate text-[var(--impulse-text-secondary)]">
                    {log.source}
                  </span>
                )}
                
                <span className="flex-1">{log.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper functions for styling
function getLogItemClass(level: LogLevel): string {
  switch (level) {
    case LogLevel.DEBUG:
      return 'text-gray-400';
    case LogLevel.INFO:
      return 'text-[var(--impulse-text-primary)]';
    case LogLevel.WARNING:
      return 'text-yellow-400';
    case LogLevel.ERROR:
      return 'text-[var(--impulse-secondary)]';
    case LogLevel.CRITICAL:
      return 'text-red-600 font-semibold animate-pulse';
    default:
      return '';
  }
}

function getLogCategoryClass(category: LogCategory): string {
  switch (category) {
    case LogCategory.SYSTEM:
      return 'text-[var(--impulse-primary)]';
    case LogCategory.NETWORK:
      return 'text-blue-400';
    case LogCategory.AUTH:
      return 'text-yellow-400';
    case LogCategory.UI:
      return 'text-green-400';
    case LogCategory.ADMIN:
      return 'text-[var(--impulse-secondary)]';
    case LogCategory.CHAT:
      return 'text-purple-400';
    case LogCategory.DATABASE:
      return 'text-orange-400';
    case LogCategory.PERFORMANCE:
      return 'text-cyan-400';
    case LogCategory.CONTENT:
      return 'text-pink-400';
    default:
      return 'text-gray-400';
  }
}
