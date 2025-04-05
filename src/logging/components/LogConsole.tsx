import React, { useState, useEffect, useRef } from 'react';
import { LogEntry, LogLevel, LogCategory } from '../types';
import { useLoggingContext } from '../context/LoggingContext';
import { LOG_LEVEL_NAMES, isLogLevelAtLeast, getLogLevelColorClass } from '../constants/logLevel';
import { safelyRenderNode } from '../utils/react';
import { X, Minimize2, Maximize2, Download, Trash } from 'lucide-react';

interface LogConsoleProps {
  minLevel?: LogLevel;
  height?: string;
  width?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showSource?: boolean;
  autoScroll?: boolean;
  categories?: LogCategory[];
  hideIfEmpty?: boolean;
  maxHeight?: string;
}

export function LogConsole({
  minLevel = LogLevel.INFO,
  height = '400px',
  width = '100%',
  position = 'bottom-right',
  showSource = true,
  autoScroll = true,
  categories,
  hideIfEmpty = false,
  maxHeight
}: LogConsoleProps) {
  const { logs, clearLogs, showLogConsole, setShowLogConsole } = useLoggingContext();
  const [filter, setFilter] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<LogLevel>(minLevel);
  const [selectedCategory, setSelectedCategory] = useState<LogCategory | 'all'>('all');
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (autoScroll && scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll, isMinimized]);

  const filteredLogs = logs
    .filter(log => isLogLevelAtLeast(log.level, selectedLevel))
    .filter(log => selectedCategory === 'all' || log.category === selectedCategory)
    .filter(log => {
      if (!filter) return true;
      const message = typeof log.message === 'string' ? log.message : JSON.stringify(log.message);
      return message.toLowerCase().includes(filter.toLowerCase()) ||
        (log.source && log.source.toLowerCase().includes(filter.toLowerCase()));
    });
  
  if (hideIfEmpty && filteredLogs.length === 0 && !showLogConsole) {
    return null;
  }
  
  if (!showLogConsole) {
    return null;
  }
  
  const positionClass = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  }[position];
  
  const uniqueCategories = Array.from(
    new Set(logs.map(log => log.category))
  ).sort() as LogCategory[];
  
  const downloadLogs = () => {
    const json = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div
      className={`fixed ${positionClass} z-50 bg-background border border-border rounded-lg shadow-lg overflow-hidden transition-all duration-300`}
      style={{
        width: isMinimized ? '300px' : width,
        height: isMinimized ? '40px' : height,
        maxHeight: maxHeight || '80vh',
        maxWidth: '100vw'
      }}
    >
      <div className="flex items-center justify-between p-2 bg-muted/50 border-b">
        <div className="text-sm font-medium flex items-center gap-2">
          {isMinimized ? 'Logs' : `Logs (${filteredLogs.length})`}
        </div>
        <div className="flex items-center gap-1">
          {!isMinimized && (
            <>
              <button 
                onClick={downloadLogs}
                className="p-1 rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Download logs"
              >
                <Download size={14} />
              </button>
              <button 
                onClick={clearLogs}
                className="p-1 rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Clear logs"
              >
                <Trash size={14} />
              </button>
            </>
          )}
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button 
            onClick={() => setShowLogConsole(false)}
            className="p-1 rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          <div className="flex items-center p-2 border-b gap-2 flex-wrap">
            <input
              type="text"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Filter logs..."
              className="flex-1 min-w-[100px] px-2 py-1 text-xs rounded border"
            />
            
            <select 
              value={selectedLevel} 
              onChange={e => setSelectedLevel(Number(e.target.value) as LogLevel)}
              className="px-2 py-1 text-xs rounded border bg-background"
            >
              {Object.entries(LOG_LEVEL_NAMES).map(([level, name]) => (
                <option key={level} value={level}>
                  {name}
                </option>
              ))}
            </select>
            
            <select 
              value={selectedCategory} 
              onChange={e => setSelectedCategory(e.target.value as LogCategory | 'all')}
              className="px-2 py-1 text-xs rounded border bg-background"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div 
            ref={scrollRef}
            className="overflow-auto h-full font-mono text-xs p-0"
          >
            {filteredLogs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground italic p-4">
                No logs to display
              </div>
            ) : (
              <table className="w-full">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b">
                    <th className="px-2 py-1 text-left font-medium text-xs text-muted-foreground">Time</th>
                    <th className="px-2 py-1 text-left font-medium text-xs text-muted-foreground">Level</th>
                    <th className="px-2 py-1 text-left font-medium text-xs text-muted-foreground">Category</th>
                    {showSource && (
                      <th className="px-2 py-1 text-left font-medium text-xs text-muted-foreground">Source</th>
                    )}
                    <th className="px-2 py-1 text-left font-medium text-xs text-muted-foreground">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => {
                    const messageContent = renderMessage(log.message);
                    
                    return (
                      <tr 
                        key={log.id}
                        className="border-b hover:bg-muted/20"
                      >
                        <td className="px-2 py-1 whitespace-nowrap text-xs text-muted-foreground">
                          {new Date(log.timestamp instanceof Date ? log.timestamp : log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap text-xs">
                          <span className={getLogLevelColorClass(log.level)}>
                            {LOG_LEVEL_NAMES[log.level]}
                          </span>
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap text-xs">
                          {log.category}
                        </td>
                        {showSource && (
                          <td className="px-2 py-1 whitespace-nowrap text-xs text-muted-foreground">
                            {log.source || '-'}
                          </td>
                        )}
                        <td className="px-2 py-1 text-xs overflow-hidden text-ellipsis">
                          <div className="truncate max-w-[500px]">
                            {messageContent}
                          </div>
                          {log.details && (
                            <details className="mt-1">
                              <summary className="cursor-pointer text-xs text-muted-foreground">Details</summary>
                              <pre className="text-xs bg-muted/20 p-2 rounded mt-1 overflow-auto max-h-[200px]">
                                {formatErrorDetails(log.details)}
                              </pre>
                            </details>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function renderMessage(message: any): React.ReactNode {
  if (message === null || message === undefined) {
    return '';
  }
  
  if (typeof message === 'string' || typeof message === 'number' || typeof message === 'boolean') {
    return String(message);
  }
  
  if (React.isValidElement(message)) {
    return message;
  }
  
  if (typeof message === 'object' && message !== null && 'message' in message && typeof message.message === 'string') {
    return message.message;
  }
  
  if (Array.isArray(message)) {
    try {
      return JSON.stringify(message);
    } catch {
      return '[Array]';
    }
  }
  
  try {
    return typeof message === 'object' ? JSON.stringify(message) : String(message);
  } catch {
    return '[Complex Object]';
  }
}

const formatErrorDetails = (details: any): string => {
  if (!details) return '';
  
  if (details.message && details.name && typeof details === 'object') {
    return `${details.name}: ${details.message}${details.stack ? '\n' + details.stack : ''}`;
  } else if (typeof details === 'object') {
    try {
      return JSON.stringify(details, null, 2);
    } catch (e) {
      return String(details);
    }
  }
  
  return String(details);
};
