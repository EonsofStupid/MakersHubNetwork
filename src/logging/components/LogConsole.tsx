
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { LogEntry, LogLevel } from '../types';
import { memoryTransport } from '../transports/memory-transport';
import { Button } from '@/components/ui/button';
import { renderUnknownAsNode } from '@/shared/rendering';

export const LogConsole: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<LogLevel | null>(null);

  useEffect(() => {
    return memoryTransport.subscribe((entries) => {
      setLogs(entries);
    });
  }, []);

  const filteredLogs = filter
    ? logs.filter((log) => log.level === filter)
    : logs;

  const clearLogs = () => {
    memoryTransport.clear();
  };

  return (
    <Card className="p-4 max-h-96 overflow-auto">
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold">Logs</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setFilter(null)}>
            All
          </Button>
          <Button size="sm" variant="outline" onClick={() => setFilter(LogLevel.INFO)}>
            Info
          </Button>
          <Button size="sm" variant="outline" onClick={() => setFilter(LogLevel.ERROR)}>
            Errors
          </Button>
          <Button size="sm" variant="destructive" onClick={clearLogs}>
            Clear
          </Button>
        </div>
      </div>
      <div className="space-y-1">
        {filteredLogs.length === 0 ? (
          <p className="text-muted-foreground text-sm">No logs to display</p>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`text-xs p-1 border-l-2 ${
                log.level === LogLevel.ERROR
                  ? 'border-destructive bg-destructive/10'
                  : log.level === LogLevel.WARN
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : log.level === LogLevel.SUCCESS
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-muted-foreground bg-muted/40'
              }`}
            >
              <div className="flex gap-2 items-start">
                <span className="text-muted-foreground">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="font-medium">
                  {renderUnknownAsNode(log.message)}
                </span>
              </div>
              {log.details && (
                <pre className="text-xs mt-1 text-muted-foreground overflow-auto max-h-20">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
