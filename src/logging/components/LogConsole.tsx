import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, Download, Clock, Tag, RefreshCw, Search } from 'lucide-react';
import { LogEntry, LogLevel, LogCategory } from '../types';
import { memoryTransport } from '../config';
import { useLoggingContext } from '../context/LoggingContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * A console-like UI for viewing logs in real-time
 */
export const LogConsole: React.FC = () => {
  const { setShowLogConsole } = useLoggingContext();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<LogLevel[]>([
    LogLevel.INFO,
    LogLevel.WARNING,
    LogLevel.ERROR,
    LogLevel.CRITICAL,
  ]);
  const [selectedCategories, setSelectedCategories] = useState<LogCategory[]>(
    Object.values(LogCategory)
  );
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Function to refresh logs from memory transport
  const refreshLogs = () => {
    const updatedLogs = memoryTransport.getLogs();
    setLogs(updatedLogs);
  };

  // Set up auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      refreshLogs(); // Initial load
      refreshIntervalRef.current = setInterval(refreshLogs, 1000);
    } else if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoRefresh]);

  // Apply filters when logs, search, levels, or categories change
  useEffect(() => {
    let filtered = [...logs];
    
    // Filter by level
    if (selectedLevels.length > 0) {
      filtered = filtered.filter(log => selectedLevels.includes(log.level));
    }
    
    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(log => selectedCategories.includes(log.category));
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        log =>
          log.message.toLowerCase().includes(query) ||
          (log.source && log.source.toLowerCase().includes(query)) ||
          log.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredLogs(filtered);
  }, [logs, searchQuery, selectedLevels, selectedCategories]);

  // Handle level toggle
  const handleLevelToggle = (level: LogLevel) => {
    setSelectedLevels(prev => {
      if (prev.includes(level)) {
        return prev.filter(l => l !== level);
      } else {
        return [...prev, level];
      }
    });
  };

  // Handle category toggle
  const handleCategoryToggle = (category: LogCategory) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Export logs to JSON file
  const handleExportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const filename = `logs_${new Date().toISOString().replace(/:/g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.click();
  };

  // Clear all logs
  const handleClearLogs = () => {
    memoryTransport.clear();
    refreshLogs();
    setSelectedLog(null);
  };

  // Get color class for log level
  const getLevelColorClass = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'text-gray-400';
      case LogLevel.INFO:
        return 'text-blue-400';
      case LogLevel.WARNING:
        return 'text-yellow-400';
      case LogLevel.ERROR:
        return 'text-red-400';
      case LogLevel.CRITICAL:
        return 'text-red-600 font-bold';
      default:
        return 'text-gray-400';
    }
  };

  // Get name for log level
  const getLevelName = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'DEBUG';
      case LogLevel.INFO:
        return 'INFO';
      case LogLevel.WARNING:
        return 'WARN';
      case LogLevel.ERROR:
        return 'ERROR';
      case LogLevel.CRITICAL:
        return 'CRITICAL';
      default:
        return 'UNKNOWN';
    }
  };

  // Format timestamp
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Format log message for display
  const formatLogMessage = (log: LogEntry): React.ReactNode => {
    return (
      <div className="flex items-start space-x-2 py-1 px-2 hover:bg-black/10 rounded cursor-pointer" onClick={() => setSelectedLog(log)}>
        <div className={cn("flex-shrink-0 font-mono text-xs py-0.5", getLevelColorClass(log.level))}>
          {getLevelName(log.level)}
        </div>
        <div className="flex-shrink-0 text-xs text-gray-400 py-0.5">
          {formatTime(log.timestamp)}
        </div>
        <div className="flex-shrink-0">
          <Badge variant="outline" className="text-xs py-0">
            {log.category}
          </Badge>
        </div>
        <div className="flex-grow font-mono text-xs break-all">
          {log.message}
        </div>
      </div>
    );
  };

  // Render log details when a log is selected
  const renderLogDetails = useMemo(() => {
    if (!selectedLog) return null;

    return (
      <div className="border-t border-[var(--impulse-border-normal)] p-4 space-y-3 bg-black/20">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-[var(--impulse-text-primary)]">Log Details</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedLog(null)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-1">
            <div className="text-[var(--impulse-text-secondary)]">Timestamp</div>
            <div>{selectedLog.timestamp.toISOString()}</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-[var(--impulse-text-secondary)]">Level</div>
            <div className={getLevelColorClass(selectedLog.level)}>
              {getLevelName(selectedLog.level)}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-[var(--impulse-text-secondary)]">Category</div>
            <div>{selectedLog.category}</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-[var(--impulse-text-secondary)]">Source</div>
            <div>{selectedLog.source || 'Not specified'}</div>
          </div>
          
          {selectedLog.userId && (
            <div className="space-y-1">
              <div className="text-[var(--impulse-text-secondary)]">User ID</div>
              <div className="truncate">{selectedLog.userId}</div>
            </div>
          )}
          
          {selectedLog.sessionId && (
            <div className="space-y-1">
              <div className="text-[var(--impulse-text-secondary)]">Session ID</div>
              <div className="truncate">{selectedLog.sessionId}</div>
            </div>
          )}
          
          {selectedLog.duration !== undefined && (
            <div className="space-y-1">
              <div className="text-[var(--impulse-text-secondary)]">Duration</div>
              <div>{selectedLog.duration}ms</div>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="text-[var(--impulse-text-secondary)] text-xs">Message</div>
          <div className="font-mono text-xs break-all bg-black/20 p-2 rounded">
            {selectedLog.message}
          </div>
        </div>
        
        {selectedLog.details && (
          <div className="space-y-1">
            <div className="text-[var(--impulse-text-secondary)] text-xs">Details</div>
            <Textarea
              readOnly
              value={typeof selectedLog.details === 'object' 
                ? JSON.stringify(selectedLog.details, null, 2) 
                : String(selectedLog.details)}
              className="font-mono text-xs h-32 bg-black/20"
            />
          </div>
        )}
        
        {selectedLog.tags && selectedLog.tags.length > 0 && (
          <div className="space-y-1">
            <div className="text-[var(--impulse-text-secondary)] text-xs">Tags</div>
            <div className="flex flex-wrap gap-1">
              {selectedLog.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }, [selectedLog]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'fixed bottom-16 right-4 z-30 w-[calc(100vw-2rem)] md:w-[600px] lg:w-[800px] h-[500px] max-h-[80vh]',
        'rounded-lg border border-[var(--impulse-border-normal)] backdrop-blur-xl',
        'bg-[var(--impulse-bg-card)]/90 shadow-2xl flex flex-col',
        'electric-effect-border animate-in fade-in-50 cyber-window'
      )}
    >
      {/* Console header */}
      <div className="p-3 border-b border-[var(--impulse-border-normal)] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="cyber-dots flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full hover:animate-pulse"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full hover:animate-pulse"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full hover:animate-pulse"></div>
          </div>
          <h2 className="text-sm font-bold text-[var(--impulse-text-primary)]">
            System Logs
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:text-[var(--impulse-primary)]"
            onClick={refreshLogs}
            title="Refresh Logs"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 w-7 p-0 hover:text-[var(--impulse-primary)]",
              isFilterVisible && "text-[var(--impulse-primary)]"
            )}
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            title="Filter Logs"
          >
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:text-[var(--impulse-primary)]"
            onClick={handleExportLogs}
            title="Export Logs"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-gray-400 hover:text-[var(--impulse-primary)]"
            onClick={() => setShowLogConsole(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Filter section */}
      <AnimatePresence>
        {isFilterVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-3 border-b border-[var(--impulse-border-normal)] bg-black/20 overflow-hidden"
          >
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className="text-xs text-[var(--impulse-text-secondary)] flex items-center space-x-1">
                  <Tag className="h-3 w-3" />
                  <span>Log Levels</span>
                </div>
                
                <ToggleGroup type="multiple" className="justify-start">
                  <ToggleGroupItem
                    value="debug"
                    size="sm"
                    className="h-7 text-xs bg-black/20"
                    data-state={selectedLevels.includes(LogLevel.DEBUG) ? 'on' : 'off'}
                    onClick={() => handleLevelToggle(LogLevel.DEBUG)}
                  >
                    Debug
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="info"
                    size="sm"
                    className="h-7 text-xs bg-black/20"
                    data-state={selectedLevels.includes(LogLevel.INFO) ? 'on' : 'off'}
                    onClick={() => handleLevelToggle(LogLevel.INFO)}
                  >
                    Info
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="warning"
                    size="sm"
                    className="h-7 text-xs bg-black/20"
                    data-state={selectedLevels.includes(LogLevel.WARNING) ? 'on' : 'off'}
                    onClick={() => handleLevelToggle(LogLevel.WARNING)}
                  >
                    Warning
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="error"
                    size="sm"
                    className="h-7 text-xs bg-black/20"
                    data-state={selectedLevels.includes(LogLevel.ERROR) ? 'on' : 'off'}
                    onClick={() => handleLevelToggle(LogLevel.ERROR)}
                  >
                    Error
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="critical"
                    size="sm"
                    className="h-7 text-xs bg-black/20"
                    data-state={selectedLevels.includes(LogLevel.CRITICAL) ? 'on' : 'off'}
                    onClick={() => handleLevelToggle(LogLevel.CRITICAL)}
                  >
                    Critical
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className="text-xs text-[var(--impulse-text-secondary)] flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Auto-refresh</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auto-refresh"
                    checked={autoRefresh}
                    onCheckedChange={(checked) => setAutoRefresh(checked as boolean)}
                  />
                  <label
                    htmlFor="auto-refresh"
                    className="text-xs cursor-pointer"
                  >
                    Refresh automatically (1s)
                  </label>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className="text-xs text-[var(--impulse-text-secondary)] flex items-center space-x-1">
                  <span>Categories</span>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      {selectedCategories.length === Object.values(LogCategory).length
                        ? 'All Categories'
                        : `${selectedCategories.length} Categories`}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.values(LogCategory).map(category => (
                      <DropdownMenuCheckboxItem
                        key={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      >
                        {category}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleClearLogs}
                >
                  Clear All Logs
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Logs container */}
      <div className="flex-grow relative flex flex-col overflow-hidden">
        <ScrollArea className="flex-grow">
          {filteredLogs.length > 0 ? (
            <div className="divide-y divide-[var(--impulse-border-normal)]/30">
              {filteredLogs.map(log => (
                <div
                  key={log.id}
                  className={cn(
                    selectedLog?.id === log.id ? 'bg-[var(--impulse-primary)]/10' : 'hover:bg-[var(--impulse-border-normal)]/10',
                    'transition-colors duration-150'
                  )}
                >
                  {formatLogMessage(log)}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-[var(--impulse-text-secondary)] text-sm">
                {logs.length > 0
                  ? 'No logs match the current filters'
                  : 'No logs available'}
              </p>
            </div>
          )}
        </ScrollArea>
        
        {/* Log details panel */}
        {renderLogDetails}
      </div>
      
      {/* Status bar */}
      <div className="p-2 border-t border-[var(--impulse-border-normal)] flex items-center justify-between text-xs text-[var(--impulse-text-secondary)]">
        <div className="flex items-center space-x-2">
          <span>{filteredLogs.length} logs</span>
          <span>•</span>
          <span>{autoRefresh ? 'Auto-refresh on' : 'Auto-refresh off'}</span>
        </div>
        <div>
          {selectedLevels.length === 0
            ? 'No levels selected'
            : `Showing: ${selectedLevels.map(l => getLevelName(l)).join(', ')}`}
        </div>
      </div>
    </motion.div>
  );
};
