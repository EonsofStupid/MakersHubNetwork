
import React, { useState, useMemo, useCallback } from 'react';
import { X, Filter, Trash2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useLoggingContext } from '../context/LoggingContext';
import { LogEntry, LogCategory, LogLevel } from '../types';
import { LOG_LEVEL_NAMES } from '../constants/log-level';
import { cn } from '@/lib/utils';
import { nodeToSearchableString } from '@/shared/utils/react-utils';
import { useLogger } from '@/hooks/use-logger';

export function LogConsole() {
  const {
    logs,
    toggleLogConsole,
    clearAllLogs,
    filterCategory,
    setFilterCategory,
    filterMinLevel,
    setFilterMinLevel,
    searchTerm,
    setSearchTerm
  } = useLoggingContext();
  
  const [expanded, setExpanded] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LogEntry | null>(null);
  const logger = useLogger('LogConsole', LogCategory.SYSTEM);

  // Filter logs based on criteria
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Filter by category
      if (filterCategory && log.category !== filterCategory) {
        return false;
      }
      
      // Filter by minimum level
      if (log.level < filterMinLevel) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm) {
        const searchableLog = 
          nodeToSearchableString(log.message) + 
          ' ' + log.category + 
          ' ' + LOG_LEVEL_NAMES[log.level] + 
          ' ' + (log.source || '') +
          ' ' + (log.tags?.join(' ') || '');
        
        return searchableLog.toLowerCase().includes(searchTerm.toLowerCase());
      }
      
      return true;
    });
  }, [logs, filterCategory, filterMinLevel, searchTerm]);

  // Handle closing the console
  const handleClose = () => {
    logger.debug('Log console closed');
    toggleLogConsole();
  };

  // Handle clearing logs
  const handleClearLogs = () => {
    logger.info('Clearing logs');
    clearAllLogs();
  };

  // Handle expanding the console
  const toggleExpand = () => {
    setExpanded(prev => !prev);
    logger.debug(`Log console ${expanded ? 'collapsed' : 'expanded'}`);
  };

  // Get log level badge color
  const getLevelColor = useCallback((level: LogLevel): string => {
    switch (level) {
      case LogLevel.TRACE:
        return 'bg-gray-500/20 text-gray-300';
      case LogLevel.DEBUG:
        return 'bg-blue-500/20 text-blue-300';
      case LogLevel.INFO:
        return 'bg-green-500/20 text-green-300';
      case LogLevel.WARN:
        return 'bg-yellow-500/20 text-yellow-300';
      case LogLevel.ERROR:
        return 'bg-red-500/20 text-red-300';
      case LogLevel.CRITICAL:
        return 'bg-red-700/20 text-red-400';
      case LogLevel.SUCCESS:
        return 'bg-emerald-500/20 text-emerald-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  }, []);

  // Get category badge color
  const getCategoryColor = useCallback((category: LogCategory): string => {
    switch (category) {
      case LogCategory.SYSTEM:
        return 'bg-purple-500/20 text-purple-300';
      case LogCategory.NETWORK:
        return 'bg-blue-500/20 text-blue-300';
      case LogCategory.AUTH:
        return 'bg-yellow-500/20 text-yellow-300';
      case LogCategory.UI:
        return 'bg-teal-500/20 text-teal-300';
      case LogCategory.ADMIN:
        return 'bg-red-500/20 text-red-300';
      case LogCategory.DATA:
        return 'bg-green-500/20 text-green-300';
      case LogCategory.PERFORMANCE:
        return 'bg-orange-500/20 text-orange-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  }, []);

  return (
    <div 
      className={cn(
        "fixed z-50 bg-background/95 backdrop-blur-lg border border-primary/30",
        "text-foreground shadow-xl",
        expanded ? "inset-10" : "right-4 bottom-16 w-[600px] h-[400px] max-w-[calc(100vw-2rem)]"
      )}
      style={{ 
        transition: 'all 0.3s ease',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-primary/30 bg-background/80">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Log Console</h3>
          <span className="text-xs bg-primary/20 text-primary-foreground px-2 py-0.5 rounded-full">
            {filteredLogs.length} logs
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleExpand}
            className="p-1 hover:bg-muted rounded-sm"
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ArrowDownCircle className="w-4 h-4" /> : <ArrowUpCircle className="w-4 h-4" />}
          </button>
          
          <button 
            onClick={handleClearLogs}
            className="p-1 hover:bg-muted rounded-sm"
            title="Clear logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-destructive/20 hover:text-destructive rounded-sm"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 p-2 border-b border-primary/20 bg-background/60">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterMinLevel}
            onChange={(e) => setFilterMinLevel(Number(e.target.value) as LogLevel)}
            className="text-xs bg-background border border-primary/20 rounded px-2 py-1"
          >
            <option value={LogLevel.TRACE}>Level: Trace+</option>
            <option value={LogLevel.DEBUG}>Level: Debug+</option>
            <option value={LogLevel.INFO}>Level: Info+</option>
            <option value={LogLevel.WARN}>Level: Warning+</option>
            <option value={LogLevel.ERROR}>Level: Error+</option>
          </select>
        </div>
        
        <div>
          <select
            value={filterCategory || ""}
            onChange={(e) => setFilterCategory(e.target.value ? e.target.value as LogCategory : null)}
            className="text-xs bg-background border border-primary/20 rounded px-2 py-1"
          >
            <option value="">All Categories</option>
            {Object.values(LogCategory).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-background border border-primary/20 rounded px-2 py-1"
          />
        </div>
      </div>
      
      {/* Log entries */}
      <div className="overflow-auto h-[calc(100%-108px)]">
        {filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No logs to display
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-background/95 backdrop-blur-sm">
              <tr className="border-b border-primary/20">
                <th className="px-2 py-1 text-left font-medium w-28">Timestamp</th>
                <th className="px-2 py-1 text-left font-medium w-20">Level</th>
                <th className="px-2 py-1 text-left font-medium w-24">Category</th>
                <th className="px-2 py-1 text-left font-medium">Message</th>
                <th className="px-2 py-1 text-left font-medium w-28">Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr 
                  key={log.id}
                  className="border-b border-primary/10 hover:bg-muted/20 cursor-pointer"
                  onClick={() => setSelectedEntry(log === selectedEntry ? null : log)}
                >
                  <td className="px-2 py-1 whitespace-nowrap">
                    {log.timestamp.toLocaleTimeString()}
                  </td>
                  <td className="px-2 py-1">
                    <span className={cn("px-1.5 py-0.5 rounded text-xs font-medium", getLevelColor(log.level))}>
                      {LOG_LEVEL_NAMES[log.level]}
                    </span>
                  </td>
                  <td className="px-2 py-1">
                    <span className={cn("px-1.5 py-0.5 rounded text-xs", getCategoryColor(log.category))}>
                      {log.category}
                    </span>
                  </td>
                  <td className="px-2 py-1 truncate max-w-[300px]">
                    {nodeToSearchableString(log.message)}
                  </td>
                  <td className="px-2 py-1 truncate text-muted-foreground">
                    {log.source || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Details panel for selected entry */}
      {selectedEntry && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl p-4 overflow-auto">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-medium">Log Details</h3>
            <button 
              onClick={() => setSelectedEntry(null)}
              className="p-1 hover:bg-destructive/20 hover:text-destructive rounded-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Timestamp</p>
              <p>{selectedEntry.timestamp.toLocaleString()}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">ID</p>
              <p>{selectedEntry.id}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Level</p>
              <p className={cn("inline-block px-2 py-0.5 rounded", getLevelColor(selectedEntry.level))}>
                {LOG_LEVEL_NAMES[selectedEntry.level]}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className={cn("inline-block px-2 py-0.5 rounded", getCategoryColor(selectedEntry.category))}>
                {selectedEntry.category}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Source</p>
              <p>{selectedEntry.source || '-'}</p>
            </div>
            
            {selectedEntry.userId && (
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p>{selectedEntry.userId}</p>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Message</p>
            <div className="p-2 bg-muted/20 rounded border border-primary/20">
              {nodeToSearchableString(selectedEntry.message)}
            </div>
          </div>
          
          {selectedEntry.details && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-1">Details</p>
              <pre className="p-2 bg-muted/20 rounded border border-primary/20 overflow-auto max-h-60 text-xs">
                {JSON.stringify(selectedEntry.details, null, 2)}
              </pre>
            </div>
          )}
          
          {selectedEntry.tags && selectedEntry.tags.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tags</p>
              <div className="flex flex-wrap gap-1">
                {selectedEntry.tags.map((tag, i) => (
                  <span 
                    key={i} 
                    className="px-2 py-0.5 bg-muted/30 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
