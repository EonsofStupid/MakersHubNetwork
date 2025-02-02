import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity } from 'lucide-react';

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
}

interface RedisLogViewerProps {
  logs: LogEntry[];
}

export const RedisLogViewer = ({ logs }: RedisLogViewerProps) => {
  const getLogColor = (level: LogLevel) => {
    switch (level) {
      case 'error': return 'text-red-500';
      case 'warn': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
    }
  };

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Redis Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] rounded-md border border-white/10 p-4">
          {logs.map((log, index) => (
            <div key={index} className="mb-2 last:mb-0">
              <span className="text-sm text-muted-foreground">{log.timestamp}</span>
              <span className={`ml-2 text-sm ${getLogColor(log.level)}`}>
                [{log.level.toUpperCase()}]
              </span>
              <span className="ml-2 text-sm text-white/80">{log.message}</span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};