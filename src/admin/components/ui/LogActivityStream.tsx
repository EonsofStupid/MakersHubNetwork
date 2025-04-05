import React, { useEffect, useState } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory, LogLevel, memoryTransport } from '@/logging';
import type { LogEntry } from '@/logging/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { renderUnknownAsNode } from '@/shared/utils/render';
import { Check, Info, AlertCircle, AlertTriangle } from 'lucide-react';

interface LogActivityStreamProps {
  maxItems?: number;
  showHeader?: boolean;
  showTimestamp?: boolean;
  category?: LogCategory;
  level?: LogLevel;
  categories?: LogCategory[];
  height?: string;
  autoScroll?: boolean;
  className?: string;
  showSource?: boolean;
}

export function LogActivityStream({
  maxItems = 20,
  showHeader = true,
  showTimestamp = true,
  category,
  level,
  categories,
  height = '300px',
  autoScroll = true,
  showSource = false,
  className = '',
}: LogActivityStreamProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logger = useLogger('LogActivityStream', LogCategory.ADMIN);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  // Load logs when component mounts
  useEffect(() => {
    // Get initial logs
    let initialLogs = memoryTransport.getLogs();
    
    // Filter by category or categories if provided
    if (category) {
      initialLogs = initialLogs.filter(log => log.category === category);
    } else if (categories && categories.length > 0) {
      initialLogs = initialLogs.filter(log => categories.includes(log.category));
    }
    
    // Filter by level if provided
    if (level) {
      initialLogs = initialLogs.filter(log => log.level === level || log.level === LogLevel.ERROR);
    }
    
    setLogs(initialLogs.slice(0, maxItems));
    
    // Subscribe to new logs
    const unsubscribe = memoryTransport.subscribe((entry) => {
      let shouldAdd = true;
      
      // Filter by category
      if (category && entry.category !== category) {
        shouldAdd = false;
      } else if (categories && categories.length > 0 && !categories.includes(entry.category)) {
        shouldAdd = false;
      }
      
      // Filter by level
      if (level && entry.level !== level && entry.level !== LogLevel.ERROR) {
        shouldAdd = false;
      }
      
      if (shouldAdd) {
        setLogs(prevLogs => [entry, ...prevLogs].slice(0, maxItems));
        
        // Auto-scroll to newest log
        if (autoScroll && scrollAreaRef.current) {
          setTimeout(() => {
            if (scrollAreaRef.current) {
              scrollAreaRef.current.scrollTop = 0;
            }
          }, 10);
        }
      }
    });
    
    logger.debug('Log activity stream mounted');
    
    return () => {
      unsubscribe();
      logger.debug('Log activity stream unmounted');
    };
  }, [category, categories, level, maxItems, logger, autoScroll]);
  
  // Get icon for log level
  const getLogIcon = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return <AlertCircle className="h-3 w-3 flex-shrink-0 text-destructive" />;
      case LogLevel.WARN:
        return <AlertTriangle className="h-3 w-3 flex-shrink-0 text-amber-500" />;
      case LogLevel.INFO:
        return <Info className="h-3 w-3 flex-shrink-0 text-blue-500" />;
      case LogLevel.SUCCESS:
        return <Check className="h-3 w-3 flex-shrink-0 text-green-500" />;
      default:
        return <Info className="h-3 w-3 flex-shrink-0 text-muted-foreground" />;
    }
  };

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">
            Activity Stream {category && `(${category})`}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={`p-0 ${!showHeader ? 'pt-0' : ''}`}>
        <ScrollArea 
          className={`bg-background/50 rounded-md`}
          style={{ height }}
          ref={scrollAreaRef}
        >
          <div className="space-y-0.5 p-2">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="text-[10px] border-b border-border/30 last:border-0 py-1"
                >
                  <div className="flex items-center gap-1 text-muted-foreground">
                    {showTimestamp && (
                      <span className="font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    )}
                    {getLogIcon(log.level)}
                    <span className="font-mono text-foreground line-clamp-2">
                      {typeof log.message === 'string' ? log.message : renderUnknownAsNode(log.message)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground text-xs">
                No activity to display
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
