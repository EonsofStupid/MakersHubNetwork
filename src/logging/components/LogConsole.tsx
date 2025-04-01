
import React, { useEffect, useState } from 'react';
import { Resizable } from 're-resizable';
import { X, Filter, Search, ChevronUp, ChevronDown, Download } from 'lucide-react';
import { LogCategory, LogEntry, LogLevel, memoryTransport } from '..';
import { cn } from '@/lib/utils';
import { useLoggingContext } from '../context/LoggingContext';

interface LogConsoleProps {
  defaultHeight?: number;
  defaultWidth?: number;
  position?: 'bottom' | 'right';
}

export const LogConsole: React.FC<LogConsoleProps> = ({
  defaultHeight = 300,
  defaultWidth = 800,
  position = 'bottom'
}) => {
  const { setShowLogConsole, minLogLevel, setMinLogLevel, enabledCategories, setEnabledCategories } = useLoggingContext();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  
  // Update logs from memory transport
  useEffect(() => {
    const updateLogs = () => {
      const allLogs = memoryTransport.getFilteredLogs({
        level: minLogLevel,
        category: enabledCategories.length === Object.values(LogCategory).length 
          ? undefined 
          : enabledCategories.length === 1 
            ? enabledCategories[0] 
            : undefined,
        search: searchTerm || undefined
      });
      
      setLogs(allLogs);
    };
    
    updateLogs();
    
    // Set up interval to update logs
    const interval = setInterval(updateLogs, 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, [minLogLevel, enabledCategories, searchTerm]);
  
  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll) {
      const container = document.getElementById('log-entries-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [logs, autoScroll]);
  
  // Handle level filter changes
  const handleLevelChange = (level: LogLevel) => {
    setMinLogLevel(level);
  };
  
  // Handle category filter changes
  const handleCategoryToggle = (category: LogCategory) => {
    if (enabledCategories.includes(category)) {
      setEnabledCategories(enabledCategories.filter(c => c !== category));
    } else {
      setEnabledCategories([...enabledCategories, category]);
    }
  };
  
  // Handle select all categories
  const handleSelectAllCategories = () => {
    setEnabledCategories(Object.values(LogCategory));
  };
  
  // Handle clear all categories
  const handleClearAllCategories = () => {
    setEnabledCategories([]);
  };
  
  // Export logs to JSON file
  const handleExportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `logs-${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  // Clear all logs
  const handleClearLogs = () => {
    memoryTransport.clear();
    setLogs([]);
    setSelectedLog(null);
  };
  
  return (
    <Resizable
      defaultSize={{
        width: position === 'bottom' ? '100%' : defaultWidth,
        height: position === 'bottom' ? defaultHeight : '100%',
      }}
      minHeight={200}
      minWidth={position === 'bottom' ? '100%' : 400}
      maxHeight={position === 'bottom' ? window.innerHeight * 0.8 : '100%'}
      maxWidth={position === 'bottom' ? '100%' : window.innerWidth * 0.8}
      enable={{
        top: position === 'bottom',
        right: position === 'right',
        bottom: false,
        left: false,
      }}
      className={cn(
        "fixed z-50 bg-[var(--impulse-bg-card)] border border-[var(--impulse-border-normal)] rounded-t-lg shadow-lg overflow-hidden",
        "backdrop-blur-md text-[var(--impulse-text-primary)]",
        position === 'bottom' ? "bottom-0 left-0 right-0" : "bottom-0 right-0 top-0",
        "electric-border"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-[var(--impulse-border-normal)] bg-[var(--impulse-bg-overlay)]">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-[var(--impulse-primary)] text-sm font-bold">
            LogConsole
          </span>
          <span className="text-xs text-[var(--impulse-text-secondary)]">
            {logs.length} entries
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveFilters(!activeFilters)}
            className={cn(
              "p-1 rounded-md hover:bg-[var(--impulse-primary)]/10",
              activeFilters && "text-[var(--impulse-primary)] bg-[var(--impulse-primary)]/10"
            )}
            title="Filters"
          >
            <Filter size={16} />
          </button>
          
          <button
            onClick={handleExportLogs}
            className="p-1 rounded-md hover:bg-[var(--impulse-primary)]/10"
            title="Export logs"
          >
            <Download size={16} />
          </button>
          
          <button
            onClick={handleClearLogs}
            className="p-1 rounded-md hover:bg-[var(--impulse-primary)]/10"
            title="Clear logs"
          >
            <X size={16} />
          </button>
          
          <button
            onClick={() => setShowLogConsole(false)}
            className="p-1 rounded-md hover:bg-[var(--impulse-primary)]/10"
            title="Close console"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {/* Filters section */}
      {activeFilters && (
        <div className="p-2 border-b border-[var(--impulse-border-normal)] bg-[var(--impulse-bg-overlay)]">
          <div className="flex flex-col space-y-2">
            {/* Search */}
            <div className="flex items-center space-x-2">
              <Search size={14} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search logs..."
                className="w-full bg-[var(--impulse-bg-main)] border border-[var(--impulse-border-normal)] rounded-md px-2 py-1 text-sm focus:outline-none focus:border-[var(--impulse-primary)]"
              />
            </div>
            
            {/* Log levels */}
            <div>
              <div className="text-xs font-bold mb-1">Log Level</div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(LogLevel)
                  .filter(([key]) => isNaN(Number(key)))
                  .map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleLevelChange(value as LogLevel)}
                      className={cn(
                        "px-2 py-1 text-xs rounded-md",
                        "border border-[var(--impulse-border-normal)]",
                        value === minLogLevel && "bg-[var(--impulse-primary)]/20 border-[var(--impulse-primary)]"
                      )}
                    >
                      {key}
                    </button>
                  ))}
              </div>
            </div>
            
            {/* Categories */}
            <div>
              <div className="flex justify-between items-center">
                <div className="text-xs font-bold mb-1">Categories</div>
                <div className="flex space-x-1">
                  <button
                    onClick={handleSelectAllCategories}
                    className="text-xs text-[var(--impulse-primary)] hover:underline"
                  >
                    All
                  </button>
                  <span className="text-xs">|</span>
                  <button
                    onClick={handleClearAllCategories}
                    className="text-xs text-[var(--impulse-primary)] hover:underline"
                  >
                    None
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {Object.values(LogCategory).map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={cn(
                      "px-2 py-1 text-xs rounded-md",
                      "border border-[var(--impulse-border-normal)]",
                      enabledCategories.includes(category) 
                        ? "bg-[var(--impulse-primary)]/20 border-[var(--impulse-primary)]" 
                        : "opacity-50"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content area */}
      <div className="flex h-[calc(100%-40px)]">
        {/* Log entries list */}
        <div className="flex-1 overflow-auto" id="log-entries-container">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[var(--impulse-text-secondary)]">
              No logs to display
            </div>
          ) : (
            <div className="font-mono text-xs">
              {logs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={cn(
                    "p-1 border-b border-[var(--impulse-border-normal)] cursor-pointer hover:bg-[var(--impulse-bg-overlay)]",
                    selectedLog?.id === log.id && "bg-[var(--impulse-bg-overlay)]",
                    getLogItemClass(log.level)
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-16 text-[var(--impulse-text-secondary)]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={cn("w-16", getLogLevelClass(log.level))}>
                      {LogLevel[log.level]}
                    </span>
                    <span className="w-20 text-[var(--impulse-text-secondary)]">
                      {log.category}
                    </span>
                    <span className="flex-1 truncate">{log.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Details panel */}
        {selectedLog && (
          <div className="w-1/2 border-l border-[var(--impulse-border-normal)] overflow-auto p-2">
            <div className="mb-2 font-bold text-[var(--impulse-primary)]">
              {selectedLog.message}
            </div>
            
            <div className="grid grid-cols-2 gap-1 mb-4">
              <div className="text-xs text-[var(--impulse-text-secondary)]">Timestamp</div>
              <div className="text-xs">
                {new Date(selectedLog.timestamp).toISOString()}
              </div>
              
              <div className="text-xs text-[var(--impulse-text-secondary)]">Level</div>
              <div className="text-xs">
                {LogLevel[selectedLog.level]}
              </div>
              
              <div className="text-xs text-[var(--impulse-text-secondary)]">Category</div>
              <div className="text-xs">{selectedLog.category}</div>
              
              {selectedLog.source && (
                <>
                  <div className="text-xs text-[var(--impulse-text-secondary)]">Source</div>
                  <div className="text-xs">{selectedLog.source}</div>
                </>
              )}
              
              {selectedLog.userId && (
                <>
                  <div className="text-xs text-[var(--impulse-text-secondary)]">User ID</div>
                  <div className="text-xs">{selectedLog.userId}</div>
                </>
              )}
              
              {selectedLog.duration !== undefined && (
                <>
                  <div className="text-xs text-[var(--impulse-text-secondary)]">Duration</div>
                  <div className="text-xs">{selectedLog.duration.toFixed(2)}ms</div>
                </>
              )}
              
              {selectedLog.tags && selectedLog.tags.length > 0 && (
                <>
                  <div className="text-xs text-[var(--impulse-text-secondary)]">Tags</div>
                  <div className="text-xs">{selectedLog.tags.join(', ')}</div>
                </>
              )}
            </div>
            
            {selectedLog.details && (
              <>
                <div className="text-xs font-bold text-[var(--impulse-text-secondary)] mb-1">
                  Details
                </div>
                <pre className="text-xs bg-[var(--impulse-bg-main)] p-2 rounded-md overflow-auto max-h-60">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-1 border-t border-[var(--impulse-border-normal)] bg-[var(--impulse-bg-overlay)] flex justify-between items-center">
        <div className="text-xs text-[var(--impulse-text-secondary)] flex items-center">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="mr-1 accent-[var(--impulse-primary)]"
          />
          <span>Auto-scroll</span>
        </div>
        
        <div className="flex items-center text-xs text-[var(--impulse-text-secondary)]">
          {position === 'bottom' ? (
            <button
              onClick={() => setShowLogConsole(false)}
              className="flex items-center hover:text-[var(--impulse-primary)]"
            >
              <ChevronDown size={14} className="mr-1" /> Hide
            </button>
          ) : (
            <button
              onClick={() => setShowLogConsole(false)}
              className="flex items-center hover:text-[var(--impulse-primary)]"
            >
              <ChevronUp size={14} className="mr-1" /> Hide
            </button>
          )}
        </div>
      </div>
    </Resizable>
  );
};

// Helper functions for styling
function getLogLevelClass(level: LogLevel): string {
  switch (level) {
    case LogLevel.DEBUG:
      return 'text-gray-400';
    case LogLevel.INFO:
      return 'text-[var(--impulse-primary)]';
    case LogLevel.WARNING:
      return 'text-yellow-400';
    case LogLevel.ERROR:
      return 'text-[var(--impulse-secondary)]';
    case LogLevel.CRITICAL:
      return 'text-red-600 font-bold';
    default:
      return '';
  }
}

function getLogItemClass(level: LogLevel): string {
  switch (level) {
    case LogLevel.DEBUG:
      return '';
    case LogLevel.INFO:
      return 'border-l-2 border-l-[var(--impulse-primary)]';
    case LogLevel.WARNING:
      return 'border-l-2 border-l-yellow-400 bg-yellow-400/5';
    case LogLevel.ERROR:
      return 'border-l-2 border-l-[var(--impulse-secondary)] bg-[var(--impulse-secondary)]/5';
    case LogLevel.CRITICAL:
      return 'border-l-2 border-l-red-600 bg-red-500/10';
    default:
      return '';
  }
}
