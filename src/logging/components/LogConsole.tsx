
import React, { useState } from 'react';
import { getMemoryTransport } from '@/logging/logger.service';
import { LogLevel, LogCategory, LogEntry } from '@/shared/types/shared.types';
import { useLogger } from '@/logging/hooks/use-logger';

interface LogConsoleProps {
  maxHeight?: string;
  showFilters?: boolean;
}

/**
 * A component that displays logs from the memory transport
 */
const LogConsole: React.FC<LogConsoleProps> = ({ 
  maxHeight = '400px',
  showFilters = true
}) => {
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<LogCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const logger = useLogger('LogConsole', LogCategory.UI);
  
  // Get logs from memory transport
  const memoryTransport = getMemoryTransport();
  const logs = memoryTransport?.getLogs() || [];
  
  // Filter logs
  const filteredLogs = logs.filter(log => {
    // Filter by level
    if (selectedLevel !== 'all' && log.level !== selectedLevel) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory !== 'all' && log.category !== selectedCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Get the CSS class for a log level
  const getLevelClass = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'text-gray-500';
      case LogLevel.INFO:
        return 'text-blue-500';
      case LogLevel.SUCCESS:
        return 'text-green-500';
      case LogLevel.WARN:
        return 'text-yellow-500';
      case LogLevel.ERROR:
        return 'text-red-500';
      case LogLevel.FATAL:
        return 'text-red-700 font-bold';
      case LogLevel.CRITICAL:
        return 'bg-red-600 text-white font-bold px-1 rounded';
      default:
        return '';
    }
  };
  
  // Get the display name for a log level
  const getLevelName = (level: LogLevel): string => {
    return level.toUpperCase();
  };
  
  // Clear logs
  const handleClearLogs = () => {
    memoryTransport?.clearLogs();
    logger.info('Logs cleared');
  };
  
  return (
    <div className="bg-gray-900 text-gray-200 rounded-md p-2 w-full">
      {showFilters && (
        <div className="mb-2 flex flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <label className="text-xs text-gray-400">Level:</label>
            <select
              className="bg-gray-800 border border-gray-700 rounded text-xs p-1"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as LogLevel | 'all')}
            >
              <option value="all">All</option>
              <option value={LogLevel.DEBUG}>{getLevelName(LogLevel.DEBUG)}</option>
              <option value={LogLevel.INFO}>{getLevelName(LogLevel.INFO)}</option>
              <option value={LogLevel.SUCCESS}>{getLevelName(LogLevel.SUCCESS)}</option>
              <option value={LogLevel.WARN}>{getLevelName(LogLevel.WARN)}</option>
              <option value={LogLevel.ERROR}>{getLevelName(LogLevel.ERROR)}</option>
              <option value={LogLevel.FATAL}>{getLevelName(LogLevel.FATAL)}</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-xs text-gray-400">Category:</label>
            <select
              className="bg-gray-800 border border-gray-700 rounded text-xs p-1"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as LogCategory | 'all')}
            >
              <option value="all">All</option>
              <option value={LogCategory.AUTH}>Auth</option>
              <option value={LogCategory.RBAC}>RBAC</option>
              <option value={LogCategory.API}>API</option>
              <option value={LogCategory.UI}>UI</option>
              <option value={LogCategory.SYSTEM}>System</option>
              <option value={LogCategory.ADMIN}>Admin</option>
              <option value={LogCategory.DEBUG}>Debug</option>
              <option value={LogCategory.APP}>App</option>
              <option value={LogCategory.CHAT}>Chat</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-xs text-gray-400">Search:</label>
            <input
              type="text"
              className="bg-gray-800 border border-gray-700 rounded text-xs p-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter logs..."
            />
          </div>
          
          <button
            className="ml-auto bg-red-600 hover:bg-red-700 text-white text-xs rounded px-2 py-1"
            onClick={handleClearLogs}
          >
            Clear Logs
          </button>
        </div>
      )}
      
      <div 
        className="font-mono text-xs overflow-auto" 
        style={{ maxHeight }}
      >
        {filteredLogs.length === 0 ? (
          <div className="text-gray-500 italic p-2">No logs to display</div>
        ) : (
          filteredLogs.map((log, index) => (
            <LogEntry key={index} log={log} levelClass={getLevelClass(log.level)} />
          ))
        )}
      </div>
    </div>
  );
};

// Log entry component
const LogEntry: React.FC<{ log: LogEntry; levelClass: string }> = ({ log, levelClass }) => {
  const [expanded, setExpanded] = useState(false);
  
  const timestamp = log.timestamp instanceof Date
    ? log.timestamp.toISOString().split('T')[1].slice(0, -1)
    : 'unknown';
  
  return (
    <div className="border-b border-gray-800 py-1 hover:bg-gray-800/30">
      <div 
        className="flex flex-wrap gap-1 cursor-pointer" 
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-gray-400">[{timestamp}]</span>
        <span className={levelClass}>[{log.level.toUpperCase()}]</span>
        <span className="text-gray-300">[{log.category}]</span>
        {log.source && <span className="text-gray-500">[{log.source}]</span>}
        <span className="text-white">{log.message}</span>
      </div>
      
      {expanded && log.details && Object.keys(log.details).length > 0 && (
        <pre className="ml-4 mt-1 p-2 bg-gray-800 rounded text-gray-300 overflow-x-auto">
          {JSON.stringify(log.details, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default LogConsole;
