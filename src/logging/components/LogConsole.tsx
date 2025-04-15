
import React, { useState, useEffect, useRef } from 'react';
import { LogLevel, LogCategory, LogEntry, LogCategoryType } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

interface LogConsoleProps {
  initialRows?: number;
  showTimestamp?: boolean;
  showLevel?: boolean;
  showCategory?: boolean;
  minLevel?: LogLevel;
  categories?: LogCategoryType[];
  maxLogs?: number;
  autoScrollToBottom?: boolean;
  width?: string;
  height?: string;
}

export const LogConsole: React.FC<LogConsoleProps> = ({
  initialRows = 10,
  showTimestamp = true,
  showLevel = true,
  showCategory = true,
  minLevel = LogLevel.INFO,
  categories,
  maxLogs = 100,
  autoScrollToBottom = true,
  width = '100%',
  height = 'auto'
}) => {
  // State for logs and filters
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LogLevel>(minLevel);
  const [selectedCategory, setSelectedCategory] = useState<LogCategoryType | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  
  // Refs for DOM elements
  const consoleRef = useRef<HTMLDivElement>(null);
  const isScrolledToBottom = useRef(true);
  
  // Effect to setup log listener
  useEffect(() => {
    // Subscribe to log events
    const unsubscribe = logger.subscribe((entry) => {
      setLogs(currentLogs => {
        const newLogs = [...currentLogs, entry];
        // Limit the number of logs to avoid memory issues
        return newLogs.slice(-maxLogs);
      });
    });
    
    // Cleanup subscription on unmount
    return unsubscribe;
  }, [maxLogs]);
  
  // Effect for auto-scrolling
  useEffect(() => {
    if (autoScrollToBottom && isScrolledToBottom.current && consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs, autoScrollToBottom]);
  
  // Handle scroll events
  const handleScroll = () => {
    if (consoleRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = consoleRef.current;
      isScrolledToBottom.current = scrollHeight - scrollTop <= clientHeight + 50;
    }
  };
  
  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  };
  
  // Filter logs based on level, category, and search
  const filteredLogs = logs.filter(log => {
    // Filter by level
    if (log.level < selectedLevel) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory !== 'ALL' && log.category !== selectedCategory) {
      return false;
    }
    
    // Filter by search
    if (search && !log.message.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Get color for log level
  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'text-gray-500';
      case LogLevel.INFO:
        return 'text-blue-500';
      case LogLevel.WARN:
        return 'text-yellow-500';
      case LogLevel.ERROR:
        return 'text-red-500';
      case LogLevel.CRITICAL:
        return 'text-red-600 font-bold';
      default:
        return 'text-gray-700';
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };
  
  // Format log level
  const formatLevel = (level: LogLevel) => {
    return LogLevel[level] || 'UNKNOWN';
  };
  
  return (
    <div className="border rounded-lg bg-gray-50 dark:bg-gray-900" style={{ width, height }}>
      {/* Log controls */}
      <div className="p-2 border-b flex flex-col sm:flex-row gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          <select 
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(Number(e.target.value) as LogLevel)}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value={LogLevel.DEBUG}>Debug+</option>
            <option value={LogLevel.INFO}>Info+</option>
            <option value={LogLevel.WARN}>Warning+</option>
            <option value={LogLevel.ERROR}>Error+</option>
            <option value={LogLevel.CRITICAL}>Critical+</option>
          </select>
          
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as LogCategoryType | 'ALL')}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value="ALL">All Categories</option>
            {Object.keys(LogCategory).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          <input 
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2 py-1 border rounded text-sm flex-grow"
          />
        </div>
        
        <button
          onClick={clearLogs}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
        >
          Clear
        </button>
      </div>
      
      {/* Log output */}
      <div
        ref={consoleRef}
        className="p-2 font-mono text-sm overflow-y-auto"
        style={{ minHeight: `${initialRows * 1.5}rem`, maxHeight: '50vh' }}
        onScroll={handleScroll}
      >
        {filteredLogs.length === 0 ? (
          <div className="text-gray-400 p-4 text-center">No logs to display</div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="pb-1 border-b last:border-0">
              <div className="flex flex-wrap">
                {showTimestamp && (
                  <span className="text-gray-500 mr-2">
                    {formatTimestamp(log.timestamp)}
                  </span>
                )}
                
                {showLevel && (
                  <span className={`mr-2 ${getLevelColor(log.level)}`}>
                    [{formatLevel(log.level)}]
                  </span>
                )}
                
                {showCategory && (
                  <span className="text-purple-500 mr-2">
                    [{log.category}]
                  </span>
                )}
                
                <span>{log.message}</span>
              </div>
              
              {log.details && Object.keys(log.details).length > 0 && (
                <div className="pl-4 text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
